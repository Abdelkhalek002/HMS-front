import { useState } from 'react';

/**
 * Custom hook to manage table row selection and CSV/Excel export data synchronization.
 */
export function useTableSelection() {
  const [selected, setSelected] = useState([]);
  const [excel, setExcel] = useState([]);

  const handleClick = (event, id, row) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
      setExcel((prev) => prev.concat(row));
    } else if (selectedIndex === 0) {
      setExcel((prev) => prev.filter((item) => (item.id ?? item.medicEx_id) !== +id));
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      setExcel((prev) => prev.filter((item) => (item.id ?? item.medicEx_id) !== +id));
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      setExcel((prev) => prev.filter((item) => (item.id ?? item.medicEx_id) !== +id));
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const selectAll = (items) => {
    if (!items || items.length === 0) {
      setSelected([]);
      setExcel([]);
      return;
    }
    const ids = items.map((n) => n.id ?? n.medicEx_id);
    setSelected(ids);
    setExcel(items);
  };

  const clearSelection = () => {
    setSelected([]);
    setExcel([]);
  };

  return {
    selected,
    excel,
    handleClick,
    isSelected,
    selectAll,
    clearSelection,
    setSelected,
    setExcel,
  };
}
