import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';

function createData(id, name, dataset, num_participants, num_questions) {
  return { id, name, dataset, num_participants, num_questions };
}

export default function SurveyTable({data}) {
  var rows = []
 // console.log(JSON.parse(data.surveys[0]))
 if(data){
    for(var s of data.surveys){
    var survey = JSON.parse(s)
    rows.push(createData(survey.id, survey.name, survey.description, survey.num_tokens, 5))
  }
}

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Survey ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="right">No. Participants</TableCell>
            <TableCell align="right">No. Questions</TableCell>
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
              <TableCell align="right">{row.num_participants}</TableCell>
              <TableCell align="right">{row.num_questions}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
