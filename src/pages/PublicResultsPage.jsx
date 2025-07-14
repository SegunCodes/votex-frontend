import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getElectionResultsPublic, getAllElectionsPublic } from '../services/apiService';

const PublicResultsPage = ({ setActiveView, showMessage }) => {
  const [elections, setElections] = useState([]);
  const [selectedElectionId, setSelectedElectionId] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // For results fetching
  const [isElectionsLoading, setIsElectionsLoading] = useState(true); // For initial elections list
  const [error, setError] = useState(null);
  const [filterGender, setFilterGender] = useState('');
  const [filterAgeRange, setFilterAgeRange] = useState('');

  // Fetch all elections for the dropdown
  useEffect(() => {
    const fetchElections = async () => {
      setIsElectionsLoading(true);
      setError(null);
      try {
        const response = await getAllElectionsPublic(); // Use the new public endpoint
        setElections(response.elections || []);
      } catch (err) {
        console.error('Error fetching elections for dropdown:', err);
        setError(err.data?.error || err.message || 'Failed to load elections for dropdown.');
        showMessage('Failed to load elections for display.', 'error');
      } finally {
        setIsElectionsLoading(false);
      }
    };
    fetchElections();
  }, [showMessage]); // Dependency array includes showMessage

  const handleViewResults = async () => {
    if (!selectedElectionId) {
      showMessage('Please select an election.', 'error');
      return;
    }
    setIsLoading(true);
    setResults(null); // Clear previous results
    try {
      const response = await getElectionResultsPublic(selectedElectionId);
      setResults(response);
      showMessage(response.message, 'success');
    } catch (error) {
      console.error('Error fetching results:', error);
      showMessage(error.data?.error || error.message || 'Failed to fetch election results.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
      <h2 className="text-5xl font-bold mb-6 text-green-400">Public Election Results</h2>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
        View real-time or finalized election results.
      </p>

      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mb-6">
        <div className="mb-4">
          <label htmlFor="electionSelect" className="block text-gray-300 text-sm font-bold mb-2">
            Select Election:
          </label>
          <select
            id="electionSelect"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={selectedElectionId}
            onChange={(e) => setSelectedElectionId(e.target.value)}
            disabled={isElectionsLoading || isLoading}
          >
            <option value="">-- Select an Election --</option>
            {isElectionsLoading ? (
              <option disabled>Loading elections...</option>
            ) : error ? (
              <option disabled>Error loading elections</option>
            ) : (
              elections.map((election) => (
                <option key={election.id} value={election.id}>
                  {election.title} ({election.status})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Filtering Options */}
        <div className="mb-4">
          <label htmlFor="filterGender" className="block text-gray-300 text-sm font-bold mb-2">
            Filter by Gender:
          </label>
          <select
            id="filterGender"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            disabled={isLoading}
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label htmlFor="filterAgeRange" className="block text-gray-300 text-sm font-bold mb-2">
            Filter by Age Range:
          </label>
          <select
            id="filterAgeRange"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={filterAgeRange}
            onChange={(e) => setFilterAgeRange(e.target.value)}
            disabled={isLoading}
          >
            <option value="">All Age Ranges</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-50">36-50</option>
            <option value="51+">51+</option>
          </select>
        </div>

        <button
          onClick={handleViewResults}
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-lime-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-green-700 hover:to-lime-600 transition-all duration-300 transform hover:scale-105"
          disabled={isLoading || !selectedElectionId}
        >
          {isLoading ? 'Loading Results...' : 'View Results'}
        </button>
      </div>

      {results && (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md mt-6">
          <h3 className="text-3xl font-bold mb-4 text-green-300">
            {results.election?.title || 'Election Results'} ({results.isFinal ? 'Final' : 'Real-time'})
          </h3>
          {Object.keys(results.results).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(results.results).map(([candidate, votes]) => (
                <div key={candidate} className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
                  <span className="text-lg font-semibold">{candidate.replace('_votes', '').replace('_', ' ')}</span>
                  <span className="text-xl font-bold text-green-400">{votes} Votes</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No results available yet or election is pending.</p>
          )}
        </div>
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

PublicResultsPage.propTypes = {
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
};

export default PublicResultsPage;