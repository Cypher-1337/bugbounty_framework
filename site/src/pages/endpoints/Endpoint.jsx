import React, { useEffect, useState } from 'react';
import EndpointBar from './EndpointBar';
import Urls from './Urls';
import './endpoint.css';



function Endpoint() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState(''); // Store the selected domain
  const [filter, setFilter] = useState(''); // New filter state

  // Fetch all domains initially
  useEffect(() => {
    const getDomains = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/v1/endpoints/metadata');
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
    setSelectedDomain(domain); // Set the selected domain
    setFilter(''); // Reset filter when a new domain is selected

    try {
      setLoading(true);
    } catch (error) {
      setError(`Error fetching URLs for domain ${domain}`);
      console.error('Error fetching URLs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  return (
    <div className='endpoint-main'>
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      <EndpointBar
       domains={domains}
       onDomainSelect={handleDomainSelect}
       onFilterChange={handleFilterChange} // Pass the function to handle filter changes
       />
      <Urls initialUrls={[]} domain={selectedDomain} filter={filter} /> {/* Pass filter to Urls component */}
    </div>
  );
}

export default Endpoint;
