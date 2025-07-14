import React from 'react';
import PropTypes from 'prop-types';

const AdminDashboardPage = ({ user, setActiveView, showMessage, disconnectWallet, setUser }) => {
  if (!user || user.role !== 'admin') {
    showMessage('Access denied. Please login as an admin.', 'error');
    setActiveView('adminLogin');
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
    disconnectWallet();
    showMessage('Logged out successfully.', 'info');
    setActiveView('landing');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
      <h2 className="text-5xl font-bold mb-6 text-orange-400">Admin Dashboard</h2>
      <p className="text-lg text-gray-300 mb-8">Welcome, {user.email}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <button
          onClick={() => setActiveView('manageElections')}
          className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
        >
          Manage Elections
        </button>
        <button
          onClick={() => setActiveView('adminRegisterVoter')}
          className="px-6 py-4 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-bold rounded-xl shadow-lg hover:from-teal-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
        >
          Register Voters
        </button>
        <button
          onClick={() => setActiveView('managePartyMembers')} // NEW: Link to manage party members
          className="px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-500 text-white font-bold rounded-xl shadow-lg hover:from-yellow-700 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
        >
          Manage Parties & Members
        </button>
        <button
          onClick={() => showMessage('Candidate management coming soon!', 'info')} // This button will now be less critical
          className="px-6 py-4 bg-gradient-to-r from-green-600 to-lime-500 text-white font-bold rounded-xl shadow-lg hover:from-green-700 hover:to-lime-600 transition-all duration-300 transform hover:scale-105"
        >
          Manage Candidates (via Posts)
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

AdminDashboardPage.propTypes = {
  user: PropTypes.object,
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  disconnectWallet: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
};

export default AdminDashboardPage;