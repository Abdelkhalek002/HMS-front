import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { Tooltip, Skeleton } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  getAllUserApi,
  toggleUserActiveApi,
} from '../UserControlSlice';
import StatusCode from '../../../StatusCode';
import { getUserInfo } from '../../auth';
import { useTableSelection } from '../../../components/table/useTableSelection';
import TableToolbar from '../../../components/table/TableToolbar';
import userPic from '../../../images/userProfile.jpg';
import { BASE_URL } from '../../../services/http';
import { getAllFaculties, getAllLevels } from '../../lookups';
import './UserTable.css';

const headCells = [
  {
    id: 'username',
    numeric: false,
    disablePadding: true,
    label: 'اسم الطالب',
    sortable: true,
  },
  {
    id: 'email',
    numeric: false,
    disablePadding: false,
    label: 'البريد الإلكتروني',
    sortable: true,
  },
  {
    id: 'faculty_name',
    numeric: false,
    disablePadding: false,
    label: 'الكلية',
    sortable: true,
  },
  {
    id: 'document_status',
    numeric: false,
    disablePadding: false,
    label: 'حالة المستندات',
    sortable: true,
  },
  {
    id: 'is_active',
    numeric: false,
    disablePadding: false,
    label: 'حالة الحساب',
    sortable: true,
  },
  {
    id: 'created_at',
    numeric: false,
    disablePadding: false,
    label: 'تاريخ التسجيل',
    sortable: true,
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'إجراءات',
    sortable: false,
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow style={{ borderBottom: 'none' }}>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'تحديد جميع المستخدمين',
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable !== false ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'desc'}
                onClick={createSortHandler(headCell.id)}
              >
                <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{headCell.label}</h3>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'asc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{headCell.label}</h3>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar({ numSelected }) {
  if (numSelected <= 0) return null;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        bgcolor: (theme) =>
          alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        display: 'flex',
        justifyContent: 'space-between',
        borderRadius: '10px 10px 0 0',
      }}
    >
      <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1" component="div">
        {numSelected} مستخدم محدد
      </Typography>
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function UserTable() {
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('created_at');
  const [togglingId, setTogglingId] = React.useState(null);

  const dispatch = useDispatch();
  const { token, payLoad } = useSelector(getUserInfo) || {};
  const { data: allUserData = [], status } = useSelector((state) => state.UserControlSlice);
  const [searchParams, setSearchParams] = useSearchParams();

  // For Access Lookups
  const faculties = useSelector(getAllFaculties);
  const levels = useSelector(getAllLevels);

  const facultiesList = Array.isArray(faculties) ? faculties : (faculties?.value || []);
  const levelsList = Array.isArray(levels) ? levels : (levels?.value || []);

  // For Access URL Params
  const documentStatusFilter = searchParams.get('document_status') || 'all';
  const dateFilter = searchParams.get('date') || '';
  const facultyId = searchParams.get('faculty_id') || '';
  const levelId = searchParams.get('level_id') || '';
  const genderFilter = searchParams.get('gender') || '';
  const nationalityId = searchParams.get('nationality_id') || '';

  // Advanced demographic active count
  const activeDemographicCount = [facultyId, levelId, genderFilter, nationalityId].filter(Boolean).length;
  const hasActiveFilters = Boolean(
    searchParams.get('search') ||
    (documentStatusFilter && documentStatusFilter !== 'all') ||
    dateFilter ||
    activeDemographicCount > 0
  );

  // Collapsible Advanced Filter Panel State
  const [isAdvOpen, setIsAdvOpen] = React.useState(activeDemographicCount > 0);

  // Helper to cleanly update filters in URL search parameters
  const updateFilters = (newFilterValues) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    Object.entries(newFilterValues).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '' && val !== 'all') {
        newParams.set(key, val);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  const handleDocumentStatusChange = (e) => {
    updateFilters({ document_status: e.target.value });
  };

  const handleDateChange = (e) => {
    updateFilters({ date: e.target.value });
  };

  const handleAdvFilterChange = (key, value) => {
    updateFilters({ [key]: value });
  };

  const handleResetAdvancedFilters = () => {
    updateFilters({
      faculty_id: '',
      level_id: '',
      gender: '',
      nationality_id: '',
    });
  };

  const handleResetAllFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set('page', '1');
    setSearchInput('');
    setSearchParams(newParams);
  };

  const {
    selected,
    excel,
    handleClick,
    isSelected,
    selectAll,
    clearSelection,
  } = useTableSelection();

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Filter & Sort users
  const filteredUsers = React.useMemo(() => {
    if (!Array.isArray(allUserData)) return [];

    let result = [...allUserData];
    const q = (searchParams.get('search') || '').trim().toLowerCase();

    if (q) {
      result = result.filter((item) => {
        const username = String(item.username || item.userName || '').toLowerCase();
        const email = String(item.email || '').toLowerCase();
        const faculty = String(item.faculty_name || '').toLowerCase();
        const nationalId = String(item.national_id || '').toLowerCase();
        return (
          username.includes(q) ||
          email.includes(q) ||
          faculty.includes(q) ||
          nationalId.includes(q)
        );
      });
    }

    if (documentStatusFilter && documentStatusFilter !== 'all') {
      result = result.filter(
        (item) =>
          String(item.document_status || 'pending').toLowerCase() ===
          documentStatusFilter.toLowerCase()
      );
    }

    if (dateFilter) {
      result = result.filter((item) => {
        const itemDate = item.created_at ? String(item.created_at).slice(0, 10) : '';
        return itemDate === dateFilter;
      });
    }

    if (facultyId) {
      result = result.filter((item) => String(item.faculty_id) === String(facultyId));
    }

    if (levelId) {
      result = result.filter((item) => String(item.level_id) === String(levelId));
    }

    if (genderFilter) {
      result = result.filter((item) => String(item.gender) === String(genderFilter));
    }

    if (nationalityId) {
      result = result.filter((item) => String(item.nationality_id) === String(nationalityId));
    }

    return result.sort((a, b) => {
      let aVal = '';
      let bVal = '';

      if (orderBy === 'username') {
        aVal = a.username || a.userName || '';
        bVal = b.username || b.userName || '';
      } else if (orderBy === 'email') {
        aVal = a.email || '';
        bVal = b.email || '';
      } else if (orderBy === 'faculty_name') {
        aVal = a.faculty_name || '';
        bVal = b.faculty_name || '';
      } else if (orderBy === 'document_status') {
        aVal = a.document_status || '';
        bVal = b.document_status || '';
      } else if (orderBy === 'is_active') {
        aVal = a.is_active ? 1 : 0;
        bVal = b.is_active ? 1 : 0;
      } else if (orderBy === 'created_at') {
        aVal = a.created_at || '';
        bVal = b.created_at || '';
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [
    allUserData,
    searchParams,
    documentStatusFilter,
    dateFilter,
    facultyId,
    levelId,
    genderFilter,
    nationalityId,
    order,
    orderBy,
  ]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked && filteredUsers) {
      selectAll(filteredUsers);
    } else {
      clearSelection();
    }
  };

  const [searchInput, setSearchInput] = React.useState(searchParams.get('search') || '');

  React.useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // Search handler (triggers backend search & URL sync)
  const searchHandler = () => {
    updateFilters({ search: searchInput });
  };

  // Toggle is_active flag
  const handleToggleActive = (id, newActive, name) => {
    setTogglingId(id);
    dispatch(toggleUserActiveApi({ id, is_active: newActive }))
      .unwrap()
      .then(() => {
        toast.success(
          newActive
            ? `تم تفعيل حساب ${name || 'المستخدم'} بنجاح`
            : `تم تعطيل حساب ${name || 'المستخدم'} بنجاح`
        );
      })
      .catch((error) => {
        const errorMsg =
          error?.error ||
          error?.message ||
          (typeof error === 'string' ? error : null) ||
          'حدث خطأ أثناء تعديل حالة الحساب';
        toast.error(errorMsg);
      })
      .finally(() => {
        setTogglingId(null);
      });
  };

  // Excel formatted data
  const exportData = React.useMemo(() => {
    const list = selected.length > 0 ? excel : filteredUsers;
    return list.map((item) => ({
      'اسم الطالب': item.username || item.userName || '',
      'البريد الإلكتروني': item.email || '',
      'الكلية': item.faculty_name || '',
      'حالة المستندات':
        item.document_status === 'approved'
          ? 'معتمد'
          : item.document_status === 'rejected'
          ? 'مرفوض'
          : 'قيد المراجعة',
      'حالة الحساب': item.is_active && !item.blocked ? 'نشط' : 'محظور',
      'تاريخ التسجيل': item.created_at ? String(item.created_at).slice(0, 10) : '',
    }));
  }, [selected, excel, filteredUsers]);

  const profileBasePath = payLoad?.type === 'user' ? '/profile' : '/ad/profile';

  return (
    <div>
      <Box className="k-user-table-box">
        <TableToolbar
          searchValue={searchInput}
          onSearchChange={(e) => setSearchInput(e.target.value)}
          onSearchSubmit={searchHandler}
          placeholder="ابحث بالاسم، البريد، الكلية..."
          excelData={exportData}
          excelFilename="students_list"
          extraActions={
            <div className="resv-quick-filters">
              {/* Document Status Selector */}
              <div className="resv-toolbar-control">
                <span className="material-symbols-outlined control-icon">verified_user</span>
                <select
                  value={documentStatusFilter}
                  onChange={handleDocumentStatusChange}
                  className="resv-toolbar-select"
                  title="تصفية بحالة المستندات"
                >
                  <option value="all">جميع الحالات (المستندات)</option>
                  <option value="approved">معتمد (Approved)</option>
                  <option value="pending">قيد المراجعة (Pending)</option>
                  <option value="rejected">مرفوض (Rejected)</option>
                </select>
              </div>

              {/* Registration Date Filter */}
              <div className="resv-toolbar-control date-control">
                <span className="material-symbols-outlined control-icon">calendar_month</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={handleDateChange}
                  className="resv-toolbar-date"
                  title="تصفية بتاريخ التسجيل"
                />
                {dateFilter && (
                  <button
                    type="button"
                    className="resv-control-clear-btn"
                    onClick={() => updateFilters({ date: '' })}
                    title="إلغاء تصفية التاريخ"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                )}
              </div>

              {/* Advanced Filters Button */}
              <button
                type="button"
                className={`resv-adv-toggle-btn ${isAdvOpen ? 'active' : ''} ${activeDemographicCount > 0 ? 'highlight' : ''}`}
                onClick={() => setIsAdvOpen((prev) => !prev)}
                title="تصفية متقدمة (الكلية، المستوى، النوع، الجنسية)"
              >
                <span className="material-symbols-outlined">tune</span>
                <span>تصفية متقدمة</span>
                {activeDemographicCount > 0 && (
                  <span className="adv-filter-count-badge">{activeDemographicCount}</span>
                )}
              </button>

              {/* Reset All Filters Button */}
              {hasActiveFilters && (
                <button
                  type="button"
                  className="resv-reset-all-btn"
                  onClick={handleResetAllFilters}
                  title="إعادة تعيين جميع الفلاتر"
                >
                  <span className="material-symbols-outlined">restart_alt</span>
                  <span>إعادة ضبط</span>
                </button>
              )}
            </div>
          }
        />

        {/* Collapsible Advanced Demographic Filters Panel */}
        {isAdvOpen && (
          <div className="resv-adv-panel">
            <div className="resv-adv-header">
              <div className="resv-adv-title">
                <span className="material-symbols-outlined">manage_search</span>
                <h4>تصفية متقدمة لبيانات الطلاب</h4>
                {activeDemographicCount > 0 && (
                  <span className="adv-active-pill">
                    {activeDemographicCount} فلاتر نشطة
                  </span>
                )}
              </div>
              {activeDemographicCount > 0 && (
                <button
                  type="button"
                  className="resv-adv-clear-btn"
                  onClick={handleResetAdvancedFilters}
                >
                  <span className="material-symbols-outlined">clear_all</span>
                  <span>مسح التصفية المتقدمة</span>
                </button>
              )}
            </div>

            <div className="resv-adv-grid">
              {/* Faculty */}
              <div className="resv-adv-field">
                <label>
                  <span className="material-symbols-outlined">school</span>
                  الكلية
                </label>
                <select
                  value={facultyId}
                  onChange={(e) => handleAdvFilterChange('faculty_id', e.target.value)}
                >
                  <option value="">جميع الكليات</option>
                  {facultiesList.map((item) => {
                    const fId = item.faculty_id ?? item.id;
                    const fName = item.facultyName ?? item.faculty_name;
                    return (
                      <option key={fId} value={fId}>
                        {fName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Level */}
              <div className="resv-adv-field">
                <label>
                  <span className="material-symbols-outlined">stairs</span>
                  المستوى / الفرقة
                </label>
                <select
                  value={levelId}
                  onChange={(e) => handleAdvFilterChange('level_id', e.target.value)}
                >
                  <option value="">جميع المستويات</option>
                  {levelsList.map((item) => {
                    const lId = item.level_id ?? item.id;
                    const lName = item.levelName ?? item.level_name;
                    return (
                      <option key={lId} value={lId}>
                        {lName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Gender */}
              <div className="resv-adv-field">
                <label>
                  <span className="material-symbols-outlined">wc</span>
                  النوع
                </label>
                <select
                  value={genderFilter}
                  onChange={(e) => handleAdvFilterChange('gender', e.target.value)}
                >
                  <option value="">الكل (ذكور وإناث)</option>
                  <option value="ذكر">ذكر</option>
                  <option value="أنثي">أنثى</option>
                </select>
              </div>

              {/* Nationality */}
              <div className="resv-adv-field">
                <label>
                  <span className="material-symbols-outlined">public</span>
                  الجنسية
                </label>
                <select
                  value={nationalityId}
                  onChange={(e) => handleAdvFilterChange('nationality_id', e.target.value)}
                >
                  <option value="">الكل (مصري ووافد)</option>
                  <option value="1">مصري</option>
                  <option value="2">وافد</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <Paper className="user-table-paper" sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size="medium">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={filteredUsers.length}
              />
              <TableBody>
                {/* 1. Loading Skeleton */}
                {status === StatusCode.LOADING ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <TableRow key={`skeleton-${idx}`}>
                      <TableCell padding="checkbox">
                        <Skeleton variant="rounded" width={20} height={20} />
                      </TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Skeleton variant="circular" width={38} height={38} />
                          <Skeleton variant="text" width={110} height={24} />
                        </Box>
                      </TableCell>
                      <TableCell align="center"><Skeleton variant="text" width={130} /></TableCell>
                      <TableCell align="center"><Skeleton variant="text" width={110} /></TableCell>
                      <TableCell align="center"><Skeleton variant="rounded" width={75} height={24} /></TableCell>
                      <TableCell align="center"><Skeleton variant="rounded" width={60} height={24} /></TableCell>
                      <TableCell align="center"><Skeleton variant="text" width={80} /></TableCell>
                      <TableCell align="center"><Skeleton variant="rounded" width={90} height={32} /></TableCell>
                    </TableRow>
                  ))
                ) : filteredUsers.length > 0 ? (
                  /* 2. Success User Rows */
                  filteredUsers.map((row, index) => {
                    const rowId = row.student_id ?? row.id ?? row.user_id;
                    const isItemSelected = isSelected(rowId);
                    const labelId = `user-table-checkbox-${index}`;

                    const rawPhoto = row.profile_photo_url || row.userImage_file;
                    const avatarUrl = rawPhoto
                      ? rawPhoto.startsWith('http')
                        ? rawPhoto
                        : `${BASE_URL}/uploads/${rawPhoto.replace(/^\/+/, '')}`
                      : userPic;

                    const studentName = row.username || row.userName || 'غير متوفر';
                    const email = row.email || '-';
                    const facultyName = row.faculty_name || '-';
                    const createdAt = row.created_at ? String(row.created_at).slice(0, 10) : '-';

                    const isAccountActive = Boolean(row.is_active) && !row.blocked;
                    const docStatus = row.document_status || 'pending';

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={rowId ?? index}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell
                          onClick={(event) => handleClick(event, rowId, row)}
                          padding="checkbox"
                        >
                          <Checkbox
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              'aria-labelledby': labelId,
                            }}
                          />
                        </TableCell>

                        {/* Student Name & Avatar */}
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                          align="center"
                        >
                          <Link
                            to={`${profileBasePath}/${rowId}`}
                            className="user-profile-cell"
                          >
                            <img
                              className="user-avatar-img"
                              alt={studentName}
                              src={avatarUrl}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = userPic;
                              }}
                            />
                            <Tooltip title={studentName} placement="top" arrow>
                              <span>
                                {studentName.length > 14
                                  ? `${studentName.slice(0, 14)}...`
                                  : studentName}
                              </span>
                            </Tooltip>
                          </Link>
                        </TableCell>

                        {/* Email */}
                        <TableCell align="center">
                          {email !== '-' ? (
                            <Tooltip title={email} placement="top" arrow>
                              <a
                                href={`mailto:${email}`}
                                style={{ color: '#2563eb', textDecoration: 'none' }}
                              >
                                {email.length > 18 ? `${email.slice(0, 18)}...` : email}
                              </a>
                            </Tooltip>
                          ) : (
                            '-'
                          )}
                        </TableCell>

                        {/* Faculty */}
                        <TableCell align="center">
                          <Tooltip title={facultyName} placement="top" arrow>
                            <span className="faculty-tag">{facultyName}</span>
                          </Tooltip>
                        </TableCell>

                        {/* Document Status */}
                        <TableCell align="center">
                          {docStatus === 'approved' ? (
                            <span className="status-pill status-pill-approved">
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                check_circle
                              </span>
                              معتمد
                            </span>
                          ) : docStatus === 'rejected' ? (
                            <span className="status-pill status-pill-rejected">
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                cancel
                              </span>
                              مرفوض
                            </span>
                          ) : (
                            <span className="status-pill status-pill-pending">
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                hourglass_top
                              </span>
                              قيد المراجعة
                            </span>
                          )}
                        </TableCell>

                        {/* Account Status Badge */}
                        <TableCell align="center">
                          {isAccountActive ? (
                            <span className="status-pill status-pill-active">
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                verified_user
                              </span>
                              نشط
                            </span>
                          ) : (
                            <span className="status-pill status-pill-blocked">
                              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                                block
                              </span>
                              معطل
                            </span>
                          )}
                        </TableCell>

                        {/* Created At */}
                        <TableCell align="center" style={{ direction: 'ltr' }}>
                          {createdAt}
                        </TableCell>

                        {/* Actions */}
                        <TableCell align="center">
                          <div className="user-actions-group">
                            {/* View Profile */}
                            <Tooltip title="عرض الملف الشخصي" arrow>
                              <Link
                                to={`${profileBasePath}/${rowId}`}
                                className="user-action-btn view-btn"
                              >
                                <span className="material-symbols-outlined">visibility</span>
                              </Link>
                            </Tooltip>

                            {/* Toggle is_active Switch */}
                            <Tooltip
                              title={isAccountActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                              arrow
                            >
                              <span>
                                <Switch
                                  size="small"
                                  color="success"
                                  checked={isAccountActive}
                                  disabled={togglingId === rowId}
                                  onChange={(e) =>
                                    handleToggleActive(rowId, e.target.checked, studentName)
                                  }
                                  inputProps={{
                                    'aria-label': isAccountActive ? 'تعطيل الحساب' : 'تفعيل الحساب',
                                  }}
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#10b981',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#10b981',
                                    },
                                  }}
                                />
                              </span>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  /* 3. Empty State */
                  <TableRow>
                    <TableCell colSpan={8}>
                      <div className="user-empty-row">
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: '48px', color: '#94a3b8' }}
                        >
                          person_search
                        </span>
                        <h4>لا يوجد مستخدمين مطابقين</h4>
                        <p>لم يتم العثور على أي نتائج، جرب تغيير كلمات البحث أو إعادة المحاولة.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </div>
  );
}
