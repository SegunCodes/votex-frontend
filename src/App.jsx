import React, { useState, useEffect, useCallback } from 'react';
import AppRouter from './router/AppRouter';
import MessageBox from './components/MessageBox';

const App = () => {
  // --- Global State ---
  const [activeView, setActiveView] = useState('landing');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [user, setUser] = useState(null); // Stores authenticated user info (admin or voter)
  const [isAppInitialized, setIsAppInitialized] = useState(false); // NEW: Flag to control initial auth check

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
        
        // After wallet connect, if on landing, navigate to voter login
        if (activeView === 'landing') {
          setActiveView('voterLogin');
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
  }, [showMessage, activeView]); // Removed 'user' from dependencies here

  const disconnectWallet = useCallback(() => {
    setIsWalletConnected(false);
    setWalletAddress('');
    showMessage('Wallet disconnected.', 'info');
  }, [showMessage]);

  // --- Initial Load & Auth Check (Runs once on mount) ---
  useEffect(() => {
    const checkInitialAuthAndWallet = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          const decodedUser = JSON.parse(atob(token.split('.')[1]));
          setUser(decodedUser); // Set user state
          
          // Navigate to appropriate dashboard immediately on initial load if token exists
          if (decodedUser.role === 'admin') {
            setActiveView('adminDashboard');
          } else if (decodedUser.role === 'voter') {
            setActiveView('voterDashboard');
          }
        } catch (e) {
          console.error('Failed to decode token from localStorage:', e);
          localStorage.removeItem('jwtToken');
          setUser(null);
          setActiveView('landing'); // Fallback to landing if token invalid
        }
      } else {
        setUser(null); // Ensure user is null if no token
        setActiveView('landing'); // Default to landing if no token
      }

      // Check for MetaMask connection on initial load
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setIsWalletConnected(true);
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking MetaMask accounts on load:", error);
        }
      }
      setIsAppInitialized(true); // Mark app as initialized after initial checks
    };

    checkInitialAuthAndWallet();

    // MetaMask accountsChanged listener (separate from initial check)
    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        if (accounts[0].toLowerCase() !== walletAddress.toLowerCase()) { // Check if address actually changed
          setIsWalletConnected(true);
          setWalletAddress(accounts[0]);
          showMessage('MetaMask account changed.', 'info');
          
          // If a voter's account changes, force re-authentication
          if (user && user.role === 'voter' && user.walletAddress.toLowerCase() !== accounts[0].toLowerCase()) {
            setUser(null);
            localStorage.removeItem('jwtToken');
            setActiveView('voterLogin');
            showMessage('MetaMask account changed. Please re-login with the new account.', 'info');
          }
        }
      } else {
        disconnectWallet();
        if (user && user.role === 'voter') { // Only log out if the current user was a voter
          setUser(null);
          localStorage.removeItem('jwtToken');
          setActiveView('landing');
          showMessage('MetaMask disconnected. You have been logged out.', 'info');
        }
      }
    };

    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }

    return () => {
      if (typeof window.ethereum !== 'undefined' && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  // This useEffect handles navigation AFTER user state changes from login/logout
  useEffect(() => {
    const allowedViewsByRole = {
      admin: ['adminDashboard', 'adminLogin', 'adminRegisterVoter', 'manageElections', 'electionDetails', 'createElection', 'managePartyMembers'],
      voter: ['voterDashboard', 'voterLogin', 'votingPage', 'voteReceipts', 'publicResults'],
      guest: ['landing', 'adminLogin', 'voterLogin', 'publicResults'],
    };
  
    const role = user?.role || 'guest';
    const allowedViews = allowedViewsByRole[role];
  
    const currentView = typeof activeView === 'string' ? activeView : activeView.view;
  
    if (!allowedViews.includes(currentView)) {
      if (role === 'admin') setActiveView({ view: 'adminDashboard' });
      else if (role === 'voter') setActiveView({ view: 'voterDashboard' });
      else setActiveView({ view: 'landing' });
    }
  }, [user, activeView]);  

  // Render AppRouter only after initial authentication check is complete
  if (!isAppInitialized) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex items-center justify-center">
        <p className="text-xl text-gray-400">Loading application...</p>
      </div>
    );
  }

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