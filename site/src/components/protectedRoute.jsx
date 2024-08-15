// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../auth';


const ProtectedRoute = ({ children }) => {
    const { authData, loading } = useContext(AuthContext);

    if (loading) {
        // You can show a loading spinner or message here
        return <div>Loading...</div>;
    }

    return authData ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
