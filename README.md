# BlockEstate - Decentralized Housing Society Governance Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Solidity](https://img.shields.io/badge/Solidity-^0.8.20-363636?logo=solidity)](https://soliditylang.org/)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org/)

> **Built for Merge Conflict Hackathon 2025** organized by [MDG Space](https://mdg.iitr.ac.in/) - IIT Roorkee

A revolutionary blockchain-based platform that transforms traditional housing society management through transparent governance, AI-powered decision-making, and smart contract automation.

---

## 🏆 Hackathon Submission

**Team Name:** BlockEstate  
**Hackathon:** Merge Conflict 2025  
**Organizer:** MDG Space, IIT Roorkee

## 👥 Team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/justwasif">
        <img src="https://github.com/justwasif.png" width="100px;" alt=""/>
        <br /><sub><b>justwasif</b></sub>
      </a>
      <br />Database, Backend, Frontend Developer
    </td>
    <td align="center">
      <a href="https://github.com/TathagatGupta98">
        <img src="https://github.com/TathagatGupta98.png" width="100px;" alt=""/>
        <br /><sub><b>TathagatGupta98</b></sub>
      </a>
      <br />Web3, Smart Contract Developer,frontend 
    </td>
    <td align="center">
      <a href="https://github.com/Ibrahim2750mi">
        <img src="https://github.com/Ibrahim2750mi.png" width="100px;" alt=""/>
        <br /><sub><b>Ibrahim2750mi</b></sub>
      </a>
      <br />Configuration, UI/UX & AI Integration
    </td>
    <td align="center">
      <a href="https://github.com/uttkarshshrivastav">
        <img src="https://github.com/uttkarshshrivastav.png" width="100px;" alt=""/>
        <br /><sub><b>uttkarshshrivastav</b></sub>
      </a>
      <br />Agentic AI, Frontend Developer
    </td>
  </tr>
</table>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Smart Contracts](#-smart-contracts)
- [AI Agent System](#-ai-agent-system)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Project Structure](#-project-structure)
- [Demo](#-demo)
- [Future Roadmap](#-future-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

BlockEstate reimagines housing society management by replacing outdated committee systems with a transparent, blockchain-powered governance platform. Residents vote on proposals using Soulbound Tokens (SBTs), while AI agents analyze contractor bids and optimize decision-making.

### What Makes BlockEstate Unique?

- **True Democracy:** 1 Person = 1 Vote via non-transferable Soulbound Tokens
- **AI-Powered Decisions:** Multi-agent system evaluates proposals and contractor bids
- **Complete Transparency:** All funds and votes recorded on-chain
- **Zero Corruption:** Smart contracts eliminate manual intervention
- **Instant Payments:** Automated maintenance fee collection via blockchain

---

## 🎯 Problem Statement

Traditional housing societies face critical challenges:

1. **Lack of Transparency:** Committee members make decisions behind closed doors
2. **Corruption & Mismanagement:** Funds are often misappropriated without accountability
3. **Inefficient Voting:** Manual voting is time-consuming and prone to manipulation
4. **Delayed Payments:** Maintenance collection requires extensive follow-up
5. **Biased Contractor Selection:** Decisions favor personal connections over merit

---

## 💡 Solution

BlockEstate provides an end-to-end blockchain governance platform featuring:

### **Stage 1: Democratic Proposal System**
Residents submit proposals (repairs, upgrades, policies) that undergo on-chain voting. Once a proposal passes, it automatically advances to Stage 2.

### **Stage 2: AI-Powered Contractor Selection**
Companies submit bids which are analyzed by our multi-agent AI system:
- **Understanding Agent:** Analyzes bid quality, feasibility, and sustainability
- **Evaluation Agent:** Scores bids based on price, experience, and risk
- **Decision Agent:** Recommends the best contractor with natural language explanations

### **Stage 3: Smart Contract Execution**
The winning contractor begins work with milestone-based payments locked in the Timelock contract, ensuring completion before fund release.

### **Stage 4: Project Completion**
Residents verify work completion, triggering final payment to the contractor.

---

## ✨ Key Features

### For Residents

- ✅ **Soulbound Token Voting:** Each verified resident receives 1 non-transferable governance token
- ✅ **Proposal Creation:** Submit maintenance, repair, or policy proposals with AI feasibility checks
- ✅ **Real-Time Voting:** Vote on active proposals with blockchain-verified results
- ✅ **Instant Dues Payment:** Pay maintenance fees directly to the treasury via MetaMask
- ✅ **Full Transparency:** View all proposals, votes, and treasury transactions

### For Companies/Contractors

- 🏢 **Bid Submission Portal:** Compete for approved housing society projects
- 🏢 **AI-Based Ranking:** Bids evaluated fairly using multi-factor scoring
- 🏢 **Milestone Payments:** Guaranteed payment upon completion via Timelock
- 🏢 **Reputation System:** Build on-chain credibility through successful projects

### For Society Administrators

- 🔐 **Auto-Governance:** No manual intervention required after deployment
- 🔐 **Treasury Management:** All funds locked in Timelock contract
- 🔐 **Audit Trail:** Complete history of every transaction and vote

---

## 🛠 Tech Stack

### Blockchain Layer
- **Ethereum (Sepolia Testnet):** Primary blockchain for deployment
- **Solidity ^0.8.20:** Smart contract development
- **Foundry:** Testing, deployment, and debugging
- **OpenZeppelin Contracts:** Battle-tested governance modules

### Frontend
- **React 19.2.0:** Modern UI library
- **Vite:** Lightning-fast build tool
- **Wagmi 3.4.1:** React hooks for Ethereum
- **RainbowKit:** Wallet connection UX
- **Framer Motion:** Smooth animations
- **TailwindCSS:** Utility-first styling

### Backend
- **Node.js + Express 5.2.1:** RESTful API server
- **MongoDB + Mongoose 9.1.5:** Proposal and bid storage
- **JWT Authentication:** Secure user sessions
- **Ethers.js 6.16.0:** Blockchain interaction

### AI/ML Layer
- **Google Gemini 2.5 Flash:** Natural language understanding
- **Multi-Agent Orchestration:** Coordinated AI decision-making
- **JSON Schema Validation:** Structured output parsing

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (React)                        │
│  - RainbowKit Wallet Connection                                │
│  - Proposal Dashboard with Stage Tracking                      │
│  - AI Feasibility Checker                                      │
│  - Voting Interface with Live Results                          │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ HTTP/WebSocket
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│                    Backend API (Express)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              AI Agent Orchestrator                       │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │  │
│  │  │ Understanding│  │  Evaluation  │  │   Decision   │   │  │
│  │  │    Agent     │─▶│    Agent     │─▶│    Agent     │   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         MongoDB Database                                 │  │
│  │  - User Accounts                                         │  │
│  │  - Proposals (with on-chain IDs)                        │  │
│  │  - Company Bids                                          │  │
│  │  - AI Analysis Results                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
                   │ ethers.js / viem
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│               Ethereum (Sepolia Testnet)                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HousingToken.sol (ERC20 + ERC20Votes + Soulbound)      │  │
│  │  - safeMint(): Admin issues 1 token per verified user   │  │
│  │  - Transfer blocked after minting (Soulbound)           │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HousingGovernor.sol (OpenZeppelin Governor)            │  │
│  │  - propose(): Create on-chain proposal                  │  │
│  │  - castVote(): Vote For/Against/Abstain                 │  │
│  │  - queue(): Move successful proposals to Timelock       │  │
│  │  - execute(): Trigger payment to contractor             │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  HousingTimelock.sol (TimelockController)               │  │
│  │  - Holds society treasury (ETH)                         │  │
│  │  - Enforces 1-day delay before execution                │  │
│  │  - Only Governor can trigger payments                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📜 Smart Contracts

### 1. **HousingToken.sol** - Soulbound Governance Token

```solidity
// Non-transferable ERC20 token for 1-person-1-vote
contract HousingToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    function safeMint(address to) public onlyOwner {
        _mint(to, 1 * 10 ** decimals());
    }
    
    function _update(address from, address to, uint256 value) internal override {
        if (from != address(0) && to != address(0)) {
            revert SoulboundTransferNotAllowed();
        }
        super._update(from, to, value);
    }
}
```

**Key Features:**
- ✅ Minted only by backend admin wallet after user verification
- ✅ Transfers blocked (Soulbound) - prevents vote selling
- ✅ ERC20Votes compatibility for governance
- ✅ Delegation support for voting power

### 2. **HousingGovernor.sol** - DAO Governance Contract

```solidity
contract HousingGovernor is Governor, GovernorSettings, 
    GovernorCountingSimple, GovernorVotes, 
    GovernorVotesQuorumFraction, GovernorTimelockControl {
    
    constructor(IVotes _token, TimelockController _timelock)
        Governor("HousingGovernor")
        GovernorSettings(
            1,   // 1 block voting delay
            25,  // 25 blocks voting period (~5 min on Sepolia)
            0    // Anyone can propose
        )
        GovernorVotesQuorumFraction(0) // No minimum turnout required
        GovernorTimelockControl(_timelock)
    {}
}


```solidity
contract HousingTimelock is TimelockController {
    constructor(
        uint256 minDelay,  // 1 day = 86400 seconds
        address[] memory proposers,  // Only Governor
        address[] memory executors,  // Anyone can execute after delay
        address admin  // Initial admin (revoked post-deployment)
    ) TimelockController(minDelay, proposers, executors, admin) {}
}
```

**Security Features:**
- 🔒 Only Governor contract can queue operations
- 🔒 1-day delay before fund disbursement
- 🔒 Public execution - anyone can trigger after delay
- 🔒 Admin role revoked after setup

---

## 🤖 AI Agent System

### Multi-Agent Orchestration Pipeline

```javascript
// backend/ai/orchestrator/bidOrchestrator.js
export async function runBidOrchestrator(bids) {
  const lowestAmount = Math.min(...bids.map(b => b.amount));
  const evaluated = [];

  // STEP 1: Understanding Agent analyzes each bid
  for (const bid of bids) {
    const analysis = await understandingAgent(bid.description);
    
    // STEP 2: Evaluation Agent scores the bid
    const score = evaluationAgent(bid.amount, analysis, lowestAmount);

    evaluated.push({
      contractor: bid.contractor,
      amount: bid.amount,
      score,
      analysis
    });
  }

  // STEP 3: Sort by score
  evaluated.sort((a, b) => b.score - a.score);

  // STEP 4: Decision Agent generates explanation
  const explanation = await decisionAgent(evaluated);

  return {
    winner: evaluated[0].contractor,
    ranking: evaluated,
    explanation
  };
}
```

### Agent Roles

#### 1. **Understanding Agent** (Gemini 2.5 Flash)
- Extracts quality, speed, experience, and risk scores from bid descriptions
- Returns structured JSON: `{quality: 0-1, speed: 0-1, experience: 0-1, risk: 0-1}`

#### 2. **Evaluation Agent** (Rule-Based Scoring)
```javascript
function evaluationAgent(amount, analysis, lowestAmount) {
  const priceScore = lowestAmount / amount;
  
  return (
    priceScore * 0.4 +        // 40% weight on price
    analysis.quality * 0.25 +  // 25% weight on quality
    analysis.experience * 0.2 + // 20% weight on experience
    analysis.speed * 0.1 -      // 10% weight on speed
    analysis.risk * 0.05        // -5% penalty for risk
  );
}
```

#### 3. **Decision Agent** (Gemini 2.5 Flash)
- Generates human-readable explanation for why the top contractor was selected
- Example output: *"ABC Construction was selected due to their competitive pricing (₹45,000) combined with extensive 15-year experience in society maintenance. While XYZ offered lower cost, ABC's proven track record and detailed sustainability plan (solar-powered tools) provided better long-term value."*

---

## 🚀 Installation

### Prerequisites

- **Node.js** 18+ and npm
- **Foundry** (for smart contracts)
- **MongoDB** (local or Atlas)
- **MetaMask** browser extension
- **Alchemy API Key** (for Sepolia RPC)

### 1. Clone Repository

```bash
git clone https://github.com/justwasif/BlockEstate.git
cd BlockEstate
```

### 2. Smart Contract Setup

```bash
cd smartContracts

# Install Foundry dependencies
forge install

# Create .env file
cat > .env << EOF
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_deployer_private_key
EOF

# Compile contracts
forge build

# Deploy to Sepolia
forge script script/DeployDAO.s.sol:DeployDAO --rpc-url sepolia --broadcast --verify

# Copy deployed addresses to frontend/src/abis.js
```

### 3. Backend Setup

```bash
cd ../backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=8000
MONGODB_URL=mongodb://localhost:27017/resida0
CORS_ORIGIN=http://localhost:5173

# JWT Secrets
JWT_ACCESSES_TOKEN=your_secret_key
JWT_REFRESH_TOKEN=your_refresh_key
JWT_ACCESSES_EXP=1d
JWT_REFRESH_EXP=7d

# Blockchain Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
ADMIN_PRIVATE_KEY=your_admin_wallet_private_key
HOUSING_TOKEN_ADDRESS=deployed_token_address
GOVERNOR_ADDRESS=deployed_governor_address

# AI Configuration
GEMINI_API_KEY=your_gemini_api_key
EOF

# Start backend
npm run dev
```

### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_BACKEND_URL=http://localhost:8000
EOF

# Update contract addresses in src/abis.js
export const TOKEN_ADDRESS = "0x...";
export const GOVERNOR_ADDRESS = "0x...";
export const TIMELOCK_ADDRESS = "0x...";

# Start frontend
npm run dev
```

### 5. Access Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **MongoDB:** mongodb://localhost:27017/resida0

---

## 📖 Usage Guide

### For Residents

#### 1. **Register & Get Voting Token**

```bash
# Visit http://localhost:5173/signup
# Fill registration form with:
# - Username, Email, Password
# - Wallet Address (MetaMask)
# - House Number

# Backend automatically mints 1 SBT to your wallet
```

#### 2. **Activate Voting Power**

```javascript
// Dashboard > "Activate Voting Power" button
// This delegates your token to yourself
await tokenContract.delegate(userAddress);
```

#### 3. **Create Proposal**

```bash
# Navigate to "Raise Proposal"
# Enter title: "Repair Swimming Pool Pump"
# Enter description: "Detailed requirements..."
# Click "Submit to Community"

# Transaction triggers:
# - Frontend calls HousingGovernor.propose()
# - Backend saves proposal to MongoDB with onChainProposalId
```

#### 4. **Vote on Proposals**

```bash
# Dashboard > Active Proposals
# Select proposal > "Use ID" to autofill
# Click "Approve" or "Reject"

# Transaction:
# - Frontend calls HousingGovernor.castVote(proposalId, 1 or 0)
# - Backend updates acceptCount/rejectCount
```

#### 5. **Pay Maintenance Dues**

```bash
# Navigate to "Pay Dues"
# Click "Pay 0.04 ETH Now"
# MetaMask prompts payment to Timelock address
# Backend records payment timestamp
```

### For Companies/Contractors

#### 1. **Register as Company**

```bash
# Visit http://localhost:5173/companyregister
# Enter company name, wallet, password
# Login redirects to Company Dashboard
```

#### 2. **Browse & Submit Bids**

```bash
# Company Dashboard > "Open Opportunities"
# View Stage 2 proposals (passed voting)
# Click "Submit Bid"
# Enter:
#   - Estimated Cost (e.g., "₹50,000")
#   - Execution Plan (AI analyzes this!)
# Click "Submit Bid"
```

#### 3. **Check AI Ranking**

```bash
# Proposal Details > "Generate Recommendation"
# AI Consensus Agent displays:
#   - Winner contractor
#   - Full ranking with scores
#   - Natural language explanation
```

---

## 📁 Project Structure

```
BlockEstate/
│
├── smartContracts/          # Foundry project
│   ├── src/
│   │   ├── HousingToken.sol
│   │   ├── HousingGovernor.sol
│   │   └── HousingTimelock.sol
│   ├── script/
│   │   └── DeployDAO.s.sol
│   ├── foundry.toml
│   └── .env
│
├── backend/                 # Express API
│   ├── ai/
│   │   ├── agents/
│   │   │   ├── understandingAgent.js
│   │   │   ├── evaluationAgent.js
│   │   │   ├── decisionAgent.js
│   │   │   ├── proposalUnderstandingAgent.js
│   │   │   ├── proposalEvaluationAgent.js
│   │   │   └── proposalDecisionAgent.js
│   │   ├── orchestrator/
│   │   │   ├── bidOrchestrator.js
│   │   │   └── proposalOrchestrator.js
│   │   └── utils/
│   │       └── json.js
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── proposal.controller.js
│   │   ├── bid.controller.js
│   │   ├── company.controller.js
│   │   └── ai.controller.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── proposal.model.js
│   │   ├── bid.model.js
│   │   ├── company.model.js
│   │   └── vote.model.js
│   ├── routes/
│   │   ├── user.route.js
│   │   ├── proposal.route.js
│   │   ├── bid.route.js
│   │   ├── company.route.js
│   │   └── ai.route.js
│   ├── middlewares/
│   │   └── auth.middlewares.js
│   ├── db/
│   │   └── mongo.config.js
│   ├── index.js
│   └── .env
│
├── frontend/                # React + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── ProposalCard.jsx
│   │   │   └── walletButton.js
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── DashboardHome.jsx
│   │   │   ├── ProposalDetails.jsx
│   │   │   ├── RaiseProposal.jsx
│   │   │   ├── PayDues.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── CompanyDashboard.jsx
│   │   │   ├── CompanyLogin.jsx
│   │   │   ├── CreateBid.jsx
│   │   │   └── Companies.jsx
│   │   ├── services/
│   │   │   └── auth.js
│   │   ├── abis.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🎥 Demo

### Live Deployment
- **Frontend:** [Coming Soon]
- **Smart Contracts (Sepolia):** 
  - HousingToken: `0x840Be1e779EF23c309787F1a2AaEDccC98a08DF8`
  - HousingGovernor: `0x0305d3868fB5275925c03B9EC86e52fca5CACB4f`
  - HousingTimelock: `0x12b57693A9c2b78dFb32486662d4c71beEedB531`

### Video Walkthrough
[Watch Full Demo on YouTube](#) *(Upload to YouTube and add link)*

### Screenshots

![Landing Page](https://via.placeholder.com/800x400?text=Landing+Page)
*Landing page with resident and company portals*

![Dashboard](https://via.placeholder.com/800x400?text=Dashboard)
*Kanban-style proposal tracking across 4 stages*

![AI Consensus](https://via.placeholder.com/800x400?text=AI+Consensus)
*AI agent recommending best contractor with explanation*

---

## 🔮 Future Roadmap

### Phase 1: Mainnet Deployment (Q2 2025)
- [ ] Comprehensive smart contract audit
- [ ] Gas optimization for lower transaction costs
- [ ] Deploy to Ethereum Mainnet or Polygon
- [ ] Integrate fiat on-ramp (Stripe/Razorpay)

### Phase 2: Mobile App (Q3 2025)
- [ ] React Native iOS/Android apps
- [ ] Push notifications for votes and proposals
- [ ] Biometric authentication
- [ ] Offline vote caching

### Phase 3: Advanced AI Features (Q4 2025)
- [ ] Predictive maintenance alerts
- [ ] Automated RFP generation from proposals
- [ ] Sentiment analysis on proposal descriptions
- [ ] Fraud detection in contractor bids

### Phase 4: Multi-Society Support (Q1 2026)
- [ ] Tenant contract factory for deploying new DAOs
- [ ] Inter-society resource sharing marketplace
- [ ] Reputation NFTs for contractors
- [ ] DAO-to-DAO collaboration features

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Workflow

1. **Fork the Repository**
```bash
git clone https://github.com/yourusername/BlockEstate.git
cd BlockEstate
git checkout -b feature/your-feature-name
```

2. **Make Changes**
- Follow existing code style (use ESLint/Prettier)
- Write clear commit messages
- Add tests for new features

3. **Submit Pull Request**
```bash
git push origin feature/your-feature-name
# Open PR on GitHub with description
```

### Areas for Contribution

- ✨ **New Features:** See [Roadmap](#-future-roadmap)
- 📚 **Documentation:** Improve README or add tutorials
- 🎨 **UI/UX:** Design improvements or new components
- 🧪 **Testing:** Write unit/integration tests

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 BlockEstate Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

---

## 🙏 Acknowledgments

- **MDG Space, IIT Roorkee** for organizing Merge Conflict Hackathon
- **OpenZeppelin** for secure smart contract libraries
- **Google Gemini Team** for powerful AI models
- **Ethereum Foundation** for blockchain infrastructure
- **Foundry** for excellent developer tooling

---

## 📞 Contact

- **Email:** resida0team@gmail.com
- **Twitter:** [@BlockEstate](https://twitter.com/BlockEstate)
- **Discord:** [Join Our Community](#)


---

<div align="center">

**Built with ❤️ by Team BlockEstate**

[![GitHub stars](https://img.shields.io/github/stars/justwasif/BlockEstate?style=social)](https://github.com/justwasif/BlockEstate/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/justwasif/BlockEstate?style=social)](https://github.com/justwasif/BlockEstate/network/members)

</div>
