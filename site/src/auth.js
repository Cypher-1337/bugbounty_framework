// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        // Check if there's a valid session cookie or token
        const checkAuth = async () => {
            try {
                const response = await fetch('/api/v1/auth/check', { credentials: 'include' });
                if (response.ok) {
                    const data = await response.json();
                    setAuthData(data);
                    setIsAuth(data.authenticated)
                } else {
                    setAuthData(null);
                    setIsAuth(false);

                }
            } catch (error) {
                console.error('Error checking auth:', error);
                setAuthData(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const updateAuthStatus = async () => {
        try {
            const response = await fetch('/api/v1/auth/check', { credentials: 'include' });
            if (response.ok) {
                const data = await response.json();
                setAuthData(data);
                setIsAuth(data.authenticated);
            } else {
                setAuthData(null);
                setIsAuth(false);
            }
        } catch (error) {
            console.error('Error updating auth status:', error);
        }
    };


    return (
        <AuthContext.Provider value={{ authData, setAuthData, loading, isAuth, updateAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};
