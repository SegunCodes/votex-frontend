import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getVoterVoteReceipts } from '../../services/apiService';

const VoteReceiptsPage = ({ user, setActiveView, showMessage }) => {
  const [receipts, setReceipts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure user is logged in as voter
  useEffect(() => {
    if (!user || user.role !== 'voter') {
      showMessage('Access denied. Please login as a voter to view receipts.', 'error');
      setActiveView('voterLogin');
    }
  }, [user, setActiveView, showMessage]);

  useEffect(() => {
    const fetchReceipts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getVoterVoteReceipts();
        setReceipts(response.receipts);
      } catch (err) {
        console.error('Failed to fetch vote receipts:', err);
        setError(err.data?.error || err.message || 'Failed to load vote receipts.');
        showMessage('Failed to load vote receipts.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'voter') {
      fetchReceipts();
    }
  }, [user, showMessage]);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center p-8">
      <h2 className="text-5xl font-bold mb-8 text-teal-400">My Vote Receipts</h2>

      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        {isLoading ? (
          <p className="text-gray-400">Loading your vote receipts...</p>
        ) : error ? (
          <p className="text-red-400">Error: {error}</p>
        ) : receipts.length === 0 ? (
          <p className="text-gray-400">You have not cast any votes yet.</p>
        ) : (
          <div className="space-y-4">
            {receipts.map((receipt) => (
              <div key={receipt.id} className="bg-gray-700 p-4 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-white mb-2">{receipt.electionTitle}</h4>
                <p className="text-gray-300 text-sm">Post: {receipt.postName}</p>
                <p className="text-gray-300 text-sm">Voted for: <span className="font-bold">{receipt.candidateName}</span></p>
                <p className="text-gray-400 text-xs mt-2 break-all">
                  Transaction Hash: <a href={receipt.blockExplorerUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                    {receipt.transaction_hash}
                  </a>
                </p>
                <p className="text-gray-400 text-xs">Cast On: {new Date(receipt.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setActiveView('voterDashboard')}
        className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

VoteReceiptsPage.propTypes = {
  user: PropTypes.object,
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
};

export default VoteReceiptsPage;