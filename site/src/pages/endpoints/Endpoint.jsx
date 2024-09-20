import React, { useEffect, useState } from 'react';
import EndpointBar from './EndpointBar';
import Urls from './Urls';
import { fetchEndpointData, formatDomainData } from './../../data/endpointsData'; // Adjust the path as needed
import './endpoint.css';

function Endpoint() {
  const [domains, setDomains] = useState([]);
  const [urls, setUrls] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchEndpointData();
        const formattedData = formatDomainData(data);
        setDomains(formattedData);
        // Extract URLs from all domains (you can modify this logic based on your needs)
        const allUrls = formattedData.flatMap(domain => domain.urls);
        setUrls(allUrls);        
      } catch (error) {
        console.error('Error fetching endpoint data:', error);
      }
    };

    getData();
  }, []);

  const handleDomainSelect = async (domain) => {
    try {
      const response = await fetch(`/api/v1/endpoints?domain=${domain}`);
      const data = await response.json();
  
      if (data.urls && data.urls.length > 0) {
        setUrls(data.urls); // Update URLs based on the fetched data
      } else {
        setUrls([]); // Clear URLs if none are found
      }
    } catch (error) {
      console.error('Error fetching URLs:', error);
    }
  };
  
  return (
    <div className='endpoint-main'>
      <EndpointBar domains={domains} onDomainSelect={handleDomainSelect} /> {/* Pass the callback */}
      <Urls urls={urls} /> {/* Pass URLs to Urls */}
    </div>
  );
}

export default Endpoint;
