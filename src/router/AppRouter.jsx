import React from 'react';
import PropTypes from 'prop-types';
import LandingPage from '../pages/LandingPage';
import VoterLoginPage from '../pages/VoterLoginPage';
import AdminLoginPage from '../pages/AdminLoginPage';
import VoterDashboardPage from '../pages/VoterDashboardPage';
import AdminDashboardPage from '../pages/AdminDashboardPage';
import PublicResultsPage from '../pages/PublicResultsPage';

// Admin Pages
import ManageElectionsPage from '../pages/admin/ManageElectionsPage';
import CreateElectionPage from '../pages/admin/CreateElectionPage';
import ElectionDetailsPage from '../pages/admin/ElectionDetailsPage';
import VoterRegistrationPage from '../pages/VoterRegistrationPage';
import ManagePartyMembersPage from '../pages/admin/ManagePartyMembersPage'; // NEW

// Voter Pages
import VotingPage from '../pages/voter/VotingPage';
import VoteReceiptsPage from '../pages/voter/VoteReceiptsPage';

const AppRouter = ({
  activeView,
  setActiveView,
  isWalletConnected,
  walletAddress,
  message,
  showMessage,
  user,
  setUser,
  connectWallet,
  disconnectWallet
}) => {
  const commonProps = { setActiveView, showMessage, user, setUser, disconnectWallet };
  const voterAuthProps = { isWalletConnected, walletAddress, connectWallet, ...commonProps };

  const getRouteParams = () => {
    if (typeof activeView === 'object' && activeView !== null && 'id' in activeView && 'view' in activeView) {
      return { view: activeView.view, id: activeView.id, postId: activeView.postId };
    }
    return { view: activeView };
  };

  const { view, id, postId } = getRouteParams();


  switch (view) {
    case 'landing':
      return <LandingPage {...voterAuthProps} message={message} />;
    case 'voterLogin':
      return <VoterLoginPage {...voterAuthProps} />;
    case 'adminLogin':
      return <AdminLoginPage {...commonProps} />;
    case 'voterDashboard':
      return <VoterDashboardPage {...voterAuthProps} />;
    case 'adminDashboard':
      return <AdminDashboardPage {...commonProps} />;
    case 'publicResults':
      return <PublicResultsPage {...commonProps} />;

    // --- Admin Specific Routes ---
    case 'manageElections':
      return <ManageElectionsPage {...commonProps} />;
    case 'createElection':
      return <CreateElectionPage {...commonProps} />;
    case 'electionDetails':
      return <ElectionDetailsPage {...commonProps} electionId={id} />;
    case 'adminRegisterVoter':
      return <VoterRegistrationPage {...commonProps} />;
    case 'managePartyMembers':
      return <ManagePartyMembersPage {...commonProps} />;

    // --- Voter Specific Routes ---
    case 'votingPage':
      return <VotingPage {...voterAuthProps} electionId={id} postId={postId} />;
    case 'voteReceipts':
      return <VoteReceiptsPage {...voterAuthProps} />;

    default:
      return <LandingPage {...voterAuthProps} message={message} />;
  }
};

AppRouter.propTypes = {
  activeView: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      view: PropTypes.string.isRequired,
      id: PropTypes.number,
      postId: PropTypes.number,
    })
  ]).isRequired,
  setActiveView: PropTypes.func.isRequired,
  isWalletConnected: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string.isRequired,
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error', 'info']),
  }).isRequired,
  showMessage: PropTypes.func.isRequired,
  user: PropTypes.object,
  setUser: PropTypes.func.isRequired,
  connectWallet: PropTypes.func.isRequired,
  disconnectWallet: PropTypes.func.isRequired,
};

export default AppRouter;