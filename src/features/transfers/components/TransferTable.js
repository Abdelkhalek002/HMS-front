import * as React from 'react';
import { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Tooltip,
  Skeleton,
  Tabs,
  Tab,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { useGetTransfersQuery, useAssignHospitalMutation } from '../transferApi';
import { getAllExhospitals, getAllExhospitalsAPI } from '../../lookups';
import TableToolbar from '../../../components/table/TableToolbar';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/permissionUtils';

const headCells = [
  { id: 'transferId', label: 'رقم التحويل' },
  { id: 'studentName', label: 'اسم الطالب / المريض' },
  { id: 'phoneNumber', label: 'رقم الهاتف' },
  { id: 'email', label: 'البريد الإلكتروني' },
  { id: 'clinic', label: 'العيادة المحول منها' },
  { id: 'transferReason', label: 'سبب التحويل' },
  { id: 'hospital', label: 'المستشفى المحول إليها' },
  { id: 'createdAt', label: 'تاريخ التحويل' },
  { id: 'status', label: 'الحالة' },
  { id: 'actions', label: 'الإجراءات' },
];

export default function TransferTable() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams({ page: 1 });
  const currentPage = Math.max(parseInt(searchParams.get('page'), 10) || 1, 1);
  const currentSearch = searchParams.get('search') || '';

  // Tab filter: pending | completed | all
  const [statusTab, setStatusTab] = useState('pending');
  const [searchInput, setSearchInput] = useState(currentSearch);

  // External hospitals lookup
  const rawHospitals = useSelector(getAllExhospitals);
  const hospitals = Array.isArray(rawHospitals) ? rawHospitals : (rawHospitals?.value || []);

  // Permissions & Audit Mode
  const { isObserver, canMutate, can } = usePermission();
  const canEditTransfer = canMutate(PERMISSIONS.TRANSFERS_WRITE);
  const isAuditMode = isObserver || !canEditTransfer;
  const canViewProfile = can(PERMISSIONS.USERS_READ);
  const showActions = !isAuditMode && statusTab !== 'completed';
  const visibleHeadCells = headCells.filter((c) => c.id !== 'actions' || showActions);

  React.useEffect(() => {
    dispatch(getAllExhospitalsAPI());
  }, [dispatch]);

  // Query transfers using RTK Query
  const { data: responseData, isLoading, isFetching } = useGetTransfersQuery({
    page: currentPage,
    limit: 10,
    searchKey: currentSearch,
    status: statusTab === 'all' ? '' : statusTab,
  });

  const transfersList = responseData?.data || [];

  // Mutations
  const [assignHospitalMutation, { isLoading: isAssigning }] = useAssignHospitalMutation();

  // Modal State for Assigning Hospital
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [notesInput, setNotesInput] = useState('');

  const handleOpenAssignModal = (transfer) => {
    if (transfer.status === 'completed') return;
    setSelectedTransfer(transfer);
    setSelectedHospitalId(transfer.externalHospital?.id || '');
    setNotesInput(transfer.notes || '');
    setModalOpen(true);
  };

  const handleCloseAssignModal = () => {
    setModalOpen(false);
    setSelectedTransfer(null);
    setSelectedHospitalId('');
    setNotesInput('');
  };

  const handleSubmitAssign = async (e) => {
    if (e) e.preventDefault();
    if (!selectedHospitalId) {
      toast.error('يرجى اختيار المستشفى الخارجية');
      return;
    }

    try {
      await assignHospitalMutation({
        transferId: selectedTransfer.id || selectedTransfer.transferId,
        hospital_id: selectedHospitalId,
        notes: notesInput.trim() || undefined,
      }).unwrap();

      toast.success('تم تحديد المستشفى الخارجية وإشعار الطالب بنجاح');
      handleCloseAssignModal();
    } catch (err) {
      toast.error(err?.data?.message || err?.message || 'فشل تحديد المستشفى الخارجية');
    }
  };

  // Search handler
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    setSearchParams({ page: 1, search: searchInput });
  };

  const handleSearchClear = () => {
    setSearchInput('');
    setSearchParams({ page: 1, search: '' });
  };

  return (
    <Box sx={{ width: '100%', mb: 4 }} dir="rtl">
      {/* Status Tabs */}
      <Paper sx={{ mb: 2, p: 1, borderRadius: 2 }}>
        <Tabs
          value={statusTab}
          onChange={(e, val) => {
            setStatusTab(val);
            setSearchParams({ page: 1, search: currentSearch });
          }}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
        >
          <Tab value="pending" label="طلبات بالانتظار (قيد التحديد)" sx={{ fontWeight: 'bold' }} />
          <Tab value="completed" label="طلبات محولة مكتملة" sx={{ fontWeight: 'bold' }} />
          <Tab value="all" label="جميع طلبات التحويل" sx={{ fontWeight: 'bold' }} />
        </Tabs>
      </Paper>

      {/* Main Table Container */}
      <Paper sx={{ width: '100%', mb: 2, borderRadius: 2, overflow: 'hidden' }}>
        <TableToolbar
          numSelected={0}
          title="سجل التحويلات لمستشفيات خارجية"
          filterComponent={
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="text"
                placeholder="بحث باسم الطالب، العيادة، المستشفى..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="k-search-input"
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', width: '280px' }}
              />
              <Button type="submit" variant="contained" size="small" sx={{ height: '38px' }}>
                بحث
              </Button>
              {searchInput && (
                <Button type="button" variant="outlined" color="inherit" size="small" onClick={handleSearchClear}>
                  إلغاء
                </Button>
              )}
            </form>
          }
        />

        {/* Audit Mode Banner */}
        {isAuditMode && (
          <div
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              padding: '10px 18px',
              borderRadius: '10px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>visibility</span>
            <span>وضع الملاحظة والتدقيق (للقراءة فقط - تم تعطيل تحديد أو تعديل المستشفيات الخارجية)</span>
          </div>
        )}

        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-label="transfers table">
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                {visibleHeadCells.map((headCell) => (
                  <TableCell key={headCell.id} align="center" sx={{ fontWeight: 'bold', color: '#334155' }}>
                    {headCell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading || isFetching ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    {visibleHeadCells.map((cell, cIdx) => (
                      <TableCell key={cIdx} align="center">
                        <Skeleton variant="text" width="80%" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : transfersList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={visibleHeadCells.length} align="center" sx={{ py: 6, color: '#64748b' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#94a3b8' }}>
                        assignment_late
                      </span>
                      <h3>لا توجد طلبات تحويل مطابقة</h3>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transfersList.map((transfer) => {
                  const tId = transfer.id || transfer.transferId;
                  const patient = transfer.patient || {};
                  const reservation = transfer.reservation || {};
                  const externalHospital = transfer.externalHospital;
                  const isPending = transfer.status === 'pending';

                  return (
                    <TableRow hover key={tId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      {/* Transfer ID */}
                      <TableCell align="center" sx={{ fontWeight: 'bold', color: '#64748b' }}>
                        #{tId}
                      </TableCell>

                      {/* Patient Name */}
                      <TableCell align="center">
                        {patient.id && canViewProfile ? (
                          <Link
                            to={`/profile-viewer/${patient.id}`}
                            style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 'bold' }}
                          >
                            {patient.name}
                          </Link>
                        ) : (
                          <span style={{ fontWeight: 'bold' }}>{patient.name}</span>
                        )}
                        
                      </TableCell>

                      {/* Phone Number */}
                      <TableCell align="center" dir="ltr">
                        {patient.phoneNumber || transfer.phoneNumber || '-'}
                      </TableCell>

                      {/* Email */}
                      <TableCell align="center">
                        {patient.email || transfer.email || '-'}
                      </TableCell>

                      {/* Clinic */}
                      <TableCell align="center">{reservation.clinicName || '-'}</TableCell>

                      {/* Transfer Reason */}
                      <TableCell align="center" sx={{ maxWidth: '200px' }}>
                        <Tooltip title={transfer.transferReason} placement="top">
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                            {transfer.transferReason}
                          </span>
                        </Tooltip>
                      </TableCell>

                      {/* External Hospital */}
                      <TableCell align="center">
                        {externalHospital ? (
                          <span style={{ fontWeight: 'bold', color: '#0f766e' }}>
                            {externalHospital.name}
                          </span>
                        ) : (
                          <span style={{ color: '#d97706', backgroundColor: '#fef3c7', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                            قيد التحديد
                          </span>
                        )}
                      </TableCell>

                      {/* Created At Date */}
                      <TableCell align="center">
                        {transfer.createdAt ? String(transfer.createdAt).slice(0, 10) : '-'}
                      </TableCell>

                      {/* Status */}
                      <TableCell align="center">
                        {isPending ? (
                          <span style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                            بالانتظار
                          </span>
                        ) : (
                          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '4px 10px', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                            مكتمل
                          </span>
                        )}
                      </TableCell>

                      {/* Actions (hidden in audit mode or completed tab) */}
                      {showActions && (
                        <TableCell align="center">
                          {isPending ? (
                            <Button
                              variant="contained"
                              size="small"
                              onClick={() => handleOpenAssignModal(transfer)}
                              sx={{
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '12px',
                                backgroundColor: '#7c3aed',
                                '&:hover': {
                                  backgroundColor: '#6d28d9',
                                },
                              }}
                            >
                              تحديد المستشفى
                            </Button>
                          ) : (
                            <span style={{ color: '#94a3b8' }}>-</span>
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Assign Hospital Modal */}
      <Dialog open={modalOpen} onClose={handleCloseAssignModal} maxWidth="sm" fullWidth dir="rtl">
        <DialogTitle sx={{ fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: 1 }}>
          <span className="material-symbols-outlined" style={{ color: '#7c3aed' }}>local_hospital</span>
          تحديد المستشفى الخارجية للطالب
        </DialogTitle>

        <DialogContent dividers>
          {selectedTransfer && (
            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span><strong>المريض:</strong> {selectedTransfer.patient?.name}</span>
                <span><strong>العيادة:</strong> {selectedTransfer.reservation?.clinicName}</span>
              </div>
              <div>
                <strong>سبب التحويل:</strong> {selectedTransfer.transferReason}
              </div>
            </div>
          )}

          <TextField
            select
            label="اختر المستشفى الخارجية *"
            value={selectedHospitalId}
            onChange={(e) => setSelectedHospitalId(e.target.value)}
            fullWidth
            margin="dense"
            sx={{ mb: 2 }}
          >
            {hospitals && hospitals.length > 0 ? (
              hospitals
                .filter((h) => h.is_active !== false)
                .map((hosp) => {
                  const hId = hosp.id ?? hosp.exhospital_id ?? hosp.exHosp_id;
                  const hName = hosp.hospitalName || hosp.hospName || hosp.hospital_name || hosp.name;
                  return (
                    <MenuItem key={hId} value={hId}>
                      {hName}
                    </MenuItem>
                  );
                })
            ) : (
              <MenuItem value="" disabled>
                لا توجد مستشفيات متاحة
              </MenuItem>
            )}
          </TextField>

          <TextField
            label="ملاحظات أو تعليمات للمريض (اختياري)"
            placeholder="مثال: يرجى التوجه لمكتب الاستقبال مصطحباً بطاقة الرقم القومي"
            multiline
            rows={3}
            fullWidth
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseAssignModal} color="inherit">
            إلغاء
          </Button>
          <Button
            onClick={handleSubmitAssign}
            variant="contained"
            disabled={isAssigning}
            sx={{ backgroundColor: '#7c3aed', '&:hover': { backgroundColor: '#6d28d9' } }}
          >
            {isAssigning ? 'جاري الحفظ وإرسال الإشعار...' : 'تأكيد وإشعار الطالب'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
