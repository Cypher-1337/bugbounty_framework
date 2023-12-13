import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { fetchDomainsData, formatDomainsData } from '../../data/allDomainsData';
import { useQuery } from 'react-query';
import { Button, Modal } from '@mui/material';
import EditModal from '../../modal/domains/EditModal';
import DeleteModal from '../../modal/domains/DelModal';

export default function DomainsData() {


  const [ domainId, setDomainId ] = React.useState(null)
  const [modalOpen, setModalOpen] = React.useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false); // New state for delete modal


  const handleEditButtonClick = (id) => {
    setDomainId(id);
    setModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setDomainId(null); // Reset selectedId when the modal is closed
    setModalOpen(false);
  };

  const handleDelButtonClick = (id) => {
    setDomainId(id);
    setDeleteModalOpen(true); // Open delete modal
  }

  const handleCloseDeleteModal = () => {
    setDomainId(null);
    setDeleteModalOpen(false); // Close delete modal
  };



  const columns = [
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
  },
  {
      field: 'domain',
      headerName: 'Domain',
      width: 400,
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
  },
  {
      field: 'wayback',
      headerName: 'Wayback',
      type: 'number',
      headerClassName: 'super-app-theme--header',
      width: 150,
  },
  {
      field: 'monitor',
      headerName: 'Monitor',
      type: 'number',
      headerClassName: 'super-app-theme--header',
      width: 150,
  },
  {
      field: 'date',
      headerName: 'Date',
      type: 'Date',
      headerClassName: 'super-app-theme--header',
      width: 250,
      
  }, 
  {
    field: 'edit', // You can customize this field name
    headerName: 'Edit',
    width: 150,
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
    width: 150,
    headerClassName: 'super-app-theme--header',
    renderCell: (p) => (
      <Button
      variant="contained"
      color="error"
      onClick={() => handleDelButtonClick(p.row.id)}
    >
      Delete
    </Button>
    ),
  },
  ];


  // Fetch data based on inputFilter using useQuery
  const { data, isLoading, isError } = useQuery(['domainsData'], () =>
    fetchDomainsData()
  );
  if (isLoading) {return <h2>Loading...</h2>;}
  if (isError) {return <h2>{"internal server error"}</h2>;}

  const formattedDomains = formatDomainsData(data);
  


  return (
    <>
      <DataGrid
        rows={formattedDomains}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 50,
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
          },
          '& .css-levciy-MuiTablePagination-displayedRows':{
            color: 'white',
          },
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          },
          '& .css-v4u5dn-MuiInputBase-root-MuiInput-root': {
            backgroundColor: 'white',
            color: 'black',
            borderRadius: '4px', // Adjust as needed
          },
          '& .css-ptiqhd-MuiSvgIcon-root': {
            color: 'blue',
          },
          fontSize: '20px',
          color: 'white'
        }}
      />

    <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>

      <DeleteModal
        domainId={domainId}
        onClose={handleCloseDeleteModal}
      />
    </Modal>


      <Modal open={modalOpen} onClose={handleCloseEditModal}>
        <EditModal domainId={domainId} onClose={handleCloseEditModal}/>
      </Modal>

    </>
  );
}

