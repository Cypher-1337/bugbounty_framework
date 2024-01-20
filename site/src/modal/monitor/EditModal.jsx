import React, { useContext, useState } from 'react';
import { Button, FormControl, Input } from '@mui/material';
import { AppContext } from '../../App';
import { useQuery } from 'react-query';
import { fetchMonitorData, formatMonitorData } from '../../data/monitorData';

import './modal.css';
import Axios from 'axios';

function EditModal({ monitorId, onClose }) {
  
  const { darkMode } = useContext(AppContext);

  // State to manage input values
  const [monitorValue, setMonitorValue] = useState('');

  // Fetch data based on inputFilter using useQuery
  const { data, isLoading, isError } = useQuery(['monitorData', monitorId], () =>
    fetchMonitorData(monitorId)
  );
  if (isLoading) {return <h2>Loading...</h2>;}
  if (isError) {return <h2>{"internal server error"}</h2>;}

  // Ensure data is an array, even if it's a single object
  const dataArray = Array.isArray(data) ? data : [data];
  const formattedMonitor = formatMonitorData(dataArray);



  // when click edit button this function executes
  const handleEditClick = async () => {
    try {

      let editedMonitor = monitorValue;
    

    
      // Check and update monitor value if it's empty
      if (!editedMonitor) {
        editedMonitor = formattedMonitor[0].monitor;
      }
    
    
    
      // Update state variables with edited values
      setMonitorValue(editedMonitor);
    
      // Send a POST request to update the data
      const url = '/api/v1/monitor';
      const requestBody = {
        id: formattedMonitor[0].id,
        monitor: editedMonitor,
      };

      await Axios.post(url, requestBody);


      
      onClose();



    } catch (error) {

      console.error('Error updating data:', error);
    }
  }

  return (
    <div className={darkMode === 'dark' ? 'modal-background dark' : 'modal-background light'}>
      <div className='modal-content'>
        <div className='titleCloseBtn'>
          <Button onClick={onClose}>&times;</Button>
        </div>

        <div className='title'>Modal Title</div>

        <div className='body'>
          <div className='domain-content'>

            <div className='domain-prop'>
              <p>ID: </p>
              <span> {formattedMonitor[0].id} </span>
            </div>

            <div className='domain-prop'>
              <p>Domain: </p>
              <div className='input-style'>
                 
                  <h5>{formattedMonitor[0].url}</h5>
              </div>
            </div>

            <div className='domain-prop'>
              <p>Monitor: </p>
              <div className='input-style'>
                <FormControl color='success' fullWidth sx={{ backgroundColor: '#eee', borderRadius: '5px 5px 0 0', width: '150px'}}>
                 
                  <Input id="monitor"
                   value={monitorValue}
                   onChange={(e) => setMonitorValue(e.target.value)}
                   sx={{ padding: ' 10px 20px', fontSize: '20px'}}
                   type="number"
                  />
                </FormControl>
              </div>
            </div>


            <div className='domain-prop'>
              <p>Date: </p>
              <span> {formattedMonitor[0].date} </span>
            </div>
          </div>
        </div>

        <div className='footer'>
          <Button variant='outlined' color='error' onClick={onClose}>
            Cancel
          </Button>
          <Button variant='outlined' color='success' onClick={handleEditClick}>
            Edit
          </Button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
