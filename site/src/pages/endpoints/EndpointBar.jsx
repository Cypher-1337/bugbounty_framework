import React, { useState } from 'react';
import { Select, MenuItem, FormControl } from '@mui/material';
import './endpoint.css';

function EndpointBar({ domains, onDomainSelect }) {
  const [selectedDomain, setSelectedDomain] = useState('');

  const handleChange = (event) => {
    const domain = event.target.value;
    setSelectedDomain(domain);
    onDomainSelect(domain); // Call the callback with the selected domain
  };

  return (
    <div className='endpoint-bar'>
      <div className='endpoint-msg'>
        <h3>
          {selectedDomain ? (
            <>
              New Endpoints for <span style={{ color: 'white', fontSize: '22px' }}>{selectedDomain}</span>
            </>
          ) : (
            'New Endpoints'
          )}
        </h3>
      </div>
      <FormControl sx={{ width: '200px' }}>
        <Select
          labelId="endpoint-select-label"
          value={selectedDomain}
          onChange={handleChange}
          variant="outlined"
          MenuProps={{
            PaperProps: {
              sx: {
                backgroundColor: '#424242',
                color: 'white',
              },
            },
          }}
          sx={{
            '& .MuiSelect-icon': {
              color: 'white',
            },
            '& .MuiInputBase-input': {
              color: 'white',
              background: "var(--border-color)",
            },
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              border: '1px solid var(--border-color)',
            },
          }}
        >
          {domains.map((domain, index) => (
            <MenuItem key={index} value={domain.domain} sx={{ color: 'white' }}>
              {domain.domain}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default EndpointBar;
