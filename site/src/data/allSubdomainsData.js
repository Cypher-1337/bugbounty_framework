// domainUtils.js
import Axios from 'axios';

export const fetchSubdomainsData = async (inputFilter) => {
  try {
    const url = inputFilter
    ? `/api/v1/subdomains?filter=${encodeURIComponent(inputFilter)}`
    : '/api/v1/subdomains';

    const response = await Axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const formatSubdomainsData = (data) => {
  return data.map((subdomains) => ({
    id: subdomains.id,
    subdomain: subdomains.subdomain,
    date: subdomains.date
    // Add more fields as needed
  }));
};

