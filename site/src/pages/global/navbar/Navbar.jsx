import React, { useState, useEffect } from 'react'
import './navbar.css'
import NotificationsIcon from '@mui/icons-material/Notifications';
import BugReportIcon from '@mui/icons-material/BugReport';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { IconButton } from '@mui/material';
import Axios from 'axios';


function Navbar() {

  const[ openNotifications, setOpenNotifications] = useState(false)

  const [notifications, setNotifications] = useState([]);


  // Your API endpoint for fetching notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/v1/notifications');
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {

    // Call the function to fetch notifications
    fetchNotifications();

     // Set up an interval to fetch notifications every 5 seconds
     const intervalId = setInterval(fetchNotifications, 5000);

     // Clean up the interval when the component unmounts
     return () => clearInterval(intervalId);
  }, []);
 

  const handleDelete = async (notificationId) => {
    try {

      const url = `/api/v1/notifications?id=${notificationId}`;
      await Axios.delete(url);

      fetchNotifications();

        
    }catch (error) {

        console.error('Error Deleteing data:', error);
    }

}
  return (
    <div className='navbar'>
      <h2>Framework</h2>

      <div className='icons'>
        
        <div className='icon' onClick={() => setOpenNotifications(!openNotifications)}>
          <IconButton>
            <NotificationsIcon color='primary' sx={{fontSize: '32px'}} />
          </IconButton>
          <div className='counter'>{notifications.length}</div>
        </div>

        <div className='icon'>
          <IconButton>
            <BugReportIcon color='error' sx={{fontSize: '32px'}} />
          </IconButton>
          <div className='counter'>{notifications.length}</div>

          
        </div>

      </div>

      {openNotifications && (
        <div className='notifications'>
          {notifications.map((notification, index) => (
            <span className='notification' key={index}>
              <span className='notification-content'>{notification.message}</span>
              <IconButton>
                <DoneAllIcon color='primary' onClick={() => handleDelete(notification.id)}/>
              </IconButton>
            </span>
          ))}
        </div>
      )}

    </div>
  )
}

export default Navbar