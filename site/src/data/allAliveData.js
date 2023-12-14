import Axios from 'axios';

export const fetchAliveData = async (inputFilter) => {
  try {
    // Append the inputFilter to the API URL if it has a value
    const url = inputFilter
      ? `/api/v1/alive?filter=${encodeURIComponent(inputFilter)}`
      : '/api/v1/alive';

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
