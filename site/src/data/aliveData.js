import Axios from 'axios';

export const fetchAliveData = async (id) => {
  try {
    // Append the inputFilter to the API URL if it has a value
    const url = `http://127.0.0.1:5000/api/v1/alive/${encodeURIComponent(id)}`

    const response = await Axios.get(url);
    
    return response.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


export const formatAliveData = (data) => {
  return data.map((alive) => ({
    id: alive.id,
    alive: alive.alive,
    status: alive.status,
    size:  alive.size,
    title: alive.title,
    date: alive.date
    // Add more fields as needed
  }));
};
