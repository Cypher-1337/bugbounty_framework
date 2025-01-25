// Sidebar.jsx
import React, { useContext, useState, useRef, useEffect } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MonitorIcon from '@mui/icons-material/Monitor';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../../App';
import { AuthContext } from '../../../auth';
import './Sidebar.css';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'; // Import the dropdown icon

export default function Sidebar() {
    const { data, setData, selectedView, setSelectedView } = useContext(AppContext);
    const { isAuth, loading, authData } = useContext(AuthContext);
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleViewChange = (event) => {
        setSelectedView(event.target.value);
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

    if (loading) {
        return <div className='sidebar-loading'>Loading...</div>;
    }

    return (
        isAuth && (
            <nav className={`sidebar dark`}>
                <div className="sidebar-content">
                    <ul className="navigation-items">
                        <li className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                            <Link to="/dashboard" className="nav-link">
                                <DashboardOutlinedIcon className="nav-icon" />
                                Dashboard
                            </Link>
                        </li>

                        <li className={`nav-item ${location.pathname === '/monitor' ? 'active' : ''}`}>
                            <Link to="/monitor" className="nav-link">
                                <MonitorIcon className="nav-icon" />
                                Monitor
                            </Link>
                        </li>
                    </ul>
                </div>
                {location.pathname === '/dashboard' && (
                    <div className="sidebar-bottom">
                        <div className="custom-select">
                            <select
                                id="view-select"
                                className="select"
                                value={selectedView}
                                onChange={handleViewChange}
                            >
                                <option value="alive">Alive</option>
                                <option value="domains">Domains</option>
                                <option value="subdomains">Subdomains</option>
                            </select>
                            <div className="select-arrow">
                                <ArrowDropDownIcon />
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        )
    );
}