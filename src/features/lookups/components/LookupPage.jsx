import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Modal,
  Pagination,
  Paper,
  Switch,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import { CircleLoader } from 'react-spinners';
import swal from 'sweetalert';
import { toast } from 'react-toastify';
import StatusCode from '../../../StatusCode.js';
import { parseApiError } from '../../../utils/apiErrorHelper';
import {
  StyledTableCell,
  StyledTableRow,
  TableContainerStyled,
  modalBoxStyle,
} from './TableStyles.js';
import EmptyStatePlaceholder from './EmptyStatePlaceholder.jsx';

export default function LookupPage({
  pageTitle,
  entitySingular,
  helmetTitle,
  data = [],
  status,
  idKey,
  nameKey,
  onFetch,
  onCreate,
  onUpdate,
  onToggleActive,
  onDelete,
  iconName,
  customIcon,
  emptyTitle,
  emptyDescription,
  hint,
  addButtonText,
  entityIndefinite,
  pageSize = 8,
}) {
  const [modalState, setModalState] = useState({
    open: false,
    mode: 'add',
    id: null,
    value: '',
    isActive: true,
  });
  const [modalError, setModalError] = useState('');
  const [togglingId, setTogglingId] = useState(null);

  const [page, setPage] = useState(1);

  const items = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data?.value)
    ? data.value
    : [];
  const totalPages = Math.ceil(items.length / pageSize);

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  useEffect(() => {
    if (onFetch) {
      onFetch();
    }
  }, [onFetch]);

  const handleCatchError = (error, isModal = false) => {
    console.error(`Error in ${entitySingular} operation:`, error);
    const { message } = parseApiError(error);

    if (isModal) {
      setModalError(message);
    } else {
      toast.error(message, {
        theme: 'colored',
        position: 'top-right',
      });
    }
  };

  const handleToggleActive = async (item) => {
    const id = item[idKey];
    const currentActive =
      item.is_active !== undefined ? Boolean(item.is_active) : true;
    const newActive = !currentActive;

    setTogglingId(id);
    try {
      if (onToggleActive) {
        await onToggleActive(id, newActive);
      } else if (onUpdate) {
        await onUpdate(id, item[nameKey], newActive);
      }
      toast.success(
        `تم ${newActive ? 'تفعيل' : 'تعطيل'} ${entitySingular} بنجاح`,
        {
          theme: 'colored',
          position: 'top-right',
          autoClose: 2000,
        }
      );
      if (onFetch) onFetch();
    } catch (error) {
      console.error(`Error toggling status for ${entitySingular}:`, error);
      const { message } = parseApiError(error);
      toast.error(message, {
        theme: 'colored',
        position: 'top-right',
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleOpenAddModal = () => {
    setModalError('');
    setModalState({ open: true, mode: 'add', id: null, value: '', isActive: true });
  };

  const handleOpenEditModal = (item) => {
    setModalError('');
    const id = item[idKey];
    const currentVal = item[nameKey] || '';
    const isActive =
      item.is_active !== undefined ? Boolean(item.is_active) : true;
    setModalState({
      open: true,
      mode: 'edit',
      id,
      value: currentVal,
      isActive,
    });
  };

  const handleCloseModal = () => {
    setModalError('');
    setModalState((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = (modalState.value || '').trim();
    if (!trimmed) {
      const emptyMsg = 'يرجى إدخال الاسم';
      setModalError(emptyMsg);
      return;
    }

    setModalError('');

    if (modalState.mode === 'add') {
      onCreate(trimmed, modalState.isActive)
        .then((msg) => {
          toast.success(msg?.message || 'تمت الإضافة بنجاح', {
            theme: 'colored',
            position: 'top-right',
          });
          handleCloseModal();
          if (onFetch) onFetch();
        })
        .catch((err) => handleCatchError(err, true));
    } else {
      onUpdate(modalState.id, trimmed, modalState.isActive)
        .then((msg) => {
          toast.success(msg?.message || 'تم التعديل بنجاح', {
            theme: 'colored',
            position: 'top-right',
          });
          handleCloseModal();
          if (onFetch) onFetch();
        })
        .catch((err) => handleCatchError(err, true));
    }
  };

  const handleDelete = (id) => {
    swal({
      title: ' هل انت متأكد من الحذف؟',
      text: 'لما تحذفه مش هتقدر ترجعه تاني',
      icon: 'warning',
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        onDelete(id)
          .then((msg) => {
            swal(msg?.message || 'تم الحذف بنجاح', { icon: 'success' });
            if (onFetch) onFetch();
          })
          .catch((error) => {
            console.error(`Error deleting ${entitySingular}:`, error);
            const { message } = parseApiError(error);
            swal({
              title: 'تعذر الحذف',
              text: message,
              icon: 'error',
              button: 'حسناً',
            });
          });
      }
    });
  };

  if (status === StatusCode.LOADING) {
    return (
      <Box
        sx={{
          minHeight: '360px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
        }}
      >
        <CircleLoader color="#0061ff" />
      </Box>
    );
  }

  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content="HSH application" />
      </Helmet>

      {/* Add / Edit Unified Modal */}
      <Modal
        open={modalState.open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalBoxStyle}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            sx={{
              fontFamily: '"Cairo", sans-serif !important',
              fontWeight: 700,
              textAlign: 'center',
              mb: 3,
              color: '#1e293b',
            }}
          >
            {modalState.mode === 'add'
              ? `اضافة ${entitySingular} جديدة`
              : `تعديل بيانات ${entitySingular}`}
          </Typography>
          <form onSubmit={handleSubmit}>
            {modalError && (
              <Alert
                severity="error"
                sx={{
                  mb: 2.5,
                  borderRadius: 2,
                  fontFamily: '"Cairo", sans-serif !important',
                  fontWeight: 600,
                  fontSize: '13.5px',
                  py: 0.5,
                }}
              >
                {modalError}
              </Alert>
            )}
            <Box sx={{ mb: 2.5 }}>
              <label
                style={{
                  display: 'block',
                  fontFamily: '"Cairo", sans-serif',
                  fontWeight: 600,
                  fontSize: '15px',
                  color: '#475569',
                  marginBottom: '8px',
                }}
              >
                الاسم
              </label>
              <input
                autoFocus
                type="text"
                value={modalState.value}
                onChange={(e) => {
                  if (modalError) setModalError('');
                  setModalState((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }));
                }}
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px',
                  fontSize: '15px',
                  fontFamily: '"Cairo", sans-serif',
                  borderRadius: '8px',
                  border: modalError ? '1px solid #ef4444' : '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </Box>

            {/* is_active Toggle in Modal */}
            <Box
              sx={{
                mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 1.5,
                borderRadius: 2,
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
              }}
            >
              <Box>
                <Typography
                  sx={{
                    fontFamily: '"Cairo", sans-serif !important',
                    fontWeight: 600,
                    fontSize: '14.5px',
                    color: '#334155',
                  }}
                >
                  حالة التفعيل
                </Typography>
                <Typography
                  sx={{
                    fontFamily: '"Cairo", sans-serif !important',
                    fontSize: '12px',
                    color: '#64748b',
                  }}
                >
                  {modalState.isActive
                    ? 'هذا العنصر نشط ومتاح في النظام'
                    : 'هذا العنصر معطل ولن يظهر في الاختيارات الجديدة'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Chip
                  size="small"
                  label={modalState.isActive ? 'مفعل' : 'معطل'}
                  sx={{
                    fontFamily: '"Cairo", sans-serif !important',
                    fontWeight: 700,
                    fontSize: '12px',
                    backgroundColor: modalState.isActive ? '#dcfce7' : '#fee2e2',
                    color: modalState.isActive ? '#15803d' : '#b91c1c',
                  }}
                />
                <Switch
                  checked={modalState.isActive}
                  onChange={(e) =>
                    setModalState((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                  color="primary"
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  borderRadius: '10px',
                  px: 5,
                  py: 1,
                  fontFamily: '"Cairo", sans-serif !important',
                  fontWeight: 600,
                  fontSize: '15px',
                  backgroundColor: '#0061ff',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: '#0052d9',
                    boxShadow: 'none',
                  },
                }}
              >
                حفظ
              </Button>
            </Box>
          </form>
        </Box>
      </Modal>

      <Box sx={{ width: '100%', mt: 1, pb: 4 }}>
        {/* Header with Title and Add Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            mb: 2.5,
            px: 0.5,
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontFamily: '"Cairo", sans-serif !important',
              fontWeight: 700,
              fontSize: '24px',
              color: '#1e293b',
              m: 0,
            }}
          >
            {pageTitle}
          </Typography>
          <Tooltip title={`اضافة ${entitySingular} جديدة`} arrow>
            <IconButton
              aria-label="add"
              color="primary"
              onClick={handleOpenAddModal}
              sx={{
                backgroundColor: '#e8f0fe',
                color: '#1a73e8',
                borderRadius: '12px',
                p: 1.2,
                '&:hover': { backgroundColor: '#d2e3fc' },
              }}
            >
              <Add fontSize="medium" />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Content: Empty State Placeholder or Table */}
        {items.length === 0 ? (
          <EmptyStatePlaceholder
            entitySingular={entitySingular}
            entityIndefinite={entityIndefinite}
            addButtonText={addButtonText}
            pageTitle={pageTitle}
            iconName={iconName}
            customIcon={customIcon}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            hint={hint}
            onAdd={handleOpenAddModal}
          />
        ) : (
          <>
            {/* Table */}
            <TableContainerStyled component={Paper}>
              <Table sx={{ width: '100%' }} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell
                      align="center"
                      style={{
                        width: '70px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      #
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      {entitySingular}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        width: '140px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      الحالة
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      style={{
                        width: '140px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      العمليات
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedItems.map((item, idx) => {
                    const globalIndex = startIndex + idx + 1;
                    const isActive =
                      item.is_active !== undefined ? Boolean(item.is_active) : true;
                    const isToggling = togglingId === item[idKey];

                    return (
                      <StyledTableRow key={item[idKey] || globalIndex}>
                        <StyledTableCell
                          align="center"
                          style={{
                            width: '70px',
                            fontWeight: 600,
                            color: '#64748b',
                            fontSize: '15px',
                          }}
                        >
                          {globalIndex}
                        </StyledTableCell>
                        <StyledTableCell
                          align="center"
                          style={{
                            fontSize: '15px',
                            fontWeight: 500,
                            color: '#1e293b',
                          }}
                        >
                          {item[nameKey]}
                        </StyledTableCell>

                        {/* Status Toggle Switch */}
                        <StyledTableCell align="center" style={{ width: '140px' }}>
                          <Box
                            sx={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.8,
                              backgroundColor: isActive ? '#f0fdf4' : '#f8fafc',
                              border: isActive ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                              borderRadius: '20px',
                              px: 1,
                              py: 0.25,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {isToggling ? (
                              <CircularProgress size={16} sx={{ color: '#0061ff', mx: 0.8 }} />
                            ) : (
                              <Tooltip
                                title={isActive ? 'انقر لتعطيل العنصر' : 'انقر لتفعيل العنصر'}
                                arrow
                              >
                                <Switch
                                  size="small"
                                  checked={isActive}
                                  onChange={() => handleToggleActive(item)}
                                  color="success"
                                  sx={{
                                    '& .MuiSwitch-switchBase.Mui-checked': {
                                      color: '#16a34a',
                                    },
                                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                      backgroundColor: '#16a34a',
                                    },
                                  }}
                                />
                              </Tooltip>
                            )}
                            <Typography
                              sx={{
                                fontFamily: '"Cairo", sans-serif !important',
                                fontWeight: 700,
                                fontSize: '11.5px',
                                color: isActive ? '#15803d' : '#64748b',
                                minWidth: '32px',
                                textAlign: 'center',
                              }}
                            >
                              {isActive ? 'مفعل' : 'معطل'}
                            </Typography>
                          </Box>
                        </StyledTableCell>

                        {/* Actions */}
                        <StyledTableCell align="center" style={{ width: '140px' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              gap: 1.5,
                            }}
                          >
                            <Tooltip title={`تعديل ${entitySingular}`} arrow>
                              <IconButton
                                aria-label="edit"
                                size="small"
                                onClick={() => handleOpenEditModal(item)}
                                sx={{
                                  backgroundColor: '#f1f5f9',
                                  color: '#475569',
                                  borderRadius: '8px',
                                  p: 1,
                                  '&:hover': {
                                    backgroundColor: '#e2e8f0',
                                    color: '#1e293b',
                                  },
                                }}
                              >
                                <Edit fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={`حذف ${entitySingular}`} arrow>
                              <IconButton
                                aria-label="delete"
                                size="small"
                                onClick={() => handleDelete(item[idKey])}
                                sx={{
                                  backgroundColor: '#fef2f2',
                                  color: '#ef4444',
                                  borderRadius: '8px',
                                  p: 1,
                                  '&:hover': {
                                    backgroundColor: '#fee2e2',
                                    color: '#dc2626',
                                  },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </StyledTableCell>
                      </StyledTableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainerStyled>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mt: 3,
                  mb: 2,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(e, value) => setPage(value)}
                  color="primary"
                  shape="rounded"
                  size="medium"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontFamily: '"Cairo", sans-serif !important',
                      fontWeight: 600,
                    },
                  }}
                />
              </Box>
            )}
          </>
        )}
      </Box>
    </>
  );
}
