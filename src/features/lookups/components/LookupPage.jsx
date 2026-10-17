import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  Box,
  Button,
  IconButton,
  Modal,
  Pagination,
  Paper,
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
import {
  StyledTableCell,
  StyledTableRow,
  TableContainerStyled,
  modalBoxStyle,
} from './TableStyles.js';

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
  onDelete,
}) {
  const [modalState, setModalState] = useState({
    open: false,
    mode: 'add',
    id: null,
    value: '',
  });

  const [page, setPage] = useState(1);
  const pageSize = 15;

  const items = Array.isArray(data)
    ? data
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

  const handleCatchError = (error) => {
    console.error(`Error in ${entitySingular} operation:`, error);
    const is429 =
      error?.status === 429 ||
      error?.status === '429' ||
      error?.error === 'Request failed with status code 429';
    const is409 =
      error?.status === 409 ||
      error?.status === '409' ||
      error?.error === 'Request failed with status code 409';

    if (is429) {
      toast.error('تجاوزت الحد الاقصي من المحاولة برجاء المحاولة لاحقا', {
        theme: 'colored',
        position: 'top-right',
      });
    } else if (is409) {
      toast.error(`${entitySingular} موجودة بالفعل`, {
        theme: 'colored',
        position: 'top-right',
      });
    } else {
      toast.error('حدث خطأ ما برجاء المحاولة لاحقا', {
        theme: 'colored',
        position: 'top-right',
      });
    }
  };

  const handleOpenAddModal = () => {
    setModalState({ open: true, mode: 'add', id: null, value: '' });
  };

  const handleOpenEditModal = (id, currentVal) => {
    setModalState({
      open: true,
      mode: 'edit',
      id,
      value: currentVal || '',
    });
  };

  const handleCloseModal = () => {
    setModalState((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = (modalState.value || '').trim();
    if (!trimmed) {
      toast.warning('يرجى إدخال الاسم', {
        theme: 'colored',
        position: 'top-right',
      });
      return;
    }

    if (modalState.mode === 'add') {
      onCreate(trimmed)
        .then((msg) => {
          toast.success(msg?.message || 'تمت الإضافة بنجاح', {
            theme: 'colored',
            position: 'top-right',
          });
          handleCloseModal();
          if (onFetch) onFetch();
        })
        .catch(handleCatchError);
    } else {
      onUpdate(modalState.id, trimmed)
        .then((msg) => {
          toast.success(msg?.message || 'تم التعديل بنجاح', {
            theme: 'colored',
            position: 'top-right',
          });
          handleCloseModal();
          if (onFetch) onFetch();
        })
        .catch(handleCatchError);
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
          .catch(handleCatchError);
      }
    });
  };

  if (status === StatusCode.LOADING) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
            <Box sx={{ mb: 3 }}>
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
                onChange={(e) =>
                  setModalState((prev) => ({
                    ...prev,
                    value: e.target.value,
                  }))
                }
                style={{
                  width: '100%',
                  height: '42px',
                  padding: '0 12px',
                  fontSize: '15px',
                  fontFamily: '"Cairo", sans-serif',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
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

      <div className="k-group-user-page">
        {/* Header with Title and Add Button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            maxWidth: 800,
            margin: '0 auto 24px auto',
            px: 1,
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

        {/* Table */}
        <TableContainerStyled component={Paper}>
          <Table sx={{ width: '100%' }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell
                  align="center"
                  style={{
                    width: '80px',
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
                    width: '160px',
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
                return (
                  <StyledTableRow key={item[idKey] || globalIndex}>
                    <StyledTableCell
                      align="center"
                      style={{
                        width: '80px',
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
                    <StyledTableCell align="center" style={{ width: '160px' }}>
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
                            onClick={() =>
                              handleOpenEditModal(item[idKey], item[nameKey])
                            }
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
      </div>
    </>
  );
}
