import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';

export default function LogDetailsModal({ open, onClose, log }) {
  if (!log) return null;

  const isSuccess = log.status === 'SUCCESS' || log.status === 'success' || !log.status;

  const formatJson = (val) => {
    if (!val) return null;
    if (typeof val === 'string') {
      try {
        const parsed = JSON.parse(val);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return val;
      }
    }
    return JSON.stringify(val, null, 2);
  };

  const formattedDetails = formatJson(log.details);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
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
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
            تفاصيل العملية #{log.id}
          </Typography>
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
        </Box>
        <IconButton onClick={onClose} size="small" aria-label="close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ mt: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              المسؤول
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {log.adminName || 'غير محدد'} {log.adminId ? `(#${log.adminId})` : ''}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              رمز العملية (Action)
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', color: 'primary.main', fontWeight: 600 }}>
              {log.action || '—'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              وصف العملية
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {log.method || '—'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              نوع الكيان المستهدف
            </Typography>
            <Typography variant="body2">
              {log.entityType ? `${log.entityType} ${log.entityId ? `(#${log.entityId})` : ''}` : '—'}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="caption" color="text.secondary">
              عنوان IP
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {log.ipAddress || '—'}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="text.secondary">
              تاريخ وتوقيت التنفيذ
            </Typography>
            <Typography variant="body2">
              {log.createdAt ? new Date(log.createdAt).toLocaleString('ar-EG') : '—'}
            </Typography>
          </Grid>

          {formattedDetails && (
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                البيانات الإضافية (Details)
              </Typography>
              <Box
                component="pre"
                sx={{
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #e9ecef',
                  borderRadius: 2,
                  p: 2,
                  maxHeight: 280,
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: 13,
                  direction: 'ltr',
                  textAlign: 'left',
                }}
              >
                {formattedDetails}
              </Box>
            </Grid>
          )}
        </Grid>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          إغلاق
        </Button>
      </DialogActions>
    </Dialog>
  );
}
