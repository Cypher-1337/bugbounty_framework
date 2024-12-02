import React from 'react'
import { fetchMonitorData, formatMonitorData } from '../../data/monitorData';
import { fetchMonitorNotifications } from '../../data/monitorNotifications';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Button, Modal } from '@mui/material';
import { useQuery } from 'react-query';
import DeleteModal from '../../modal/monitor/DelModal';
import EditModal from '../../modal/monitor/EditModal';
import { format } from 'date-fns'; // Import the format function
import { Helmet } from 'react-helmet';

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

  const { data: notificationsData, isLoading: isLoadingNotifications, isError: isErrorNotifications } = useQuery(
    ['notificationsData'],
    fetchMonitorNotifications,
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
      width: 120,
      type: 'number',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      cellClassName: 'custom-cell', // Add this line
      cellClassName: (params) => {
        if (params.row.hasAi) {
          return 'custom-cell blue';
        }
        return `custom-cell ${params.value > 0 ? 'green' : 'red'}`;
      },
    },
    {
        field: 'url',
        headerName: 'Url',
        width: 916,
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
              style={{ marginLeft: 'auto'}}
            >
              Display
            </Button>
          </div>
        ),
  
},

    
    {
        field: 'date',
        headerName: 'Date',
        type: 'Date',
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        width: 450,
        cellClassName: 'custom-cell', // Add this line
        valueFormatter: (params) => format(new Date(params.value), 'dd-MM-yyyy'), // Format the date

    },
    {
      field: 'edit', // You can customize this field name
      headerName: 'Edit',
      width: 125,
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
      width: 125,
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
  
  if (!isLoadingNotifications && !isErrorNotifications && notificationsData) {
    notificationsData.forEach((notification) => {
      formattedAlive.forEach((row) => {
        if (row.url === notification.base_url) {
          if(notification.ai > 0){
            row.hasAi = true
          }
          row.count += 1;
        }
      });
    });
  }

  const handleDisplayClick = (url) =>{
    navigate(`/monitor/display?url=${encodeURIComponent(url)}`);
  }


  const gridStyles = {
    '& .super-app-theme--header': {
      color: 'white',
    },
    '& .MuiDataGrid-row': {
      '&:hover': {
        backgroundColor: '#4D4D4D',
      },
      display: 'flex',  // Add this line
      justifyContent: 'center',  // Add this line
      alignItems: 'center',  // Add this line
    },
    '& .css-tptqer-MuiDataGrid-root':{
      border: 'none',
    },
    '.blue': {
      color: '#006ef6', // Choose the shade of blue you prefer
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
    '& .MuiDataGrid-cellContent': {
      margin: '0 auto',
    },

    '& .css-ptiqhd-MuiSvgIcon-root': {
      color: 'green',

    },
    '& .css-levciy-MuiTablePagination-displayedRows':{
      color: 'white',
    },
    '& .MuiButtonBase-root':{
      color: 'white'
    },
    '.MuiDataGrid-withBorderColor': {
      borderColor: "var(--border-color)",
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
    color: 'white',
    border: 'none',

    //... other styles
  };

  return (
    <div className='table-content'>
      <Helmet>
          <title>Monitor</title>
      </Helmet>
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
          slots={{ toolbar: GridToolbar}}

          slotProps={{
            toolbar: {
              showQuickFilter: true,
            },
          }}
          pageSizeOptions={[5]}
          sortModel={[{ field: 'count', sort: 'desc' }]} // Add this line

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