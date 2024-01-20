import Axios from 'axios';
import { formatDistanceToNow } from 'date-fns'; // Import the formatDistanceToNow function


export const fetchMonitorData = async (id) => {
  try {
    // Append the inputFilter to the API URL if it has a value

    const url = id
    ? `/api/v1/monitor?id=${id}`
    : '/api/v1/monitor';

    const response = await Axios.get(url);
    
    return response.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


export const formatMonitorData = (data) => {
  
  return data.map((m) => ({
    id: m.id,
    url: m.url,
    monitor: m.monitor,
    count: m.count,
    date: m.date // Calculate and format the time difference
    // Add more fields as needed
  }));
};
