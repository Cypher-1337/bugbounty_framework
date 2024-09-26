import React, { useEffect, useState } from 'react';
import EndpointBar from './EndpointBar';
import Urls from './Urls';
import './endpoint.css';



function Endpoint() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0)
  const [selectedDomain, setSelectedDomain] = useState(''); // Store the selected domain
  const [domainData, setDomainData] = useState([]); // New state to store domain data

  // Fetch all domains initially
  useEffect(() => {
    const getDomains = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/endpoints/metadata');
        const data = await response.json();
        setDomains(data.directories); // Assuming the backend sends a 'directories' field
        setDomainData(data.domainData); // Store the domain data for counts
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
    setSelectedDomain(domain); // Set the selected domain

    // Find the selected domain's data to set the count
    const selectedDomainData = domainData.find((d) => d.domain === domain);
    setCount(selectedDomainData ? selectedDomainData.urlCount : 0); // Update the count based on selected domain

    try {
      setLoading(true);
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
      <EndpointBar domains={domains} onDomainSelect={handleDomainSelect} count={count} />
      <Urls initialUrls={[]} domain={selectedDomain} /> {/* Pass domain to Urls component */}
    </div>
  );
}

export default Endpoint;
