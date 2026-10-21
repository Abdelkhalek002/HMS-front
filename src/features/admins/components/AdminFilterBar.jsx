import React from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const rtlFilterSx = {
  direction: 'rtl',
  '& label': {
    fontFamily: '"Cairo", sans-serif !important',
    fontSize: '14px',
    fontWeight: 600,
    left: 'inherit !important',
    right: '1.75rem !important',
    transformOrigin: 'right !important',
    textAlign: 'right',
  },
  '& legend': {
    fontFamily: '"Cairo", sans-serif !important',
    textAlign: 'right',
  },
  '& .MuiInputBase-root': {
    fontFamily: '"Cairo", sans-serif !important',
    borderRadius: '10px',
  },
  '& .MuiInputBase-input': {
    fontFamily: '"Cairo", sans-serif !important',
    fontSize: '14px',
    textAlign: 'right',
    '&::placeholder': {
      fontFamily: '"Cairo", sans-serif !important',
      fontSize: '13px',
      opacity: 0.85,
    },
  },
  '& .MuiSelect-select': {
    fontFamily: '"Cairo", sans-serif !important',
    fontSize: '14px',
    textAlign: 'right',
  },
  '& .MuiSelect-icon': {
    left: '7px',
    right: 'auto',
  },
};

const dropdownMenuProps = {
  PaperProps: {
    sx: {
      borderRadius: '12px',
      marginTop: '6px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
      direction: 'rtl',
      '& .MuiMenuItem-root': {
        fontFamily: '"Cairo", sans-serif !important',
        fontSize: '13.5px',
        fontWeight: 500,
        justifyContent: 'flex-start',
        padding: '8px 16px',
        '&.Mui-selected': {
          backgroundColor: '#eff6ff !important',
          color: '#1d4ed8 !important',
          fontWeight: 700,
        },
        '&:hover': {
          backgroundColor: '#f1f5f9',
        },
      },
    },
  },
};

const AdminFilterBar = ({
  searchTerm = '',
  onSearchChange,
  roleFilter = 'all',
  onRoleChange,
  statusFilter = 'all',
  onStatusChange,
  onReset,
  totalCount = 0,
  filteredCount = 0,
  disabled = false,
}) => {
  const isFiltered = Boolean(
    searchTerm.trim() !== '' || roleFilter !== 'all' || statusFilter !== 'all'
  );

  return (
    <div className='admin-filters-container' dir='rtl'>
      <div className='admin-filters-row'>
        {/* Search input */}
        <TextField
          className='admin-search-input'
          size='small'
          placeholder='بحث بالاسم أو البريد الإلكتروني...'
          label='بحث'
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={disabled}
          sx={rtlFilterSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#9ca3af', fontSize: 20 }} />
              </InputAdornment>
            ),
            endAdornment: searchTerm ? (
              <InputAdornment position='end'>
                <IconButton
                  size='small'
                  onClick={() => onSearchChange('')}
                  title='مسح نص البحث'
                  edge='end'
                >
                  <ClearIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />

        {/* Role filter */}
        <FormControl
          size='small'
          className='admin-filter-select'
          disabled={disabled}
          sx={rtlFilterSx}
        >
          <InputLabel id='admin-role-filter-label'>الدور / الصلاحية</InputLabel>
          <Select
            labelId='admin-role-filter-label'
            id='admin-role-filter-select'
            value={roleFilter}
            label='الدور / الصلاحية'
            onChange={(e) => onRoleChange(e.target.value)}
            MenuProps={dropdownMenuProps}
          >
            <MenuItem value='all'>جميع الأدوار (الكل)</MenuItem>
            <MenuItem value='super_admin'>مدير النظام (Super Admin)</MenuItem>
            <MenuItem value='counter'>كاونتر (Counter)</MenuItem>
            <MenuItem value='transfer'>مسؤول التحويلات (Transfer)</MenuItem>
            <MenuItem value='viewer'>ملاحظ (Viewer / Auditor)</MenuItem>
          </Select>
        </FormControl>

        {/* Status filter */}
        <FormControl
          size='small'
          className='admin-filter-select'
          disabled={disabled}
          sx={rtlFilterSx}
        >
          <InputLabel id='admin-status-filter-label'>الحالة</InputLabel>
          <Select
            labelId='admin-status-filter-label'
            id='admin-status-filter-select'
            value={statusFilter}
            label='الحالة'
            onChange={(e) => onStatusChange(e.target.value)}
            MenuProps={dropdownMenuProps}
          >
            <MenuItem value='all'>جميع الحالات (الكل)</MenuItem>
            <MenuItem value='active'>نشط</MenuItem>
            <MenuItem value='inactive'>غير نشط</MenuItem>
            <MenuItem value='blocked'>محظور</MenuItem>
          </Select>
        </FormControl>

        {/* Reset button */}
        {isFiltered && (
          <Button
            variant='outlined'
            size='small'
            onClick={onReset}
            startIcon={<RestartAltIcon />}
            className='admin-reset-btn'
            title='إعادة تعيين خيارات البحث والتصفية'
          >
            إعادة تعيين
          </Button>
        )}

        {/* Counter Badge */}
        <div className='admin-filter-count-chip'>
          <FilterAltIcon sx={{ fontSize: 16 }} />
          <span>
            {isFiltered
              ? `عرض ${filteredCount} من أصل ${totalCount} مسؤول`
              : `إجمالي المسؤولين: ${totalCount}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AdminFilterBar;
