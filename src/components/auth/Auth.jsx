import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DevButton from '../dev-cmp/Button';

// Configure axios defaults
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;
axios.defaults.withCredentials = true;

const Auth = ({ role = 'HR' }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        companyName: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setError(''); // Clear error on input change
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Prepare login data based on role
            const loginData = {
                email: formData.email,
                password: formData.password,
            };

            if (role === 'COMPANY') {
                loginData.role = 'COMPANY';
                loginData.companyName = formData.companyName;
            }

            // Make login request
            let response;

            if(role === 'COMPANY') {
              response = await axios.post('api/register', loginData);

            } else {
              response = await axios.post('api/login', loginData);
            }
            // Handle successful login
            if (response.data.user) {
                
                // Redirect based on role
                if (response.data.user.role === 'COMPANY') {
                    navigate('/meeting');
                } else {
                    navigate('/meeting');
                }
            }
        } catch (error) {
            setError(
                error.response?.data?.message || 
                'An error occurred during login. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 border rounded-4xl w-96 bg-white shadow-lg">
                {error && (
                    <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
                        {error}
                    </div>
                )}
                
                <div className="flex flex-col gap-2 text-left">
                    <label className="text-gray-700">Email:</label>
                    <input 
                        type="email" 
                        name="email"
                        className="border rounded-md p-2" 
                        placeholder="Email"
                        value={formData.email} 
                        onChange={handleChange} 
                        required
                    />
                </div>

                <div className="flex flex-col gap-2 text-left">
                    <label className="text-gray-700">Password:</label>
                    <input 
                        type="password" 
                        name="password"
                        className="border rounded-md p-2" 
                        placeholder="Password"
                        value={formData.password} 
                        onChange={handleChange} 
                        required
                    />
                </div>

                {role === 'COMPANY' && (
                    <div className="flex flex-col gap-2 text-left">
                        <label className="text-gray-700">Company Name:</label>
                        <input 
                            type="text" 
                            placeholder="Company Name"
                            name="companyName" 
                            className="border rounded-md p-2" 
                            value={formData.companyName} 
                            onChange={handleChange} 
                            required
                        />
                    </div>
                )}

                {role === 'HR' ? (
                    <a href="/register" className="text-blue-400 hover:text-blue-600 text-center">
                        Register the company
                    </a>
                ) : (
                    <a href="/login" className="text-blue-400 hover:text-blue-600 text-center">
                        Login to Company
                    </a>
                )}
                
                <DevButton 
                    type="submit" 
                    disabled={loading}
                    className={`${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Logging in...' : 'Login'}
                </DevButton>
            </form>
        </div>
    );
};

export default Auth;