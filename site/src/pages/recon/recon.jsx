// Recon.js

import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import './recon.css';

function Recon() {
  const [inputValue, setInputValue] = useState('');
  const [queue, setQueue] = useState([]);
  const [processingResult, setProcessingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const getQueue = async () => {
    // Fetch initial queue status
    const response = await fetch('/api/v1/recon/queue');
    const data = await response.json();

    // Set the initial queue status
    setQueue(data.queueStatus);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const isValidDomain = () => {
    // Validate domain pattern
    const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return domainPattern.test(inputValue);
  };

  const handleSubmit = async () => {
    if (isValidDomain()) {
      try {
        // Set loading indicator while waiting for the server response
        setLoading(true);

        // Send domain to the backend for processing
        const response = await fetch('/api/v1/recon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ domain: inputValue }),
        });

        const data = await response.json();

        // Set the processing result based on the backend response
        setProcessingResult(data);

        // Reset loading indicator
        setLoading(false);

        // Fetch the updated queue after processing
        getQueue();
      } catch (error) {
        console.error('Error processing domain:', error);

        // Reset loading indicator in case of an error
        setLoading(false);
      }
    } else {
      console.log('Please specify a valid domain');
    }
  };

  return (
    <div className="recon">
      <div className="recon-content">
        <div className="recon-field">
          <TextField
            variant="outlined"
            value={inputValue}
            onChange={handleInputChange}
            sx={{ width: '30%', marginRight: '100px', backgroundColor: '#ddd' }}
          />

          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={handleSubmit}
            sx={{ height: '100%' }}
          >
            Add
          </Button>

          <Button
            variant="contained"
            size="large"
            color="warning"
            onClick={getQueue}
            sx={{ height: '100%', marginLeft: '25px' }}
          >
            Queue
          </Button>
        </div>

        <div className="recon-result">
          {loading && <div>Loading...</div>}
          {queue.length > 0 && (
            <div>
              <h3>Current Queue: </h3>
              {queue.map((q, index) => (
                <div key={index}>{q}</div>
              ))}
            </div>
          )}
          {processingResult !== null && (
            <div>
              <h3>Processing Result:</h3>
              <div>{processingResult.message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recon;
