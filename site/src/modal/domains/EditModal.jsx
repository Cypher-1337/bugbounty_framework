import React, { useContext, useState } from 'react';
import { Button, FormControl, Input } from '@mui/material';
import { AppContext } from '../../App';
import { useQuery } from 'react-query';
import { fetchDomainsData, formatDomainsData } from '../../data/allDomainsData';

import './modal.css';
import Axios from 'axios';

function EditModal({ domainId, onClose }) {
  
  const { darkMode } = useContext(AppContext);

  // State to manage input values
  const [domainValue, setDomainValue] = useState('');
  const [monitorValue, setMonitorValue] = useState('');
  const [waybackValue, setWaybackValue] = useState('');

  // Fetch data based on inputFilter using useQuery
  const { data, isLoading, isError } = useQuery(['domainsData', domainId], () =>
    fetchDomainsData(domainId)
  );
  if (isLoading) {return <h2>Loading...</h2>;}
  if (isError) {return <h2>{"internal server error"}</h2>;}

  // Ensure data is an array, even if it's a single object
  const dataArray = Array.isArray(data) ? data : [data];
  const formattedDomains = formatDomainsData(dataArray);

  // regext to check if the domain is valid
  const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // when click edit button this function executes
  const handleEditClick = async () => {
    try {

      let editedDomain = domainValue;
      let editedMonitor = monitorValue;
      let editedWayback = waybackValue;
    
      // Check and update domain value if it's empty or not a valid domain
      if (!editedDomain || !domainPattern.test(editedDomain)) {
        editedDomain = formattedDomains[0].domain;
      }
    
      // Check and update monitor value if it's empty
      if (!editedMonitor) {
        editedMonitor = formattedDomains[0].monitor;
      }
    
      // Check and update wayback value if it's empty or not a valid integer
      if (!editedWayback) {
        editedWayback = formattedDomains[0].wayback;
      }
    
      // Update state variables with edited values
      setDomainValue(editedDomain);
      setMonitorValue(editedMonitor);
      setWaybackValue(editedWayback);
    
      // Send a POST request to update the data
      const url = 'http://127.0.0.1:5000/api/v1/domains';
      const requestBody = {
        id: formattedDomains[0].id,
        domain: editedDomain,
        monitor: editedMonitor,
        wayback: editedWayback,
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
              <span> {formattedDomains[0].id} </span>
            </div>

            <div className='domain-prop'>
              <p>Domain: </p>
              <div className='input-style'>
                <FormControl color='success' fullWidth sx={{ backgroundColor: '#eee', borderRadius: '5px 5px 0 0'}}>
                 
                  <Input id="domain" value={domainValue} onChange={(e) => setDomainValue(e.target.value)}
                    sx={{ padding: ' 10px 20px', fontSize: '20px'}}
                  />
                </FormControl>
              </div>
            </div>

            <div className='domain-prop'>
              <p>Monitor: </p>
              <div className='input-style'>
                <FormControl color='success' fullWidth sx={{ backgroundColor: '#eee', borderRadius: '5px 5px 0 0'}}>
                 
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
              <p>Wayback: </p>
              <div className='input-style'>
                <FormControl color='success' fullWidth sx={{ backgroundColor: '#eee', borderRadius: '5px 5px 0 0'}}>
                 
                  <Input id="wayback" 
                    type="number"
                    value={waybackValue}
                    onChange={(e) => setWaybackValue(e.target.value)}
                    sx={{ padding: ' 10px 20px', fontSize: '20px'}}
                  />
                </FormControl>
              </div>
            </div> 

            <div className='domain-prop'>
              <p>Date: </p>
              <span> {formattedDomains[0].date} </span>
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
