

import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {ChevronLeftIcon, NotificationsIcon, MenuIcon,Toolbar, Box, Badge, List, Divider, Button, IconButton, Typography, Paper, Grid, Link, Container } from '@mui/material';


import SurveyTable from './SurveyTable';

export const SurveyPage = ({data}) => {
    console.log(data)
    return(
        data && <Box
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
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

                        
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
        </Box>)
}