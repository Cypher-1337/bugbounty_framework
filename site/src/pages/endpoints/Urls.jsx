import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import './endpoint.css'

function Urls({ urls }) {

  
  const rows = urls.map((url, index) => ({
    id: index + 1,
    url
  }));

  const columns = [
   
    {
      field: 'url',
      headerName: 'Url',
      width: 1750,
      type: 'string',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      renderCell: (params) => {
        // Check if the URL has parameters
        const hasParams = params.value.includes('?');
        return (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <a 
              style={{ 
                textDecoration: 'none', 
                color: hasParams ? 'yellow' : 'white' // Change color based on presence of parameters
              }} 
              href={params.value} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {params.value}
            </a>
          </div>
        );
      }
    }
  ];

  return (
    <div className="endpoint-content">
      <Helmet>
        <title>Endpoints</title>
      </Helmet>
      <DataGrid
        rows={rows}
        columns={columns}
        slots={{ toolbar: GridToolbar}}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50, // Display 5 rows per page
            },
          },
        }}
        pageSizeOptions={[50]} // Page size options
        sx={{
          '& .MuiDataGrid-withBorderColor':{
            border: '1px solid var(--border-color)'
            
          },
          '& .MuiDataGrid-cell': {
            color: 'white', // Custom text color for cells
            fontSize: '16px',
            border: '1px solid var(--border-color)'
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#1d1d1d', // Dark background for headers
            color: 'white', // White text for headers
            
          },
          '& .MuiButtonBase-root':{
            color: 'white'
          },
          '& .MuiToolbar-root':{
            color: 'white'
          },
          '& .MuiDataGrid-root': {
              backgroundColor: '#333', // Dark background for table
          },
          '& .MuiDataGrid-columnHeaders': {
            display: 'none',
          },
          '& .MuiFormControl-root': {
            background: 'white'
          },
          border: '1px solid var(--border-color)',
          color: 'white'
        }}
      />
    </div>
  );
}

export default Urls;
