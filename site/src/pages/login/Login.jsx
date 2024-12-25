import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "./login.css";
import { AuthContext } from '../../auth';
import { Helmet } from 'react-helmet';

function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('');
    const { isAuth, setAuthData, updateAuthStatus } = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.showToast) {
            setToastMessage(location.state.toastMessage);
            setToastType('success');
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    }, [location.state]);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setShowToast(false);

        try {
            const response = await fetch('/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const responseData = await response.json();

            if (response.status === 401) {
                setToastMessage(responseData.Message);
                setToastType('error');
                setShowToast(true);
                setTimeout(() => setShowToast(false), 3000);
                return;
            }

            if (response.ok) {
                navigate('/dashboard', { replace: true });
                setAuthData(responseData);
                await updateAuthStatus();
                setToastMessage("Logged in successfully!");
                setShowToast(true);
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during login:', error);
            setToastMessage("An error occurred. Please try again.");
            setToastType('error');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isAuth) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuth, navigate]);

    return (
        <div className='login-container'>
            <Helmet>
                <title>Login</title>
            </Helmet>
            <div className='login-card'>
                <h2>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='input-group'>
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className='input-group'>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <button type="submit" className='login-button' disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>

            {showToast && (
                <div className={`toast ${toastType}`}>
                    <p>{toastMessage}</p>
                </div>
            )}
        </div>
    );
}

export default Login;