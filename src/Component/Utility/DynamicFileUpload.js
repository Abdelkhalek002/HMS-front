import React, { useRef, useState, useEffect } from 'react';
import './DynamicFileUpload.css';

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const DynamicFileUpload = ({
  id,
  label,
  sublabel = 'انقر لاختيار ملف',
  icon = 'cloud_upload',
  file = null,
  onFileChange,
  accept = 'image/*,.pdf',
  maxSizeMB = 10,
}) => {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    if (file instanceof File && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleFile = (selectedFile) => {
    if (!selectedFile) return;

    if (maxSizeMB && selectedFile.size > maxSizeMB * 1024 * 1024) {
      alert(`حجم الملف كبير جداً. الحد الأقصى هو ${maxSizeMB} ميجابايت`);
      return;
    }

    onFileChange(selectedFile);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      handleFile(selected);
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleChangeClick = (e) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleBoxClick = () => {
    if (!file && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      handleFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const isPdf =
    file?.type === 'application/pdf' || file?.name?.toLowerCase().endsWith('.pdf');

  return (
    <div className="dynamic-upload-container">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={handleInputChange}
      />

      {!file ? (
        <div
          className={`dynamic-upload-box ${isDragOver ? 'drag-over' : ''}`}
          onClick={handleBoxClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              inputRef.current?.click();
            }
          }}
        >
          <div className="upload-icon-circle">
            <span className="material-symbols-outlined">{icon}</span>
          </div>
          <div className="upload-text-content">
            <span className="upload-title">{label}</span>
            <span className="upload-sublabel">{sublabel}</span>
          </div>
          <span className="material-symbols-outlined upload-arrow">
            add_circle_outline
          </span>
        </div>
      ) : (
        <div className="dynamic-uploaded-card">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={file.name}
              className="preview-thumb"
              title="اضغط لمعاينة الصورة"
              onClick={() => window.open(previewUrl, '_blank')}
            />
          ) : (
            <div className="file-icon-placeholder">
              <span className="material-symbols-outlined">
                {isPdf ? 'picture_as_pdf' : 'description'}
              </span>
            </div>
          )}

          <div className="uploaded-info">
            <div className="uploaded-label-tag">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                check_circle
              </span>
              <span>{label}</span>
            </div>
            <div className="uploaded-name" title={file.name}>
              {file.name}
            </div>
            <div className="uploaded-size">{formatFileSize(file.size)}</div>
          </div>

          <div className="uploaded-actions">
            <button
              type="button"
              className="action-btn change-btn"
              onClick={handleChangeClick}
              title="تغيير الملف"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                edit
              </span>
            </button>
            <button
              type="button"
              className="action-btn delete-btn"
              onClick={handleRemove}
              title="حذف الملف"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 18 }}
              >
                delete
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DynamicFileUpload;
