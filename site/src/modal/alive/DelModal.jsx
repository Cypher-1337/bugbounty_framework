import React, { useContext } from 'react';
import { Button } from '@mui/material';
import './modal.css'
import { AppContext } from '../../App';
import Axios from 'axios';

const DeleteModal = ({  aliveId, onClose }) => {

    const { darkMode } = useContext(AppContext);


    const handleDelete = async () => {
        try {



            // Send a POST request to update the data
            const url = `/api/v1/alive/${aliveId}`;
            await Axios.delete(url);

            
            onClose();
        }catch (error) {

            console.error('Error Deleteing data:', error);
        }

    }
    return (
        <div className="dark" >
            <div className='modal-content' style={{width: '25%', height: '30%'}}>
                <div className='titleCloseBtn'>
                    <Button onClick={onClose}>&times;</Button>
                </div>
                <div className='title'>Are you sure you want to delete This Alive URL ?</div>

                <div className='footer'>

                    <Button variant="contained" color="error" onClick={handleDelete}>
                        Delete
                    </Button>
                    <Button variant="contained" color="primary" onClick={onClose}>
                    Cancel
                    </Button>
                </div>
            </div>

        </div>
    );
};

export default DeleteModal;
