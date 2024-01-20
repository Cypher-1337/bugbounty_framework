import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchSubdomainsData, formatSubdomainsData } from '../../data/allSubdomainsData';
import { useQuery } from 'react-query';
import { AppContext } from '../../App';
import TextField from '@mui/material/TextField';

export default function SubDomainsData() {
        
  
  
  const { inputFilter, setInputFilter } = React.useContext(AppContext);
  const [localInputFilter, setLocalInputFilter] = React.useState(inputFilter);


  const handleChange = (e) => {
    setLocalInputFilter(e.target.value);
  };

  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setInputFilter(localInputFilter);
    }
  };

  // Fetch data based on inputFilter using useQuery
  const { data, isLoading, isError } = useQuery(['subdomainsData', inputFilter], () =>
  fetchSubdomainsData(inputFilter)
  );


  if (isLoading) {
    return <h2>Loading...</h2>;
  }

  if (isError) {
          // Extract relevamnt information from the error object

      return <h2>{"internal server error"}</h2>;
  }

  const columns = [
  {
      field: 'id',
      headerName: 'ID',
      width: 150,
      type: 'number',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      cellClassName: 'custom-cell', // Add this line


  },{
      field: 'subdomain',
      headerName: 'Subdomain',
      width: 600,
      type: 'string',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      cellClassName: 'custom-cell', // Add this line


  },
  {
      field: 'date',
      headerName: 'Date',
      type: 'Date',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      width: 250,
      cellClassName: 'custom-cell', // Add this line

  },
  ];

  
  




  

  const formattedAlive = formatSubdomainsData(data);
  
  return (
    <div className='table-content'>
      <div className='filter-area'>
        <TextField
        sx={{ color: 'white', backgroundColor: '#f5f5f5', borderRadius: '4px', width: '50%px' }}
        value={localInputFilter}
        onChange={handleChange}
        size='small'
        placeholder='Filter...'
        onKeyDown={handleKeyDown} />

        { (inputFilter) &&
        <p style={{color:'white', fontSize: '22px', marginLeft: '80px' }}>
          Searched for: <b>{inputFilter}</b>
        </p>
        }

      </div>
      <DataGrid
        rows={formattedAlive}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[5]}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
        disableRowSelectionOnClick
        sx={{
          '& .super-app-theme--header': {
            backgroundColor: '#3A3B3C',
            color: 'white',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: '#4D4D4D',
            },
            backgroundColor: "black",
            border: '1px solid green',
          },
          '& .css-tptqer-MuiDataGrid-root':{
            border: 'none',
          },
          '& .custom-cell': {
            fontSize: '18px',
            textAlign: 'center',
            width:'100%',
          },
          '& .css-v4u5dn-MuiInputBase-root-MuiInput-root': {
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '4px', // Adjust as needed
          },
          '& .css-ptiqhd-MuiSvgIcon-root': {
            color: 'green',

          },
          '& .css-levciy-MuiTablePagination-displayedRows':{
            color: 'white',
          },
          '.MuiDataGrid-withBorderColor': {
            borderColor: "rgb(255 255 255 / 11%)",
          },
          '.css-1knaqv7-MuiButtonBase-root-MuiButton-root':{
            color: 'white',
          },
          fontSize: '20px',
          color: 'white'
        }}
      />
    </div>
  );
}
