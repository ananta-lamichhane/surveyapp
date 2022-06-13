import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { SurveyPage } from './SurveyComponents/SurveyPage';
import { useState, useEffect } from 'react';

import LoginPrompt from './loginModal';

const drawerWidth = 500;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

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

function DashboardContent(props) {
  const [open, setOpen] = React.useState(true);
  const [activeDrawerElem, setActiveDrawerElem] = React.useState("");
  const toggleDrawer = () => {
    setOpen(!open);
  };

  const [backendData, setBackendData] = useState()
  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL+'/survey')
    .then(response =>response.json()).then(data =>{
    console.log(data)
    setBackendData(data)

     
        
    })
  }, [])




  // pull data that is sent by the listitems child component
  const getClickedDrawerElem = (data) =>{
    console.log(data)
    setActiveDrawerElem(data)
  }

  return (
    
     <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar postion="static">
        <Toolbar >
        
          <Typography align='center' variant = "h4" className="toolbarClass">
            Surveys
            
          </Typography>
        </Toolbar>
        </AppBar>
        

        {<SurveyPage data={backendData}/>}
        {/*activeDrawerElem === "Surveys" &&<SurveyPage data= {backendData} />}
        {activeDrawerElem === "Datasets" && <DatasetsPage data= {backendData} />}
        {activeDrawerElem === "Offline" && <OfflineEvalPage data={backendData} />*/}
        
      </Box>
    </ThemeProvider>
  );
}

export default function Dashboard() {
  const [isLoggedIn, setLoggedIn] = React.useState(false)

  //need this to change state
  useEffect(() => {
    console.log("ok")
  }, [isLoggedIn]);

  // checked if login is ok
  function checkLogin(){
    setLoggedIn(true)
 
  }

  if(isLoggedIn){

          return(<div>
            <DashboardContent /> 
            <div className='footer'>
                      <h6>&#169; 	Ananta Lamichhane, Technische Universität Berlin</h6>
                  </div> 
            </div>
          )
  }else{
    return(
      <div>
        <LoginPrompt checkLogin={checkLogin} pwd={process.env.REACT_APP_DASHBOARD_PW}/>
      </div>
    )

  }

}
