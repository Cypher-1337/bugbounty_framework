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
        if (!data) return [];
        const formatted = formatMonitorData(data);
        if (!isLoadingNotifications && !isErrorNotifications && notificationsData) {
            notificationsData.forEach((notification) => {
                formatted.forEach((row) => {
                    if (row.url === notification.base_url) {
                        if (notification.ai > 0) {
                            row.hasAi = true;
                        }
                        row.count += 1;
                    }
                });
            });
        }
        return formatted;
    }, [data, isLoadingNotifications, isErrorNotifications, notificationsData]);

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

    return (
        <div className="table-container">
            <Helmet>
                <title>Monitor</title>
            </Helmet>
            <div className="table-wrapper">
                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th style={{ width: '8%' }}> {/* Adjusted width */}
                                <button className="sort-header-button" onClick={() => handleSort('count')}>
                                    Count{getSortIndicator('count')}
                                </button>
                            </th>
                            <th style={{ width: '60%' }}> {/* Adjusted width */}
                                <button className="sort-header-button" onClick={() => handleSort('url')}>
                                    Url{getSortIndicator('url')}
                                </button>
                            </th>
                            <th style={{ width: '10%' }}>Display</th> {/* Adjusted width */}
                            <th style={{ width: '12%' }}> {/* Adjusted width */}
                                <button className="sort-header-button" onClick={() => handleSort('date')}>
                                    Date{getSortIndicator('date')}
                                </button>
                            </th>
                            <th style={{ width: '5%' }}>Edit</th> {/* Adjusted width */}
                            <th style={{ width: '5%' }}>Delete</th> {/* Adjusted width */}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row) => (
                            <tr key={row.id}>
                                <td className="table-cell centered-cell" style={{ width: '8%' }}> {/* Adjusted width */}
                                    <span className={row.hasAi ? 'highlight' : ''}>{row.count}</span>
                                </td>
                                <td className="table-cell" style={{ width: '60%' }}> {/* Adjusted width */}
                                    <div className="asset-cell">
                                        <a
                                            href={row.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{ display: 'block', color: 'var(--primary)' }}
                                        >
                                            {row.url}
                                        </a>
                                    </div>
                                </td>
                                <td className="table-cell centered-cell" style={{ width: '10%' }}> {/* Adjusted width */}
                                    <Button
                                        variant="outlined"
                                        style={{ color: 'var(--info)', borderColor: 'var(--info)' }}
                                        onClick={() => handleDisplayClick(row.url)}
                                        size="small"
                                    >
                                        Display
                                    </Button>
                                </td>
                                <td className="table-cell centered-cell" style={{ width: '12%' }}> {/* Adjusted width */}
                                    {format(new Date(row.date), 'dd-MM-yyyy')}
                                </td>

                                <td className="table-cell centered-cell" style={{ width: '5%' }}> {/* Adjusted width */}
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: 'var(--success)' }}
                                        onClick={() => handleEditButtonClick(row.id)}
                                        size="small"
                                    >
                                        Edit
                                    </Button>
                                </td>
                                <td className="table-cell centered-cell" style={{ width: '5%' }}> {/* Adjusted width */}
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