VoteX Frontend (React.js)
This repository contains the user-facing interface for the VoteX Blockchain-Based E-Voting System, built with React.js and styled using Tailwind CSS. It provides intuitive dashboards for both electoral administrators and voters, enabling seamless interaction with the underlying blockchain and backend services.

✨ Features
Responsive Design: Optimized for various screen sizes (mobile, tablet, desktop).

Admin Login: Secure authentication for electoral administrators.

Voter Login: Decentralized authentication via MetaMask wallet signature.

Admin Dashboard: Navigation to manage elections, register voters, and manage parties/members.

Voter Dashboard: Access to available elections and vote receipts.

Public Results Dashboard: Real-time and finalized election results accessible to all.

🧱 Tech Stack
Frontend Framework: React.js

Styling: Tailwind CSS

Build Tool: Vite

Wallet Integration: MetaMask (via window.ethereum)

API Communication: Fetch API

🚀 Getting Started
Follow these steps to get the VoteX Frontend up and running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm (Node Package Manager) or Yarn

Installation
Clone the repository:

git clone https://github.com/SegunCodes/votex-frontend.git # Replace with your actual repo URL
cd votex-frontend

Install dependencies:

npm install
# or
yarn install

Configure Environment Variables:
Create a .env file in the root of the votex-frontend directory:

# .env
VITE_BACKEND_URL: The URL of your running VoteX Backend API.

Running the Application
To start the development server:

npm run dev
# or
yarn dev

The application will typically be available at http://localhost:5173/.

Important Notes for Local Development
Backend and Smart Contracts Required: This frontend requires the VoteX Backend and the deployed Smart Contracts to be running for full functionality. Please refer to their respective READMEs for setup instructions.

MetaMask: Ensure you have the MetaMask browser extension installed and configured to connect to your local Hardhat Network (http://127.0.0.1:8545, Chain ID: 31337). You'll need to import the private key of your test admin/voter account into MetaMask.

CORS: The backend is configured with CORS to allow requests from http://localhost:5173.

📂 Project Structure
votex-frontend/
├── public/
│   ├── abi/                  # Compiled Smart Contract ABIs (e.g., VoteXElection.json)
│   └── index.html            # Main HTML file
├── src/
│   ├── assets/               # Static assets like images, icons
│   ├── components/           # Reusable UI components (e.g., MessageBox)
│   ├── pages/                # Top-level application views/pages
│   │   ├── admin/            # Admin-specific pages (e.g., ManageElectionsPage)
│   │   └── voter/            # Voter-specific pages (e.g., VotingPage)
│   ├── router/               # Application routing logic (AppRouter.jsx)
│   ├── services/             # API communication (apiService.js)
│   ├── App.jsx               # Main application component
│   └── main.jsx              # Application entry point
├── .env                      # Environment variables (local)
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js

🤝 Contributing
Contributions are welcome! Please follow standard Gitflow practices.