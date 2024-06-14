import React, {useContext} from 'react'
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import { IconButton } from '@mui/material';
import MonitorIcon from '@mui/icons-material/Monitor';
import Switch from '@mui/material/Switch';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import "./Sidebar.css"
import { Link } from 'react-router-dom';
import { AppContext } from '../../../App';



export default function Sidebar() {


    // Getting the data from useContext
    const {data, setData, darkMode, setDarkMode} = useContext(AppContext)


    const toggleDarkMode = () => {
        setDarkMode(darkMode === 'dark' ? 'light' : 'dark');
      };

      const handleChange = (event) => {
      setData(event.target.value);
      };
    


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
