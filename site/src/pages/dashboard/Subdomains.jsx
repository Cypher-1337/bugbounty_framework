// SubDomains.jsx
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { fetchSubdomainsData, formatSubdomainsData } from '../../data/allSubdomainsData';
import './subdomains.css'; // Import the new CSS file for SubDomains
import { Button } from '@mui/material';
import { AppContext } from '../../App';

const SubDomains = () => {
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [localInputFilter, setLocalInputFilter] = useState('');
    const { inputFilter } = useContext(AppContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rawData = await fetchSubdomainsData(inputFilter);
                const formattedData = formatSubdomainsData(rawData);
                setTableData(formattedData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [inputFilter]);

    const handleSort = (key) => {
        setSortConfig((currentSortConfig) => {
            if (currentSortConfig.key === key) {
                return { key, direction: currentSortConfig.direction === 'ascending' ? 'descending' : 'ascending' };
            } else {
                return { key, direction: 'ascending' };
            }
        });
    };

    const filteredData = useMemo(() => {
        let dataToFilter = [...tableData];
        if (localInputFilter) {
            const lowerSearchTerm = localInputFilter.toLowerCase();
            dataToFilter = dataToFilter.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(lowerSearchTerm)
                )
            );
        }
        return dataToFilter;
    }, [tableData, localInputFilter]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) {
            return filteredData;
        }
        return [...filteredData].sort((a, b) => {
            const isAsc = sortConfig.direction === 'ascending';
            const key = sortConfig.key;
            if (key === 'id') {
                return isAsc ? a[key] - b[key] : b[key] - a[key];
            } else if (key === 'date') {
                return isAsc ? new Date(a[key]) - new Date(b[key]) : new Date(b[key]) - new Date(a[key]);
            } else {
                return isAsc ? String(a[key]).localeCompare(String(b[key])) : String(b[key]).localeCompare(String(a[key]));
            }
        });
    }, [filteredData, sortConfig]);

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
        }
        return null;
    };

    const handleChange = (e) => {
        setLocalInputFilter(e.target.value);
    };
    const handleKeyDown = (e) => {
        // You can implement specific filtering logic here if needed
    };

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
        <div className="subdomains-table-container">
            <div className='subdomains-filter-area'>
                <div className="subdomains-entries-dropdown">
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
                    className="subdomains-search-input"
                    size='small'
                    placeholder='Filter...'
                    onKeyDown={handleKeyDown}
                    sx={{ backgroundColor: 'white', borderRadius: '4px' }}
                />
            </div>
            <div className="subdomains-table-wrapper">
                <table className="subdomains-dashboard-table">
                    <thead>
                        <tr>
                            <th>
                                <button className="subdomains-sort-header-button" onClick={() => handleSort('id')}>
                                    ID{getSortIndicator('id')}
                                </button>
                            </th>
                            <th>
                                <button className="subdomains-sort-header-button" onClick={() => handleSort('subdomain')}>
                                    SUBDOMAIN{getSortIndicator('subdomain')}
                                </button>
                            </th>
                            <th>
                                <button className="subdomains-sort-header-button" onClick={() => handleSort('date')}>
                                    DATE{getSortIndicator('date')}
                                </button>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row) => {
                            const rowDate = new Date(row.date);
                            const isToday = rowDate.getDate() === today.getDate() &&
                                rowDate.getMonth() === today.getMonth() &&
                                rowDate.getFullYear() === today.getFullYear();

                            return (
                                <tr key={row.id}>
                                    <td className="subdomains-centered-cell">{row.id}</td>
                                    <td className="subdomains-asset-cell">
                                        {row.subdomain}
                                    </td>
                                    <td className={`subdomains-centered-cell ${isToday ? 'subdomains-today-date' : ''}`}>
                                        {new Date(row.date).toLocaleDateString()}
                                    </td>
                                    <td className="subdomains-action-cell">
                                        {/* You can add action buttons here if needed */}
                                        {/* <Button variant="contained" color="success" size="small">
                                            Edit
                                        </Button>
                                        <Button variant="contained" color="error" size="small" style={{ marginLeft: 8 }}>
                                            Delete
                                        </Button> */}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="subdomains-pagination">
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

export default SubDomains;