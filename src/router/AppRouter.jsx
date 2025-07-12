/* eslint-disable no-unused-vars */

import React from 'react';
import PropTypes from 'prop-types';
import LandingPage from '../pages/LandingPage';
import VoterRegistrationPage from '../pages/VoterRegistrationPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import VoterDashboardPage from '../pages/VoterDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import PublicResultsPage from '../pages/PublicResultsPage';

const AppRouter = ({
  activeView,
  setActiveView,
  isWalletConnected,
  walletAddress,
  message,
  showMessage,
  user, // The authenticated user object (admin or voter)
  setUser, // Function to set user
  connectWallet,
  disconnectWallet // New prop
}) => {
  switch (activeView) {
    case 'landing':
      return (
        <LandingPage
          onConnectWallet={connectWallet}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          setActiveView={setActiveView}
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
        // Note: Voter registration is now admin-driven, this page will be for the admin,
        // or for voter to initiate linking their wallet after admin registration.
        // For now, it's a placeholder for the admin's voter registration form.
        />
      );
    case 'voterLogin': // New route for voters to login via wallet
      return (
        <VoterLoginPage
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          connectWallet={connectWallet}
          setActiveView={setActiveView}
          showMessage={showMessage}
          setUser={setUser}
        />
      );
    case 'adminLogin':
      return (
        <AdminLoginPage
          setActiveView={setActiveView}
          showMessage={showMessage}
          setUser={setUser}
        />
      );
    case 'voterDashboard':
      return (
        <VoterDashboardPage
          user={user}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          setActiveView={setActiveView}
          showMessage={showMessage}
          disconnectWallet={disconnectWallet}
        />
      );
    case 'adminDashboard':
      return (
        <AdminDashboardPage
          user={user}
          setActiveView={setActiveView}
          showMessage={showMessage}
          disconnectWallet={disconnectWallet}
        />
      );
    case 'publicResults':
      return (
        <PublicResultsPage
          setActiveView={setActiveView}
          showMessage={showMessage}
        />
      );
    // Add other cases for 'votingPage', 'resultsPage', etc.
    default:
      return (
        <LandingPage
          onConnectWallet={connectWallet}
          isWalletConnected={isWalletConnected}
          walletAddress={walletAddress}
          setActiveView={setActiveView}
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
  user: PropTypes.object, // Can be null
  setUser: PropTypes.func.isRequired,
  connectWallet: PropTypes.func.isRequired,
  disconnectWallet: PropTypes.func.isRequired,
};

export default AppRouter;