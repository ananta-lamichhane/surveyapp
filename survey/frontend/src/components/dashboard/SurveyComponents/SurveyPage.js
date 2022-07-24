

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {Toolbar, Box,  Button,  Paper, Grid, Container } from '@mui/material';


import SurveyTable from './SurveyTable';

const mdTheme = createTheme(
    {
      palette:{
        mode: "light",
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

export const SurveyPage = ({data}) => {
    console.log(data)
    return(
        <ThemeProvider theme={mdTheme}>
        <Box
        component="main"
        sx={{
        backgroundColor: (theme) =>
            theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        }}
        >
        <Toolbar />
        <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>

                        
        <Grid item xs={12} md={4} lg={3}>
            <Paper
                sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
               // height: 240,
                }}
            >
            <Button variant="contained" onClick={() => window.open('/create/survey') }>Create and Deploy New Survey</Button>

                
            </Paper>
           
        </Grid>
    
          
        <Grid item xs={12} md={8} lg={9}>

                <SurveyTable data={data} />
     
            
            </Grid>

        </Container>
        </Box>
        </ThemeProvider>
        )

}