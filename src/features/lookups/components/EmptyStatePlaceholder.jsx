import React from 'react';
import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from '@mui/material';
import {
  Add,
  StorageRounded,
  InfoOutlined,
  MonitorHeart,
  School,
  AccountBalance,
  LocalHospital,
  LocationCity,
  Layers,
} from '@mui/icons-material';

const ICON_MAP = {
  monitor_heart: <MonitorHeart sx={{ fontSize: 44, color: '#0061ff' }} />,
  school: <School sx={{ fontSize: 44, color: '#0061ff' }} />,
  account_balance: <AccountBalance sx={{ fontSize: 44, color: '#0061ff' }} />,
  local_hospital: <LocalHospital sx={{ fontSize: 44, color: '#0061ff' }} />,
  location_city: <LocationCity sx={{ fontSize: 44, color: '#0061ff' }} />,
  layers: <Layers sx={{ fontSize: 44, color: '#0061ff' }} />,
};

const toIndefinite = (text) => {
  if (!text) return '';
  return text
    .split(' ')
    .map((word) => (word.startsWith('ال') ? word.slice(2) : word))
    .join(' ');
};

export default function EmptyStatePlaceholder({
  entitySingular = 'عنصر',
  entityIndefinite,
  addButtonText,
  pageTitle = 'البيانات',
  iconName,
  customIcon,
  emptyTitle,
  emptyDescription,
  hint,
  onAdd,
}) {
  const renderedIcon =
    customIcon ||
    ICON_MAP[iconName] || (
      <StorageRounded sx={{ fontSize: 44, color: '#0061ff' }} />
    );

  const cleanIndefinite = entityIndefinite || toIndefinite(entitySingular);
  const buttonLabel = addButtonText || `أضف أول ${cleanIndefinite}`;

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        p: { xs: 3, sm: 5 },
        borderRadius: 4,
        border: '2px dashed #cbd5e1',
        backgroundColor: '#fafbfc',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
      }}
    >
      {/* Icon with soft illuminated ring */}
      <Box
        sx={{
          width: 88,
          height: 88,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
          border: '2px solid #bfdbfe',
          mb: 2.5,
          boxShadow: '0 8px 24px rgba(0, 97, 255, 0.1)',
        }}
      >
        {renderedIcon}
      </Box>

      {/* Database Status Chip */}
      <Chip
        label="قاعدة البيانات: لا توجد سجلات حالياً"
        size="small"
        sx={{
          fontFamily: '"Cairo", sans-serif !important',
          fontWeight: 600,
          fontSize: '12px',
          color: '#475569',
          backgroundColor: '#f1f5f9',
          border: '1px solid #e2e8f0',
          mb: 2,
          px: 1,
        }}
      />

      {/* Main Title */}
      <Typography
        variant="h6"
        component="h3"
        sx={{
          fontFamily: '"Cairo", sans-serif !important',
          fontWeight: 700,
          fontSize: { xs: '18px', sm: '21px' },
          color: '#1e293b',
          mb: 1.5,
        }}
      >
        {emptyTitle || `لا توجد بيانات مسجلة لـ ${pageTitle} في قاعدة البيانات`}
      </Typography>

      {/* Description */}
      <Typography
        variant="body1"
        sx={{
          fontFamily: '"Cairo", sans-serif !important',
          fontWeight: 500,
          fontSize: '14.5px',
          color: '#64748b',
          maxWidth: 540,
          lineHeight: 1.8,
          mb: 3.5,
        }}
      >
        {emptyDescription ||
          `لم يتم استرجاع أي بيانات مسجلة لـ ${entitySingular} من قاعدة البيانات حتى الآن. يمكنك بدء إدخال أول ${cleanIndefinite} لتفعيل العمليات المرتبطة بها في النظام.`}
      </Typography>

      {/* CTA Button */}
      {onAdd && (
        <Button
          variant="contained"
          onClick={onAdd}
          startIcon={<Add />}
          sx={{
            fontFamily: '"Cairo", sans-serif !important',
            fontWeight: 700,
            fontSize: '15px',
            backgroundColor: '#0061ff',
            color: '#ffffff',
            borderRadius: '12px',
            px: 4,
            py: 1.2,
            boxShadow: '0 4px 14px rgba(0, 97, 255, 0.25)',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#0052d9',
              boxShadow: '0 6px 20px rgba(0, 97, 255, 0.35)',
            },
          }}
        >
          {buttonLabel}
        </Button>
      )}

      {/* Helpful Hint Footer */}
      {hint && (
        <Box
          sx={{
            mt: 4,
            pt: 2.5,
            borderTop: '1px solid #e2e8f0',
            width: '100%',
            maxWidth: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            color: '#64748b',
          }}
        >
          <InfoOutlined sx={{ fontSize: 18, color: '#3b82f6', flexShrink: 0 }} />
          <Typography
            variant="caption"
            sx={{
              fontFamily: '"Cairo", sans-serif !important',
              fontSize: '13px',
              fontWeight: 500,
              color: '#64748b',
              textAlign: 'center',
            }}
          >
            {hint}
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
