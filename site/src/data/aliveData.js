import Axios from 'axios';

export const fetchAliveData = async (id) => {
  try {
    // Append the inputFilter to the API URL if it has a value
    const url = `/api/v1/alive/${encodeURIComponent(id)}`

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
    tech: alive.tech,
    waf: alive.waf,
    comment: alive.comment,
    date: alive.date,
    scanned: alive.scanned
    // Add more fields as needed
  }));
};
