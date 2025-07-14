import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createElection } from '../../services/apiService';

const CreateElectionPage = ({ setActiveView, showMessage, user }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user || user.role !== 'admin') {
    showMessage('Access denied. Only admins can create elections.', 'error');
    setActiveView('adminLogin');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const electionData = { title, description, startDate, endDate };
      const response = await createElection(electionData);
      showMessage(response.message, 'success');
      setActiveView('manageElections');
    } catch (error) {
      console.error('Create election error:', error);
      showMessage(error.data?.error || error.message || 'Failed to create election.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
      <h2 className="text-5xl font-bold mb-6 text-green-400">Create New Election</h2>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
        Define the parameters for a new voting election.
      </p>

      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-300 text-sm font-bold mb-2">
            Election Title:
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            placeholder="e.g., Presidential Election 2025"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-300 text-sm font-bold mb-2">
            Description:
          </label>
          <textarea
            id="description"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            placeholder="A brief description of the election."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={isLoading}
            rows="3"
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-300 text-sm font-bold mb-2">
            Start Date & Time:
          </label>
          <input
            type="datetime-local"
            id="startDate"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="endDate" className="block text-gray-300 text-sm font-bold mb-2">
            End Date & Time:
          </label>
          <input
            type="datetime-local"
            id="endDate"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-green-700 hover:to-emerald-600 transition-all duration-300 transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Election...' : 'Create Election'}
        </button>
      </form>

      <button
        onClick={() => setActiveView('manageElections')}
        className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
      >
        Back to Manage Elections
      </button>
    </div>
  );
};

CreateElectionPage.propTypes = {
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default CreateElectionPage;