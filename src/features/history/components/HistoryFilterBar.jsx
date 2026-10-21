import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { getAllAdmins, getAllAdminsApi } from '../../admins/AdminSlice';

const ACTION_OPTIONS = [
  { value: '', label: 'جميع العمليات' },
  { value: 'ADMIN_CREATE', label: 'إضافة مسؤول جديد' },
  { value: 'ADMIN_UPDATE', label: 'تعديل بيانات مسؤول' },
  { value: 'ADMIN_DELETE', label: 'حذف مسؤول' },
  { value: 'USER_UPDATE_STATUS', label: 'تحديث حالة مستخدم' },
  { value: 'RESERVATION_ACCEPT', label: 'قبول كشف طبي' },
  { value: 'RESERVATION_REJECT', label: 'رفض كشف طبي' },
  { value: 'RESERVATION_CREATE', label: 'حجز كشف عاجل' },
  { value: 'RESERVATION_DELETE', label: 'حذف حجز كشف' },
  { value: 'TRANSFER_INITIATE', label: 'تحويل إلى مستشفى خارجية' },
  { value: 'TRANSFER_ASSIGN', label: 'تحديد مستشفى التحويل' },
  { value: 'TRANSFER_UPDATE', label: 'تحديث طلب تحويل' },
];

const STATUS_OPTIONS = [
  { value: '', label: 'جميع الحالات' },
  { value: 'SUCCESS', label: 'ناجحة (SUCCESS)' },
  { value: 'FAILED', label: 'فاشلة (FAILED)' },
];

const LIMIT_OPTIONS = [
  { value: 10, label: '10 سجلات' },
  { value: 25, label: '25 سجل' },
  { value: 50, label: '50 سجل' },
];

export default function HistoryFilterBar({ filters, onChange, onReset }) {
  const dispatch = useDispatch();
  const admins = useSelector(getAllAdmins);

  useEffect(() => {
    if (!admins || admins.length === 0) {
      dispatch(getAllAdminsApi());
    }
  }, [dispatch, admins]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 3,
        border: '1px solid #e2e8f0',
        backgroundColor: '#ffffff',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 100 }}>
          <FilterAltIcon color="primary" />
          <span style={{ fontWeight: 'bold', fontSize: '15px' }}>تصفية السجل:</span>
        </Box>

        {/* Filter by Admin */}
        <FormControl size="small" sx={{ minWidth: 170, flex: 1 }}>
          <InputLabel id="filter-admin-label">المسؤول</InputLabel>
          <Select
            labelId="filter-admin-label"
            label="المسؤول"
            value={filters.adminId || ''}
            onChange={(e) => onChange({ adminId: e.target.value })}
          >
            <MenuItem value="">جميع المسؤولين</MenuItem>
            {Array.isArray(admins) &&
              admins.map((adm) => {
                const id = adm.id || adm.admin_id;
                const name = adm.username || adm.name || adm.email;
                return (
                  <MenuItem key={id} value={id}>
                    {name}
                  </MenuItem>
                );
              })}
          </Select>
        </FormControl>

        {/* Filter by Action */}
        <FormControl size="small" sx={{ minWidth: 190, flex: 1 }}>
          <InputLabel id="filter-action-label">نوع العملية</InputLabel>
          <Select
            labelId="filter-action-label"
            label="نوع العملية"
            value={filters.action || ''}
            onChange={(e) => onChange({ action: e.target.value })}
          >
            {ACTION_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filter by Status */}
        <FormControl size="small" sx={{ minWidth: 150, flex: 1 }}>
          <InputLabel id="filter-status-label">حالة العملية</InputLabel>
          <Select
            labelId="filter-status-label"
            label="حالة العملية"
            value={filters.status || ''}
            onChange={(e) => onChange({ status: e.target.value })}
          >
            {STATUS_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Limit */}
        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel id="filter-limit-label">لكل صفحة</InputLabel>
          <Select
            labelId="filter-limit-label"
            label="لكل صفحة"
            value={filters.limit || 10}
            onChange={(e) => onChange({ limit: Number(e.target.value) })}
          >
            {LIMIT_OPTIONS.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reset Button */}
        <Button
          variant="outlined"
          color="secondary"
          size="medium"
          startIcon={<RestartAltIcon />}
          onClick={onReset}
          sx={{ borderRadius: 2 }}
        >
          إعادة تعيين
        </Button>
      </Box>
    </Paper>
  );
}
