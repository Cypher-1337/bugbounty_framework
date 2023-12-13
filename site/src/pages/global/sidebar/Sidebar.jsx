import React, {useContext} from 'react'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { IconButton } from '@mui/material';
import SearchIconOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import "./Sidebar.css"
import { Link } from 'react-router-dom';
import { AppContext } from '../../../App';



export default function Sidebar() {


    // Getting the data from useContext
    const {data, setData, darkMode, setDarkMode, isSidebarCollapsed, setIsSidebarCollapsed} = useContext(AppContext)

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
      };

    const toggleDarkMode = () => {
        setDarkMode(darkMode === 'dark' ? 'light' : 'dark');
      };

      const handleChange = (event) => {
      setData(event.target.value);
      };
    


    

      

  return ( 
    <nav className={`sidebar ${darkMode === 'dark' ? 'dark' : 'light'} ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <header>
            <div className='image-text'>
                <IconButton> 
                    <BugReportOutlinedIcon className='bug-icon' sx={{ fontSize: 40}}  /> 
                </IconButton>

                <div className='text header-text'>
                    <span className='name'>Bug Bounty</span>
                </div>
            </div>
            <div className={isSidebarCollapsed ? 'collapsed-toggle toggle-cover' : 'toggle-cover'}>
                <IconButton onClick={toggleSidebar}>
                    <ArrowForwardIosIcon className='toggle' sx={{ fontSize: 'small' }} />
                </IconButton>
            </div>

        </header>

        <div className='menu-bar'>
            <div className='menu'>
                <ul className='menu-links'>
                    <li className='nav-link'>
                        <Link to="/dashboard" className='link-a'>
                            <DashboardOutlinedIcon className='link-icon' />
                            <span className='text nav-text'>Dashboard</span>
                        </Link>
                        
                    </li>

                    <li className='nav-link'>
                        <Link to="/recon" className='link-a'>
                            <SearchIconOutlinedIcon className='link-icon' />
                            <span className='text nav-text'>Recon</span>
                        </Link>
                        
                    </li>

                    <li className='nav-link'>
                        <Link to="/scanner" className='link-a'>
                            <ConstructionOutlinedIcon className='link-icon' />
                            <span className='text nav-text'>Scanner</span>
                        </Link>
                        
                    </li>




                </ul>
            </div>

            <div className='bottom-content'>
                <li>
                    <FormControl className={darkMode === 'dark' ? 'dark data-form' : 'light data-form'}>
                        <InputLabel id="demo-simple-select-label" sx={{color: 'white'}}>Data</InputLabel>
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
                
                <li className='mode'>

                    <span className='mode-text text'>Dark Mode</span>

                    <div className={darkMode === 'dark' ? 'dark toggle-switch' : 'light toggle-switch'}>
                        <Switch defaultChecked={darkMode === 'dark'}
                            checked={darkMode === 'dark'}
                            onChange={toggleDarkMode}
                            inputProps={{ 'aria-label': 'Toggle dark mode'}}
                            color="warning" 
                        />
                    </div>
                </li>
            </div>
        </div>
    </nav>

    )
}
