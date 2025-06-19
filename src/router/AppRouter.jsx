import React from 'react';
import PropTypes from 'prop-types';
import LandingPage from '../pages/LandingPage';
import VoterRegistrationPage from '../pages/VoterRegistrationPage';

const AppRouter = ({
  activeView,
  setActiveView,
  isWalletConnected,
  walletAddress,
  message,
  showMessage,
  db, // Pass db and userId to pages that need them
  userId,
  connectWallet // Connect wallet function passed down
}) => {
  switch (activeView) {
    case 'landing':
      return (
        <LandingPage
          onConnectWallet={connectWallet}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          setActiveView={setActiveView}
          message={message}
          showMessage={showMessage}
        />
      );
    case 'voterRegistration':
      return (
        <VoterRegistrationPage
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          setActiveView={setActiveView}
          showMessage={showMessage}
          db={db}
          userId={userId}
        />
      );
    case 'adminLogin':
      // Placeholder for Admin Login Page
      return (
        <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
          <h2 className="text-5xl font-bold mb-6 text-orange-400">Admin Login</h2>
          <p className="text-lg text-gray-300">Admin authentication goes here.</p>
          <button
            onClick={() => setActiveView('landing')}
            className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
          >
            Back to Landing
          </button>
        </div>
      );
    case 'dashboard':
        // Placeholder for Dashboard
        return (
            <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
                <h2 className="text-5xl font-bold mb-6 text-teal-400">Voter Dashboard</h2>
                <p className="text-lg text-gray-300">Welcome! Your voter ID is: {walletAddress}</p>
                <p className="text-md text-gray-400 mt-2">Firebase User ID: {userId}</p>
                <button
                    onClick={() => setActiveView('landing')}
                    className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
                >
                    Back to Landing
                </button>
            </div>
        );
    // I will add other cases for 'votingPage', 'resultsPage', etc.
    default:
      return (
        <LandingPage
          onConnectWallet={connectWallet}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          setActiveView={setActiveView}
          message={message}
          showMessage={showMessage}
        />
      );
  }
};

AppRouter.propTypes = {
  activeView: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
  isWalletConnected: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string.isRequired,
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error', 'info']),
  }).isRequired,
  showMessage: PropTypes.func.isRequired,
  db: PropTypes.object,
  userId: PropTypes.string,
  connectWallet: PropTypes.func.isRequired,
};

export default AppRouter;