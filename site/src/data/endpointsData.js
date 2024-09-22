import Axios from 'axios';

// Function to fetch both domain and URL data
export const fetchEndpointData = async () => {
  try {
    const response = await Axios.get('/api/v1/endpoints'); // Removed responseType
    console.log('Response:', response.data); // Log the raw response data

    // Directly use response.data
    return response.data.directories; // Access directories directly from the response
  } catch (error) {
    console.error('Error fetching endpoint data:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

// Function to format the domain data
export const formatDomainData = (data) => {
  return data.map((domain) => ({
    domain: domain.domain,
    latestUrlsFile: domain.latestUrlsFile || null, // Include latestUrlsFile if available
    urls: domain.urls, // Array of URLs from the latest file
  }));
};
