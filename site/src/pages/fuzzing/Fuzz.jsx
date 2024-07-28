import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Paper, Box, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';

function Fuzz() {

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const url = query.get('url');
  
  const [results, setResults] = useState('');
  const [rows, setRows] = useState([]);
  const [columns] = useState([
    {
      field: 'filePath',
      headerName: 'File Path',
      width: 400,
      renderCell: (params) => {
        // Define the base URL here
        const baseURL = url; // Replace with your actual base URL
        // Concatenate base URL with params.value
        const fullURL = new URL(params.value, baseURL).href;

        return (
          <a
            style={{ textDecoration: 'none', color: 'white', width: '100%' }}
            href={fullURL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {fullURL}
          </a>
        );
      },
    },
    {
      field: 'status',
      headerName: 'Status Code',
      width: 150,
      renderCell: (params) => (
        <div style={{ backgroundColor: getRowBackgroundColor(params.value), padding: 16 }}>
          {params.value}
        </div>
      ),
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 150,
    },
  ]);



  useEffect(() => {
    if (url) {
      axios.get(`/api/v1/fuzz/?url=${url}`)
        .then(response => {
          setResults(response.data.fileContent);
          parseResults(response.data.fileContent);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [url]);

  const parseResults = (data) => {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const parsedRows = lines.map(line => {
      const cleanLine = line.replace(/^\r/, '');
      const statusStartIndex = cleanLine.indexOf('[Status:');
      const filePath = cleanLine.substring(0, statusStartIndex).trim();
      const details = cleanLine.substring(statusStartIndex).trim();

      const statusStart = details.indexOf('Status:') + 'Status:'.length;
      const statusEnd = details.indexOf(',', statusStart);
      const status = details.substring(statusStart, statusEnd).trim();

      const sizeStart = details.indexOf('Size:') + 'Size:'.length;
      const sizeEnd = details.indexOf(',', sizeStart);
      const size = details.substring(sizeStart, sizeEnd).trim();

      return {
        id: filePath + details,
        filePath: filePath,
        status: status || 'Unknown',
        size: size || 'Unknown'
      };
    });

    setRows(parsedRows);
  };


  const getRowBackgroundColor = (status) => {
    const statusCode = parseInt(status, 10);
    if (statusCode >= 200 && statusCode < 300) {
      return 'darkgreen'; // 200-299
    } else if (statusCode >= 300 && statusCode < 400) {
      return 'darkblue'; // 300-399
    } else if (statusCode >= 400 && statusCode < 600) {
      return 'darkred'; // 400-599
    }
    return 'transparent'; // Default background color
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', mt: 4, margin: '0px' }}>
      <Helmet>
        <title>{url}</title>
      </Helmet>
      <Box sx={{ display: 'flex', width: '100%' }}>
        <Paper sx={{ flex: 4, p: 3, border: '1px solid var(--primary-color)', backgroundColor: "var(--secondary-color)", color: 'white', overflow: "auto", maxHeight: '93vh' }}>
          <Typography variant="h6">File Content</Typography>
          <div style={{ height: '100%', width: '100%' }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={50}
              components={{ Toolbar: GridToolbar }}
              getRowId={(row) => row.id}
              sortModel={[{ field: 'status', sort: 'asc' }]}
              sx={{ color: 'white' , fontSize: "20px"}}
            />
          </div>
        </Paper>
      </Box>
    </Box>
  );
}

export default Fuzz;
