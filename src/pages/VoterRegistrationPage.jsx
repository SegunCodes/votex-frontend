import React, {  useState } from "react";
import PropTypes from "prop-types";
import { registerVoterByAdmin } from "../services/apiService";

const VoterRegistrationPage = ({ setActiveView, showMessage, user }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [nationalIdNumber, setNationalIdNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => console.log("Active"), []);

  // Ensure only admin can access this page
  if (!user || user.role !== "admin") {
    showMessage("Access denied. Only admins can register voters.", "error");
    setActiveView("adminLogin");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const voterData = {
        email,
        name,
        age: parseInt(age),
        gender,
        nationalIdNumber: nationalIdNumber || null,
      };
      const response = await registerVoterByAdmin(voterData);
      showMessage(response.message, "success");
      // Clear form
      setEmail("");
      setName("");
      setAge("");
      setGender("");
      setNationalIdNumber("");
    } catch (error) {
      console.error("Admin voter registration error:", error);
      showMessage(
        error.data?.error || error.message || "Failed to register voter.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter flex flex-col items-center justify-center p-8">
      <h2 className="text-5xl font-bold mb-6 text-teal-400">
        Admin: Register New Voter
      </h2>
      <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
        Register a new voter profile. They will link their wallet during their
        first login.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Voter Email:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            placeholder="voter@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Full Name:
          </label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="age"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Age:
          </label>
          <input
            type="number"
            id="age"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            placeholder="e.g., 30"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            min="18"
            disabled={isLoading}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="gender"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            Gender:
          </label>
          <select
            id="gender"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            disabled={isLoading}
          >
            <option value="">-- Select Gender --</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-6">
          <label
            htmlFor="nationalId"
            className="block text-gray-300 text-sm font-bold mb-2"
          >
            National ID Number (Optional):
          </label>
          <input
            type="text"
            id="nationalId"
            className="shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-900 leading-tight focus:outline-none focus:shadow-outline bg-gray-200"
            placeholder="e.g., NIN123456789"
            value={nationalIdNumber}
            onChange={(e) => setNationalIdNumber(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-teal-700 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105"
          disabled={isLoading}
        >
          {isLoading ? "Registering Voter..." : "Register Voter"}
        </button>
      </form>

      <button
        onClick={() => setActiveView("adminDashboard")}
        className="mt-8 px-6 py-3 bg-gray-600 text-white font-semibold rounded-full shadow-lg hover:bg-gray-700 transition-colors duration-300"
      >
        Back to Admin Dashboard
      </button>
    </div>
  );
};

VoterRegistrationPage.propTypes = {
  setActiveView: PropTypes.func.isRequired,
  showMessage: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default VoterRegistrationPage;
