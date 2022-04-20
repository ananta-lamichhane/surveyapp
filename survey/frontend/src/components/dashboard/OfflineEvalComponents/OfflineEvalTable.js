import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(id, name, dataset, num_participants, progress) {
  return { id, name, dataset, num_participants, progress };
}

const rows = [
  createData(1,'TestSurvey1', 'MovieLens Small', 100, 10),
  createData(2,'TestSurvey2', 'MovieLens', 10, 1),
  createData(3,'TestSurvey3', 'Jester', 150, 20),
  createData(4,'TestSurvey4', 'MovieLens Small', 50, 100),
  createData(5,'TestSurvey5', 'Iris', 100, 0),
];

export default function OfflineEvalTable(props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Survey ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Dataset</TableCell>
            <TableCell align="right">No. Participants</TableCell>
            <TableCell align="right">Progress</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.dataset}</TableCell>
              <TableCell align="right">{row.num_participants}</TableCell>
              <TableCell align="right">{row.progress}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
