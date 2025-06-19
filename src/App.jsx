/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AppRouter from './router/AppRouter';
import MessageBox from './components/MessageBox';

const App = () => {
  // --- Global State ---
  const [activeView, setActiveView] = useState('landing');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [firebaseApp, setFirebaseApp] = useState(null);
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false); // To ensure Firestore operations wait for auth

  const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
  const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

  const showMessage = (text, type = 'info', duration = 3000) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), duration);
  };

  // Wallet Connection Logic
  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsWalletConnected(true);
        setWalletAddress(accounts[0]);
        showMessage('Wallet connected successfully!', 'success');
        // If wallet connected, automatically go to registration/dashboard
        if (activeView === 'landing') { // Only navigate if on landing
            setActiveView('voterRegistration');
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
  };

  //Firebase Initialization and Authentication Effect
  useEffect(() => {
    // Initialize Firebase only once
    if (Object.keys(firebaseConfig).length === 0) {
      console.warn('Firebase config not provided. Firebase features will be limited.');
      setIsAuthReady(true); // Still mark as ready if no config
      return;
    }

    if (!firebaseApp) {
      const app = initializeApp(firebaseConfig);
      const authInstance = getAuth(app);
      const dbInstance = getFirestore(app);

      setFirebaseApp(app);
      setAuth(authInstance);
      setDb(dbInstance);

      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (user) {
          setUserId(user.uid);
          console.log('Firebase User ID:', user.uid);
        } else {
          setUserId(null);
          console.log('No Firebase user signed in.');
        }
        setIsAuthReady(true);
      });

      const signInFirebase = async () => {
        try {
          if (initialAuthToken) {
            await signInWithCustomToken(authInstance, initialAuthToken);
            console.log("Firebase signed in with custom token!");
          } else {
            await signInAnonymously(authInstance);
            console.log("Signed in anonymously to Firebase.");
          }
        } catch (error) {
          console.error("Firebase authentication error:", error);
          showMessage(`Firebase auth error: ${error.message}`, 'error');
        }
      };

      signInFirebase();

      return () => unsubscribe();
    }
  }, [firebaseApp, firebaseConfig, initialAuthToken]); // Only re-run if firebaseApp, config, or token changes

  return (
    <div className="relative min-h-screen bg-gray-900 text-white font-inter flex flex-col">
      <MessageBox message={message} clearMessage={() => showMessage('', '')} />

      <AppRouter
        activeView={activeView}
        setActiveView={setActiveView}
        isWalletConnected={isWalletConnected}
        walletAddress={walletAddress}
        message={message}
        showMessage={showMessage}
        db={db}
        userId={userId}
        connectWallet={connectWallet}
      />
    </div>
  );
};

export default App;