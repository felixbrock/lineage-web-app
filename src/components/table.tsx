import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// const getSampleDate = (dayOffset = 0): Date => {
//   const date = new Date();
//   date.setDate(new Date().getDate() + dayOffset);
// return date;};

// const rows = [{
//   date: getSampleDate().toISOString().split('T')[0],
//   type: "Distribution",
//   deviation: "448%"
// }, {
//   date: getSampleDate(-16).toISOString().split('T')[0],
//   type: "Nullness",
//   deviation: "195%"
// }, {
//   date: getSampleDate(-27).toISOString().split('T')[0],
//   type: "Distribution",
//   deviation: "56%"
// }, {
//   date: getSampleDate(-27).toISOString().split('T')[0],
//   type: "Distribution",
//   deviation: "69%"
// }, {
//   date: getSampleDate(-29).toISOString().split('T')[0],
//   type: "Nullness",
//   deviation: "312%"
// }, {
//   date: getSampleDate(-40).toISOString().split('T')[0],
//   type: "Distribution",
//   deviation: "82%"
// }, {
//   date: getSampleDate(-40).toISOString().split('T')[0],
//   type: "Nullness",
//   deviation: "311%"
// }, {
//   date: getSampleDate(-46).toISOString().split('T')[0],
//   type: "Freshness",
//   deviation: "402%"
// }, {
//   date: getSampleDate(-54).toISOString().split('T')[0],
//   type: "Distribution",
//   deviation: "325%"
// }, {
//   date: getSampleDate(-63).toISOString().split('T')[0],
//   type: "Nullness",
//   deviation: "653%"
// }];

export default function BasicTable(alertHistory: any[]) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        backgroundColor: '#f3eefe',
      }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow
            sx={{
              backgroundColor: '#ddd7f5',
            }}
          >
            <TableCell>Date</TableCell>
            <TableCell align="left">Type</TableCell>
            <TableCell align="right">Severity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alertHistory.map((row) => (
            <TableRow
              key={row.date}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="left">{row.type}</TableCell>
              <TableCell align="right">{row.deviation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
