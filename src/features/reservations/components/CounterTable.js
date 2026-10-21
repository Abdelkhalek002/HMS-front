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
import { visuallyHidden } from '@mui/utils';
import { Tooltip } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { acceptOrDeclineAPI, getAllReservationListAPI, getReservationData } from '../../admins/CounterSlice';
import StatusCode from '../../../StatusCode';
import { getUserInfo } from '../../auth';
import { useState } from 'react';
import { BASE_URL } from '../../../services/http';
import { useInitiateTransferMutation } from '../reservationApi';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button as MuiButton } from '@mui/material';
import { useTableSelection } from '../../../components/table/useTableSelection';
import TableToolbar from '../../../components/table/TableToolbar';
import { getAllClinics, getAllFaculties, getAllLevels } from '../../lookups';
import { usePermission } from '../../../hooks/usePermission';
import { PERMISSIONS } from '../../../utils/permissionUtils';
import userPic from '../../../images/userProfile.jpg';

const headCells = [
  {
    id: 'studentName',
    numeric: false,
    disablePadding: true,
    label: 'اسم الطالب',
    sortable: true,
  },
  {
    id: 'nationalId',
    numeric: false,
    disablePadding: false,
    label: 'الرقم القومي',
    sortable: true,
  },
  {
    id: 'clinic',
    numeric: false,
    disablePadding: false,
    label: 'العيادة',
    sortable: true,
  },
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'تاريخ الحجز',
    sortable: true,
  },
  {
    id: 'examType',
    numeric: false,
    disablePadding: false,
    label: ' نوع الكشف',
    sortable: true,
  },
  {
    id: 'status',
    numeric: false,
    disablePadding: false,
    label: 'حالة الكشف',
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
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, showActions = true } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const visibleHeadCells = headCells.filter((cell) => cell.id !== 'actions' || showActions);

  return (
    <TableHead>
      <TableRow style={{ borderBottom: "none" }} >
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'تحديد جميع الحجوزات',
            }}
          />
        </TableCell>
        {visibleHeadCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.id === 'studentName' ? 'right' : 'center'}
            sx={headCell.id === 'studentName' ? { pr: 2 } : {}}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable !== false ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'desc'}
                onClick={createSortHandler(headCell.id)}
              >
                <h3>{headCell.label}</h3>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'asc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <h3>{headCell.label}</h3>
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
  showActions: PropTypes.bool,
};

function EnhancedTableToolbar(props) {
  const { numSelected } = props;


  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >

      {/* Note Here For Access Length Selected Item */}
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        ""
      )}


    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('date');

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

  // For Access Reservation Data 
  const { data, status } = useSelector(getReservationData);

  const formattedExcelData = React.useMemo(() => {
    return excel.map((item) => ({
      'المعرف': item.id ?? item.medicEx_id,
      'اسم الطالب / المريض': item.user?.name ?? item.student?.name ?? item.student_name ?? item.patient_name ?? item.Name ?? '',
      'الرقم القومي': item.user?.national_id ?? item.student?.nationalId ?? item.national_id ?? item.nationalId ?? '',
      'رقم الهاتف': item.user?.phone_number ?? item.phoneNumber ?? item.phone_number ?? '',
      'العيادة': typeof item.clinic === 'string' ? item.clinic : (item.clinic?.name ?? item.clinic_name ?? ''),
      'تاريخ الحجز': item.date ? (typeof item.date === 'string' && item.date.includes(',') ? item.date.split(',')[0] : String(item.date).slice(0, 10)) : '',
      'نوع الكشف': item.examType ?? item.exam_type ?? '',
      'حالة الكشف': item.status ?? '',
    }));
  }, [excel]);

  const sortedData = React.useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      let aVal = '';
      let bVal = '';
      if (orderBy === 'studentName') {
        aVal = a.user?.name ?? a.student?.name ?? a.student_name ?? a.patient_name ?? a.Name ?? '';
        bVal = b.user?.name ?? b.student?.name ?? b.student_name ?? b.patient_name ?? b.Name ?? '';
      } else if (orderBy === 'nationalId') {
        aVal = String(a.user?.national_id ?? a.student?.nationalId ?? a.national_id ?? a.nationalId ?? '');
        bVal = String(b.user?.national_id ?? b.student?.nationalId ?? b.national_id ?? b.nationalId ?? '');
      } else if (orderBy === 'clinic') {
        aVal = typeof a.clinic === 'string' ? a.clinic : (a.clinic?.name ?? a.clinic_name ?? '');
        bVal = typeof b.clinic === 'string' ? b.clinic : (b.clinic?.name ?? b.clinic_name ?? '');
      } else if (orderBy === 'date') {
        aVal = a.date ?? '';
        bVal = b.date ?? '';
      } else if (orderBy === 'examType') {
        aVal = a.examType ?? a.exam_type ?? '';
        bVal = b.examType ?? b.exam_type ?? '';
      } else if (orderBy === 'status') {
        aVal = a.status ?? '';
        bVal = b.status ?? '';
      }

      if (aVal < bVal) return order === 'asc' ? -1 : 1;
      if (aVal > bVal) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, order, orderBy]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked && sortedData) {
      selectAll(sortedData);
    } else {
      clearSelection();
    }
  };

  // For Dispatch Action
  const dispatch = useDispatch();

  // For Token 
  const { token } = useSelector(getUserInfo);

  // For Access Lookups
  const clinics = useSelector(getAllClinics);
  const faculties = useSelector(getAllFaculties);
  const levels = useSelector(getAllLevels);

  const clinicsList = Array.isArray(clinics) ? clinics : (clinics?.value || []);
  const facultiesList = Array.isArray(faculties) ? faculties : (faculties?.value || []);
  const levelsList = Array.isArray(levels) ? levels : (levels?.value || []);

  // For Access Params
  const [searchParams, setSearchParams] = useSearchParams();
  const activeStatus = searchParams.get('status') === 'finished' ? 'finished' : 'pending';
  const clinicId = searchParams.get('clinic_id') || '';
  const dateFilter = searchParams.get('date') || '';
  const facultyId = searchParams.get('faculty_id') || '';
  const levelId = searchParams.get('level_id') || '';
  const genderFilter = searchParams.get('gender') || '';
  const nationalityId = searchParams.get('nationality_id') || '';

  // Advanced demographic active count
  const activeDemographicCount = [facultyId, levelId, genderFilter, nationalityId].filter(Boolean).length;

  // Permissions & Audit Mode
  const { isObserver, canMutate, can } = usePermission();
  const canApprove = canMutate(PERMISSIONS.RESERVATIONS_APPROVE);
  const canWrite = canMutate(PERMISSIONS.RESERVATIONS_WRITE);
  const isAuditMode = isObserver || (!canApprove && !canWrite);
  const canViewProfile = can(PERMISSIONS.USERS_READ);
  const showActions = activeStatus !== 'finished' && !isAuditMode;
  const hasActiveFilters = Boolean(
    searchParams.get('search') ||
    clinicId ||
    dateFilter ||
    activeDemographicCount > 0
  );

  // Collapsible Advanced Filter Panel State
  const [isAdvOpen, setIsAdvOpen] = useState(activeDemographicCount > 0);

  // Helper to cleanly update filters in URL search parameters
  const updateFilters = (newFilterValues) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    Object.entries(newFilterValues).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        newParams.set(key, val);
      } else {
        newParams.delete(key);
      }
    });
    setSearchParams(newParams);
  };

  // Quick filters handlers
  const handleClinicChange = (e) => {
    updateFilters({ clinic_id: e.target.value });
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
    newParams.set('status', activeStatus);
    setSearchInput('');
    setSearchParams(newParams);
  };

  //  For Accept and Decline (Allowed ONLY for pending reservations requiring action)
  const acceptOrDecline = (reservationId, studentId, isAccepted, currentStatus) => {
    if (currentStatus && currentStatus !== "تحت الانتظار") {
      toast.info("تم اتخاذ إجراء على هذا الكشف بالفعل ولا يتطلب أي إجراء إضافي");
      return;
    }

    const status = Boolean(isAccepted);

    dispatch(
      acceptOrDeclineAPI({
        id: reservationId,
        medxId: reservationId,
        status,
        page: searchParams.get('page') ? searchParams.get('page') : 1,
        search: searchParams.get('search') ? searchParams.get('search') : "",
        filterStatus: activeStatus,
        clinic_id: clinicId,
        date: dateFilter,
        faculty_id: facultyId,
        level_id: levelId,
        gender: genderFilter,
        nationality_id: nationalityId,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(status ? "تم قبول الكشف بنجاح" : "تم رفض الكشف بنجاح");
      })
      .catch((error) => {
        const errorMsg =
          error?.error ||
          error?.message ||
          (typeof error === 'string' ? error : null) ||
          "حدث خطأ أثناء تعديل حالة الكشف";
        toast.error(errorMsg);
      });
  };

  // For Transfer Workflow
  const [initiateTransfer, { isLoading: isInitiatingTransfer }] = useInitiateTransferMutation();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedReservationForTransfer, setSelectedReservationForTransfer] = useState(null);
  const [transferReasonInput, setTransferReasonInput] = useState("");
  const [transferNotesInput, setTransferNotesInput] = useState("");

  const handleOpenTransferModal = (resv) => {
    setSelectedReservationForTransfer(resv);
    setTransferReasonInput("");
    setTransferNotesInput("");
    setIsTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setIsTransferModalOpen(false);
    setSelectedReservationForTransfer(null);
    setTransferReasonInput("");
    setTransferNotesInput("");
  };

  const handleSubmitTransfer = async () => {
    if (!transferReasonInput.trim()) {
      toast.error("يرجى كتابة سبب التحويل");
      return;
    }
    const resvId = selectedReservationForTransfer?.id || selectedReservationForTransfer?.medicEx_id;
    if (!resvId) {
      toast.error("تعذر تحديد معرف الكشف");
      return;
    }
    try {
      await initiateTransfer({
        id: resvId,
        reason: transferReasonInput.trim(),
        notes: transferNotesInput.trim() || undefined,
      }).unwrap();
      toast.success("تم تحويل الكشف بنجاح وإرساله لقسم التحويلات");
      handleCloseTransferModal();
      dispatch(
        getAllReservationListAPI({
          page: searchParams.get("page") ? searchParams.get("page") : 1,
          search: searchParams.get("search") ? searchParams.get("search") : "",
          filterStatus: activeStatus,
          clinic_id: clinicId,
          date: dateFilter,
          faculty_id: facultyId,
          level_id: levelId,
          gender: genderFilter,
          nationality_id: nationalityId,
        })
      );
    } catch (err) {
      const errMsg = err?.data?.message || err?.message || "حدث خطأ أثناء تحويل الكشف";
      toast.error(errMsg);
    }
  };

  // For Tab Filters (Pending vs Finished) - Preserves active filters!
  const handleStatusFilter = (newStatus) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    newParams.set('status', newStatus);
    setSearchParams(newParams);
  };

  // For Access Input 
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  React.useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  // For Search 
  const searchHandler = () => {
    updateFilters({ search: searchInput });
  };

  return (
    <div>
      <Box sx={{ width: '1250px', maxWidth: "100%", margin: "20px auto", borderRadius: "20px" }}>
        {/* 2 Primary Lists Filter Buttons: Pending vs Finished */}
        <div className="resv-filter-tabs-wrapper">
          <div className="resv-filter-tabs">
            <button
              type="button"
              className={`resv-tab-btn ${activeStatus === 'pending' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('pending')}
            >
              <span className="material-symbols-outlined">hourglass_top</span>
              <span>كشوفات قيد الانتظار</span>
              <span className="tab-pill-badge pending">تتطلب إجراء</span>
            </button>

            <button
              type="button"
              className={`resv-tab-btn ${activeStatus === 'finished' ? 'active' : ''}`}
              onClick={() => handleStatusFilter('finished')}
            >
              <span className="material-symbols-outlined">task_alt</span>
              <span>كشوفات مكتملة</span>
              <span className="tab-pill-badge finished">تمت معالجتها</span>
            </button>
          </div>
        </div>

        <TableToolbar
          searchValue={searchInput}
          onSearchChange={(e) => setSearchInput(e.target.value)}
          onSearchSubmit={searchHandler}
          placeholder="ابحث بالاسم، الرقم القومي، العيادة..."
          excelData={formattedExcelData}
          excelFilename={`reservations_${activeStatus}`}
          extraActions={
            <div className="resv-quick-filters">
              {/* Clinic Dropdown */}
              <div className="resv-toolbar-control">
                <span className="material-symbols-outlined control-icon">local_hospital</span>
                <select
                  value={clinicId}
                  onChange={handleClinicChange}
                  className="resv-toolbar-select"
                  title="تصفية حسب العيادة"
                >
                  <option value="">جميع العيادات</option>
                  {clinicsList.map((item) => {
                    const cId = item.clinic_id ?? item.id;
                    const cName = item.clinicName || item.clinic_name;
                    return (
                      <option key={cId} value={cId}>
                        {cName}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Date Filter */}
              <div className="resv-toolbar-control date-control">
                <span className="material-symbols-outlined control-icon">calendar_month</span>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={handleDateChange}
                  className="resv-toolbar-date"
                  title="تصفية بتاريخ الحجز"
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
            <span>وضع الملاحظة والتدقيق (للقراءة فقط - تم تعطيل إجراءات القبول، الرفض، والتحويل)</span>
          </div>
        )}

        <Paper style={{ borderRadius: "10px" }} sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={sortedData?.length || 0}
                showActions={showActions}
              />
              <TableBody>
                {status === StatusCode.SUCCESS && sortedData.length !== 0 ? sortedData.map((row, index) => {
                  const rowId = row.id ?? row.medicEx_id;
                  const isItemSelected = isSelected(rowId);
                  const labelId = `enhanced-table-checkbox-${index}`;
                  const studentId = row.user?.id ?? row.student?.id ?? row.student_id;
                  const studentName =
                    row.user?.name ??
                    row.student?.name ??
                    row.student_name ??
                    row.patient_name ??
                    row.Name ??
                    "";
                  const studentImg =
                    row.user?.profile_photo_url ||
                    row.student?.userImage ||
                    row.userImage ||
                    (row.student_image
                      ? `${BASE_URL}/uploads/${row.student_image.replace(/^\/+/, '')}`
                      : "");
                  const nationalId =
                    row.user?.national_id ??
                    row.student?.nationalId ??
                    row.national_id ??
                    row.nationalId ??
                    "";
                  const clinicName =
                    typeof row.clinic === 'string'
                      ? row.clinic
                      : (row.clinic?.name ?? row.clinic_name ?? "");
                  const displayDate = row.date
                    ? (typeof row.date === "string" && row.date.includes(",")
                        ? row.date.split(",")[0]
                        : String(row.date).slice(0, 10))
                    : "";
                  const examType = row.examType ?? row.exam_type ?? "";
                  const statusText = row.status ?? "";
                  const isEmergency =
                    row.is_emergency === 1 ||
                    row.is_emergency === true ||
                    row.is_emergency === '1' ||
                    examType === 'طوارئ' ||
                    row.exam_type === 'طوارئ';

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
                      <TableCell onClick={(event) => { handleClick(event, rowId, row) }} padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell>

                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                        align="right"
                        sx={{ pr: 2 }}
                      >
                        {studentId && canViewProfile ? (
                          <Link
                            to={`/profile-viewer/${studentId}`}
                            style={{
                              color: "#1e293b",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "10px",
                              textDecoration: "none",
                              fontWeight: 600,
                            }}
                          >
                            <img
                              className='imgage-table'
                              alt={studentName}
                              src={studentImg || userPic}
                              loading='lazy'
                              onError={(e) => { e.target.src = userPic; }}
                            />
                            <Tooltip TransitionProps={{ timeout: 200 }} title={studentName} placement="top">
                              <span>{studentName.length > 14 ? `${studentName.slice(0, 14)}...` : studentName}</span>
                            </Tooltip>
                            {isEmergency && (
                              <span style={{ fontSize: '11px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>طوارئ</span>
                            )}
                          </Link>
                        ) : (
                          <div
                            style={{
                              color: "#1e293b",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "10px",
                              fontWeight: 600,
                            }}
                          >
                            <img
                              className='imgage-table'
                              alt={studentName}
                              src={studentImg || userPic}
                              loading='lazy'
                              onError={(e) => { e.target.src = userPic; }}
                            />
                            <Tooltip TransitionProps={{ timeout: 200 }} title={studentName} placement="top">
                              <span>{studentName.length > 14 ? `${studentName.slice(0, 14)}...` : studentName}</span>
                            </Tooltip>
                            {isEmergency && (
                              <span style={{ fontSize: '11px', backgroundColor: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: '4px' }}>طوارئ</span>
                            )}
                          </div>
                        )}
                      </TableCell>

                      <TableCell align="center">{nationalId}</TableCell>
                      <TableCell align="center">{clinicName}</TableCell>
                      <TableCell align="center">{displayDate}</TableCell>
                      <TableCell align="center">{examType}</TableCell>
                      <TableCell align="center">{statusText}</TableCell>

                      {/* Actions: ONLY rendered on lists where actions are needed and user is not in audit mode */}
                      {showActions && (
                        <TableCell align="center" style={{ display: "flex", justifyContent: "center" }}>
                          <div className='k-btn-group'>
                            {statusText === "تحت الانتظار" ? (
                              <React.Fragment>
                                <Tooltip title="قبول الكشف" placement="top">
                                  <button
                                    type="button"
                                    className="action-btn accept-action-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      acceptOrDecline(rowId, studentId, true, statusText);
                                    }}
                                  >
                                    <span className="material-symbols-outlined">check</span>
                                  </button>
                                </Tooltip>
                                <Tooltip title="رفض الكشف" placement="top">
                                  <button
                                    type="button"
                                    className="action-btn reject-action-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      acceptOrDecline(rowId, studentId, false, statusText);
                                    }}
                                  >
                                    <span className="material-symbols-outlined">close</span>
                                  </button>
                                </Tooltip>
                                <Tooltip title="تحويل لمستشفى خارجية" placement="top">
                                  <button
                                    type="button"
                                    className="action-btn transfer-action-btn"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleOpenTransferModal(row);
                                    }}
                                  >
                                    <span className="material-symbols-outlined">local_hospital</span>
                                  </button>
                                </Tooltip>
                              </React.Fragment>
                            ) : (
                              <Tooltip title="تم اتخاذ الإجراء سابقاً ولا يتطلب إجراءً حالياً" placement="top">
                                <span className="no-action-tag">
                                  {statusText === "مقبول" ? (
                                    <div className='accept-resv'>مقبول</div>
                                  ) : statusText === "مرفوض" ? (
                                    <div className='rej-resv'>مرفوض</div>
                                  ) : statusText === "محول" ? (
                                    <div className="transfer-resv" style={{ backgroundColor: "#ede9fe", color: "#6d28d9", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold", fontSize: "12px" }}>محول</div>
                                  ) : (
                                    <div className='neutral-resv'>{statusText || "مكتمل"}</div>
                                  )}
                                </span>
                              </Tooltip>
                            )}
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                }) : <TableRow  > <TableCell colSpan={showActions ? 8 : 7}>  <h3 style={{ width: "100%", textAlign: "center", fontSize: "25px" }} > غير موجود </h3> </TableCell> </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>

      </Box>
      {/* Modal for Transfer Confirmation */}
      <Dialog
        open={isTransferModalOpen}
        onClose={handleCloseTransferModal}
        maxWidth="sm"
        fullWidth
        dir="rtl"
      >
        <DialogTitle id="transfer-dialog-title" sx={{ fontWeight: "bold", color: "#1e293b", display: "flex", alignItems: "center", gap: 1 }}>
          <span className="material-symbols-outlined" style={{ color: "#7c3aed" }}>local_hospital</span>
          تحويل طلب الكشف لمستشفى خارجية
        </DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: "14px" }}>
            سيتم تحويل هذا الكشف إلى قسم التحويلات ليقوم موظف التحويلات بتحديد المستشفى المناسبة وإشعار الطالب.
          </p>
          <TextField
            autoFocus
            margin="dense"
            label="سبب التحويل *"
            placeholder="مثال: الحالة بحاجة لفحص رنين مغناطيسي غير متوفر"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={transferReasonInput}
            onChange={(e) => setTransferReasonInput(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="ملاحظات إضافية (اختياري)"
            placeholder="أي تعليمات أو ملاحظات للمريض أو موظف التحويلات"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            value={transferNotesInput}
            onChange={(e) => setTransferNotesInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <MuiButton onClick={handleCloseTransferModal} color="inherit">
            إلغاء
          </MuiButton>
          <MuiButton
            onClick={handleSubmitTransfer}
            variant="contained"
            disabled={isInitiatingTransfer}
            sx={{ backgroundColor: "#7c3aed", "&:hover": { backgroundColor: "#6d28d9" } }}
          >
            {isInitiatingTransfer ? "جاري التحويل..." : "تأكيد التحويل"}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
