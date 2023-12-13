// domainUtils.js
import Axios from 'axios';

export const fetchDomainsData = async (id) => {
  try {

    const url = id
    ? `http://127.0.0.1:5000/api/v1/domains?id=${id}`
    : 'http://127.0.0.1:5000/api/v1/domains';

  const response = await Axios.get(url);
  
  return response.data;

  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const formatDomainsData = (data) => {
  return data.map((domain) => ({
    id: domain.id,
    domain: domain.domain,
    monitor: domain.monitor,
    wayback:  domain.wayback,
    date: domain.date
    // Add more fields as needed
  }));
};
