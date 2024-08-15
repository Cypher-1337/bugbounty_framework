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
        const [toastType, setToastType] = useState('')
        const { isAuth, setAuthData, updateAuthStatus } = useContext(AuthContext);
        const location = useLocation();


        useEffect(() => {
            // Check if there's a toast message passed in state
            if (location.state?.showToast) {
                setToastMessage(location.state.toastMessage);
                setToastType('success'); // Set the toast type to success
                setShowToast(true);

                // Remove the toast after a delay
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
                    setToastMessage(responseData.Message)
                    setToastType('error'); // Set the toast type to error
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                    return;
                }

                if (response.ok) {

                    
                    navigate('/dashboard', { replace: true });
                    
                    setAuthData(responseData)
                    await updateAuthStatus()
                    setToastMessage("Logged in ")
                    setShowToast(true);

                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                console.error('Error during login:', error);
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
            <div className='login_div'>
                <Helmet>
                    <title>Login</title>
                </Helmet>
                <form className='login_form' onSubmit={handleSubmit}>
                    <div className='username input_div'>
                        <label>Username: </label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div className='password input_div'>
                        <label>Password: </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <input
                        type="submit"
                        className='login_submit'
                        value={loading ? "Logging in..." : "Login"}
                        disabled={loading}
                    />
                </form>

                {showToast && (
                    <div className={`toast ${toastType}`}>
                        <p>{toastMessage}</p>
                    </div>
                )}
            </div>
        );
    }

    export default Login;
