import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  Box,
  Card,
  CardActionArea,
  Chip,
  Container,
  Grid,
  Typography,
  Alert,
} from '@mui/material';
import {
  MonitorHeart,
  School,
  AccountBalance,
  LocalHospital,
  LocationCity,
  StorageRounded,
  WarningAmberRounded,
} from '@mui/icons-material';

import LookupPage from '../components/LookupPage.jsx';
import { getUserInfo } from '../../auth';

import {
  getAllClinicsAPI,
  addNewClinicsAPI,
  updateClinicsAPI,
  deleteClinicsAPI,
} from '../ClinicSlice';

import {
  getAllLevelsAPI,
  addNewLevelsAPI,
  updateLevelsAPI,
  deleteLevelsAPI,
} from '../LevelSlice';

import {
  getAllFacultiesAPI,
  addNewFacultyAPI,
  updateFacultyAPI,
  deleteFacultyAPI,
} from '../FacultySlice';

import {
  getAllExhospitalsAPI,
  addNewExhospitalAPI,
  updateExhospitalAPI,
  deleteExhospitalAPI,
} from '../ExHospitalSlice';

import {
  getAllGovsAPI,
  addNewGovernorateAPI,
  updateGovernorateAPI,
  deleteGovernorateAPI,
} from '../GovernorateSlice';

const TAB_INDEX_MAP = {
  clinics: 0,
  levels: 1,
  faculties: 2,
  hospitals: 3,
  governorates: 4,
};

const INDEX_TAB_MAP = ['clinics', 'levels', 'faculties', 'hospitals', 'governorates'];

// --- Internal Section Components ---

function ClinicsSection() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.ClinicSlice);
  const { token } = useSelector(getUserInfo);

  const fetchClinics = useCallback(() => {
    dispatch(getAllClinicsAPI({ token }));
  }, [dispatch, token]);

  const handleCreate = (clinicName, is_active = true) =>
    dispatch(addNewClinicsAPI({ data: { clinicName, is_active }, token })).unwrap();

  const handleUpdate = (id, clinicName, is_active) =>
    dispatch(updateClinicsAPI({ data: { id, clinicName, is_active }, token })).unwrap();

  const handleToggleActive = (id, is_active) =>
    dispatch(updateClinicsAPI({ data: { id, is_active }, token })).unwrap();

  const handleDelete = (id) =>
    dispatch(deleteClinicsAPI({ data: id, token })).unwrap();

  return (
    <LookupPage
      pageTitle="العيادات"
      entitySingular="العيادة"
      entityIndefinite="عيادة"
      addButtonText="أضف أول عيادة"
      helmetTitle="Clinics"
      iconName="monitor_heart"
      emptyTitle="لا توجد عيادات مسجلة في قاعدة البيانات"
      emptyDescription="قاعدة البيانات لا تحتوي على أي عيادات حالياً. العيادات ضرورية لتوزيع مواعيد الكشف الطبي وحجوزات الطلاب والتحويلات."
      hint="تُستخدم العيادات لتحديد التخصصات الطبية داخل المستشفى وربط الأطباء والكشوفات بها."
      data={data}
      status={status}
      idKey="clinic_id"
      nameKey="clinicName"
      onFetch={fetchClinics}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggleActive={handleToggleActive}
      onDelete={handleDelete}
      pageSize={8}
    />
  );
}

function LevelsSection() {
  const dispatch = useDispatch();
  const { data: level, status } = useSelector((state) => state.LevelSlice);
  const { token } = useSelector(getUserInfo);

  const fetchLevels = useCallback(() => {
    dispatch(getAllLevelsAPI());
  }, [dispatch]);

  const handleCreate = (levelName, is_active = true) =>
    dispatch(addNewLevelsAPI({ data: { levelName, is_active }, token })).unwrap();

  const handleUpdate = (id, levelName, is_active) =>
    dispatch(updateLevelsAPI({ data: { id, levelName, is_active }, token })).unwrap();

  const handleToggleActive = (id, is_active) =>
    dispatch(updateLevelsAPI({ data: { id, is_active }, token })).unwrap();

  const handleDelete = (id) =>
    dispatch(deleteLevelsAPI({ data: id, token })).unwrap();

  return (
    <LookupPage
      pageTitle="المراحل التعليمية"
      entitySingular="المرحلة الدراسية"
      entityIndefinite="مرحلة دراسية"
      addButtonText="أضف أول مرحلة دراسية"
      helmetTitle="Levels"
      iconName="school"
      emptyTitle="لا توجد مراحل دراسية مسجلة في قاعدة البيانات"
      emptyDescription="قاعدة البيانات لا تحتوي على أي مرحلة دراسية حالياً. المراحل التعليمية مطلوبة لتسجيل بيانات الطلاب وإدارة الفرق الدراسية."
      hint="تُستخدم المراحل التعليمية (مثل: الفرقة الأولى، الفرقة الثانية، ...) لتنظيم تسجيل الطلاب والكشوفات الطبية."
      data={level}
      status={status}
      idKey="level_id"
      nameKey="levelName"
      onFetch={fetchLevels}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggleActive={handleToggleActive}
      onDelete={handleDelete}
      pageSize={8}
    />
  );
}

function FacultiesSection() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.FacultySlice);
  const { token } = useSelector(getUserInfo);

  const fetchFaculties = useCallback(() => {
    dispatch(getAllFacultiesAPI());
  }, [dispatch]);

  const handleCreate = (facultyName, is_active = true) =>
    dispatch(addNewFacultyAPI({ data: { facultyName, is_active }, token })).unwrap();

  const handleUpdate = (id, facultyName, is_active) =>
    dispatch(updateFacultyAPI({ data: { id, facultyName, is_active }, token })).unwrap();

  const handleToggleActive = (id, is_active) =>
    dispatch(updateFacultyAPI({ data: { id, is_active }, token })).unwrap();

  const handleDelete = (id) =>
    dispatch(deleteFacultyAPI({ data: id, token })).unwrap();

  return (
    <LookupPage
      pageTitle="الكليات"
      entitySingular="الكلية"
      entityIndefinite="كلية"
      addButtonText="أضف أول كلية"
      helmetTitle="Faculties"
      iconName="account_balance"
      emptyTitle="لا توجد كليات مسجلة في قاعدة البيانات"
      emptyDescription="قاعدة البيانات لا تحتوي على أي كليات حالياً. الكليات الجامعية مطلوبة لتسجيل بيانات الطلاب وإجراء الكشوفات الطبية."
      hint="تُستخدم الكليات لربط الطلاب بكلياتهم الجامعية وتنظيم المواعيد الطبية وتوزيع العيادات."
      data={data}
      status={status}
      idKey="faculty_id"
      nameKey="facultyName"
      onFetch={fetchFaculties}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggleActive={handleToggleActive}
      onDelete={handleDelete}
      pageSize={8}
    />
  );
}

function HospitalsSection() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.ExHospitalSlice);
  const { token } = useSelector(getUserInfo);

  const fetchHospitals = useCallback(() => {
    dispatch(getAllExhospitalsAPI({ token }));
  }, [dispatch, token]);

  const handleCreate = (hospitalName, is_active = true) =>
    dispatch(addNewExhospitalAPI({ data: { hospitalName, is_active }, token })).unwrap();

  const handleUpdate = (id, hospitalName, is_active) =>
    dispatch(updateExhospitalAPI({ data: { id, hospitalName, is_active }, token })).unwrap();

  const handleToggleActive = (id, is_active) =>
    dispatch(updateExhospitalAPI({ data: { id, is_active }, token })).unwrap();

  const handleDelete = (id) =>
    dispatch(deleteExhospitalAPI({ data: id, token })).unwrap();

  return (
    <LookupPage
      pageTitle="المستشفيات الخارجية"
      entitySingular="المستشفى الخارجي"
      entityIndefinite="مستشفى خارجي"
      addButtonText="أضف أول مستشفى خارجي"
      helmetTitle="External Hospitals"
      iconName="local_hospital"
      emptyTitle="لا توجد مستشفيات خارجية مسجلة في قاعدة البيانات"
      emptyDescription="قاعدة البيانات لا تحتوي على أي مستشفيات خارجية حالياً. المستشفيات الخارجية مطلوبة لإجراء التحويلات الطبية المتقدمة والعمليات."
      hint="تُستخدم المستشفيات الخارجية لتحويل الحالات الطبية الحرجة التي تتطلب رعاية غير متوفرة داخل المستشفى الجامعي."
      data={data}
      status={status}
      idKey="exHosp_id"
      nameKey="hospitalName"
      onFetch={fetchHospitals}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggleActive={handleToggleActive}
      onDelete={handleDelete}
      pageSize={8}
    />
  );
}

function GovernoratesSection() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((state) => state.GovernorateSlice);
  const { token } = useSelector(getUserInfo);

  const fetchGovs = useCallback(() => {
    dispatch(getAllGovsAPI());
  }, [dispatch]);

  const handleCreate = (govName, is_active = true) =>
    dispatch(addNewGovernorateAPI({ data: { govName, is_active }, token })).unwrap();

  const handleUpdate = (id, govName, is_active) =>
    dispatch(updateGovernorateAPI({ data: { id, govName, is_active }, token })).unwrap();

  const handleToggleActive = (id, is_active) =>
    dispatch(updateGovernorateAPI({ data: { id, is_active }, token })).unwrap();

  const handleDelete = (id) =>
    dispatch(deleteGovernorateAPI({ data: id, token })).unwrap();

  return (
    <LookupPage
      pageTitle="المحافظات"
      entitySingular="المحافظة"
      entityIndefinite="محافظة"
      addButtonText="أضف أول محافظة"
      helmetTitle="Governorates"
      iconName="location_city"
      emptyTitle="لا توجد محافظات مسجلة في قاعدة البيانات"
      emptyDescription="قاعدة البيانات لا تحتوي على أي محافظات حالياً. المحافظات مطلوبة لتحديد النطاق الجغرافي للمرضى والطلاب والعناوين."
      hint="تُستخدم المحافظات لتسجيل العناوين والتوزيع الجغرافي للمرضى والطلبة في سجلات النظام."
      data={data}
      status={status}
      idKey="gov_id"
      nameKey="govName"
      onFetch={fetchGovs}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onToggleActive={handleToggleActive}
      onDelete={handleDelete}
      pageSize={8}
    />
  );
}

// --- Main SystemDataPage Component ---

export default function SystemDataPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTabParam = searchParams.get('tab');
  const [selectedTab, setSelectedTab] = useState(
    initialTabParam && TAB_INDEX_MAP[initialTabParam] !== undefined
      ? TAB_INDEX_MAP[initialTabParam]
      : 0
  );

  // Redux state for summary counts
  const clinicState = useSelector((state) => state.ClinicSlice);
  const levelState = useSelector((state) => state.LevelSlice);
  const facultyState = useSelector((state) => state.FacultySlice);
  const hospitalState = useSelector((state) => state.ExHospitalSlice);
  const govState = useSelector((state) => state.GovernorateSlice);

  const getCount = (stateSlice) => {
    const raw = stateSlice?.data;
    if (Array.isArray(raw)) return raw.length;
    if (Array.isArray(raw?.value)) return raw.value.length;
    return 0;
  };

  const clinicCount = getCount(clinicState);
  const levelCount = getCount(levelState);
  const facultyCount = getCount(facultyState);
  const hospitalCount = getCount(hospitalState);
  const govCount = getCount(govState);

  const totalRecords =
    clinicCount + levelCount + facultyCount + hospitalCount + govCount;

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && TAB_INDEX_MAP[tabParam] !== undefined) {
      setSelectedTab(TAB_INDEX_MAP[tabParam]);
    }
  }, [searchParams]);

  const handleCardClick = (tabKey) => {
    const tabIdx = TAB_INDEX_MAP[tabKey];
    if (tabIdx !== undefined) {
      setSelectedTab(tabIdx);
      setSearchParams({ tab: tabKey });
    }
  };

  const categories = [
    {
      key: 'clinics',
      title: 'العيادات',
      count: clinicCount,
      icon: <MonitorHeart sx={{ fontSize: 30, color: '#0061ff' }} />,
      tabIndex: 0,
    },
    {
      key: 'levels',
      title: 'المراحل التعليمية',
      count: levelCount,
      icon: <School sx={{ fontSize: 30, color: '#0061ff' }} />,
      tabIndex: 1,
    },
    {
      key: 'faculties',
      title: 'الكليات',
      count: facultyCount,
      icon: <AccountBalance sx={{ fontSize: 30, color: '#0061ff' }} />,
      tabIndex: 2,
    },
    {
      key: 'hospitals',
      title: 'المستشفيات الخارجية',
      count: hospitalCount,
      icon: <LocalHospital sx={{ fontSize: 30, color: '#0061ff' }} />,
      tabIndex: 3,
    },
    {
      key: 'governorates',
      title: 'المحافظات',
      count: govCount,
      icon: <LocationCity sx={{ fontSize: 30, color: '#0061ff' }} />,
      tabIndex: 4,
    },
  ];

  return (
    <>
      <Helmet>
        <title>بيانات النظام | System Data</title>
        <meta name="description" content="إدارة الجداول المرجعية وبيانات النظام" />
      </Helmet>

      <Box
        sx={{
          width: '100%',
          height: '100vh',
          overflowY: 'auto',
          py: 3,
          px: { xs: 2, sm: 3 },
          boxSizing: 'border-box',
        }}
      >
        <Container maxWidth="lg" sx={{ px: 0 }}>
          {/* Header Title Banner */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              mb: 3,
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 52,
                  height: 52,
                  borderRadius: 3,
                  backgroundColor: '#e8f0fe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0061ff',
                }}
              >
                <StorageRounded sx={{ fontSize: 30 }} />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontFamily: '"Cairo", sans-serif !important',
                    fontWeight: 700,
                    color: '#1e293b',
                    m: 0,
                  }}
                >
                  بيانات النظام الأساسية (System Data)
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: '"Cairo", sans-serif !important',
                    fontWeight: 500,
                    color: '#64748b',
                    mt: 0.5,
                  }}
                >
                  إدارة الجداول المرجعية والمعلومات الأساسية للنظام (المراحل، العيادات، المحافظات، المستشفيات، الكليات)
                </Typography>
              </Box>
            </Box>

            <Chip
              label={
                totalRecords === 0
                  ? 'قاعدة البيانات فارغة حالياً'
                  : `إجمالي السجلات: ${totalRecords}`
              }
              color={totalRecords === 0 ? 'warning' : 'primary'}
              variant="outlined"
              sx={{
                fontFamily: '"Cairo", sans-serif !important',
                fontWeight: 600,
                fontSize: '13px',
                height: 32,
              }}
            />
          </Box>

          {/* Database Empty Alert Banner */}
          {totalRecords === 0 && (
            <Alert
              severity="info"
              icon={<WarningAmberRounded sx={{ fontSize: 22 }} />}
              sx={{
                mb: 3,
                borderRadius: 3,
                fontFamily: '"Cairo", sans-serif !important',
                fontWeight: 600,
                fontSize: '14px',
                backgroundColor: '#f0f9ff',
                color: '#0369a1',
                border: '1px solid #bae6fd',
                '& .MuiAlert-icon': {
                  color: '#0284c7',
                },
              }}
            >
              تنبيه قاعدة البيانات: لم يتم العثور على أي بيانات مسجلة في قاعدة البيانات للجداول المرجعية. يمكنك النقر على أي بطاقة بالأسفل لإدخال أولى البيانات وتفعيل العمليات المرتبطة بها (كحجوزات الكشف الطبي والتحويلات).
            </Alert>
          )}

          {/* Interactive Category Selector Cards (Acts as Navigation Selector) */}
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {categories.map((cat) => {
              const isSelected = selectedTab === cat.tabIndex;
              return (
                <Grid item xs={12} sm={6} md={2.4} key={cat.key}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      position: 'relative',
                      overflow: 'hidden',
                      border: isSelected ? '2px solid #0061ff' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f0f7ff' : '#ffffff',
                      boxShadow: isSelected
                        ? '0 6px 20px rgba(0, 97, 255, 0.15)'
                        : '0 2px 8px rgba(0, 0, 0, 0.02)',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        transform: 'translateY(-3px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)',
                        borderColor: isSelected ? '#0061ff' : '#cbd5e1',
                      },
                    }}
                  >
                    {/* Active Top Accent Bar */}
                    {isSelected && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          backgroundColor: '#0061ff',
                        }}
                      />
                    )}

                    <CardActionArea
                      onClick={() => handleCardClick(cat.key)}
                      sx={{ p: 2.2, textAlign: 'center' }}
                    >
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: 2.5,
                          backgroundColor: isSelected ? '#ffffff' : '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 10px auto',
                          boxShadow: isSelected
                            ? '0 2px 10px rgba(0, 97, 255, 0.15)'
                            : 'none',
                          border: isSelected ? '1px solid #bfdbfe' : '1px solid transparent',
                        }}
                      >
                        {cat.icon}
                      </Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontFamily: '"Cairo", sans-serif !important',
                          fontWeight: isSelected ? 800 : 700,
                          fontSize: '14.5px',
                          color: isSelected ? '#0061ff' : '#1e293b',
                          mb: 0.8,
                        }}
                      >
                        {cat.title}
                      </Typography>
                      <Chip
                        size="small"
                        label={cat.count === 0 ? 'فارغ' : `${cat.count} مسجل`}
                        sx={{
                          fontFamily: '"Cairo", sans-serif !important',
                          fontWeight: 600,
                          fontSize: '11px',
                          height: 22,
                          backgroundColor: cat.count === 0 ? '#fef2f2' : '#f0fdf4',
                          color: cat.count === 0 ? '#dc2626' : '#16a34a',
                          border: `1px solid ${cat.count === 0 ? '#fecaca' : '#bbf7d0'}`,
                        }}
                      />
                    </CardActionArea>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Active View Panel (No duplicate tab bar) */}
          <Box sx={{ minHeight: 400 }}>
            {selectedTab === 0 && <ClinicsSection />}
            {selectedTab === 1 && <LevelsSection />}
            {selectedTab === 2 && <FacultiesSection />}
            {selectedTab === 3 && <HospitalsSection />}
            {selectedTab === 4 && <GovernoratesSection />}
          </Box>
        </Container>
      </Box>
    </>
  );
}
