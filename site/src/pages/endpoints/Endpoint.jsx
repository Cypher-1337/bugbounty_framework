import React, { useEffect, useState } from 'react';
import EndpointBar from './EndpointBar';
import Urls from './Urls';
import { fetchEndpointData, formatDomainData } from './../../data/endpointsData'; // Adjust the path as needed
import './endpoint.css';

function Endpoint() {
  const [domains, setDomains] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const data = await fetchEndpointData();
        const formattedData = formatDomainData(data);
        setDomains(formattedData);
        const allUrls = formattedData.flatMap(domain => domain.urls);
        setUrls(allUrls);
      } catch (error) {
        setError('Error fetching endpoint data');
        console.error('Error fetching endpoint data:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    console.log('Domains:', domains);
  }, [domains]);

  const handleDomainSelect = async (domain) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/v1/endpoints?domain=${domain}`, { 
        method: 'GET', 
        headers: { 'Accept': 'application/json' } 
      });
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = '';
  
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        result += decoder.decode(value, { stream: true });
      }

      const data = JSON.parse(result);
  
      if (data.urls && data.urls.length > 0) {
        setUrls(data.urls);
      } else {
        setUrls([]);
      }
    } catch (error) {
      setError(`Error fetching URLs for domain ${domain}`);
      console.error('Error fetching URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='endpoint-main'>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <EndpointBar domains={domains} onDomainSelect={handleDomainSelect} />
      <Urls urls={urls} />
    </div>
  );
}

export default Endpoint;
