import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import TableContainer from '@mui/material/TableContainer';

export const StyledTableCell = styled(TableCell)(() => ({
  fontFamily: '"Cairo", sans-serif !important',
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f8fafc',
    color: '#1e293b',
    fontWeight: 700,
    fontSize: 16,
    padding: '16px 20px',
    borderBottom: '2px solid #e2e8f0',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 15,
    fontWeight: 500,
    color: '#334155',
    padding: '14px 20px',
    borderBottom: '1px solid #f1f5f9',
  },
}));

export const StyledTableRow = styled(TableRow)(() => ({
  transition: 'background-color 0.2s ease',
  '&:nth-of-type(odd)': {
    backgroundColor: '#ffffff',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#fafbfc',
  },
  '&:hover': {
    backgroundColor: '#f1f5f9 !important',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export const TableContainerStyled = styled(TableContainer)(() => ({
  borderRadius: 16,
  width: '100%',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
  border: '1px solid #eef2f6',
  overflow: 'hidden',
}));

export const modalBoxStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 420,
  bgcolor: 'white',
  borderRadius: 4,
  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12)',
  p: 4,
  fontFamily: '"Cairo", sans-serif !important',
};
