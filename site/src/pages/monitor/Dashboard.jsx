import React from 'react'
import { fetchMonitorData, formatMonitorData } from '../../data/monitorData';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Modal } from '@mui/material';
import { useQuery } from 'react-query';
import DeleteModal from '../../modal/monitor/DelModal';
import EditModal from '../../modal/monitor/EditModal';
import { format } from 'date-fns'; // Import the format function

import { useNavigate } from 'react-router-dom';


function Dashboard() {

  const [ monitorId, setMonitorId ] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false); // New state for delete modal

  const navigate = useNavigate();

  const handleEditButtonClick = (id) => {
    setMonitorId(id);
    setModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setMonitorId(null); // Reset selectedId when the modal is closed
    setModalOpen(false);
  };

  const handleDelButtonClick = (id) => {
    setMonitorId(id);
    setDeleteModalOpen(true); // Open delete modal
  }
  const handleCloseDeleteModal = () => {
    setMonitorId(null);
    setDeleteModalOpen(false); // Close delete modal
  };

  // Fetch data based on inputFilter using useQuery
  const { data, isLoading, isError } = useQuery(['subdomainsData'], () =>
  fetchMonitorData()
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
      field: 'count',
      headerName: 'Count',
      width: 80,
      type: 'number',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      cellClassName: 'custom-cell', // Add this line
      cellClassName: (params) => `custom-cell ${params.value > 0 ? 'green' : 'red'}`, // Add this line
  
    },
    {
        field: 'url',
        headerName: 'Url',
        width: 600,
        type: 'string',
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        cellClassName: 'custom-cell', // Add this line
        renderCell: (params) => (
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
            <a style={{ textDecoration: 'none', color: 'white' }} href={params.value} target="_blank" rel="noopener noreferrer">
              {params.value}
            </a>
            <Button
              variant="outlined"
              color="warning"  // You can customize the color as needed
              onClick={() => handleDisplayClick(params.row.url)}
              style={{ marginLeft: 'auto' }}
            >
              Display
            </Button>
          </div>
        ),

    },{
      field: 'monitor',
      headerName: 'Monitor',
      width: 150,
      type: 'number',
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
        width: 350,
        cellClassName: 'custom-cell', // Add this line
        valueFormatter: (params) => format(new Date(params.value), 'dd/MM/yy, HH:mm a'), // Format the date

    },
    {
      field: 'edit', // You can customize this field name
      headerName: 'Edit',
      width: 90,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Button
        variant="contained"
        color="success"
        onClick={() => handleEditButtonClick(params.row.id)}
      >
        Edit
      </Button>
      ),
    },
    {
      field: 'delete', // You can customize this field name
      headerName: 'Delete',
      width: 90,
      headerClassName: 'super-app-theme--header',
      renderCell: (p) => (
        <Button
        variant="contained"
        color="error"
        onClick={() => handleDelButtonClick(p.row.id)}
      >
        Del
      </Button>
      ),
    },
  ];

    

  const formattedAlive = formatMonitorData(data);
  

  const handleDisplayClick = (url) =>{
    navigate(`/monitor/display?url=${encodeURIComponent(url)}`);
  }


  const gridStyles = {
    '& .super-app-theme--header': {
      backgroundColor: '#3A3B3C',
      color: 'white',
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: '#4D4D4D',
      },
      backgroundColor: 'black',
      border: '1px solid green',
      display: 'flex',  // Add this line
      justifyContent: 'center',  // Add this line
      alignItems: 'center',  // Add this line
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
    '.green': {
      color: 'lightgreen', // Add this line
    },
    '.red': {
      color: 'red', // Add this line
    },
    fontSize: '20px',
    color: 'white'
    //... other styles
  };

  return (
    <div className='table-content'>
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
              ...gridStyles
          }}
        />


        <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>

        <DeleteModal
          monitorId={monitorId}
          onClose={handleCloseDeleteModal}
        />
        </Modal>
        

        <Modal open={modalOpen} onClose={handleCloseEditModal}>
          <EditModal monitorId={monitorId} onClose={handleCloseEditModal}/>
        </Modal>

      </div>
  )
}

export default Dashboard