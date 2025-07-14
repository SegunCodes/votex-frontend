import React from 'react';
import PropTypes from 'prop-types';
import MessageBox from '../components/MessageBox';

const LandingPage = ({ onConnectWallet, isWalletConnected, walletAddress, setActiveView, message, showMessage, user }) => { // Added 'user' prop

  const handleAdminNav = () => {
    if (user && user.role === 'admin') {
      setActiveView('adminDashboard');
    } else {
      setActiveView('adminLogin');
    }
  };

  const handleVoterNav = () => {
    if (user && user.role === 'voter') {
      setActiveView('voterDashboard');
    } else {
      setActiveView('voterLogin');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col">
      {/* Message Box for alerts */}
      <MessageBox message={message} clearMessage={() => showMessage('', '')} />

      {/* Navigation Bar */}
      <nav className="p-6 flex justify-between items-center bg-gray-800 rounded-b-xl shadow-lg">
        <div className="text-3xl font-bold text-purple-400">VoteX</div>
        <div className="flex space-x-4">
          {user && user.role === 'admin' ? (
            <button
              onClick={handleAdminNav}
              className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Admin Dashboard
            </button>
          ) : (
            <button
              onClick={handleAdminNav}
              className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-full shadow-lg hover:bg-gray-600 transition-colors duration-300"
            >
              Admin Login
            </button>
          )}
          
          {user && user.role === 'voter' ? (
            <button
              onClick={handleVoterNav}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Voter Dashboard
            </button>
          ) : (
            <button
              onClick={handleVoterNav}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
            >
              Voter Login
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-7xl md:text-8xl font-extrabold mb-4 animate-fadeIn">VoteX</h1>
        <p className="text-2xl md:text-3xl font-light text-gray-300 tracking-wide animate-fadeIn animation-delay-200">
          THE FUTURE OF VOTING
        </p>
      </header>

      {/* Features/Benefits Section */}
      <section className="p-8 pb-16 bg-gray-850 grid grid-cols-1 md:grid-cols-2 gap-8 lg:grid-cols-4 rounded-t-xl shadow-inner">
        {/* Feature Card: Reliability */}
        <div className="flex flex-col items-center p-6 bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-teal-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.001 12.001 0 002 12c0 2.757 1.125 5.226 2.944 7.054A11.993 11.993 0 0012 22c2.906 0 5.603-1.077 7.747-2.946A12.001 12.001 0 0022 12c0-2.757-1.125-5.226-2.944-7.054z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Reliability</h3>
          <p className="text-gray-300 text-center text-sm">Ensuring your vote is accurately recorded every time.</p>
        </div>

        {/* Feature Card: Security */}
        <div className="flex flex-col items-center p-6 bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v3h8z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Security</h3>
          <p className="text-gray-300 text-center text-sm">Protected by advanced cryptographic techniques.</p>
        </div>

        {/* Feature Card: Decentralized (Blockchain) */}
        <div className="flex flex-col items-center p-6 bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">Blockchain Powered</h3>
          <p className="text-gray-300 text-center text-sm">Transparent and immutable records for every vote.</p>
        </div>

        {/* Feature Card: User-Friendly & Accessible */}
        <div className="flex flex-col items-center p-6 bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.879-4.879A1 1 0 0121 6.121v7.757a1 1 0 01-1.707.707L15 10zm-3 8h-2m2 0c1.065 0 2.062-.358 2.879-1H20.75a1 1 0 00.912-1.405l-3.374-7.054C18.257 8.358 17.159 8 16 8h-4a2 2 0 00-2 2v4a2 2 0 002 2zm-5 0H4.25a1 1 0 01-.912-1.405l3.374-7.054C5.743 8.358 6.841 8 8 8h4a2 2 0 012 2v4a2 2 0 01-2 2zm-5 0h-2m2 0c-1.065 0-2.062-.358-2.879-1H3.25a1 1 0 00-.912 1.405l3.374-7.054C5.743 8.358 6.841 8 8 8h4a2 2 0 002 2v4a2 2 0 00-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">User-Friendly</h3>
          <p className="text-gray-300 text-center text-sm">Intuitive design for a seamless voting experience on any device.</p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gray-900 py-16 px-8 text-center">
        <h2 className="text-4xl font-bold mb-6 text-purple-300">Start Your Secure Voting Journey</h2>
        <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
          Explore the blockchain world. Create and cast votes easily on this platform.
        </p>
        {!isWalletConnected ? (
          <button
            onClick={onConnectWallet}
            className="px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold text-xl rounded-full shadow-lg hover:from-green-600 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105 animate-pulse"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-green-400 text-lg mb-4">
              Wallet Connected: <span className="font-mono text-sm break-all">{walletAddress}</span>
            </p>
            {/* If wallet is connected, offer option to proceed to voter login */}
            {user && user.role === 'voter' ? (
              <button
                onClick={handleVoterNav} // Navigate to voter dashboard
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Go to Voter Dashboard
              </button>
            ) : (
              <button
                onClick={handleVoterNav} // Navigate to voter login
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-300"
              >
                Proceed to Voter Login
              </button>
            )}
          </div>
        )}
        <button
          onClick={() => setActiveView('publicResults')}
          className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
        >
          View Public Results
        </button>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-500 bg-gray-800 rounded-t-xl shadow-inner mt-auto">
        &copy; {new Date().getFullYear()} VoteX. All rights reserved.
      </footer>

      {/* Custom Styles for Inter Font and Animations */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
        .font-inter {
          font-family: 'Inter', sans-serif;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        .animate-pulse-slow {
          animation: pulse 4s infinite cubic-bezier(0.4, 0, 0.6, 1);
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: .5;
          }
        }
      `}</style>
    </div>
  );
};

LandingPage.propTypes = {
  onConnectWallet: PropTypes.func.isRequired,
  isWalletConnected: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
  message: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.oneOf(['success', 'error', 'info']),
  }).isRequired,
  showMessage: PropTypes.func.isRequired,
  user: PropTypes.object, // Added 'user' prop type
};

export default LandingPage;