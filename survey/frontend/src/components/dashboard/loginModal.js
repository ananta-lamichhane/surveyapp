import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog, {DialogProps} from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import { useCookies } from 'react-cookie';



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


export default function LoginPrompt(props) {
  const [open, setOpen] = React.useState(true);
  const [password, setPassword] = React.useState("")
  const textInput = React.useRef(null)
  const [loginCookie, setLoginCookie] = useCookies(false)



  const handleClose = () => {
    console.log("props pwd "+ props.pwd)
    if(password === props.pwd || loginCookie.loggedIn){
        props.checkLogin(true)
       
        setOpen(false);
    }else{
        if(password !== ""){
            alert("Wrong password. Please try again.")
        }
        textInput.current.value = ""
    }
  };
  return (
    <ThemeProvider theme={mdTheme}>
    <div>
      <Dialog
       open={open}
        onClose={handleClose}
        >
        <DialogTitle>Welcome to the researcher dashboard. Please log in.</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please type your administrator password.
          </DialogContentText>
            <TextField
                autoFocus
                id="password"
                name="password"
                type="password"
                placeholder="password"
                label="Password"
                inputRef={textInput}
                fullWidth
                onChange={(e) =>{setPassword(e.target.value)}}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Log In</Button>
        </DialogActions>
      </Dialog>
    </div>
    </ThemeProvider>
  );
}


