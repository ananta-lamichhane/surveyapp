import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ContentPaste from '@mui/icons-material/ContentPaste'
import AssessmentIcon from '@mui/icons-material/Assessment';
import FeedIcon from '@mui/icons-material/Feed';
import CampaignIcon from '@mui/icons-material/Campaign';

export const MainListItems = (props) => {

  return(
  <React.Fragment>
    <ListItemButton onClick={() => props.clicked("Surveys")} selected={true}>
      <ListItemIcon>
        <CampaignIcon />
      </ListItemIcon>
      <ListItemText primary="Surveys" />
    </ListItemButton>
    <ListItemButton onClick={() => props.clicked("Datasets")} selected= {true}>
      <ListItemIcon>
        <FeedIcon />
      </ListItemIcon>
      <ListItemText primary="Datasets" />
    </ListItemButton>
    <ListItemButton onClick={() => props.clicked("Offline")}>
      <ListItemIcon>
        <AssessmentIcon />
      </ListItemIcon>
      <ListItemText primary="Offline Evaluations" />
    </ListItemButton>

  </React.Fragment>)
};
