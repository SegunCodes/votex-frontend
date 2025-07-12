import React, { useState, useEffect, useCallback } from 'react';
import AppRouter from './router/AppRouter';
import MessageBox from './components/MessageBox';

const App = () => {
  // --- Global State ---
  const [activeView, setActiveView] = useState('landing');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [user, setUser] = useState(null);

  // --- Utility Function to Display Messages ---
  const showMessage = useCallback((text, type = 'info', duration = 3000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), duration);
  }, []);

  // --- Wallet Connection Logic ---
  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsWalletConnected(true);
        setWalletAddress(accounts[0]);
        showMessage('Wallet connected successfully!', 'success');
        // If a voter, and wallet is connected, might auto-redirect to voter login/dashboard
        if (user && user.role === 'voter') {
          setActiveView('voterDashboard');
        }
      } catch (error) {
        console.error("User denied account access or another error occurred:", error);
        showMessage('Failed to connect wallet. Please ensure MetaMask is unlocked and try again.', 'error');
      }
    } else {
      showMessage('MetaMask is not installed. Please install it to connect your wallet.', 'error');
      setTimeout(() => {
        window.open('https://metamask.io/download/', '_blank');
      }, 2000);
    }
  }, [showMessage, user]);

  const disconnectWallet = useCallback(() => {
    setIsWalletConnected(false);
    setWalletAddress('');
    showMessage('Wallet disconnected.', 'info');
    // Note: MetaMask doesn't have a direct 'disconnect' API for all providers.
    // This primarily clears oour app's state.
  }, [showMessage]);

  // --- Initial Load & Auth Check ---
  useEffect(() => {
    // Check for existing token in localStorage on app load
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // In a real app, you'd send this token to your backend to verify it
      // and get the user's details, rather than just decoding it client-side.
      // For now, a simple client-side decode to get user role/walletAddress
      try {
        const decodedUser = JSON.parse(atob(token.split('.')[1])); // Basic decode, not verification
        setUser(decodedUser);
        if (decodedUser.role === 'admin') {
          setActiveView('adminDashboard');
        } else if (decodedUser.role === 'voter') {
          setActiveView('voterDashboard');
        }
      } catch (e) {
        console.error('Failed to decode token from localStorage:', e);
        localStorage.removeItem('jwtToken'); // Clear invalid token
      }
    }

    // Check for MetaMask connection on load
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setWalletAddress(accounts[0]);
          }
        })
        .catch(error => console.error("Error checking MetaMask accounts:", error));

      // Listen for account changes in MetaMask
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
          showMessage('MetaMask account changed.', 'info');
          // If user role is voter, might need to re-authenticate or refresh dashboard
          if (user && user.role === 'voter') {
            // Force re-authentication or refresh dashboard based on new wallet
            // For now, just update state.
          }
        } else {
          disconnectWallet();
          // If the connected account is removed, log out the user if they were a voter
          if (user && user.role === 'voter') {
            setUser(null);
            localStorage.removeItem('jwtToken');
            setActiveView('landing');
            showMessage('MetaMask disconnected. You have been logged out.', 'info');
          }
        }
      });
    }

    // Cleanup listener on component unmount
    return () => {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', () => { });
      }
    };
  }, [showMessage, disconnectWallet, user]); // Added user to dependencies

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-inter flex flex-col">
      {/* Global Message Box */}
      <MessageBox message={message} clearMessage={() => showMessage('', '')} />

      {/* Main Router Component */}
      <AppRouter
        activeView={activeView}
        setActiveView={setActiveView}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        message={message}
        showMessage={showMessage}
        user={user}
        setUser={setUser}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
    </div>
  );
};

export default App;