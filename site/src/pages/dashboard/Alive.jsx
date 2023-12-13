import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchAliveData, formatAliveData } from '../../data/allAliveData';
import { useQuery } from 'react-query';
import { AppContext } from '../../App';
import TextField from '@mui/material/TextField';
import { Button, Modal } from '@mui/material';
import EditModal from '../../modal/alive/EditModal';
import DeleteModal from '../../modal/alive/DelModal';

export default function AliveData() {
  
  
  const { inputFilter, setInputFilter } = React.useContext(AppContext);
  const [localInputFilter, setLocalInputFilter] = React.useState(inputFilter);

  const [ aliveId, setAliveId ] = React.useState(null);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false); // New state for delete modal



// ----------------------- Edit & Delete -------------------------
  const handleEditButtonClick = (id) => {
    setAliveId(id);
    setModalOpen(true);
  };
  const handleCloseEditModal = () => {
    setAliveId(null); // Reset selectedId when the modal is closed
    setModalOpen(false);
  };
  const handleDelButtonClick = (id) => {
    setAliveId(id);
    setDeleteModalOpen(true); // Open delete modal
  }
  const handleCloseDeleteModal = () => {
    setAliveId(null);
    setDeleteModalOpen(false); // Close delete modal
  };
// ---------------------------------------------------------------


//------------------- Filter Input ---------------------
  const handleChange = (e) => {
    setLocalInputFilter(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setInputFilter(localInputFilter);
    }
  };
// ------------------------------------------------------

const handleScanButtonClick = (url) => {
  // Implement the logic for the scan button click
  alert(`Scan button clicked for URL: ${url}`);
};

  // Fetch data based on inputFilter using useQuery
  const { data, isLoading, isError } = useQuery(['aliveData', inputFilter], () =>
    fetchAliveData(inputFilter)
  );


  const columns = [
  
    
    {
      field: 'alive',
      headerName: 'Alive',
      width: 550,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      renderCell: (params) => (
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <a style={{ textDecoration: 'none', color: 'white' }} href={params.value} target="_blank" rel="noopener noreferrer">
            {params.value}
          </a>
          <Button
            variant="outlined"
            color="warning"  // You can customize the color as needed
            onClick={() => handleScanButtonClick(params.row.alive)}
            style={{ marginLeft: 'auto' }}
          >
            Scan
          </Button>
        </div>
      ),
      cellClassName: 'custom-cell',
    },
    {
        field: 'status',
        headerName: 'Status',
        type: 'number',
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        cellClassName: 'custom-cell', // Add this line

    },
    {
        field: 'size',
        headerName: 'Size',
        type: 'number',
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        cellClassName: 'custom-cell', // Add this line


    },
    {
        field: 'title',
        headerName: 'Title',
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        width: 300,
        cellClassName: 'custom-cell', // Add this line

    },
    {
        field: 'date',
        headerName: 'Date',
        type: 'Date',
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        width: 150,
        cellClassName: 'custom-cell', // Add this line

    },
    {
      field: 'edit', // You can customize this field name
      headerName: 'Edit',
      width: 100,
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
    width: 100,
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

  
  const getRowId = (row) => row.id;

  const getRowClassName = (p) => {
    const statusValue = p.row.status;
    if (statusValue === 200 || statusValue === 204) {
        return 'green-background';
    } else if (statusValue >= 300 & statusValue < 400) {
        return 'blue-background';
    } else if (statusValue >= 400) {
        return 'red-background';
    }
    return '';
  };

  
  if (isLoading) {
      return <h2>Loading...</h2>;
  }

  if (isError) {
          // Extract relevamnt information from the error object

      return <h2>{"internal server error"}</h2>;
  }

  const formattedAlive = formatAliveData(data);

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
        getRowId={getRowId}
        getRowClassName={getRowClassName}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 100,
            },
          },
        }}
        pageSizeOptions={[5]}
        slots={{ toolbar: GridToolbar}}
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
          },
          '& .green-background': {
            backgroundColor: '#1B4D3E',
            color: 'white',
          },
          '& .red-background': {
            backgroundColor: '#660000',
            color: 'white',
          },
          '& .blue-background': {
            backgroundColor: '#002244',
            color: 'white',
          },
          '& .custom-cell': {
            fontSize: '18px',
            textAlign: 'center',
          },
          '& .css-v4u5dn-MuiInputBase-root-MuiInput-root': {
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '4px', // Adjust as needed
          },
          '& .css-ptiqhd-MuiSvgIcon-root': {
            color: 'blue',
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

        }}
        style={{
          height: '50%', // Set the height to 50%
          border: 'none', // Set the border color to grey
          fontSize: '20px',

        }}
        />

        <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>

        <DeleteModal
          aliveId={aliveId}
          onClose={handleCloseDeleteModal}
        />
        </Modal>


        <Modal open={modalOpen} onClose={handleCloseEditModal}>
          <EditModal aliveId={aliveId} onClose={handleCloseEditModal}/>
        </Modal>

      </div>
  );
}
