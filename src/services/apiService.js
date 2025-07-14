const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

const makeRequest = async (endpoint, method = 'GET', data = null, requiresAuth = false) => {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (requiresAuth) {
    const token = localStorage.getItem('jwtToken'); // Get token from local storage
    if (!token) {
      throw new Error('Authentication token not found.');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const responseData = await response.json();

    if (!response.ok) {
      // Handle API errors
      const error = new Error(responseData.error || 'Something went wrong with the API request.');
      error.status = response.status;
      error.data = responseData;
      throw error;
    }

    return responseData;
  } catch (error) {
    console.error('API Service Error:', error);
    throw error;
  }
};

// --- Admin API Calls ---
export const adminLogin = (email, password) => makeRequest('/admin/login', 'POST', { email, password });
export const createElection = (electionData) => makeRequest('/admin/elections', 'POST', electionData, true);
export const getAllElectionsAdmin = () => makeRequest('/admin/elections', 'GET', null, true);
export const updateElectionStatus = (electionId, status, results = null, winningCandidateId = null) => makeRequest(`/admin/elections/${electionId}/status`, 'PUT', { status, results, winningCandidateId }, true);
export const startElection = (electionId) => makeRequest(`/admin/elections/${electionId}/start`, 'POST', null, true);
export const endElection = (electionId) => makeRequest(`/admin/elections/${electionId}/end`, 'POST', null, true);
export const auditElection = (electionId) => makeRequest(`/admin/elections/${electionId}/audit`, 'GET', null, true);
export const createPost = (electionId, postData) => makeRequest(`/admin/elections/${electionId}/posts`, 'POST', postData, true);
export const getElectionPostsAdmin = (electionId) => makeRequest(`/admin/elections/${electionId}/posts`, 'GET', null, true);
export const addCandidateToPost = (postId, candidateData) => makeRequest(`/admin/posts/${postId}/candidates`, 'POST', candidateData, true);
export const getPostCandidatesAdmin = (postId) => makeRequest(`/admin/posts/${postId}/candidates`, 'GET', null, true);
export const registerVoterByAdmin = (voterData) => makeRequest('/admin/voters', 'POST', voterData, true);
export const getAllVotersAdmin = () => makeRequest('/admin/voters', 'GET', null, true);
export const getAllParties = () => makeRequest('/admin/parties', 'GET', null, true);
export const getPartyMembers = (partyId) => makeRequest(`/admin/parties/${partyId}/members`, 'GET', null, true);
export const uploadImage = (imageBase64) => makeRequest('/admin/upload-image', 'POST', { imageBase64 }, true);
export const getWhitelistedVoters = (electionId) => makeRequest(`/admin/elections/${electionId}/whitelisted-voters`, 'GET', null, true);
export const getElectionDetailsAdmin = (electionId) => makeRequest(`/admin/elections/${electionId}`, 'GET', null, true); 
export const createPartyMember = (memberData) => makeRequest('/admin/party-members', 'POST', memberData, true); // (Note: partyId will be in body)
export const getAllPartyMembersAdmin = () => makeRequest('/admin/party-members', 'GET', null, true);

// --- Voter API Calls (Authenticated) ---
export const requestVoterAuthMessage = (email) => makeRequest('/voters/request-auth-message', 'POST', { email });
export const voterAuthenticate = (message, signature, walletAddress, email) => makeRequest('/voters/authenticate', 'POST', { message, signature, walletAddress, email });
export const getAvailableElectionsVoter = () => makeRequest('/voters/elections', 'GET', null, true);
export const castVote = (electionId, postId, candidateId) => makeRequest('/voters/vote', 'POST', { electionId, postId, candidateId }, true);
export const getVoterElectionStatus = (electionId) => makeRequest(`/voters/elections/${electionId}/status`, 'GET', null, true);
export const getVoterVoteReceipts = () => makeRequest('/voters/receipts', 'GET', null, true);

// --- Public API Calls (No Authentication Required) ---
export const getElectionResultsPublic = (electionId, gender = null, ageRange = null) => {
  let query = '';
  if (gender) query += `&gender=${gender}`;
  if (ageRange) query += `&ageRange=${ageRange}`;
  return makeRequest(`/voters/elections/${electionId}/results?${query}`, 'GET');
};

// Public endpoints for fetching election posts and candidates for display
export const getElectionPostsPublic = (electionId) => makeRequest(`/voters/elections/${electionId}/posts`, 'GET');
export const getPostCandidatesPublic = (postId) => makeRequest(`/voters/posts/${postId}/candidates`, 'GET');
export const getElectionDetailsPublic = (electionId) => makeRequest(`/voters/elections/${electionId}`, 'GET');
export const getAllElectionsPublic = () => makeRequest('/voters/public/elections', 'GET');