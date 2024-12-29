// Domains.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { fetchDomainsData, formatDomainsData } from '../../data/allDomainsData';
import './domains.css'; // Import the new CSS file for Domains
import { Button, Modal } from '@mui/material';
import EditModal from '../../modal/domains/EditModal';
import DeleteModal from '../../modal/domains/DelModal';

const Domains = () => {
    // ... rest of your component code (same as before)
    const [tableData, setTableData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [localInputFilter, setLocalInputFilter] = useState('');

    const [domainId, setDomainId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const rawData = await fetchDomainsData();
                const formattedData = formatDomainsData(rawData);
                setTableData(formattedData);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleEditButtonClick = (id) => {
        setDomainId(id);
        setModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setDomainId(null);
        setModalOpen(false);
    };

    const handleDelButtonClick = (id) => {
        setDomainId(id);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setDomainId(null);
        setDeleteModalOpen(false);
    };

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
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();
            dataToFilter = dataToFilter.filter(item =>
                Object.values(item).some(value =>
                    String(value).toLowerCase().includes(lowerSearchTerm)
                )
            );
        }
        return dataToFilter;
    }, [tableData, searchTerm]);

    const sortedData = useMemo(() => {
        if (!sortConfig.key) {
            return filteredData;
        }
        return [...filteredData].sort((a, b) => {
            const isAsc = sortConfig.direction === 'ascending';
            const key = sortConfig.key;
            if (key === 'wayback' || key === 'monitor' || key === 'id') {
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
        <div className="domains-table-container"> {/* Use a unique class name */}
            <div className='domains-filter-area'> {/* Use a unique class name */}
                <div className="domains-entries-dropdown"> {/* Use a unique class name */}
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
                    className="domains-search-input" 
                    size='small'
                    placeholder='Filter...'
                    onKeyDown={handleKeyDown}
                    sx={{ backgroundColor: 'white', borderRadius: '4px' }}
                />

                <input
                    type="text"
                    placeholder="Search..."
                    className="domains-search-input" 
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>
            <div className="domains-table-wrapper"> {/* Use a unique class name */}
                <table className="domains-dashboard-table"> {/* Use a unique class name */}
                    <thead>
                        <tr>
                            <th>
                                <button className="domains-sort-header-button" onClick={() => handleSort('id')}>
                                    ID{getSortIndicator('id')}
                                </button>
                            </th>
                            <th>
                                <button className="domains-sort-header-button" onClick={() => handleSort('domain')}>
                                    DOMAIN{getSortIndicator('domain')}
                                </button>
                            </th>
                            <th>
                                <button className="domains-sort-header-button" onClick={() => handleSort('wayback')}>
                                    WAYBACK{getSortIndicator('wayback')}
                                </button>
                            </th>
                            <th>
                                <button className="domains-sort-header-button" onClick={() => handleSort('monitor')}>
                                    MONITOR{getSortIndicator('monitor')}
                                </button>
                            </th>
                            <th>
                                <button className="domains-sort-header-button" onClick={() => handleSort('date')}>
                                    DATE{getSortIndicator('date')}
                                </button>
                            </th>
                            <th>
                                <button className="domains-sort-header-button" onClick={() => handleSort('program')}>
                                    PROGRAM{getSortIndicator('program')}
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
                                    <td className="domains-centered-cell">{row.id}</td> {/* Use a unique class name */}
                                    <td className="domains-asset-cell"> {/* Use a unique class name */}
                                        {row.domain}
                                    </td>
                                    <td className="domains-centered-cell">{row.wayback}</td> {/* Use a unique class name */}
                                    <td className="domains-centered-cell">{row.monitor}</td> {/* Use a unique class name */}
                                    <td className={`domains-centered-cell ${isToday ? 'domains-today-date' : ''}`}> {/* Use unique class names */}
                                        {new Date(row.date).toLocaleDateString()}
                                    </td>
                                    <td className="domains-centered-cell">{row.program}</td> {/* Use a unique class name */}
                                    <td className="domains-action-cell"> {/* Use a unique class name */}
                                        <Button
                                            variant="contained"
                                            color="success"
                                            size="small"
                                            onClick={() => handleEditButtonClick(row.id)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelButtonClick(row.id)}
                                            style={{ marginLeft: 8 }}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="domains-pagination"> {/* Use a unique class name */}
                <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                    Previous
                </button>
                <span>{firstItemOnPage} - {lastItemOnPage} of {sortedData.length}</span>
                <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>

            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <DeleteModal domainId={domainId} onClose={handleCloseDeleteModal} />
            </Modal>

            <Modal open={modalOpen} onClose={handleCloseEditModal}>
                <EditModal domainId={domainId} onClose={handleCloseEditModal} />
            </Modal>
        </div>
    );
};

export default Domains;