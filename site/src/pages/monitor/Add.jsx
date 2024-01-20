import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function Add() {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
      setInputValue(event.target.value);
  };


  const handleSubmit = async () => {

      // Send URL to the backend for processing (assuming it's a GET request)
      const response = await fetch(`/api/v1/monitor/add?url=${inputValue}`, {
          method: 'GET',  // Specify GET method
          headers: {
          'Content-Type': 'application/json',
          },
      });

      // const data = await response.json();

  }

  return (
    <div className='add'>
      <div className='add-content'>
          <div className="add-field">

              <TextField
              variant="outlined"
              value={inputValue}
              onChange={handleInputChange}
              sx={{ width: '30%', marginRight: '100px', backgroundColor: '#ddd' }}
              />

              <Button
              variant="contained"
              size="large"
              color="success"
              onClick={handleSubmit}
              sx={{ height: '100%' }}
              >
                  Add
              </Button>


          </div>
      </div>
  </div>
  )
}

export default Add