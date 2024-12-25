import React, { useContext, useState, useRef, useEffect } from 'react';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import MonitorIcon from '@mui/icons-material/Monitor';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../../App';
import { AuthContext } from '../../../auth';
import './Sidebar.css';
import InsertDriveFileOutlinedIcon from '@mui/icons-material/InsertDriveFileOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

export default function Sidebar() {
    const { data, setData } = useContext(AppContext);
    const { isAuth, loading, authData } = useContext(AuthContext);
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleDataChange = (value) => {
        setData(value);
        setIsDropdownOpen(false); // Close dropdown after selection
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
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

    // Conditionally render the sidebar content based on authentication
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

                      
                        <li className={`nav-item ${location.pathname === '/fuzz' ? 'active' : ''}`}>
                            <Link to="/fuzz" className="nav-link">
                                <AssessmentOutlinedIcon className="nav-icon" />
                                Fuzz
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
            </nav>
        )
    );
}