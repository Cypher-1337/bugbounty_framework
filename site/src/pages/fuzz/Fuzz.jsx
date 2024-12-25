import React, { useState, useEffect } from 'react';
import './fuzz.css';

const Fuzz = () => {
  const [fuzzData, setFuzzData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFuzzData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/v1/fuzz');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setFuzzData(data);
      } catch (error) {
        console.error("Could not fetch fuzz data:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFuzzData();
  }, []);

  const handleUrlClick = (subdomain) => {
    // Construct the report URL based on the backend endpoint, encoding the subdomain
    const encodedSubdomain = encodeURIComponent(subdomain);
    const reportUrl = `/api/v1/fuzz/report/${encodedSubdomain}`;
    window.open(reportUrl, '_blank');
  };

  const isInteresting = () => {
    return false;
  };

  if (loading) {
    return <div>Loading fuzz data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="table-container">
      <div className="table-header">
        <h2>Directory Fuzzing Results</h2>
      </div>
      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Target URL</th>
              <th>Directories Found</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {fuzzData.map((item) => (
              <tr key={item.id}>
                <td>
                  <a
                    href="#"
                    onClick={() => handleUrlClick(item.alive)}
                    className="asset-cell-link"
                  >
                    {item.alive}
                  </a>
                </td>
                <td className="centered-cell">
                  {item.directories_found}
                </td>
                <td className="action-cell">
                  <button onClick={() => handleUrlClick(item.alive)} className="action-button">
                    View Report
                  </button>
                  {isInteresting() && <span className="interesting-indicator">🔥</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        {fuzzData.length} entries
      </div>
    </div>
  );
};

export default Fuzz;