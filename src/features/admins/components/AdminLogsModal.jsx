import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CloseIcon from '@mui/icons-material/Close';
import HistoryIcon from '@mui/icons-material/History';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import { CircleLoader } from 'react-spinners';

import StatusCode from '../../../StatusCode.js';
import {
  getAdminLogsAPI,
  deleteAdminLogsAPI,
  clearAdminLogs,
  selectAdminLogs,
  selectAdminLogsStatus,
} from '../../history/HistorySlice.js';
import LogDetailsModal from '../../history/components/LogDetailsModal.jsx';
import usePermission from '../../../hooks/usePermission';
import { ROUTES } from '../../../routes/routePaths';

export default function AdminLogsModal({ open, onClose, admin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const adminLogs = useSelector(selectAdminLogs);
  const status = useSelector(selectAdminLogsStatus);
  const { can, isSuperAdmin, PERMISSIONS } = usePermission();
  const canDeleteLogs = isSuperAdmin || can(PERMISSIONS.LOGS_DELETE);

  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    if (open && admin?.id) {
      dispatch(getAdminLogsAPI(admin.id));
    } else {
      dispatch(clearAdminLogs());
    }
  }, [dispatch, open, admin?.id]);

  if (!admin) return null;

  const handleDeleteAdminLogs = () => {
    swal({
      title: `هل أنت متأكد من حذف سجل عمليات ${admin.username || 'هذا المسؤول'}؟`,
      text: 'سيتم مسح جميع العمليات المسجلة لهذا المسؤول نهائياً.',
      icon: 'warning',
      buttons: ['إلغاء', 'نعم، حذف السجل'],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        dispatch(deleteAdminLogsAPI(admin.id))
          .unwrap()
          .then((res) => {
            swal(res?.message || 'تم حذف سجل العمليات بنجاح', { icon: 'success' });
          })
          .catch((err) => {
            toast.error(err?.message || 'حدث خطأ أثناء حذف السجل', {
              theme: 'colored',
              position: 'top-right',
            });
          });
      }
    });
  };

  const handleOpenInHistoryPage = () => {
    onClose();
    navigate(`${ROUTES.STAFF.LOGS}?adminId=${admin.id}`);
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
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 1,
            direction: 'rtl',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <HistoryIcon color="primary" sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                سجل عمليات المسؤول: {admin.username || admin.title || admin.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                معرف المسؤول: #{admin.id} | البريد: {admin.email || '—'}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={onClose} size="small" aria-label="close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {status === StatusCode.LOADING ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 250,
              }}
            >
              <CircleLoader color="#0061ff" size={40} />
            </Box>
          ) : Array.isArray(adminLogs) && adminLogs.length > 0 ? (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e2e8f0', borderRadius: 2 }}>
              <Table size="small" aria-label="admin specific logs">
                <TableHead sx={{ backgroundColor: '#f8fafc' }}>
                  <TableRow>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>#</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>العملية</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>الكيان</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>الحالة</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>التوقيت</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>التفاصيل</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {adminLogs.map((log) => {
                    const isSuccess = log.status === 'SUCCESS' || log.status === 'success' || !log.status;
                    return (
                      <TableRow key={log.id} hover>
                        <TableCell align="center" sx={{ fontFamily: 'monospace' }}>#{log.id}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>{log.method || '—'}</Typography>
                          {log.action && (
                            <Chip
                              label={log.action}
                              size="small"
                              sx={{ fontSize: '10px', height: 18, fontFamily: 'monospace', mt: 0.3 }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {log.entityType ? `${log.entityType} ${log.entityId ? `(#${log.entityId})` : ''}` : '—'}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            size="small"
                            icon={isSuccess ? <CheckCircleIcon fontSize="inherit" /> : <CancelIcon fontSize="inherit" />}
                            label={isSuccess ? 'ناجحة' : 'فاشلة'}
                            color={isSuccess ? 'success' : 'error'}
                            variant="outlined"
                            sx={{
                              fontWeight: 600,
                              height: 22,
                              fontSize: 11,
                              '& .MuiChip-icon': { mr: 0.75, ml: -0.25, fontSize: 14 },
                              '& .MuiChip-label': { px: 0.75 },
                            }}
                          />
                        </TableCell>
                        <TableCell align="center" sx={{ fontSize: 12, whiteSpace: 'nowrap' }}>
                          {formatDateTime(log.createdAt)}
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="عرض التفاصيل" arrow>
                            <IconButton size="small" color="primary" onClick={() => setSelectedLog(log)}>
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                لم يتم تسجيل أي عمليات من هذا المسؤول حتى الآن.
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {canDeleteLogs && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteOutlineIcon />}
                onClick={handleDeleteAdminLogs}
                disabled={!adminLogs || adminLogs.length === 0}
              >
                مسح سجل هذا المسؤول
              </Button>
            )}
            <Button
              variant="text"
              color="primary"
              startIcon={<OpenInNewIcon />}
              onClick={handleOpenInHistoryPage}
            >
              عرض في صفحة السجلات
            </Button>
          </Box>
          <Button onClick={onClose} variant="contained" color="inherit">
            إغلاق
          </Button>
        </DialogActions>
      </Dialog>

      {/* Details modal for single record */}
      <LogDetailsModal
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        log={selectedLog}
      />
    </>
  );
}
