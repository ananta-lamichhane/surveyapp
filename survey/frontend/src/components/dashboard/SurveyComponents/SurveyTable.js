import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { IconButton, Box, Typography, Collapse } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ListItem, ListItemText, List } from '@mui/material';



function createData(id, name, description, dataset, num_participants, num_questions, tokens) {
  return { id, name, description, dataset, num_participants, num_questions, tokens };
}

export default function SurveyTable({data}) {
  var rows = []
  const [open, setOpen] = React.useState(false);
 // console.log(JSON.parse(data.surveys[0]))
 if(data){
    for(var s of data.surveys){
    var survey = JSON.parse(s)

    //convert the tokens list string representation to proper JS string so that
    // it can be parsed correctly
    var tokens = '' + survey.tokens
    var tok2 = JSON.parse(tokens)
    rows.push(createData(survey.id, survey.name, survey.description, survey.dataset_id, survey.num_tokens, 5, tok2))
  }
}

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Survey ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Description</TableCell>
            <TableCell align="right">No. Participants</TableCell>
            <TableCell align="right">No. Questions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.id} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}



// create a row which collapses out to display extra information
function Row(props) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell align="left">{row.name}</TableCell>
        <TableCell align="left">{row.description}</TableCell>
        <TableCell align="right">{row.num_participants}</TableCell>
        <TableCell align="right">{row.num_questions}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Details
              </Typography>
              <h6>Survey ID: {row.id}</h6>
              <h6>Description: {row.description}</h6>
              <h6>Number of participants: {row.num_participants}</h6>
              <h6>Number of questions in a questionnaire: {row.num_questions}</h6>
              <h6>Dataset ID: {row.dataset_id}</h6>
              <h6>Participants:</h6>
              <List dense={true}>
              {row.tokens.map((token) => (
                <ListItem key={token}>
                <ListItemText
                  primary={
                  <div className='tokenAndLink'>
                    <p>{`token: ${token}`}</p>
                    <p> Participation Link: </p>
                    <a href={`${process.env.REACT_APP_SURVEY_URL}/survey?token=${token}`}>{`${process.env.REACT_APP_SURVEY_URL}/survey?token=${token}`}</a>
                    </div>}
                />
                </ListItem>
            ))}
            </List>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

