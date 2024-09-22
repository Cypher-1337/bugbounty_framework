import React, { useEffect, useState } from 'react';
import EndpointBar from './EndpointBar';
import Urls from './Urls';
import './endpoint.css';

// Function to fetch and process streaming data efficiently
const fetchStreamingData = async (domain) => {
  const response = await fetch(`/api/v1/endpoints?domain=${domain}`, { 
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let urls = [];
  
  // Process the stream chunk-by-chunk
  let { done, value } = await reader.read();
  while (!done) {
    const chunk = decoder.decode(value, { stream: true });
    
    // Split the chunk by newlines assuming NDJSON (newline-delimited JSON)
    const lines = chunk.split('\n').filter(Boolean); // Filter out any empty lines

    for (const line of lines) {
      try {
        const parsedLine = JSON.parse(line); // Parse each line individually
        urls.push(parsedLine.url); // Assuming the structure has a URL field
      } catch (error) {
        console.error("Error parsing line:", line, error);
      }
    }
    
    // Read the next chunk
    ({ done, value } = await reader.read());
  }

  return urls; // Return the list of parsed URLs
};

function Endpoint() {
  const [domains, setDomains] = useState([]);
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all domains initially
  useEffect(() => {
    const getDomains = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/endpoints');
        const data = await response.json();
        setDomains(data.directories); // Assuming the backend sends a 'directories' field
      } catch (error) {
        setError('Error fetching domains');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getDomains();
  }, []);

  // Handle domain selection and streaming
  const handleDomainSelect = async (domain) => {
    try {
      setLoading(true);
      const fetchedUrls = await fetchStreamingData(domain); // Fetch streaming data
      setUrls(fetchedUrls);
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
