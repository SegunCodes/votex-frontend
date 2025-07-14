/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  getElectionDetailsAdmin,
  getElectionPostsAdmin,
  getPostCandidatesAdmin,
  getAllVotersAdmin,
  getAllParties,
  getAllPartyMembersAdmin,
  startElection,
  endElection,
  auditElection,
  createPost,
  addCandidateToPost,
  getWhitelistedVoters
} from '../../services/apiService';

const ElectionDetailsPage = ({ setActiveView, showMessage, user, electionId: propElectionId }) => {
  const [election, setElection] = useState(null);
  const [posts, setPosts] = useState([]);
  const [voters, setVoters] = useState([]); // All registered voters
  const [parties, setParties] = useState([]); // All parties
  const [allPartyMembers, setAllPartyMembers] = useState([]); // All party members for dropdowns
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for creating new post
  const [newPostName, setNewPostName] = useState('');
  const [newPostMaxVotes, setNewPostMaxVotes] = useState(1);
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // State for adding candidate (now selecting from allPartyMembers)
  const [selectedPostIdForCandidate, setSelectedPostIdForCandidate] = useState('');
  const [selectedPartyMemberId, setSelectedPartyMemberId] = useState('');
  const [isAddingCandidate, setIsAddingCandidate] = useState(false);
  const [candidatesForDisplay, setCandidatesForDisplay] = useState({});

  // State to store whitelisted voters for display
  const [whitelistedVoters, setWhitelistedVoters] = useState([]);
  const [isWhitelistedVotersLoading, setIsWhitelistedVotersLoading] = useState(true);
 

  // State for audit report
  const [auditReport, setAuditReport] = useState(null);
  const [isAuditing, setIsAuditing] = useState(false);


  // Ensure only admin can access this page
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      showMessage('Access denied. Only admins can manage elections.', 'error');
      setActiveView('adminLogin');
    }
  }, [user, setActiveView, showMessage]);

  // Fetch election details, posts, voters, parties, party members
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (!propElectionId) {
          throw new Error('No election ID provided.');
        }

        const electionResponse = await getElectionDetailsAdmin(propElectionId);
        const foundElection = electionResponse.election;
        if (!foundElection) {
          throw new Error('Election not found.');
        }
        setElection(foundElection);

        const postsResponse = await getElectionPostsAdmin(propElectionId);
        setPosts(postsResponse.posts);

        const votersResponse = await getAllVotersAdmin();
        setVoters(votersResponse.voters); // All registered voters

        const partiesResponse = await getAllParties();
        setParties(partiesResponse.parties);

        const allPartyMembersResponse = await getAllPartyMembersAdmin();
        setAllPartyMembers(allPartyMembersResponse.members);

        // Fetch candidates for each post for display
        const candidatesByPost = {};
        if (postsResponse.posts.length > 0) {
            for (const post of postsResponse.posts) {
                const postCandidatesResponse = await getPostCandidatesAdmin(post.id);
                candidatesByPost[post.id] = postCandidatesResponse.candidates;
            }
        }
        setCandidatesForDisplay(candidatesByPost);

        // Fetch whitelisted voters for this election from backend API
        setIsWhitelistedVotersLoading(true);
        const whitelistedVotersResponse = await getWhitelistedVoters(propElectionId);
        setWhitelistedVoters(whitelistedVotersResponse.whitelistedVoters);
        setIsWhitelistedVotersLoading(false);


      } catch (err) {
        console.error('Failed to fetch election details or related data:', err);
        setError(err.data?.error || err.message || 'Failed to load election details.');
        showMessage('Failed to load election details.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'admin' && propElectionId) {
      fetchData();
    }
  }, [user, propElectionId, showMessage, setActiveView]);

  const handleStartElection = async () => {
    if (!election || !election.id) return;
    setIsLoading(true);
    try {
      const response = await startElection(election.id);
      showMessage(response.message, 'success');
      setElection(prev => ({ ...prev, status: 'active' }));
    } catch (err) {
      console.error('Failed to start election:', err);
      showMessage(err.data?.error || err.message || 'Failed to start election.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndElection = async () => {
    if (!election || !election.id) return;
    setIsLoading(true);
    try {
      const response = await endElection(election.id);
      showMessage(response.message, 'success');
      setElection(prev => ({ ...prev, status: 'ended', results: response.results }));
    } catch (err) {
      console.error('Failed to end election:', err);
      showMessage(err.data?.error || err.message || 'Failed to end election.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuditElection = async () => {
    if (!election || !election.id) return;
    setIsAuditing(true);
    setAuditReport(null);
    try {
      const response = await auditElection(election.id);
      setAuditReport(response.report);
      showMessage(response.message, 'success');
    } catch (err) {
      console.error('Failed to audit election:', err);
      showMessage(err.data?.error || err.message || 'Failed to perform audit.', 'error');
    } finally {
      setIsAuditing(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!election || !election.id) return;
    setIsCreatingPost(true);
    try {
      const response = await createPost(election.id, { name: newPostName, maxVotesPerVoter: newPostMaxVotes });
      showMessage(response.message, 'success');
      setPosts(prev => [...prev, response.post]);
      setNewPostName('');
      setNewPostMaxVotes(1);
    } catch (err) {
      console.error('Failed to create post:', err);
      showMessage(err.data?.error || err.message || 'Failed to create post.', 'error');
    } finally {
      setIsCreatingPost(false);
    }
  };

  const handleAddCandidate = async (e) => {
    e.preventDefault();
    if (!selectedPostIdForCandidate || !selectedPartyMemberId) {
      showMessage('Please select a post and a party member.', 'error');
      return;
    }
    setIsAddingCandidate(true);
    try {
      const response = await addCandidateToPost(
        parseInt(selectedPostIdForCandidate),
        { partyMemberId: parseInt(selectedPartyMemberId) }
      );
      showMessage(response.message, 'success');
      // Refresh candidates for the affected post
      const updatedCandidates = await getPostCandidatesAdmin(parseInt(selectedPostIdForCandidate));
      setCandidatesForDisplay(prev => ({
          ...prev,
          [selectedPostIdForCandidate]: updatedCandidates.candidates
      }));
      setSelectedPartyMemberId(''); // Clear selection
    } catch (err) {
      console.error('Failed to add candidate:', err);
      showMessage(err.data?.error || err.message || 'Failed to add candidate.', 'error');
    } finally {
      setIsAddingCandidate(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex items-center justify-center">
        <p className="text-xl">Loading election details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <button
          onClick={() => setActiveView('manageElections')}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Back to Manage Elections
        </button>
      </div>
    );
  }

  if (!election) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
        <p className="text-red-500 text-xl mb-4">Election not found or no ID provided.</p>
        <button
          onClick={() => setActiveView('manageElections')}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Back to Manage Elections
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center p-8">
      <h2 className="text-5xl font-bold mb-8 text-purple-400">Election: {election.title}</h2>

      {/* Election Overview */}
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">Overview</h3>
        <p className="text-gray-300 mb-2"><strong>Description:</strong> {election.description}</p>
        <p className="text-gray-300 mb-2"><strong>Start:</strong> {new Date(election.start_date).toLocaleString()}</p>
        <p className="text-gray-300 mb-2"><strong>End:</strong> {new Date(election.end_date).toLocaleString()}</p>
        <p className={`text-xl font-bold ${
          election.status === 'active' ? 'text-green-400' :
          election.status === 'pending' ? 'text-yellow-400' :
          'text-red-400'
        }`}>Status: {election.status.toUpperCase()}</p>
        {election.blockchain_contract_address && (
          <p className="text-gray-400 text-sm mt-2 break-all">
            Contract: <span className="font-mono">{election.blockchain_contract_address}</span>
          </p>
        )}

        {/* Election Actions */}
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {election.status === 'pending' && (
            <button
              onClick={handleStartElection}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-white font-bold rounded-full shadow-lg hover:from-green-600 hover:to-emerald-500 transition-all duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? 'Starting...' : 'Start Election'}
            </button>
          )}
          {election.status === 'active' && (
            <button
              onClick={handleEndElection}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-400 text-white font-bold rounded-full shadow-lg hover:from-red-600 hover:to-orange-500 transition-all duration-300 transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? 'Ending...' : 'End Election'}
            </button>
          )}
          {election.status === 'ended' && (
            <button
              onClick={handleAuditElection}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-bold rounded-full shadow-lg hover:from-blue-600 hover:to-cyan-500 transition-all duration-300 transform hover:scale-105"
              disabled={isAuditing}
            >
              {isAuditing ? 'Auditing...' : 'Audit Election'}
            </button>
          )}
        </div>
      </div>

      {/* Audit Report Display */}
      {auditReport && (
        <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
          <h3 className="text-3xl font-semibold text-gray-200 mb-4">Audit Report</h3>
          <p className="text-gray-300"><strong>Total Votes Recorded (On-chain):</strong> {auditReport.totalVotesRecorded}</p>
          <p className="text-gray-300"><strong>Unique Voters (On-chain):</strong> {auditReport.uniqueVoters}</p>
          <p className="text-gray-300"><strong>Integrity Check:</strong> {auditReport.integrityCheck}</p>
          <h4 className="text-xl font-semibold text-gray-300 mt-4">Raw Events:</h4>
          <div className="max-h-60 overflow-y-auto bg-gray-700 p-3 rounded-lg text-sm font-mono text-gray-300">
            <pre>{JSON.stringify(auditReport.rawEvents, null, 2)}</pre>
          </div>
        </div>
      )}

      {/* Post Management */}
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">Election Posts</h3>
        <form onSubmit={handleCreatePost} className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <label htmlFor="newPostName" className="block text-gray-300 text-sm font-bold mb-2">
              New Post Name:
            </label>
            <input
              type="text"
              id="newPostName"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 bg-gray-200"
              placeholder="e.g., President"
              value={newPostName}
              onChange={(e) => setNewPostName(e.target.value)}
              required
              disabled={isCreatingPost || election.status !== 'pending'}
            />
          </div>
          <div>
            <label htmlFor="newPostMaxVotes" className="block text-gray-300 text-sm font-bold mb-2">
              Max Votes:
            </label>
            <input
              type="number"
              id="newPostMaxVotes"
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 bg-gray-200"
              value={newPostMaxVotes}
              onChange={(e) => setNewPostMaxVotes(parseInt(e.target.value))}
              min="1"
              disabled={isCreatingPost || election.status !== 'pending'}
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white font-bold rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
            disabled={isCreatingPost || election.status !== 'pending'}
          >
            {isCreatingPost ? 'Creating Post...' : 'Create Post'}
          </button>
        </form>

        {posts.length === 0 ? (
          <p className="text-gray-400">No posts created for this election yet.</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="bg-gray-700 p-4 rounded-lg shadow">
                <h4 className="text-xl font-semibold text-white">{post.name}</h4>
                <p className="text-gray-300 text-sm">Max Votes per Voter: {post.max_votes_per_voter}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {/* Add Candidate Form for this post */}
                  <form onSubmit={handleAddCandidate} className="flex flex-wrap items-center gap-2 mt-2 w-full">
                    <label htmlFor={`candidateSelect-${post.id}`} className="text-gray-300 text-sm">Add Candidate:</label>
                    <select
                      id={`candidateSelect-${post.id}`}
                      className="shadow border rounded-lg py-1 px-2 text-gray-900 bg-gray-200 flex-grow"
                      value={selectedPostIdForCandidate === post.id ? selectedPartyMemberId : ''} // Only control if this post is selected
                      onChange={(e) => {
                        setSelectedPostIdForCandidate(post.id); // Set current post for candidate addition
                        setSelectedPartyMemberId(e.target.value);
                      }}
                      required
                      disabled={isAddingCandidate || election.status !== 'pending'}
                    >
                      <option value="">-- Select Party Member --</option>
                      {allPartyMembers.map(member => ( // Use allPartyMembers here
                        <option key={member.id} value={member.id}>
                          {member.name} ({parties.find(p => p.id === member.party_id)?.name || 'N/A'})
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-500 text-white rounded-full hover:bg-emerald-600 transition-colors duration-200"
                      disabled={isAddingCandidate || election.status !== 'pending' || !selectedPartyMemberId || selectedPostIdForCandidate !== post.id}
                    >
                      Add
                    </button>
                  </form>
                  {/* List Candidates for this Post */}
                  <div className="w-full mt-2">
                    <h5 className="text-md font-semibold text-gray-300">Candidates for this Post:</h5>
                    {candidatesForDisplay[post.id] && candidatesForDisplay[post.id].length > 0 ? (
                        <ul className="list-disc list-inside text-gray-400">
                            {candidatesForDisplay[post.id].map(candidate => (
                                <li key={candidate.id} className="text-sm">
                                    {candidate.party_member_name} ({candidate.party_name})
                                    {candidate.image_url && <img src={candidate.image_url} alt={candidate.party_member_name} className="inline-block w-8 h-8 rounded-full ml-2" />}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-400 text-sm">No candidates added to this post yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

       {/* Whitelisted Voters Display Section (NEW) */}
       <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
          <h3 className="text-3xl font-semibold text-gray-200 mb-4">Whitelisted Voters for this Election</h3>
          <p className="text-gray-400 mb-4">These voters have linked their wallet and been automatically whitelisted on the blockchain for this election.</p>
          {isWhitelistedVotersLoading ? (
              <p className="text-gray-400">Loading whitelisted voters...</p>
          ) : whitelistedVoters.length === 0 ? (
              <p className="text-gray-400">No voters whitelisted for this election yet (voters need to log in with their wallets).</p>
          ) : (
              <div className="space-y-3">
                  {whitelistedVoters.map(voter => (
                      <div key={voter.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                          <div>
                              <p className="text-lg font-semibold text-white">{voter.name}</p>
                              <p className="text-gray-400 text-sm break-all">{voter.wallet_address}</p>
                          </div>
                          <span className="text-green-400 font-bold">ELIGIBLE</span>
                      </div>
                  ))}
              </div>
          )}
        </div>

      <button
        onClick={() => setActiveView('manageElections')}
        className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
      >
        Back to Manage Elections
      </button>
    </div>
  );
};

ElectionDetailsPage.propTypes = {
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  user: PropTypes.object,
  electionId: PropTypes.number, // The ID of the election to display
};

export default ElectionDetailsPage;