import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const rows = [{
  date: "2022-06-01",
  type: "Distribution",
  deviation: "448%"
}, {
  date: "2022-05-14",
  type: "Nullness",
  deviation: "195%"
}, {
  date: "2022-05-03",
  type: "Distribution",
  deviation: "56%"
}, {
  date: "2022-05-03",
  type: "Distribution",
  deviation: "69%"
}, {
  date: "2022-05-01",
  type: "Nullness",
  deviation: "312%"
}, {
  date: "2022-04-19",
  type: "Distribution",
  deviation: "82%"
}, {
  date: "2022-04-19",
  type: "Nullness",
  deviation: "311%"
}, {
  date: "2022-04-13",
  type: "Freshness",
  deviation: "402%"
}, {
  date: "2022-04-05",
  type: "Distribution",
  deviation: "325%"
}, {
  date: "2022-04-28",
  type: "Nullness",
  deviation: "653%"
}]; 

export default function BasicTable() {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Severeness</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.date}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.type}</TableCell>
              <TableCell align="right">{row.deviation}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
