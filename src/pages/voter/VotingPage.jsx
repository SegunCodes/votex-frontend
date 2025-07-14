import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getElectionDetailsPublic, getElectionPostsPublic, getPostCandidatesPublic, castVote, getVoterElectionStatus } from '../../services/apiService';

const VotingPage = ({ user, isWalletConnected, walletAddress, setActiveView, showMessage, electionId: propElectionId, postId: propPostId }) => {
  const [election, setElection] = useState(null);
  const [posts, setPosts] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [hasVotedForThisPost, setHasVotedForThisPost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCastingVote, setIsCastingVote] = useState(false);
  const [error, setError] = useState(null);

  // Ensure user is logged in as voter and wallet is connected
  useEffect(() => {
    if (!user || user.role !== 'voter' || !isWalletConnected) {
      showMessage('Please login as a voter and connect your wallet to access the ballot.', 'error');
      setActiveView('voterLogin');
    }
  }, [user, isWalletConnected, showMessage, setActiveView]);

  // Fetch election details, posts, and candidates
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!propElectionId) {
          throw new Error('Election ID not provided for voting.');
        }

        // Fetch election details
        const electionResponse = await getElectionDetailsPublic(propElectionId);
        setElection(electionResponse.election);

        // Fetch posts for this election
        const postsResponse = await getElectionPostsPublic(propElectionId);
        setPosts(postsResponse.posts);

        // For simplicity, assume we are voting for the first post if propPostId is not given,
        // or the specific propPostId
        const currentPostId = propPostId || (postsResponse.posts.length > 0 ? postsResponse.posts[0].id : null);

        if (currentPostId) {
          // Fetch candidates for the current post
          const candidatesResponse = await getPostCandidatesPublic(currentPostId);
          setCandidates(candidatesResponse.candidates);

          // Check voter status for this election/post
          const voterStatusResponse = await getVoterElectionStatus(propElectionId);
          // Note: hasVoted in backend checks for any post in election.
          // For per-post check, smart contract needs hasVotedForPost(electionId, postId, voterAddress)
          // For now, if getVoterElectionStatus says they've voted, assume for this post.
          // A more granular check would involve a dedicated backend endpoint for a specific post.
          if (voterStatusResponse.hasVoted) { // This is a simplified check
            setHasVotedForThisPost(true);
            showMessage('You have already voted in this election.', 'info');
          }
        } else {
          showMessage('No posts found for this election.', 'info');
        }

      } catch (err) {
        console.error('Failed to load voting page data:', err);
        setError(err.data?.error || err.message || 'Failed to load voting information.');
        showMessage('Failed to load voting information.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'voter' && isWalletConnected && propElectionId) {
      fetchData();
    }
  }, [user, isWalletConnected, showMessage, propElectionId, propPostId, setActiveView]);


  const handleCastVote = async () => {
    if (!selectedCandidateId || !election || !propPostId || hasVotedForThisPost) {
      showMessage('Please select a candidate or you have already voted.', 'error');
      return;
    }
    if (!isWalletConnected || walletAddress.toLowerCase() !== user.walletAddress.toLowerCase()) {
      showMessage('Please connect the correct MetaMask wallet to cast your vote.', 'error');
      return;
    }

    setIsCastingVote(true);
    try {
      const response = await castVote(election.id, propPostId, selectedCandidateId);
      showMessage(response.message, 'success');
      setHasVotedForThisPost(true); // Mark as voted locally
      // Optionally navigate to vote receipts page
      setTimeout(() => setActiveView('voteReceipts'), 2000);
    } catch (err) {
      console.error('Failed to cast vote:', err);
      showMessage(err.data?.error || err.message || 'Failed to cast vote.', 'error');
    } finally {
      setIsCastingVote(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex items-center justify-center">
        <p className="text-xl">Loading ballot...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <button
          onClick={() => setActiveView('voterDashboard')}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!election || !posts.length || !candidates.length) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
        <p className="text-yellow-500 text-xl mb-4">No active ballot found for this election/post, or no candidates.</p>
        <button
          onClick={() => setActiveView('voterDashboard')}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const currentPost = posts.find(p => p.id === propPostId);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center p-8">
      <h2 className="text-5xl font-bold mb-6 text-blue-400">Voting Ballot</h2>
      <p className="text-lg text-gray-300 mb-2">Election: {election.title}</p>
      <p className="text-xl font-semibold text-gray-200 mb-8">Post: {currentPost?.name || 'Loading Post...'}</p>

      {hasVotedForThisPost ? (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md text-center">
          <p className="text-green-400 text-2xl font-bold mb-4">You have already voted for this post!</p>
          <p className="text-gray-300">Thank you for participating.</p>
          <button
            onClick={() => setActiveView('voteReceipts')}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-bold rounded-full shadow-lg hover:from-teal-700 hover:to-cyan-600 transition-all duration-300"
          >
            View My Vote Receipts
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md">
          <p className="text-gray-300 mb-6">Select your preferred candidate:</p>
          <div className="space-y-4 mb-6">
            {candidates.map((candidate) => (
              <label
                key={candidate.id}
                className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedCandidateId === candidate.id ? 'bg-blue-700 ring-2 ring-blue-500' : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <input
                  type="radio"
                  name="candidate"
                  value={candidate.id}
                  checked={selectedCandidateId === candidate.id}
                  onChange={() => setSelectedCandidateId(candidate.id)}
                  className="form-radio h-5 w-5 text-blue-600 transition-colors duration-200"
                  disabled={isCastingVote}
                />
                <div className="ml-4 flex-grow">
                  <span className="text-xl font-semibold text-white">{candidate.party_member_name}</span>
                  <p className="text-gray-300 text-sm">{candidate.party_name}</p>
                  {candidate.image_url && (
                    <img src={candidate.image_url} alt={candidate.party_member_name} className="w-16 h-16 rounded-full object-cover mt-2" />
                  )}
                </div>
              </label>
            ))}
          </div>
          <button
            onClick={handleCastVote}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-blue-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
            disabled={isCastingVote || !selectedCandidateId}
          >
            {isCastingVote ? 'Casting Vote...' : 'Cast My Vote'}
          </button>
        </div>
      )}

      <button
        onClick={() => setActiveView('voterDashboard')}
        className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

VotingPage.propTypes = {
  user: PropTypes.object,
  isWalletConnected: PropTypes.bool.isRequired,
  walletAddress: PropTypes.string.isRequired,
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  electionId: PropTypes.number,
  postId: PropTypes.number,
};

export default VotingPage;