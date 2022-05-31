import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const rows = [
  { date: '5/8/2022', type: 'Outlier', severeness: 'High' },
  { date: '5/7/2022', type: 'Freshness', severeness: 'Medium' },
  { date: '5/26/2022', type: 'Freshness', severeness: 'Medium' },
  { date: '5/30/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/28/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/9/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/2/2022', type: 'Outlier', severeness: 'High' },
  { date: '5/10/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/2/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/14/2022', type: 'Population', severeness: 'Low' },
  { date: '5/26/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/30/2022', type: 'Population', severeness: 'High' },
  { date: '5/24/2022', type: 'Population', severeness: 'Low' },
  { date: '5/20/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/8/2022', type: 'Freshness', severeness: 'High' },
  { date: '5/25/2022', type: 'Population', severeness: 'Low' },
  { date: '5/21/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/20/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/2/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/7/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/12/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/12/2022', type: 'Freshness', severeness: 'High' },
  { date: '5/12/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/8/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/23/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/15/2022', type: 'Freshness', severeness: 'High' },
  { date: '5/14/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/6/2022', type: 'Freshness', severeness: 'High' },
  { date: '5/18/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/26/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/29/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/9/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/27/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/7/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/11/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/2/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/5/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/13/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/4/2022', type: 'Freshness', severeness: 'Medium' },
  { date: '5/21/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/23/2022', type: 'Population', severeness: 'Low' },
  { date: '5/20/2022', type: 'Freshness', severeness: 'Medium' },
  { date: '5/5/2022', type: 'Population', severeness: 'High' },
  { date: '5/29/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/28/2022', type: 'Outlier', severeness: 'High' },
  { date: '5/13/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/6/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/8/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/24/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/30/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/14/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/1/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/13/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/3/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/19/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/26/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/5/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/14/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/10/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/7/2022', type: 'Population', severeness: 'High' },
  { date: '5/16/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/20/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/14/2022', type: 'Outlier', severeness: 'High' },
  { date: '5/1/2022', type: 'Population', severeness: 'Low' },
  { date: '5/9/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/23/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/3/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/25/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/19/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/19/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/5/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/24/2022', type: 'Population', severeness: 'Low' },
  { date: '5/2/2022', type: 'Population', severeness: 'Low' },
  { date: '5/14/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/10/2022', type: 'Freshness', severeness: 'Medium' },
  { date: '5/30/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/2/2022', type: 'Population', severeness: 'Low' },
  { date: '5/5/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/4/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/28/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/3/2022', type: 'Population', severeness: 'Low' },
  { date: '5/24/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/13/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/14/2022', type: 'Outlier', severeness: 'Medium' },
  { date: '5/20/2022', type: 'Population', severeness: 'Low' },
  { date: '5/2/2022', type: 'Population', severeness: 'Low' },
  { date: '5/20/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/16/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/19/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/24/2022', type: 'Population', severeness: 'Medium' },
  { date: '5/9/2022', type: 'Population', severeness: 'Low' },
  { date: '5/30/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/8/2022', type: 'Outlier', severeness: 'High' },
  { date: '5/6/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/11/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/19/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/14/2022', type: 'Freshness', severeness: 'High' },
  { date: '5/29/2022', type: 'Outlier', severeness: 'Low' },
  { date: '5/1/2022', type: 'Freshness', severeness: 'Low' },
  { date: '5/26/2022', type: 'Freshness', severeness: 'Low' },
];

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
              <TableCell align="right">{row.severeness}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
