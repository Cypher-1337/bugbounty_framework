// dashboard.jsx
import React, { useState } from 'react';
import Domains from './Domains'
import Alive from './Alive'
import Subdomains from './Subdomains'

export default function DomainsData() {
  const [selectedView, setSelectedView] = useState('alive'); // Default to 'alive'

  const handleViewChange = (event) => {
    setSelectedView(event.target.value);
  };

  return (
    <div className='dashboard'>
      <div>
        <label htmlFor="view-select">Select View:</label>
        <select id="view-select" value={selectedView} onChange={handleViewChange}>
          <option value="alive">Alive</option>
          <option value="domains">Domains</option>
          <option value="subdomains">Subdomains</option>
        </select>
      </div>

      {selectedView === 'alive' && <Alive />}
      {selectedView === 'domains' && <Domains />}
      {selectedView === 'subdomains' && <Subdomains />}

    </div>
  );
}