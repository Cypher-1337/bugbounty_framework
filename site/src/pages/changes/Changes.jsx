import "./dashboard.css"
import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchAliveData, formatAliveData } from '../../data/changesData';
import { useQuery } from 'react-query';
import { Button, Modal } from '@mui/material';
import EditModal from '../../modal/alive/EditModal';
import DeleteModal from '../../modal/alive/DelModal';
import Axios from 'axios';
import { Helmet } from 'react-helmet';



export default function ChangesData() {
  
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




const  handleScannedButtonClick = async (id ,scannedValue) => {
  const oppositeValue = scannedValue === 'true' ? 'false' : 'true';
  const url = "/api/v1/alive/"+id;
  const requestBody = {
    scanned: oppositeValue
  };

  try {
    const response = await Axios.patch(url, requestBody);
    console(`${response.data}`);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }  
};

  // Fetch data based on inputFilter using useQuery
  const { data, isLoading, isError } = useQuery(['aliveData'], async () => {
    const response = await fetchAliveData();
    return response;
  });

  const columns = [
  
    
    {
      field: 'alive',
      headerName: 'Alive',
      width: 550,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      renderCell: (params) => {

        const url = new URL(params.value);
        const hostname = url.hostname;
        const redirect = params.row.redirect

        return(
          <div>
            <div style={{ marginTop: redirect ? '18px' : '10px',marginBottom: redirect ? '7px' : '20px', display: 'flex', flexDirection: 'column', width: '100%', display: 'flex',  justifyContent: 'space-between'}}>
              <a style={{ textDecoration: 'none', color: 'white', width: '10px', fontSize:'22px' }} href={params.value} target="_blank" rel="noopener noreferrer">
                {params.value}
              </a>     
              {redirect && ( // Show redirect if it exists
                
                <a style={{ textDecoration: 'none', color: 'orange', marginTop: '3px', width: "10px" }} href={redirect} target="_blank" rel="noopener noreferrer">{redirect}</a>
                
              )}
            </div>

                      
            <div className="links">

              <a href={`https://github.com/search?q=${hostname}&type=code`} target="_blank" rel="noopener noreferrer" className="link">
                <img src="https://github.com/favicon.ico" alt="" className="imageIcon" />
              </a>

              <a href={`https://www.google.com/search?q=site%3A${hostname}`} target="_blank" rel="noopener noreferrer" className="link">
                <img src="https://www.google.com/favicon.ico" alt="" className="imageIcon" />
              </a>

              <a href={`http://web.archive.org/cdx/search/cdx?url=${hostname}/*&output=text&fl=original&collapse=urlkey&from=`} target="_blank" rel="noopener noreferrer" className="link">
                <img src="https://archive.org/favicon.ico" alt="" className="imageIcon" />
              </a>
              
              <a href={`https://www.bing.com/search?q=site%3A${hostname}`} target="_blank" rel="noopener noreferrer" className="link">
                <img src="https://www.bing.com/favicon.ico" alt="" className="imageIcon" />
              </a>

              <a href={`https://www.shodan.io/search?query=hostname%3A%22${hostname}%22`} target="_blank" rel="noopener noreferrer" className="link">
                <img src="https://www.shodan.io/static/img/favicon-60c1b1cd.png" alt="" className="imageIcon" />
              </a>
              
              <a href={`https://search.censys.io/search?resource=hosts&q=${hostname}`} target="_blank" rel="noopener noreferrer" className="link">
                <img src="https://search.censys.io/static/img/favicon-32x32.png" alt="" className="imageIcon" />
              </a>
              

              <a href={`https://en.fofa.info/result?qbase64=${btoa(hostname)}`} target="_blank" rel="noopener noreferrer" className="link">
                <img src="https://en.fofa.info/favicon.ico" alt="" className="imageIcon" />
              </a>

            </div>
        </div>
        )
      },
      cellClassName: 'custom-cell, alive_column',
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
        width: 200,
        cellClassName: 'custom-cell', // Add this line

    },
    {
      field: 'tech',
      headerName: 'Tech',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      width: 250,
      cellClassName: 'custom-cell', // Add this line

    },
    {
      field: 'apps',
      headerName: 'apps',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      width: 150,
      cellClassName: 'custom-cell', // Add this line

    },
    {
      field: 'comment',
      headerName: 'Comment',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      width: 350,
      cellClassName: 'custom-cell', // Add this line

    },
    {
      field: 'ip',
      headerName: 'IP',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      width: 150,
      cellClassName: 'custom-cell', // Add this line

    },
    {
      field: 'cname',
      headerName: 'CName',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      width: 250,
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
      field: 'scanned',
      headerName: 'Scanned',
      type: 'Scanned',
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      width: 150,
      cellClassName: 'custom-cell', // Add this line
      renderCell: (params) => (
        <Button
        variant="outlined"
        color={params.row.scanned === 'true' ? 'success' : 'info'}
        onClick={() => handleScannedButtonClick(params.row.id, params.row.scanned)}
      >
        {params.row.scanned}
      </Button>
      ),

    },
    {
      field: 'edit', // You can customize this field name
      headerName: 'Edit',
      width: 100,
      headerClassName: 'super-app-theme--header',
      renderCell: (params) => (
        <Button
        variant="contained"
        color="secondary"
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
    const scannedValue = p.row.scanned;
    
    if (scannedValue === 'true') {
      return 'black-background';
    } else {
      if (statusValue === 200 || statusValue === 204) {
        return 'green-background';
      } else if (statusValue >= 300 && statusValue < 400) {
        return 'blue-background';
      } else if (statusValue >= 400) {
        return 'red-background';
      }
    }
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

    <div className='dashboard'>

        <div className='table-content'>
        <Helmet>
            <title>Changes</title>
        </Helmet>
        

        <DataGrid
            rows={formattedAlive}
            columns={columns}
            getRowId={getRowId}
            getRowClassName={getRowClassName}
            sortModel={[{ field: 'date', sort: 'desc' }]} // Add this line
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
            '& .MuiDataGrid-row:hover': {
                backgroundColor: "#636363",
            },
            '& .MuiDataGrid-row': {
                
                minHeight: "125px !important" ,
            },
            '& .green-background': {
                backgroundColor: '#1e481f',  /* 70% opacity */
                color: 'white',
            },
            '& .red-background': {
                backgroundColor: '#591410',  /* 70% opacity */
                color: 'white',
            },
            '& .blue-background': {
                backgroundColor: '#0c3659',  /* 70% opacity */
                color: 'white',
            },
            '& .black-background': {
                backgroundColor: '#000',
                color: 'white',
            },'& .MuiDataGrid-cellContent': {
                margin: '0 auto',
            },
            '& .custom-cell': {
                fontSize: '18px',
            },
            '& .alive_column': {
                // minHeight: "100% !important",

            },
            '& .MuiDataGrid-cell':{
                minHeight: "125px !important",
                
            },
            '& .css-v4u5dn-MuiInputBase-root-MuiInput-root': {
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '4px', // Adjust as needed
            },
            '& .css-ptiqhd-MuiSvgIcon-root': {
                color: 'blue',
            },
            '& .MuiButtonBase-root':{
              color: 'white'
            },
            '& .css-levciy-MuiTablePagination-displayedRows':{
                color: 'white',
            },
            '.MuiDataGrid-withBorderColor': {
                border:'0'
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
    </div>
  );
}
