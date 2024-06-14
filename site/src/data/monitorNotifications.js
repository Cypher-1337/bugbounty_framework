import Axios from 'axios';


export const fetchMonitorNotifications = async () => {
  try {
    // Append the inputFilter to the API URL if it has a value

    const url = '/api/v1/monitor/display/notifications';

    const response = await Axios.get(url);
    
    return response.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


