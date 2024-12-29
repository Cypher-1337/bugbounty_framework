// dashboard.jsx
import React, { useState, useContext } from 'react'; // Import useContext
import Domains from './Domains'
import Alive from './Alive'
import Subdomains from './Subdomains'
import { AppContext } from '../../App'; // Import AppContext

export default function DomainsData() {
  const { selectedView } = useContext(AppContext); // Get selectedView from context

  return (
    <div className='dashboard'>
          {selectedView === 'alive' && <Alive />}
          {selectedView === 'domains' && <Domains />}
          {selectedView === 'subdomains' && <Subdomains />}
    </div>
  );
}