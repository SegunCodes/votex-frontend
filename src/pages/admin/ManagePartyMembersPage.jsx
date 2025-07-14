import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  getAllParties,
  getAllPartyMembersAdmin,
  createPartyMember,
  // Removed uploadImage as it's no longer needed for direct URL input
} from '../../services/apiService';

const ManagePartyMembersPage = ({ setActiveView, showMessage, user }) => {
  const [parties, setParties] = useState([]);
  const [allPartyMembers, setAllPartyMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for creating new party member
  const [newPartyMemberName, setNewPartyMemberName] = useState('');
  const [newPartyMemberEmail, setNewPartyMemberEmail] = useState('');
  const [newPartyMemberPartyId, setNewPartyMemberPartyId] = useState('');
  const [newPartyMemberImageUrl, setNewPartyMemberImageUrl] = useState(''); // Changed to text input
  const [isCreatingPartyMember, setIsCreatingPartyMember] = useState(false);

  // Function to fetch all data (parties and members)
  const fetchAllPartyData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const partiesResponse = await getAllParties();
      setParties(partiesResponse.parties);

      const allPartyMembersResponse = await getAllPartyMembersAdmin();
      setAllPartyMembers(allPartyMembersResponse.members);

    } catch (err) {
      console.error('Failed to fetch party data:', err);
      setError(err.data?.error || err.message || 'Failed to load party data.');
      showMessage('Failed to load party data.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showMessage]);

  // Ensure only admin can access this page
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      showMessage('Access denied. Only admins can manage party members.', 'error');
      setActiveView('adminLogin');
    } else {
      fetchAllPartyData();
    }
  }, [user, setActiveView, showMessage, fetchAllPartyData]);

  // Removed handleImageChange as it's no longer needed for file input

  const handleCreatePartyMember = async (e) => {
    e.preventDefault();
    setIsCreatingPartyMember(true);
    // imageUrl is directly from state now, no upload needed

    try {
      const response = await createPartyMember({
        partyId: parseInt(newPartyMemberPartyId),
        name: newPartyMemberName,
        email: newPartyMemberEmail,
        imageUrl: newPartyMemberImageUrl || null // Use the URL directly
      });
      showMessage(response.message, 'success');
      
      await fetchAllPartyData(); // Re-fetch all data to ensure consistency

      // Clear form
      setNewPartyMemberName('');
      setNewPartyMemberEmail('');
      setNewPartyMemberPartyId('');
      setNewPartyMemberImageUrl(''); // Clear URL input
    } catch (err) {
      console.error('Failed to create party member:', err);
      showMessage(err.data?.error || err.message || 'Failed to create party member.', 'error');
    } finally {
      setIsCreatingPartyMember(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex items-center justify-center">
        <p className="text-xl">Loading party data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
        <p className="text-red-500 text-xl mb-4">Error: {error}</p>
        <button
          onClick={() => setActiveView('adminDashboard')}
          className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
        >
          Back to Admin Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center p-8">
      <h2 className="text-5xl font-bold mb-8 text-yellow-400">Manage Parties & Members</h2>

      {/* Party Member Creation Section */}
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg mb-8">
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">Create New Party Member</h3>
        <p className="text-gray-400 mb-4">Add individuals who can later be assigned as candidates to election posts.</p>
        <form onSubmit={handleCreatePartyMember} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="newPartyMemberName" className="block text-gray-300 text-sm font-bold mb-2">Name:</label>
            <input type="text" id="newPartyMemberName" className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 bg-gray-200" placeholder="John Doe" value={newPartyMemberName} onChange={(e) => setNewPartyMemberName(e.target.value)} required disabled={isCreatingPartyMember} />
          </div>
          <div>
            <label htmlFor="newPartyMemberEmail" className="block text-gray-300 text-sm font-bold mb-2">Email:</label>
            <input type="email" id="newPartyMemberEmail" className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 bg-gray-200" placeholder="john.doe@example.com" value={newPartyMemberEmail} onChange={(e) => setNewPartyMemberEmail(e.target.value)} required disabled={isCreatingPartyMember} />
          </div>
          <div>
            <label htmlFor="newPartyMemberPartyId" className="block text-gray-300 text-sm font-bold mb-2">Party:</label>
            <select id="newPartyMemberPartyId" className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 bg-gray-200" value={newPartyMemberPartyId} onChange={(e) => setNewPartyMemberPartyId(e.target.value)} required disabled={isCreatingPartyMember}>
              <option value="">-- Select Party --</option>
              {parties.map(party => (
                <option key={party.id} value={party.id}>{party.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="newPartyMemberImageUrl" className="block text-gray-300 text-sm font-bold mb-2">Image URL (Optional):</label>
            <input type="text" id="newPartyMemberImageUrl" className="shadow appearance-none border rounded-lg w-full py-2 px-3 text-gray-900 bg-gray-200" placeholder="https://example.com/image.jpg" value={newPartyMemberImageUrl} onChange={(e) => setNewPartyMemberImageUrl(e.target.value)} disabled={isCreatingPartyMember} />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
              disabled={isCreatingPartyMember}
            >
              {isCreatingPartyMember ? 'Creating Member...' : 'Create Party Member'}
            </button>
          </div>
        </form>
      </div>

      {/* List of Parties and their Members */}
      <div className="w-full max-w-4xl bg-gray-800 p-8 rounded-xl shadow-lg">
        <h3 className="text-3xl font-semibold text-gray-200 mb-4">Existing Parties & Members</h3>
        {allPartyMembers.length === 0 && parties.length === 0 ? (
          <p className="text-gray-400">No parties or members found. Create a party member above.</p>
        ) : (
          <div className="space-y-6">
            {parties.map(party => (
              <div key={party.id} className="bg-gray-700 p-5 rounded-lg shadow">
                <h4 className="text-2xl font-bold text-white mb-3">{party.name}</h4>
                {party.logo_url && <img src={party.logo_url} alt={`${party.name} Logo`} className="w-16 h-16 rounded-full object-cover mb-3" />}
                <p className="text-gray-300 text-sm mb-3">{party.description}</p>
                
                <h5 className="text-xl font-semibold text-gray-300 mb-2">Members:</h5>
                {allPartyMembers.filter(member => member.party_id === party.id).length > 0 ? (
                  <ul className="list-disc list-inside text-gray-400 space-y-2">
                    {allPartyMembers.filter(member => member.party_id === party.id).map(member => (
                      <li key={member.id} className="flex items-center text-lg">
                        {member.image_url && <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover mr-3" />}
                        <span>{member.name} ({member.email})</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-sm">No members in this party yet.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => setActiveView('adminDashboard')}
        className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
      >
        Back to Admin Dashboard
      </button>
    </div>
  );
};

ManagePartyMembersPage.propTypes = {
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default ManagePartyMembersPage;
