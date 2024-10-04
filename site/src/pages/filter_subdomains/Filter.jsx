import React, { useState } from 'react';

function Filter() {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      color: '#ffffff', // Text color for the dark theme
    },
    input: {
      padding: '10px',
      margin: '10px 0',
      width: '300px',
      borderRadius: '5px',
      border: '1px solid #333',
      backgroundColor: '#1e1e1e',
      color: '#fff',
      fontSize: '16px',
      outline: 'none',
    },
    button: {
      padding: '10px 20px',
      margin: '10px 0',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#6200ea', // Modern purple accent color
      color: '#fff',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#3700b3',
    },
  };

  const [isHovered, setIsHovered] = useState(false);
  const [subdomain, setSubdomain] = useState('');
  const [message, setMessage] = useState('');

  // Function to extract domain from the subdomain
  const extractDomain = (subdomain) => {
    const cleanSubdomain = subdomain.startsWith('.') ? subdomain.slice(1) : subdomain;
    const parts = cleanSubdomain.split('.');
    if (parts.length >= 2) {
      return parts.slice(-2).join('.');
    }
    return '';
  };

  // Function to handle form submission and make the POST request
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract the domain before sending the request
    const extractedDomain = extractDomain(subdomain);

    if (!extractedDomain) {
      setMessage('Invalid subdomain');
      return;
    }

    // Prepare the payload for the POST request
    const data = {
      domain: extractedDomain,
      subdomain: subdomain,
    };

    // Make the POST request
    try {
      const response = await fetch('/api/v1/filter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Send the data as JSON
      });

      const result = await response.json(); // Get the response data
      setMessage(result.message || 'Success'); // Display success message
    } catch (error) {
      console.error('Error:', error);
      setMessage('Error sending request'); // Display error message
    }
  };

  return (
    <div style={styles.container}>
      <h2>Filter</h2>
      <input
        type="text"
        placeholder="subdomain..."
        style={styles.input}
        value={subdomain}
        onChange={(e) => setSubdomain(e.target.value)} // Update state on input change
      />
      <button
        type="submit"
        style={isHovered ? { ...styles.button, ...styles.buttonHover } : styles.button}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleSubmit} // Handle submit on button click
      >
        Submit
      </button>
      {message && (
        <p>{message}</p> // Display the message (success or error)
      )}
    </div>
  );
}

export default Filter;
