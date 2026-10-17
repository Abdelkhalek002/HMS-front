import React from 'react';
import { CircleLoader } from 'react-spinners';

export default function LoadingSpinner({
  size = 50,
  color = '#2563eb',
  message = '',
  fullPage = false,
}) {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '12px',
        width: '100%',
      }}
    >
      <CircleLoader size={size} color={color} />
      {message && <p style={{ fontSize: '14px', color: '#64748b' }}>{message}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
}
