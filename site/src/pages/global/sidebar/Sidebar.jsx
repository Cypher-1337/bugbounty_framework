import React, { useContext } from 'react';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { IconButton } from '@mui/material';
import MonitorIcon from '@mui/icons-material/Monitor';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import UpdateIcon from '@mui/icons-material/Update';
import LinkIcon from '@mui/icons-material/Link';
import SettingsIcon from '@mui/icons-material/Settings';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import GoogleIcon from '@mui/icons-material/Google';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../../../App';
import { AuthContext } from '../../../auth';
import './Sidebar.css';

export default function Sidebar() {
    // Getting the data from useContext
    const { data, setData } = useContext(AppContext);
    const { isAuth, loading, authData } = useContext(AuthContext);
    
    // Use location to determine the current pathname
    const location = useLocation();

    const handleChange = (event) => {
        setData(event.target.value);
    };

    if (loading) {
        return <div className='sidebar-loading'>Loading...</div>; // Placeholder while loading auth state
    }

    return (
        <nav className="sidebar dark">
            <header>
                <div className='image-text'>
                    <IconButton>
                        <BugReportOutlinedIcon className='bug-icon' sx={{ fontSize: 40 }} />
                    </IconButton>
                </div>
            </header>

            <div className='menu-bar'>
                <div className='menu'>
                    <ul className='menu-links'>
                        {isAuth ? (
                            <>
                                <li className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                                    <Link to="/dashboard" className='link-a'>
                                        <DashboardOutlinedIcon className='link-icon' />
                                    </Link>
                                </li>
                                {authData.role === "admin" && (
                                    <>
                                        <li className={`nav-link ${location.pathname === '/endpoints' ? 'active' : ''}`}>
                                            <Link to="/endpoints" className='link-a'>
                                                <LinkIcon className='link-icon' />
                                            </Link>
                                        </li>

                                        <li className={`nav-link ${location.pathname === '/changes' ? 'active' : ''}`}>
                                            <Link to="/changes" className='link-a'>
                                                <UpdateIcon className='link-icon' />
                                            </Link>
                                        </li>

                                        <li className={`nav-link ${location.pathname === '/monitor' ? 'active' : ''}`}>
                                            <Link to="/monitor" className='link-a'>
                                                <MonitorIcon className='link-icon' />
                                            </Link>
                                        </li>

                                        <li className={`nav-link ${location.pathname === '/dorking' ? 'active' : ''}`}>
                                            <Link to="/dorking" className='link-a'>
                                                <GoogleIcon className='link-icon' />
                                            </Link>
                                        </li>
                                    </>
                                )}
                            </>
                        ) : (
                            <>
                                <li className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}>
                                    <Link to="/login" className='link-a'>
                                        <AccountCircleIcon className='link-icon' />
                                    </Link>
                                </li>
                                {isAuth && authData.role === 'admin' && (
                                    <li className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}>
                                        <Link to="/register" className='link-a'>
                                            <PersonAddIcon className='link-icon' />
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>
                </div>

                    {isAuth && authData.role === 'admin' && (
                        <div className='bottom-content'>
                            <li className={`nav-link ${location.pathname === '/filter_subdomains' ? 'active' : ''}`}>
                                <Link to="/filter_subdomains" className='link-a'>
                                    <SettingsIcon className='link-icon' />
                                </Link>
                            </li>
                            <li>
                                <FormControl className="dark">
                                    <Select
                                        labelId="grap data"
                                        id="data-grap"
                                        value={data}
                                        onChange={handleChange}
                                        className="dark data-form"
                                        color='warning'
                                    >
                                        <MenuItem value='alive' selected>Alive</MenuItem>
                                        <MenuItem value='domains'>Domains</MenuItem>
                                        <MenuItem value='subdomains'>Subdomains</MenuItem>
                                    </Select>
                                </FormControl>
                            </li>
                        </div>
                    )}
            </div>
        </nav>
    );
}
