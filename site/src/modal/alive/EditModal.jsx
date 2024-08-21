import React, { useContext, useState } from 'react';
import { Button, FormControl, Input } from '@mui/material';
import { AppContext } from '../../App';
import { useQuery } from 'react-query';
import { fetchAliveData, formatAliveData } from '../../data/aliveData';

import './modal.css';
import Axios from 'axios';

function EditModal({ aliveId, onClose }) {
  
  const { darkMode } = useContext(AppContext);


  // State to manage input values
  const [aliveValue, setAliveValue] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [sizeValue, setSizeValue] = useState('');
  const [titleValue, setTitleValue] = useState('');

  // Fetch data based on inputFilter using useQuery
  const { data, isLoading, isError } = useQuery(['aliveData', aliveId], () =>
    fetchAliveData(aliveId)
  );
  if (isLoading) {return <h2>Loading...</h2>;}
  if (isError) {return <h2>{"internal server error"}</h2>;}

  // Ensure data is an array, even if it's a single object
  const dataArray = Array.isArray(data) ? data : [data];
  const formattedAlive = formatAliveData(dataArray);

 
  // when click edit button this function executes
  const handleEditClick = async () => {
    try {

      let editedAlive = aliveValue;
      let editedStatus = statusValue;
      let editedSize = sizeValue;
      let editedTitle = titleValue;
    
      if (!editedAlive ) {
        editedAlive = formattedAlive[0].alive;
      }
    
      if (!editedStatus) {
        editedStatus = formattedAlive[0].status;
      }
    
      if (!editedSize) {
        editedSize = formattedAlive[0].size;
      }

      if (!editedTitle) {
        editedTitle = formattedAlive[0].title;
      }
        
    
      // Update state variables with edited values
      setAliveValue(editedAlive);
      setStatusValue(editedStatus);
      setSizeValue(editedSize);
      setTitleValue(editedTitle);
      // Send a POST request to update the data
      const url = '/api/v1/alive';
      const requestBody = {
        id: formattedAlive[0].id,
        alive: editedAlive,
        status: editedStatus,
        size: editedSize,
        title: editedTitle,
      };

      await Axios.post(url, requestBody);


      
      onClose();



    } catch (error) {

      console.error('Error updating data:', error);
    }
  }

  return (
    <div className="dark">
      <div className='modal-content'>
        <div className='titleCloseBtn'>
          <Button onClick={onClose}>&times;</Button>
        </div>

        <div className='title'>Alive Data</div>

        <div className='body'>
          <div className='alive-content'>

            <div className='alive-prop'>
              <p>ID: </p>
              <span> {formattedAlive[0].id} </span>
            </div>

            <div className='alive-prop'>
              <p>Alive: </p>
              <div className='input-style'>
                <FormControl color='success' fullWidth sx={{ backgroundColor: '#eee', borderRadius: '5px 5px 0 0'}}>
                 
                  <Input id="alive" value={aliveValue} onChange={(e) => setAliveValue(e.target.value)}
                    sx={{ padding: ' 10px 20px', fontSize: '20px'}}
                  />
                </FormControl>
              </div>
            </div>

            <div className='alive-prop'>
              <p>Status: </p>
              <div className='input-style'>
                <FormControl color='success' fullWidth sx={{ backgroundColor: '#eee', borderRadius: '5px 5px 0 0'}}>
                 
                  <Input id="status"
                   value={statusValue}
                   onChange={(e) => setStatusValue(e.target.value)}
                   sx={{ padding: ' 10px 20px', fontSize: '20px'}}
                   type="number"
                  />
                </FormControl>
              </div>
            </div>

            <div className='alive-prop'>
              <p>Size: </p>
              <div className='input-style'>
                <FormControl color='success' fullWidth sx={{ backgroundColor: '#eee', borderRadius: '5px 5px 0 0'}}>
                 
                  <Input id="size" 
                    type="number"
                    value={sizeValue}
                    onChange={(e) => setSizeValue(e.target.value)}
                    sx={{ padding: ' 10px 20px', fontSize: '20px'}}
                  />
                </FormControl>
              </div>
            </div> 

            <div className='alive-prop'>
              <p>Title: </p>
              <div className='input-style'>
                <FormControl color='success' fullWidth sx={{ backgroundColor: '#eee', borderRadius: '5px 5px 0 0'}}>
                 
                  <Input id="title" 
                    value={titleValue}
                    onChange={(e) => setTitleValue(e.target.value)}
                    sx={{ padding: ' 10px 20px', fontSize: '20px'}}
                  />
                </FormControl>
              </div>
            </div> 

            <div className='alive-prop'>
              <p>Date: </p>
              <span> {formattedAlive[0].date} </span>
            </div>
          </div>
        </div>

        <div className='footer'>
          <Button variant='outlined' color='error' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='outlined' color='success' onClick={handleEditClick} >
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
