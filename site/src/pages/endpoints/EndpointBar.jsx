import React, { useState } from 'react';
import { Select, MenuItem, FormControl, Button } from '@mui/material';
import './endpoint.css';

function EndpointBar({ domains, onDomainSelect, onFilterChange }) {
  const [selectedDomain, setSelectedDomain] = useState('');
  const [latestUrlsFile, setLatestUrlsFile] = useState('');
  const [subdomain, setSubdomain] = useState(''); // State for subdomain input
  const [filter, setFilter] = useState(''); // State for filter input

  const handleChange = (event) => {
    const domain = event.target.value;
    const selectedDomainData = domains.find((d) => d.domain === domain);

    setSelectedDomain(domain);
    setLatestUrlsFile(selectedDomainData?.latestUrlsFile || '');
    onDomainSelect(domain);  // Pass the selected domain to the parent
  };



  // Function to extract domain from subdomain
  const extractDomain = (subdomain) => {
    const domainParts = subdomain.split('.').slice(-2); // Get the last two parts (e.g., 'example.com' from 'www.example.com')
    return domainParts.join('.');
  };

 

  const handleFilterSubmit = async () => {
    if (!subdomain || !filter) {
      alert('Please enter both subdomain and filter');
      return;
    }

    onFilterChange(filter); // Notify parent about the new filter

    // Extract domain from subdomain
    const extractedDomain = extractDomain(subdomain);

    const payload = {
      domain: extractedDomain, // Use the extracted domain
      subdomain: subdomain,
      filter: filter
    };

    try {
      const response = await fetch('/api/v1/endpoints/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Filter applied:', data);
      } else {
        console.error('Error:', data);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      alert('Failed to apply filter');
    }
  };

  return (
    <div className='endpoint-bar'>

      <div className='filter'>
        <div className="filter_input">
          <input
            type="text"
            name="subdomain"
            placeholder='Subdomain'
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value)} // Update subdomain state
          />
          <input
            type="text"
            name="filter"
            placeholder='Filter'
            value={filter}
            onChange={(e) => setFilter(e.target.value)} // Update filter state
          />
        </div>
        <Button onClick={handleFilterSubmit}>Filter out</Button>
      </div>

      <div className='endpoint-msg'>
        <h2 style={{color:'white'}}>
          {selectedDomain && (
            <>
              {selectedDomain}
            </>
          )}
        </h2>
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
          {domains.length > 0 ? (
            domains.map((domain, index) => (
              <MenuItem key={index} value={domain.domain} sx={{ color: 'white' }}>
                {domain.domain}
              </MenuItem>
            ))
          ) : (
            <MenuItem value="" disabled>
              No domains available
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </div>
  );
}

export default EndpointBar;
