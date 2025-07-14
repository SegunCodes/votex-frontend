/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAvailableElectionsVoter } from '../services/apiService';

const VoterDashboardPage = ({ user, isWalletConnected, walletAddress, setActiveView, showMessage, disconnectWallet, setUser }) => {
  const [availableElections, setAvailableElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  if (!user || user.role !== 'voter') {
    showMessage('Access denied. Please login as a voter.', 'error');
    setActiveView('voterLogin');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    disconnectWallet();
    showMessage('Logged out successfully.', 'info');
    setActiveView('landing');
  };

  useEffect(() => {
    const fetchAvailableElections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAvailableElectionsVoter();
        setAvailableElections(response.elections);
      } catch (err) {
        console.error('Failed to fetch available elections:', err);
        setError(err.data?.error || err.message || 'Failed to load available elections.');
        showMessage('Failed to load available elections.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'voter') {
      fetchAvailableElections();
    }
  }, [user, showMessage]);


  const handleGoToVote = (electionId, postId) => {
    // Navigate to the voting page, passing election and post IDs
    setActiveView({ view: 'votingPage', id: electionId, postId: postId });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center p-8">
      <h2 className="text-5xl font-bold mb-6 text-blue-400">Voter Dashboard</h2>
      <p className="text-lg text-gray-300 mb-2">Welcome, {user.name || user.email}!</p>
      <p className="text-md text-gray-400 mb-4">Your Wallet ID: <span className="font-mono break-all">{user.walletAddress}</span></p>
      <p className="text-sm text-gray-500 mb-8">This is your unique Decentralized Identifier (DID).</p>

      <div className="w-full max-w-3xl bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">Available Elections</h3>
        {isLoading ? (
          <p className="text-gray-400">Loading elections...</p>
        ) : error ? (
          <p className="text-red-400">Error: {error}</p>
        ) : availableElections.length === 0 ? (
          <p className="text-gray-400">No active elections available for you to vote in.</p>
        ) : (
          <div className="space-y-4">
            {availableElections.map(election => (
              <div key={election.id} className="bg-gray-700 p-4 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-white mb-2">{election.title}</h4>
                <p className="text-gray-300 text-sm mb-3">{election.description}</p>
                <p className="text-gray-400 text-xs">Voting Period: {new Date(election.start_date).toLocaleString()} - {new Date(election.end_date).toLocaleString()}</p>
                <button
                  onClick={() => handleGoToVote(election.id, 1)} // Assuming post ID 1 for simplicity, or fetch posts here
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                >
                  Go to Ballot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <button
          onClick={() => setActiveView('voteReceipts')}
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
  setUser: PropTypes.func.isRequired,
};

export default VoterDashboardPage;