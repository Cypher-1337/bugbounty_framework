import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../auth';
import { Helmet } from 'react-helmet';
import "./register.css"


function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('')

    const { isAuth } = useContext(AuthContext);


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
            const response = await fetch('/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.status === 409) {
                setShowToast(true)
                setToastMessage("username or Email already registered")
                setToastType("error")
                return;
            }

            if (response.ok) {
                const data = await response.json();
                
                // Send a Discord notification
                const discordWebhookUrl = 'https://discord.com/api/webhooks/1273648238024589372/fu-EqjZ-dz1lG7bszIbcsDZC_4hnNYr0Cwz3lVMg53QA9MnWsLbpvxHmOaYYwhp6vxXq';
                const discordMessage = {
                    content: `New user registered: ${data.username} (${data.email})`,
                };

                fetch(discordWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(discordMessage),
                }).catch((error) => console.error('Error sending Discord notification:', error));


                setToastMessage("User "+ data.user + " successfully.");
                setShowToast(true);
                
                    // Redirect user to the dashboard

                navigate('/login', { 
                    replace: true, 
                    state: { 
                        showToast: true, 
                        toastMessage: "User registered successfully."
                    } 
                });

            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error('Error during login:', error);
        } finally {
            setLoading(false);
        }
    };

    if (isAuth){
        navigate('/login', {replace: true});
    }
    
    return (
        <div className='register_div'>
            <Helmet>
                <title>Register</title>
            </Helmet>
            <form className='register_form' onSubmit={handleSubmit}>
                <div className='username input_div'>
                    <label>Username: </label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className='email input_div'>
                    <label className='email_label'>Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='password input_div'>
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <input
                    type="submit"
                    className='register_submit'
                    value={loading ? "Register New User" : "register"}
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

export default Register;
