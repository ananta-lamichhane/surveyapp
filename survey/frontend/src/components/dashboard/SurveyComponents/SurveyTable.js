import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton, Box, Typography, Collapse, Button, responsiveFontSizes } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ListItem, ListItemText, List } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const axios = require('axios').default


function createData(id, name, active_status, dataset, mailing_list, num_questions, tokens) {
  return { id, name, active_status, dataset, mailing_list, num_questions, tokens };
}



const mdTheme = createTheme(
  {
    palette:{
      mode: "dark",
  },
    typography: {
      "fontFamily": `"Roboto", "Helvetica", "Arial", sans-serif`,
      "fontSize": 25,
      "fontWeightLight": 300,
      "fontWeightRegular": 400,
      "fontWeightMedium": 500
     }
  }
);

export default function SurveyTable({data}) {
  var rows = []
  const [open, setOpen] = React.useState(false);
 // console.log(JSON.parse(data.surveys[0]))
 if(data){
    for(var s of data.surveys){
    var survey = JSON.parse(s)
//    console.log(survey)

    //convert the tokens list string representation to proper JS string so that
    // it can be parsed correctly
    var tokens = '' + survey.tokens
    var tok2 = JSON.parse(tokens)
    console.log(survey)
    rows.push(survey)
  }
}


  return (
    <ThemeProvider theme={mdTheme}>
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Survey ID</TableCell>
            <TableCell align="left">Name</TableCell>
            <TableCell align="left">Status</TableCell>
            <TableCell align="center">Action</TableCell>
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
  </ThemeProvider>
  );
}



// create a row which collapses out to display extra information
function Row(props) {
  const { row } = props;

  const [open, setOpen] = React.useState(false);

  return (
    <ThemeProvider theme={mdTheme}>
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
        <TableCell align="left">{row.active_status}</TableCell>
        <TableCell align="center"> {
            <StartStopButton active_status={row.active_status} surveyId={row.id} mailing_list={row.mailing_list} />
          }
        </TableCell>
        <TableCell align="right">{JSON.parse(row.tokens)?JSON.parse(row.tokens).length:"start first"}</TableCell>
        <TableCell align="right">{row.num_questions}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h4" gutterBottom component="div">
                Survey Details
              </Typography>
              <h4>Name: {row.name}</h4>
              <h4>Survey ID: {row.id}</h4>
              <h4>Description: {row.description}</h4>
              <h4>Dataset ID: {row.dataset_id}</h4>
              <h4>Status: {row.active_status}</h4>
              <h4>Number of participants: {JSON.parse(row.tokens)?.length}</h4>
              <h4>Number of questions in a questionnaire: {row.num_questions}</h4>
              <h4>Next question selection strategy: {row.item_selection_strategy}</h4>
              <h4>Matchmaking strategy: {row.matchmaking_strategy}</h4>
              <h4>Mailing List: {row.mailing_list}</h4>
              <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header">
                  <Typography>Show particiapants</Typography>
                  </AccordionSummary>
                <AccordionDetails>
                  <List dense={true}>
                    {JSON.parse(row.tokens)?.map((token) => (
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
                </AccordionDetails>
              </Accordion>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </ThemeProvider>
  );
}

function StartStopButton(props){
  //console.log(props)
  function handleButtonOnClick(currentState){
    //console.log("handling click")
    console.log(currentState)
    if(currentState === "started"){
     // console.log("handling process started")
      axios.get(`${process.env.REACT_APP_API_URL}/survey?surveyId=${props.surveyId}&action=finish`).then(response =>{
       // console.log(response)
        if(response.status === 200){
          window.location.reload(false)
        }else{
          alert("Action could not be taken")
        }
       // window.location.reload(false)
      })
      
    }
    else if(currentState === "created"){
      console.log("handling process started")
      alert(`Starting survey will send an Email to all the participants specified in ${props.mailing_list}`)
      axios.get(`${process.env.REACT_APP_API_URL}/survey?surveyId=${props.surveyId}&action=start`).then(response =>{
        //console.log(response)
        if(response.status === 200){
          window.location.reload(false)
        }else{
          alert("Action could not be taken")
        }
       // window.location.reload(false)
      })
    }

  }

  var buttonText = "start"
  if(props.active_status === "started"){
    buttonText = "Finish Survey"
  }else if(props.active_status === "created"){
    buttonText = "Start Survey"
  }else{
    buttonText = "Finished"
    return(
    <Button variant="contained" disabled> {buttonText}</Button>
    )
  }
  return(
    <Button onClick={() =>{handleButtonOnClick(props.active_status)}} variant="contained"> {buttonText}</Button>
  )
  }
