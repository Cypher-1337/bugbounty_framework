import Axios from 'axios';

// Function to fetch both domain and URL data
export const fetchEndpointData = async () => {
  try {
    const response = await Axios.get('/api/v1/endpoints'); // Adjust the URL as needed
    return response.data.directories; // Return the fetched data
  } catch (error) {
    console.error('Error fetching endpoint data:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

// No changes needed for formatDomainData
export const formatDomainData = (data) => {
  return data.map((domain) => ({
    domain: domain.domain,
    latestNewUrlsFile: domain.latestNewUrlsFile,
    urls: domain.urls, // Array of URLs from the latest file
  }));
};
