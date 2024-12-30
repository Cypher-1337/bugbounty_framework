import React, { useState, useEffect, useMemo } from 'react';
import './fuzz.css';

const Fuzz = () => {
  const [fuzzData, setFuzzData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100); // Set items per page to 100
  const [searchTerm, setSearchTerm] = useState('');
  const [hideZeroDirectories, setHideZeroDirectories] = useState(false);

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
        setFuzzData(data); // Remove the limit to the first 1000 entries
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
    const encodedSubdomain = encodeURIComponent(subdomain);
    const reportUrl = `/api/v1/fuzz/report/${encodedSubdomain}`;
    window.open(reportUrl, '_blank');
  };

  const isInteresting = () => {
    return false;
  };

  const filteredData = useMemo(() => {
    let filtered = fuzzData;

    if (hideZeroDirectories) {
      filtered = filtered.filter(item => item.directories_found !== 0);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.alive.toLowerCase().includes(lowerSearchTerm) ||
        (typeof item.directories_found === 'number' && String(item.directories_found).includes(lowerSearchTerm))
      );
    }

    return filtered;
  }, [fuzzData, searchTerm, hideZeroDirectories]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFuzzData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const firstItemOnPage = Math.min(indexOfFirstItem + 1, filteredData.length);
  const lastItemOnPage = Math.min(indexOfLastItem, filteredData.length);

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
        <div className="header-actions">
          <input
            type="text"
            placeholder="Search Target URLs or Directories..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset page on search
            }}
          />
          <button className={`toggle-button ${hideZeroDirectories ? 'active' : ''}`} onClick={() => setHideZeroDirectories(!hideZeroDirectories)}>
            {hideZeroDirectories ? 'Show 0 Directories' : 'Hide 0 Directories'}
          </button>
        </div>
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
            {currentFuzzData.map((item) => (
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
                  {typeof item.directories_found === 'number' ? item.directories_found : 'N/A'}
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
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{firstItemOnPage} - {lastItemOnPage} of {filteredData.length}</span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
      <div className="table-footer">
        {fuzzData.length} entries
      </div>
    </div>
  );
};

export default Fuzz;