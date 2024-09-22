import Axios from 'axios';

// Function to fetch both domain and URL data
export const fetchEndpointData = async () => {
  try {
    const response = await Axios.get('/api/v1/endpoints');
    console.log('Response:', response.data);
    return response.data.directories;
  } catch (error) {
    console.error('Error fetching endpoint data:', error);
    throw error;
  }
};

// Function to format the domain data
export const formatDomainData = (data) => {
  return data.map((domain) => ({
    domain: domain.domain,
    latestUrlsFile: domain.latestUrlsFile || null,
    urls: domain.urls,
  }));
};
