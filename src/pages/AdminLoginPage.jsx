import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { adminLogin } from '../services/apiService';

const AdminLoginPage = ({ setActiveView, showMessage, setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await adminLogin(email, password);
            localStorage.setItem('jwtToken', response.token);
            setUser(response.user);
            showMessage('Admin login successful!', 'success');
            setActiveView('adminDashboard');
        } catch (error) {
            console.error('Admin login error:', error);
            showMessage(error.data?.error || error.message || 'Admin login failed.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
            <h2 className="text-5xl font-bold mb-6 text-orange-400">Admin Login</h2>
            <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
                Access the administrative dashboard to manage elections, voters, and candidates.
            </p>

            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="mb-6">
                    <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
                        Email:
                    </label>
                    <input
                        type="email"
                        id="email"
                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                        placeholder="admin@votex.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <div className="mb-6">
                    <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
                        Password:
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-orange-600 to-red-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-orange-700 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading}
                >
                    {isLoading ? 'Logging In...' : 'Login as Admin'}
                </button>
            </form>

            <button
                onClick={() => setActiveView('landing')}
                className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
            >
                Back to Landing
            </button>
        </div>
    );
};

AdminLoginPage.propTypes = {
    setActiveView: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
};

export default AdminLoginPage;