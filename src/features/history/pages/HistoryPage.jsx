import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Tooltip from '@mui/material/Tooltip';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { CircleLoader } from 'react-spinners';

import StatusCode from '../../../StatusCode.js';
import {
  deleteHistoryAPI,
  getAllHistoryAPI,
  selectHistory,
} from '../HistorySlice.js';
import HistoryFilterBar from '../components/HistoryFilterBar.jsx';
import HistoryExportButton from '../components/HistoryExportButton.jsx';
import LogDetailsModal from '../components/LogDetailsModal.jsx';
import usePermission from '../../../hooks/usePermission';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    fontWeight: 700,
    fontSize: 15,
    borderBottom: '2px solid #cbd5e1',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#334155',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: '#f8fafc',
  },
  '&:hover': {
    backgroundColor: '#f1f5f9',
    transition: 'background-color 0.15s ease',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function HistoryPage() {
  const dispatch = useDispatch();
  const { logs, totalCount, totalPages, currentPage, status } = useSelector(selectHistory);
  const { can, isSuperAdmin, PERMISSIONS } = usePermission();
  const canDeleteLogs = isSuperAdmin || can(PERMISSIONS.LOGS_DELETE);

  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedLog, setSelectedLog] = useState(null);

  // Extract filter query values from searchParams
  const pageParam = parseInt(searchParams.get('page'), 10) || 1;
  const limitParam = parseInt(searchParams.get('limit'), 10) || 10;
  const actionParam = searchParams.get('action') || '';
  const statusParam = searchParams.get('status') || '';
  const adminIdParam = searchParams.get('adminId') || '';

  const activeFilters = {
    page: pageParam,
    limit: limitParam,
    action: actionParam,
    status: statusParam,
    adminId: adminIdParam,
  };

  // Fetch audit logs whenever parameters change
  useEffect(() => {
    dispatch(
      getAllHistoryAPI({
        page: pageParam,
        limit: limitParam,
        action: actionParam || undefined,
        status: statusParam || undefined,
        adminId: adminIdParam || undefined,
      })
    );
  }, [dispatch, pageParam, limitParam, actionParam, statusParam, adminIdParam]);

  const handleFilterChange = (newFilters) => {
    const updated = {
      page: 1, // Reset to page 1 on filter change
      limit: limitParam,
      action: actionParam,
      status: statusParam,
      adminId: adminIdParam,
      ...newFilters,
    };

    const nextParams = {};
    if (updated.page > 1) nextParams.page = updated.page;
    if (updated.limit !== 10) nextParams.limit = updated.limit;
    if (updated.action) nextParams.action = updated.action;
    if (updated.status) nextParams.status = updated.status;
    if (updated.adminId) nextParams.adminId = updated.adminId;

    setSearchParams(nextParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const nextParams = new URLSearchParams(searchParams);
    if (newPage > 1) {
      nextParams.set('page', newPage);
    } else {
      nextParams.delete('page');
    }
    setSearchParams(nextParams);
  };

  const handleDeleteAll = () => {
    swal({
      title: 'هل أنت متأكد من تفريغ سجل العمليات بالكامل؟',
      text: 'تحذير: سيتم حذف جميع السجلات المسجلة نهائياً ولن تتمكن من استعادتها.',
      icon: 'warning',
      buttons: ['إلغاء', 'نعم، تفريغ السجل'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteHistoryAPI())
          .unwrap()
          .then((res) => {
            swal(res?.message || 'تم تفريغ السجل بنجاح', { icon: 'success' });
          })
          .catch((err) => {
            toast.error(err?.message || 'فشل في تفريغ السجل', {
              theme: 'colored',
              position: 'top-right',
            });
          });
      }
    });
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleString('ar-EG', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <>
      <Helmet>
        <title>سجل العمليات الإدارية | Hospital Management System</title>
        <meta name="description" content="سجل العمليات والأنشطة الإدارية" />
      </Helmet>

      <Box sx={{ maxWidth: 1300, mx: 'auto', p: { xs: 2, sm: 3 } }}>
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <AdminPanelSettingsIcon color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                سجل العمليات الإدارية
              </Typography>
              <Chip
                label={`${totalCount} عملية`}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              تتبع جميع الإجراءات والتعديلات الحساسة المنفذة بواسطة مسؤولي النظام
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <HistoryExportButton data={logs} />
            {canDeleteLogs && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteSweepIcon />}
                onClick={handleDeleteAll}
                disabled={!logs || logs.length === 0}
                sx={{ borderRadius: 2 }}
              >
                تفريغ السجل
              </Button>
            )}
          </Box>
        </Box>

        {/* Filter Bar */}
        <HistoryFilterBar
          filters={activeFilters}
          onChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Table Container or Loader */}
        {status === StatusCode.LOADING ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 350,
            }}
          >
            <CircleLoader color="#0061ff" size={50} />
          </Box>
        ) : (
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{
              borderRadius: 3,
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <Table sx={{ minWidth: 750 }} aria-label="audit logs table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center">#</StyledTableCell>
                  <StyledTableCell align="right">المسؤول</StyledTableCell>
                  <StyledTableCell align="right">العملية</StyledTableCell>
                  <StyledTableCell align="center">الكيان المستهدف</StyledTableCell>
                  <StyledTableCell align="center">الحالة</StyledTableCell>
                  <StyledTableCell align="center">عنوان IP</StyledTableCell>
                  <StyledTableCell align="center">التوقيت</StyledTableCell>
                  <StyledTableCell align="center">التفاصيل</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(logs) && logs.length > 0 ? (
                  logs.map((log) => {
                    const isSuccess =
                      log.status === 'SUCCESS' || log.status === 'success' || !log.status;
                    return (
                      <StyledTableRow key={log.id}>
                        <StyledTableCell align="center" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                          #{log.id}
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                {log.adminName || 'غير معروف'}
                              </Typography>
                              {log.adminId && (
                                <Typography variant="caption" color="text.secondary">
                                  ID: {log.adminId}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </StyledTableCell>

                        <StyledTableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {log.method || '—'}
                          </Typography>
                          {log.action && (
                            <Chip
                              label={log.action}
                              size="small"
                              sx={{
                                mt: 0.5,
                                fontSize: '11px',
                                height: 20,
                                fontFamily: 'monospace',
                                backgroundColor: '#e2e8f0',
                              }}
                            />
                          )}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          {log.entityType ? (
                            <Typography variant="caption" sx={{ fontWeight: 600 }}>
                              {log.entityType} {log.entityId ? `(#${log.entityId})` : ''}
                            </Typography>
                          ) : (
                            '—'
                          )}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <Chip
                            size="small"
                            icon={isSuccess ? <CheckCircleIcon /> : <CancelIcon />}
                            label={isSuccess ? 'ناجحة' : 'فاشلة'}
                            color={isSuccess ? 'success' : 'error'}
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              height: 24,
                              '& .MuiChip-icon': { mr: 0.75, ml: -0.25, fontSize: 16 },
                              '& .MuiChip-label': { px: 0.75 },
                            }}
                          />
                        </StyledTableCell>

                        <StyledTableCell align="center" sx={{ fontFamily: 'monospace', fontSize: 13 }}>
                          {log.ipAddress || '—'}
                        </StyledTableCell>

                        <StyledTableCell align="center" sx={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                          {formatDateTime(log.createdAt)}
                        </StyledTableCell>

                        <StyledTableCell align="center">
                          <Tooltip title="عرض التفاصيل" arrow>
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setSelectedLog(log)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                      <Typography variant="body1" color="text.secondary">
                        لا توجد سجلات عمليات مطابقة لخيارات البحث المحددة.
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Stack spacing={2}>
              <Pagination
                color="primary"
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => handlePageChange(page)}
                renderItem={(item) => (
                  <PaginationItem
                    slots={{ previous: ArrowForwardIcon, next: ArrowBackIcon }}
                    {...item}
                  />
                )}
              />
            </Stack>
          </Box>
        )}

        {/* Log Details Modal */}
        <LogDetailsModal
          open={Boolean(selectedLog)}
          onClose={() => setSelectedLog(null)}
          log={selectedLog}
        />
      </Box>
    </>
  );
}
