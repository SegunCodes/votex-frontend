/* eslint-disable no-undef */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { doc, setDoc } from 'firebase/firestore';

const VoterRegistrationPage = ({
  isWalletConnected,
  walletAddress,
  setActiveView,
  showMessage,
  db,
  userId,
}) => {
  const [voterName, setVoterName] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Check if wallet is connected when page loads
  useEffect(() => {
    if (!isWalletConnected) {
      showMessage('Please connect your wallet to register.', 'info');
    }
  }, [isWalletConnected, showMessage]);

  const handleRegisterVoter = async (e) => {
    e.preventDefault();
    if (!isWalletConnected) {
      showMessage('Please connect your MetaMask wallet first.', 'error');
      return;
    }
    if (!voterName.trim()) {
      showMessage('Please enter your name.', 'error');
      return;
    }
    if (!db || !userId) {
      showMessage('Firestore not initialized or user not authenticated. Please refresh.', 'error');
      console.error('Firestore DB or userId is undefined:', { db, userId });
      return;
    }

    setIsRegistering(true);
    try {
      // Store voter bio-data in Firestore (off-chain)
      // Path: /artifacts/{appId}/users/{userId}/voters
      const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
      const voterDocRef = doc(db, `artifacts/${appId}/users/${userId}/voters`, walletAddress);

      await setDoc(voterDocRef, {
        name: voterName,
        walletAddress: walletAddress,
        registeredAt: new Date().toISOString(),
        // NOTE: I will add more bio-data fields as needed
        // For 'Voting ID', the walletAddress serves as the primary DID
      }, { merge: true });

      showMessage('Voter registered successfully! Redirecting to dashboard...', 'success');
      // Note store this on the blockchain via a smart contract call
      // and then navigate to a dashboard or voting page.
      setTimeout(() => setActiveView('dashboard'), 2000); // Placeholder for dashboard
    } catch (error) {
      console.error('Error registering voter:', error);
      showMessage(`Error registering voter: ${error.message}`, 'error');
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
      <h2 className="text-5xl font-bold mb-6 text-purple-400">Voter Registration</h2>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
        Connect your MetaMask wallet to establish your decentralized identity and register to vote.
      </p>

      {/* Wallet Connection Status */}
      {isWalletConnected ? (
        <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-8 w-full max-w-md text-center">
          <p className="text-green-400 text-md">
            Wallet Connected: <span className="font-mono text-sm break-all">{walletAddress}</span>
          </p>
          <p className="text-gray-400 text-sm mt-2">This will be your primary Decentralized ID (DID).</p>
        </div>
      ) : (
        <button
          onClick={() => showMessage('Please connect your wallet on the landing page first.', 'info')}
          className="px-6 py-3 bg-gray-600 text-white font-bold rounded-full shadow-lg cursor-not-allowed mb-8"
          disabled
        >
          Connect Wallet (from Landing Page)
        </button>
      )}

      {/* Registration Form */}
      {isWalletConnected && (
        <form onSubmit={handleRegisterVoter} className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
          <div className="mb-6">
            <label htmlFor="voterName" className="block text-gray-300 text-sm font-bold mb-2">
              Your Full Name:
            </label>
            <input
              type="text"
              id="voterName"
              className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
              placeholder="e.g., John Doe"
              value={voterName}
              onChange={(e) => setVoterName(e.target.value)}
              required
              disabled={isRegistering}
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            disabled={isRegistering || !isWalletConnected}
          >
            {isRegistering ? 'Registering...' : 'Register Voter'}
          </button>
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

VoterRegistrationPage.propTypes = {
  isWalletConnected: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  db: PropTypes.object, // Firebase Firestore instance
  userId: PropTypes.string, // Firebase Auth user ID
};

export default VoterRegistrationPage;