import React, { useState } from 'react';
import { CSVLink } from 'react-csv';
import printPic from '../../images/printer-print-svgrepo-com.svg';
import excelPic from '../../images/excel.png';

export default function TableToolbar({
  searchValue = '',
  onSearchChange,
  onSearchSubmit,
  placeholder = 'ابحث...',
  excelData = [],
  excelFilename = 'export',
  onPrint = () => window.print(),
  extraActions = null,
}) {
  const [active, setActive] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearchSubmit) {
      onSearchSubmit();
    }
  };

  return (
    <div className='k-filter-table'>
      <div
        onBlur={() => setActive(false)}
        onFocus={() => setActive(true)}
        className={`search ${active ? 'search-active' : ''}`}
      >
        <input
          value={searchValue}
          onChange={onSearchChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <span
          onClick={onSearchSubmit}
          className="material-symbols-outlined"
          style={{ cursor: 'pointer' }}
          role="button"
          tabIndex={0}
        >
          search
        </span>
      </div>

      {extraActions}

      <img
        src={printPic}
        className='print-btn'
        alt='print'
        title='طباعة'
        loading='lazy'
        onClick={onPrint}
      />

      <CSVLink
        filename={excelFilename}
        className='excel-btn'
        data={excelData}
        title='تصدير إكسيل'
      >
        <img src={excelPic} alt='excel' />
      </CSVLink>
    </div>
  );
}
