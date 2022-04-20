import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(id, name, description, num_users, num_items) {
  return { id, name, description, num_users, num_items };
}



export default function DatasetsTable({data}) {
  var rows = []
  console.log(data.datasets)
  for(var d of data.datasets){
    var dataset = JSON.parse(d)
    rows.push(createData(dataset.id, dataset.name, "--", dataset.num_users, dataset.num_items))
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Survey ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="right">No. Users</TableCell>
            <TableCell align="right">No. Items</TableCell>
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
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">{row.dataset}</TableCell>
              <TableCell align="left">{row.num_users}</TableCell>
              <TableCell align="left">{row.num_items}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
