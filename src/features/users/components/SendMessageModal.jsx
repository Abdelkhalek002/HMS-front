import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Modal, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { sendMessageToUserApi } from '../UserControlSlice';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '92vw',
  bgcolor: 'white',
  borderRadius: '20px',
  boxShadow: 24,
  p: '28px 24px',
  direction: 'rtl',
  outline: 'none',
};

export const SendMessageModal = ({ open, onClose, userId, userName }) => {
  const dispatch = useDispatch();
  const [sending, setSending] = useState(false);
  const observationRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const msg = observationRef.current?.value?.trim();
    if (!msg) {
      toast.error('برجاء إدخال نص الملاحظة');
      return;
    }
    if (!userId) {
      toast.error('معرّف الطالب غير متوفر');
      return;
    }

    setSending(true);
    try {
      const res = await dispatch(
        sendMessageToUserApi({ id: userId, message: msg })
      ).unwrap();
      toast.success(res?.message || res?.msg || 'تم إرسال الملاحظة بنجاح', {
        theme: 'colored',
        position: 'top-right',
      });
      if (observationRef.current) observationRef.current.value = '';
      onClose();
    } catch (error) {
      console.error('Error sending message to user:', error);
      const errorMsg =
        error?.message ||
        error?.msg ||
        error?.error ||
        (typeof error === 'string' ? error : null) ||
        'حدث خطأ أثناء إرسال الملاحظة';
      toast.error(errorMsg, {
        theme: 'colored',
        position: 'top-right',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="send-message-modal-title"
    >
      <Box sx={modalStyle}>
        <Typography
          id="send-message-modal-title"
          variant="h6"
          component="h2"
          align="center"
          sx={{ fontWeight: 'bold', mb: '20px', color: '#0f172a', fontSize: '18px' }}
        >
          إرسال ملاحظة للطالب {userName ? `(${userName})` : ''}
        </Typography>
        <form onSubmit={handleSubmit}>
          <div className="popup-all-filed">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                marginTop: '15px',
                marginBottom: '25px',
              }}
            >
              <label
                htmlFor="userObservationInput"
                style={{
                  marginLeft: '15px',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  color: '#1e293b',
                  whiteSpace: 'nowrap',
                }}
              >
                الملاحظة
              </label>
              <input
                id="userObservationInput"
                className="popup-field"
                type="text"
                ref={observationRef}
                disabled={sending}
                placeholder="اكتب الملاحظة هنا..."
                style={{
                  flex: 1,
                  height: '38px',
                  borderRadius: '6px',
                  border: '1px solid #000',
                  padding: '0 10px',
                  direction: 'rtl',
                  outline: 'none',
                  fontSize: '14px',
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={sending}
              className="popup-btn"
              style={{
                borderRadius: '12px',
                padding: '6px 36px',
                fontSize: '15px',
                fontWeight: 'bold',
              }}
            >
              {sending ? 'جاري الإرسال...' : 'إرسال'}
            </Button>
          </div>
        </form>
      </Box>
    </Modal>
  );
};

SendMessageModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  userName: PropTypes.string,
};

export default SendMessageModal;
