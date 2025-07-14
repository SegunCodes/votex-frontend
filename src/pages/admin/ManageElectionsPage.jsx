import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getAllElectionsAdmin } from '../../services/apiService';

const ManageElectionsPage = ({ setActiveView, showMessage, user }) => {
  const [elections, setElections] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Ensure only admin can access this page
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      showMessage('Access denied. Only admins can manage elections.', 'error');
      setActiveView('adminLogin');
    }
  }, [user, setActiveView, showMessage]);

  useEffect(() => {
    const fetchElections = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getAllElectionsAdmin();
        setElections(response.elections);
      } catch (err) {
        console.error('Failed to fetch elections:', err);
        setError(err.data?.error || err.message || 'Failed to load elections.');
        showMessage('Failed to load elections.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchElections();
    }
  }, [user, showMessage]);

  const handleViewDetails = (electionId) => {
    setActiveView({ view: 'electionDetails', id: electionId });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center p-8">
      <h2 className="text-5xl font-bold mb-8 text-purple-400">Manage Elections</h2>

      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-semibold text-gray-200">All Elections</h3>
          <button
            onClick={() => setActiveView('createElection')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold rounded-full shadow-lg hover:from-green-600 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105"
          >
            Create New Election
          </button>
        </div>

        {isLoading ? (
          <p className="text-gray-400">Loading elections...</p>
        ) : error ? (
          <p className="text-red-400">Error: {error}</p>
        ) : elections.length === 0 ? (
          <p className="text-gray-400">No elections created yet.</p>
        ) : (
          <div className="space-y-4">
            {elections.map((election) => (
              <div key={election.id} className="bg-gray-700 p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <h4 className="text-xl font-semibold text-white">{election.title}</h4>
                  <p className="text-gray-300 text-sm">{election.description}</p>
                  <p className={`text-sm font-medium ${
                    election.status === 'active' ? 'text-green-400' :
                    election.status === 'pending' ? 'text-yellow-400' :
                    'text-red-400'
                  }`}>Status: {election.status.toUpperCase()}</p>
                </div>
                <button
                  onClick={() => handleViewDetails(election.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-200"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setActiveView('adminDashboard')}
        className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
      >
        Back to Admin Dashboard
      </button>
    </div>
  );
};

ManageElectionsPage.propTypes = {
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default ManageElectionsPage;