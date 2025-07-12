/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';

const VoterDashboardPage = ({ user, isWalletConnected, walletAddress, setActiveView, showMessage, disconnectWallet }) => {
    if (!user || user.role !== 'voter') {
        // Redirect or show error if not authenticated as voter
        showMessage('Access denied. Please login as a voter.', 'error');
        setActiveView('voterLogin');
        return null;
    }

    const handleLogout = () => {
        localStorage.removeItem('jwtToken');
        disconnectWallet();
        showMessage('Logged out successfully.', 'info');
        setActiveView('landing');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
            <h2 className="text-5xl font-bold mb-6 text-blue-400">Voter Dashboard</h2>
            <p className="text-lg text-gray-300 mb-2">Welcome, {user.name || user.email}!</p>
            <p className="text-md text-gray-400 mb-4">Your Wallet ID: <span className="font-mono break-all">{user.walletAddress}</span></p>
            <p className="text-sm text-gray-500 mb-8">This is your unique Decentralized Identifier (DID).</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
                <button
                    onClick={() => showMessage('Feature coming soon!', 'info')}
                    className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                >
                    View Available Elections
                </button>
                <button
                    onClick={() => showMessage('Feature coming soon!', 'info')}
                    className="px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                >
                    View My Vote Receipts
                </button>
                <button
                    onClick={() => setActiveView('publicResults')}
                    className="px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:from-yellow-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
                >
                    View Public Election Results
                </button>
                <button
                    onClick={handleLogout}
                    className="px-6 py-4 bg-gray-600 text-white font-bold rounded-xl shadow-lg hover:bg-gray-700 transition-colors duration-300 transform hover:scale-105"
                >
                    Logout
                </button>
            </div>

            <button
                onClick={() => setActiveView('landing')}
                className="mt-12 px-6 py-3 bg-gray-700 text-white font-semibold rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-300"
            >
                Back to Landing
            </button>
        </div>
    );
};

VoterDashboardPage.propTypes = {
    user: PropTypes.object,
    isWalletConnected: PropTypes.bool.isRequired,
    walletAddress: PropTypes.string.isRequired,
    setActiveView: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    disconnectWallet: PropTypes.func.isRequired,
};

export default VoterDashboardPage;