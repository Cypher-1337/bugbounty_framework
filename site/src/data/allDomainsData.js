// domainUtils.js
import Axios from 'axios';

export const fetchDomainsData = async (id) => {
  try {

    const url = id
    ? `/api/v1/domains?id=${id}`
    : '/api/v1/domains';

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
