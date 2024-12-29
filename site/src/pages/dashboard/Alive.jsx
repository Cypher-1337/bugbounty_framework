// Fuzz.js
import React, { useState, useEffect, useMemo } from 'react';
import { fetchAliveData, formatAliveData } from '../../data/allAliveData';
import { AppContext } from '../../App';
import TextField from '@mui/material/TextField';
import './monitor_dash.css';

const Alive = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [searchTerm, setSearchTerm] = useState('');

  const { inputFilter, setInputFilter } = React.useContext(AppContext);
  const [localInputFilter, setLocalInputFilter] = React.useState(inputFilter);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const rawData = await fetchAliveData(inputFilter); // Use inputFilter here
        const formattedData = formatAliveData(rawData);
        setTableData(formattedData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [inputFilter]); // Re-fetch data when inputFilter changes

  const handleSort = (key) => {
    setSortConfig((currentSortConfig) => {
      if (currentSortConfig.key === key) {
        if (currentSortConfig.direction === 'ascending') {
          return { key, direction: 'descending' };
        } else if (currentSortConfig.direction === 'descending') {
          return { key: null, direction: null };
        } else {
          return { key, direction: 'ascending' };
        }
      } else {
        return { key, direction: 'ascending' };
      }
    });
  };

  const filteredData = useMemo(() => {
    let dataToFilter = [...tableData];

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      dataToFilter = dataToFilter.filter(item => {
        const matchesAsset = item.alive.toLowerCase().includes(lowerSearchTerm);
        const matchesStatus = String(item.status).toLowerCase().includes(lowerSearchTerm);
        const matchSize = String(item.size).toLowerCase().includes(lowerSearchTerm);
        const matchTitle = String(item.title).toLowerCase().includes(lowerSearchTerm);
        const matchCname = String(item.cname).toLowerCase().includes(lowerSearchTerm);
        const matchComment = String(item.comment).toLowerCase().includes(lowerSearchTerm);
        let matchesTech = false;
        if (Array.isArray(item.tech)) {
          matchesTech = item.tech.some(techItem =>
            String(techItem).toLowerCase().includes(lowerSearchTerm)
          );
        } else if (item.tech) {
          matchesTech = String(item.tech).toLowerCase().includes(lowerSearchTerm);
        }
        return matchesAsset || matchesStatus || matchSize || matchTitle || matchCname || matchComment || matchesTech;
      });
    }

    return dataToFilter;
  }, [tableData, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) {
      return [...filteredData];
    }
    return [...filteredData].sort((a, b) => {
      const isAsc = sortConfig.direction === 'ascending';
      if (sortConfig.key === 'alive') {
        return isAsc ? String(a.alive).localeCompare(String(b.alive)) : String(b.alive).localeCompare(String(a.alive));
      } else if (sortConfig.key === 'status') {
        return isAsc ? String(a.status).localeCompare(String(b.status)) : String(b.status).localeCompare(String(a.status));
      } else if (sortConfig.key === 'size') {
        return isAsc ? a.size - b.size : b.size - a.size;
      } else if (sortConfig.key === 'title') {
        return isAsc ? String(a.title).localeCompare(String(b.title)) : String(b.title).localeCompare(String(a.title));
      } else if (sortConfig.key === 'cname') {
        return isAsc ? String(a.cname).localeCompare(String(b.cname)) : String(b.cname).localeCompare(String(a.cname));
      } else if (sortConfig.key === 'comment') {
        return isAsc ? String(a.comment).localeCompare(String(b.comment)) : String(b.comment).localeCompare(String(a.comment));
      } else if (sortConfig.key === 'date') {
        return isAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const getSortIndicator = (key) => {
    if (sortConfig.key === key) {
      if (sortConfig.direction === 'ascending') {
        return ' ↑';
      } else if (sortConfig.direction === 'descending') {
        return ' ↓';
      }
    }
    return null;
  };

  const handleChange = (e) => {
    setLocalInputFilter(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setInputFilter(localInputFilter);
      setCurrentPage(1); // Reset page when applying filter
    }
  };

  // Function to convert bytes to human-readable format
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const firstItemOnPage = Math.min(indexOfFirstItem + 1, sortedData.length);
  const lastItemOnPage = Math.min(indexOfLastItem, sortedData.length);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const today = new Date();

  return (
    <div className="table-container">
      <div className='filter-area'>
        <div className="entries-dropdown">
          Show
          <select value={itemsPerPage} onChange={(e) => {
            setItemsPerPage(parseInt(e.target.value, 10));
            setCurrentPage(1);
          }}>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
        <input
          value={localInputFilter}
          onChange={handleChange}
          className="search-input"
          size='small'
          placeholder='Filter...'
          onKeyDown={handleKeyDown}
          sx={{ backgroundColor: 'white', borderRadius: '4px' }}
        />

        <input
          type="text"
          placeholder="Search..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset page on search
          }}
        />
      </div>
      <div className="table-wrapper">
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>
                <button className="sort-header-button" onClick={() => handleSort('alive')}>
                  ASSET{getSortIndicator('alive')}
                </button>
              </th>
              <th>
                <button className="sort-header-button" onClick={() => handleSort('title')}>
                  TITLE{getSortIndicator('title')}
                </button>
              </th>
              <th>
                <button className="sort-header-button" onClick={() => handleSort('status')}>
                  STATUS{getSortIndicator('status')}
                </button>
              </th>
              <th>
                <button className="sort-header-button" onClick={() => handleSort('size')}>
                  CONTENT LENGTH{getSortIndicator('size')}
                </button>
              </th>
              <th>
                <button className="sort-header-button" onClick={() => handleSort('cname')}>
                  TECH{getSortIndicator('cname')}
                </button>
              </th>
              <th>
                <button className="sort-header-button" onClick={() => handleSort('comment')}>
                  COMMENT{getSortIndicator('comment')}
                </button>
              </th>
              <th>
                <button className="sort-header-button" onClick={() => handleSort('date')}>
                  DATE{getSortIndicator('date')}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((row) => {
              let hostname;
              try {
                const url = new URL(row.alive);
                hostname = url.hostname;
              } catch (error) {
                hostname = row.alive; // Fallback
              }

              const rowDate = new Date(row.date);
              const isToday = rowDate.getDate() === today.getDate() &&
                rowDate.getMonth() === today.getMonth() &&
                rowDate.getFullYear() === today.getFullYear();

              return (
                <tr key={row.id}>
                  <td>
                    <div className="asset-cell">

                      <a href={row.alive} target="_blank" rel="noopener noreferrer">
                        {row.alive}
                      </a>
                      {row.redirect && (
                        <div className="redirect">
                          Redirect: <span>{row.redirect}</span>
                        </div>
                      )}
                      <div className="dns">DNS: {row.ip}</div>
                      <div className="links">
                        <a href={`https://github.com/search?q=${hostname}&type=code`} target="_blank" rel="noopener noreferrer" className="link">
                          <img src="https://github.com/favicon.ico" alt="" className="imageIcon" />
                        </a>
                        <a href={`https://www.google.com/search?q=site%3A${hostname}`} target="_blank" rel="noopener noreferrer" className="link">
                          <img src="https://www.google.com/favicon.ico" alt="" className="imageIcon" />
                        </a>
                        <a href={`http://web.archive.org/cdx/search/cdx?url=${hostname}/*&output=text&fl=original&collapse=urlkey&from=`} target="_blank" rel="noopener noreferrer" className="link">
                          <img src="https://archive.org/favicon.ico" alt="" className="imageIcon" />
                        </a>
                        <a href={`https://www.bing.com/search?q=site%3A${hostname}`} target="_blank" rel="noopener noreferrer" className="link">
                          <img src="https://www.bing.com/favicon.ico" alt="" className="imageIcon" />
                        </a>
                        <a href={`https://www.shodan.io/search?query=hostname%3A%22${hostname}%22`} target="_blank" rel="noopener noreferrer" className="link">
                          <img src="https://www.shodan.io/static/img/favicon-60c1b1cd.png" alt="" className="imageIcon" />
                        </a>
                        <a href={`https://search.censys.io/search?resource=hosts&q=${hostname}`} target="_blank" rel="noopener noreferrer" className="link">
                          <img src="https://search.censys.io/static/img/favicon-32x32.png" alt="" className="imageIcon" />
                        </a>
                        <a href={`https://en.fofa.info/result?qbase64=${btoa(hostname)}`} target="_blank" rel="noopener noreferrer" className="link">
                          <img src="https://en.fofa.info/favicon.ico" alt="" className="imageIcon" />
                        </a>
                      </div>
                      {Array.isArray(row.tech) && row.tech.length > 0 && (
                        <div className="tags">
                          Tags:
                          {row.tech.map((tag, tagIndex) => (
                            <span key={tagIndex} className="tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {Array.isArray(row.apps) && row.apps.length > 0 && (
                        <div className="tags">
                          Apps:
                          {row.apps.map((app, appIndex) => (
                            <span key={appIndex} className="tag">
                              {app}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="centered-cell">{row.title}</td>
                  <td className="centered-cell">
                    <div className="status-code-cell">
                      <span className={`status-code status-code-${Math.floor(row.status / 100)}xx`}>{row.status}</span>
                    </div>
                  </td>
                  <td className="centered-cell">
                    <div className="content-length-cell">
                      <span className="content-length">
                        {formatBytes(row.size)}
                      </span>
                    </div>
                  </td>
                  <td className="centered-cell">{Array.isArray(row.tech) ? row.tech.join(', ') : row.tech}</td>
                  <td className="centered-cell">{row.comment}</td>
                  <td className={`centered-cell ${isToday ? 'today-date' : ''}`}>
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>{firstItemOnPage} - {lastItemOnPage} of {sortedData.length}</span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Alive;