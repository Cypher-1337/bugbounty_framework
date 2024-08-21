import React, {useContext} from 'react'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { IconButton } from '@mui/material';
import MonitorIcon from '@mui/icons-material/Monitor';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import "./Sidebar.css"
import { Link } from 'react-router-dom';
import { AppContext } from '../../../App';
import { AuthContext } from '../../../auth';


export default function Sidebar() {


    // Getting the data from useContext
    const {data, setData, darkMode, setDarkMode} = useContext(AppContext)
    const {isAuth, loading} = useContext(AuthContext)

    const toggleDarkMode = () => {  
        setDarkMode(darkMode === 'dark' ? 'light' : 'dark');
      };

    const handleChange = (event) => {
    setData(event.target.value);
    };

    if (loading) {
        return <div className='sidebar-loading'>Loading...</div>; // Placeholder while loading auth state
    }


  return ( 
    <nav className={`sidebar ${darkMode === 'dark' ? 'dark' : 'light'}`}>
        <header>
            <div className='image-text'>
                <IconButton> 
                    <BugReportOutlinedIcon className='bug-icon' sx={{ fontSize: 40}}  /> 
                </IconButton>   
            </div>
        </header>

        <div className='menu-bar'>
            <div className='menu'>
                <ul className='menu-links'>
                    
                {isAuth ? (
                            <>
                                <li className='nav-link'>
                                    <Link to="/dashboard" className='link-a'>
                                        <DashboardOutlinedIcon className='link-icon' />
                                    </Link>
                                </li>
                                <li className='nav-link'>
                                    <Link to="/monitor" className='link-a'>
                                        <MonitorIcon className='link-icon' />
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className='nav-link'>
                                    <Link to="/login" className='link-a'>
                                        <AccountCircleIcon className='link-icon' />
                                    </Link>
                                </li>

                                <li className='nav-link'>
                                    <Link to="/register" className='link-a'>
                                        <PersonAddIcon className='link-icon' />
                                    </Link>
                                </li>
                            </> 
                        )}

                </ul>
            </div>

            <div className='bottom-content'>

          
                {isAuth && (
                    <li>
                        <FormControl className="dark">
                            <Select
                            labelId="grap data"
                            id="data-grap"
                            value={data}
                            onChange={handleChange}
                            className={darkMode === 'dark' ? 'dark data-form' : 'light data-form'}
                            color='warning'
                            >
                                <MenuItem  value='alive' selected>Alive</MenuItem>
                                <MenuItem  value='domains'>Domains</MenuItem>
                                <MenuItem  value='subdomains'>Subdomains</MenuItem>
                            </Select>
                        </FormControl>
                    </li>
                )}

              
            </div>
        </div>
    </nav>

    )
}
