import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { requestVoterAuthMessage, voterAuthenticate } from '../services/apiService'; // Import API service

const VoterLoginPage = ({ isWalletConnected, walletAddress, connectWallet, setActiveView, showMessage, setUser }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [authMessage, setAuthMessage] = useState(''); // Message to be signed

    // Effect to ensure wallet is connected if not already
    useEffect(() => {
        if (!isWalletConnected) {
            showMessage('Please connect your MetaMask wallet to proceed with voter login.', 'info');
        }
    }, [isWalletConnected, showMessage]);

    const handleRequestMessage = async (e) => {
        e.preventDefault();
        if (!isWalletConnected) {
            showMessage('Please connect your MetaMask wallet first.', 'error');
            return;
        }
        if (!email.trim()) {
            showMessage('Please enter your registered email.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const response = await requestVoterAuthMessage(email);
            setAuthMessage(response.messageToSign);
            showMessage('Please sign the message with your MetaMask wallet.', 'info');
        } catch (error) {
            console.error('Request auth message error:', error);
            showMessage(error.data?.error || error.message || 'Failed to request authentication message.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignAndAuthenticate = async () => {
        if (!authMessage || !walletAddress) {
            showMessage('Authentication message or wallet not ready.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            // Request signature from MetaMask
            const signature = await window.ethereum.request({
                method: 'personal_sign',
                params: [authMessage, walletAddress],
            });

            // Send signature to backend for verification and JWT issuance
            const response = await voterAuthenticate(authMessage, signature, walletAddress, email);
            localStorage.setItem('jwtToken', response.token);
            setUser(response.user);
            showMessage('Voter login successful!', 'success');
            setActiveView('voterDashboard'); // Navigate to voter dashboard
        } catch (error) {
            console.error('Sign and authenticate error:', error);
            showMessage(error.data?.error || error.message || 'Voter authentication failed. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
            <h2 className="text-5xl font-bold mb-6 text-blue-400">Voter Login</h2>
            <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
                Authenticate using your registered email and MetaMask wallet.
            </p>

            {!isWalletConnected ? (
                <button
                    onClick={connectWallet}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold rounded-full shadow-lg hover:from-green-600 hover:to-emerald-500 transition-all duration-300 mb-8"
                    disabled={isLoading}
                >
                    Connect MetaMask Wallet
                </button>
            ) : (
                <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-8 w-full max-w-md text-center">
                    <p className="text-green-400 text-md">
                        Wallet Connected: <span className="font-mono text-sm break-all">{walletAddress}</span>
                    </p>
                </div>
            )}

            {isWalletConnected && (
                <form onSubmit={handleRequestMessage} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mb-6">
                    <div className="mb-6">
                        <label htmlFor="voterEmail" className="block text-gray-300 text-sm font-bold mb-2">
                            Registered Email:
                        </label>
                        <input
                            type="email"
                            id="voterEmail"
                            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
                            placeholder="your.email@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading || authMessage !== ''} // Disable if message requested
                        />
                    </div>
                    {!authMessage ? (
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                            disabled={isLoading || !isWalletConnected}
                        >
                            {isLoading ? 'Requesting Message...' : 'Request Auth Message'}
                        </button>
                    ) : (
                        <div className="text-center">
                            <p className="text-gray-300 mb-4">Message to sign:</p>
                            <textarea
                                className="w-full p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 mb-4 text-sm"
                                rows="3"
                                readOnly
                                value={authMessage}
                            ></textarea>
                            <button
                                type="button"
                                onClick={handleSignAndAuthenticate}
                                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing...' : 'Sign & Authenticate'}
                            </button>
                        </div>
                    )}
                </form>
            )}

            <button
                onClick={() => setActiveView('landing')}
                className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
            >
                Back to Landing
            </button>
        </div>
    );
};

VoterLoginPage.propTypes = {
    isWalletConnected: PropTypes.bool.isRequired,
    walletAddress: PropTypes.string.isRequired,
    connectWallet: PropTypes.func.isRequired,
    setActiveView: PropTypes.func.isRequired,
    showMessage: PropTypes.func.isRequired,
    setUser: PropTypes.func.isRequired,
};

export default VoterLoginPage;