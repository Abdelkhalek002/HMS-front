import React from 'react';
import { CSVLink } from 'react-csv';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const CSV_HEADERS = [
  { label: 'المعرف', key: 'id' },
  { label: 'اسم المسؤول', key: 'adminName' },
  { label: 'معرف المسؤول', key: 'adminId' },
  { label: 'رمز العملية', key: 'action' },
  { label: 'الوصف', key: 'method' },
  { label: 'نوع الكيان', key: 'entityType' },
  { label: 'معرف الكيان', key: 'entityId' },
  { label: 'الحالة', key: 'status' },
  { label: 'عنوان IP', key: 'ipAddress' },
  { label: 'التاريخ والتوقيت', key: 'createdAt' },
];

export default function HistoryExportButton({ data = [] }) {
  const formattedData = data.map((item) => ({
    ...item,
    status: item.status === 'SUCCESS' ? 'ناجحة' : item.status === 'FAILED' ? 'فاشلة' : (item.status || '—'),
    createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString('ar-EG') : '—',
  }));

  const filename = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;

  return (
    <CSVLink
      data={formattedData}
      headers={CSV_HEADERS}
      filename={filename}
      style={{ textDecoration: 'none' }}
    >
      <Button
        variant="outlined"
        color="primary"
        startIcon={<FileDownloadIcon />}
        sx={{ borderRadius: 2 }}
        disabled={!data || data.length === 0}
      >
        تصدير CSV
      </Button>
    </CSVLink>
  );
}
