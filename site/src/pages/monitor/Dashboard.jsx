import React, { useState, useMemo, useEffect } from 'react';
import { fetchMonitorData, formatMonitorData } from '../../data/monitorData';
import { fetchMonitorNotifications } from '../../data/monitorNotifications';
import { Button, Modal } from '@mui/material';
import { useQuery } from 'react-query';
import DeleteModal from '../../modal/monitor/DelModal';
import EditModal from '../../modal/monitor/EditModal';
import { format } from 'date-fns'; // Import the format function
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import './monitor.css'; // Import the dashboard.css

function Dashboard() {
    const [monitorId, setMonitorId] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sortConfig, setSortConfig] = useState({ key: 'count', direction: 'descending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');


    const navigate = useNavigate();

    const handleEditButtonClick = (id) => {
        setMonitorId(id);
        setModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setMonitorId(null);
        setModalOpen(false);
    };

    const handleDelButtonClick = (id) => {
        setMonitorId(id);
        setDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setMonitorId(null);
        setDeleteModalOpen(false);
    };

    const { data, isLoading, isError } = useQuery(['subdomainsData'], () =>
        fetchMonitorData()
    );

   
    const {
        data: notificationsData,
        isLoading: isLoadingNotifications,
        isError: isErrorNotifications,
    } = useQuery(['notificationsData'], fetchMonitorNotifications);

    const formattedMonitorData = useMemo(() => {
        if (!data || !notificationsData) return [];
        
        const notificationMap = notificationsData.reduce((acc, notification) => {
          acc[notification.base_url] = notification;
          return acc;
        }, {});
      
        return formatMonitorData(data).map(row => ({
          ...row,
          hasAi: notificationMap[row.url]?.ai > 0 || false,
          count: notificationMap[row.url]?.count || 0
        }));
      }, [data, notificationsData]); // Only essential dependencies

    const sortedData = useMemo(() => {
        if (!sortConfig.key) {
            return [...formattedMonitorData];
        }
        return [...formattedMonitorData].sort((a, b) => {
            const isAsc = sortConfig.direction === 'ascending';
            if (sortConfig.key === 'count') {
                return isAsc ? a.count - b.count : b.count - a.count;
            } else if (sortConfig.key === 'url') {
                return isAsc ? a.url.localeCompare(b.url) : b.url.localeCompare(a.url);
            } else if (sortConfig.key === 'date') {
                return isAsc ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
            }
            return 0;
        });
    }, [formattedMonitorData, sortConfig]);

    const handleSort = (key) => {
        setSortConfig((currentSortConfig) => {
            const direction =
                currentSortConfig.key === key && currentSortConfig.direction === 'ascending'
                    ? 'descending'
                    : 'ascending';
            return { key, direction };
        });
    };

    const handleDisplayClick = (url) => {
        navigate(`/monitor/display?url=${encodeURIComponent(url)}`);
    };

    if (isLoading) {
        return <h2>Loading...</h2>;
    }

    if (isError) {
        return <h2>{"internal server error"}</h2>;
    }

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓';
        }
        return null;
    };

     // Pagination Logic
     const indexOfLastItem = currentPage * itemsPerPage;
     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
     const currentData = sortedData.slice(indexOfFirstItem, indexOfLastItem);
 
     const paginate = (pageNumber) => setCurrentPage(pageNumber);
     const totalPages = Math.ceil(sortedData.length / itemsPerPage);
 
     const firstItemOnPage = Math.min(indexOfFirstItem + 1, sortedData.length);
     const lastItemOnPage = Math.min(indexOfLastItem, sortedData.length);

     
    return (
        <div className="monitor-table-container">
            <Helmet>
                <title>Monitor</title>
            </Helmet>
            <div className="monitor-table-wrapper">
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
                <table className="monitor-dashboard-table">
                    <thead>
                        <tr>
                            <th>
                                <button className="monitor-sort-header-button" onClick={() => handleSort('count')}>
                                    Count{getSortIndicator('count')}
                                </button>
                            </th>
                            <th>
                                <button className="monitor-sort-header-button" onClick={() => handleSort('url')}>
                                    Url{getSortIndicator('url')}
                                </button>
                            </th>
                            <th >Display</th>
                            <th >
                                <button className="monitor-sort-header-button" onClick={() => handleSort('date')}>
                                    Date{getSortIndicator('date')}
                                </button>
                            </th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentData.map((row) => (
                            <tr key={row.id}>
                                <td
                                    className="monitor-table-cell monitor-centered-cell"
                                    style={{

                                        backgroundColor: row.count !== 0 ? 'rgba(35, 173, 0, 0.58)' : 'inherit',
                                    }}
                                >
                                    <span className={row.hasAi ? 'highlight' : ''}>{row.count}</span>
                                </td>
                                <td className="monitor-table-cell" style={{ width: '45%' }}>
                                    <div className="monitor-asset-cell">
                                        <a
                                            href={row.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {row.url}
                                        </a>
                                    </div>
                                </td>
                                <td className="monitor-table-cell monitor-centered-cell">
                                    <Button
                                        variant="outlined"
                                        style={{ color: 'var(--info)', borderColor: 'var(--info)' }}
                                        onClick={() => handleDisplayClick(row.url)}
                                        size="small"
                                    >
                                        Display
                                    </Button>
                                </td>
                                <td className="monitor-table-cell monitor-centered-cell">
                                    {format(new Date(row.date), 'dd-MM-yyyy')}
                                </td>

                                <td className="monitor-table-cell monitor-centered-cell" style={{ width: '5%' }}>
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: 'var(--success)' }}
                                        onClick={() => handleEditButtonClick(row.id)}
                                        size="small"
                                    >
                                        Edit
                                    </Button>
                                </td>
                                <td className="monitor-table-cell monitor-centered-cell" style={{ width: '5%' }}>
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: 'var(--error)' }}
                                        onClick={() => handleDelButtonClick(row.id)}
                                        size="small"
                                    >
                                        Del
                                    </Button>
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
        <span>{firstItemOnPage} - {lastItemOnPage} of {sortedData.length}</span>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <DeleteModal monitorId={monitorId} onClose={handleCloseDeleteModal} />
            </Modal>

            <Modal open={modalOpen} onClose={handleCloseEditModal}>
                <EditModal monitorId={monitorId} onClose={handleCloseEditModal} />
            </Modal>
            
        </div>
    );
}

export default Dashboard;