
import * as React from 'react';
import Box from '@mui/material/Box';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import { MenuItem, Radio, RadioGroup, FormControl, FormLabel, Button } from '@mui/material';
import {Select, InputLabel, FormHelperText, Input } from '@mui/material';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function CustomModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button onClick={handleOpen}>Create New Survey</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            New Survey
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          
            <CreateNewForm />

          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

const CreateNewForm = () =>{

    const [allValues, setAllValues] = useState([])

    const handleSubmit = (event) =>{
        event.preventDefault()
        console.log(allValues)

       
    }

    const handleTextInput = (e) =>{
        console.log(e.target)
        setAllValues({
            ...allValues,
            [e.target.name]: e.target.value
        })
    }

    return (

        <form onSubmit={(e) =>handleSubmit(e)}>

        <Box
            component="form"
            sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
        >
       
            <TextField
                required
                id="outlined-required"
                label="Required"
                name ="surveyName"
                defaultValue="Survey Name"
                onChange={ (e) => handleTextInput(e)}
                />
                <TextField
                required
                id="outlined-required"
                label="Required"
                name ="name"
                defaultValue="Description"
                onChange={ (e) => handleTextInput(e)}
                />
            
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Dataset</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={2}
                    name = "dataset"
                    label="dataset"
                    onChange={handleTextInput}
                >
                    <MenuItem value={"MovieLens"}>MovieLens</MenuItem>
                    <MenuItem value={"Jester"}>Jester</MenuItem>
                    <MenuItem value={"Iris"}>Iris</MenuItem>
                </Select>
            </FormControl>  
       

        </Box>
        <Button variant="contained" color="primary" type="submit">
            submit
        </Button>
        </form>

  
    )

}

