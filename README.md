# BlockEstate - Decentralized Housing Society Management

![BlockEstate Banner](https://img.shields.io/badge/Web3-Housing_DAO-8b1538?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Solidity](https://img.shields.io/badge/Solidity-0.8.20-363636?style=flat-square&logo=solidity)
![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)

## 🏛️ Problem Statement

Traditional housing society management faces critical challenges:

- **Financial Opacity**: Maintenance funds managed by committees lack transparency, leading to misappropriation
- **Power Centralization**: Decision-making concentrated in the hands of a few elected members
- **Fraudulent Practices**: Kickbacks and inflated contractor bids drain community resources
- **Inefficient Procurement**: No standardized process for selecting vendors and contractors
- **Lack of Accountability**: Once projects are approved, there's minimal oversight on fund utilization
- **Resident Disengagement**: Complex bureaucracy discourages active participation in society governance

**The Result**: Housing societies lose 15-30% of maintenance funds to corruption, residents feel powerless, and critical repairs are delayed or overpriced.

---

## 💡 Our Solution: BlockEstate DAO

BlockEstate transforms housing society management through **decentralized governance** and **AI-powered decision making**:

### Core Innovation

1. **Soulbound Token Voting (1 Person = 1 Vote)**
   - Each resident receives a non-transferable governance token upon registration
   - Eliminates proxy voting and ensures democratic participation
   - Built on Ethereum using ERC20Votes standard

2. **Smart Contract Treasury**
   - Maintenance funds locked in a Timelock Vault
   - Funds only released via community vote (Governor contract)
   - Complete transparency - every transaction visible on-chain

3. **AI Feasibility Analysis**
   - Gemini 2.5 Flash agent evaluates proposal risk, timeline, and budget
   - Provides residents with data-driven insights before voting
   - Reduces emotional decision-making

4. **Competitive Bidding Platform**
   - Companies submit counter-proposals with detailed estimates
   - Residents vote on best contractor based on transparent criteria
   - Market forces drive down costs naturally

5. **Milestone-Based Fund Release**
   - Projects split into 3 stages (e.g., 30% / 40% / 30%)
   - Funds released only upon resident approval of each milestone
   - Protects against contractor abandonment

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Resident   │  │   Company    │  │    Admin     │         │
│  │  Dashboard   │  │  Dashboard   │  │   Portal     │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│         └─────────────────┴──────────────────┘                  │
│                           │                                     │
│                   ┌───────▼────────┐                            │
│                   │  RainbowKit +  │                            │
│                   │  Wagmi/Viem    │                            │
│                   └───────┬────────┘                            │
└───────────────────────────┼─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐  ┌───────▼────────┐  ┌──────▼──────┐
│  BLOCKCHAIN    │  │    BACKEND     │  │   AI LAYER  │
│  (Sepolia)     │  │  (Node/Express)│  │   (Gemini)  │
│                │  │                │  │             │
│ ┌────────────┐ │  │ ┌────────────┐ │  │ ┌─────────┐ │
│ │ Housing    │ │  │ │  MongoDB   │ │  │ │ Proposal│ │
│ │ Token      │ │  │ │  Models:   │ │  │ │Understanding│
│ │ (SBT)      │ │  │ │  - User    │ │  │ │  Agent  │ │
│ └────────────┘ │  │ │  - Proposal│ │  │ └─────────┘ │
│                │  │ │  - Bid     │ │  │ ┌─────────┐ │
│ ┌────────────┐ │  │ │  - Company │ │  │ │Evaluation│ │
│ │ Governor   │ │  │ │  - Vote    │ │  │ │  Agent  │ │
│ │ Contract   │ │  │ └────────────┘ │  │ └─────────┘ │
│ └────────────┘ │  │                │  │ ┌─────────┐ │
│                │  │ ┌────────────┐ │  │ │Decision │ │
│ ┌────────────┐ │  │ │   REST     │ │  │ │  Agent  │ │
│ │ Timelock   │ │  │ │    API     │ │  │ └─────────┘ │
│ │  Vault     │ │  │ └────────────┘ │  │             │
│ └────────────┘ │  └────────────────┘  └─────────────┘
└────────────────┘
```

### Data Flow: Proposal Lifecycle

```
Stage 1: Proposal Creation & Voting
┌─────────┐      ┌─────────┐      ┌──────────┐      ┌─────────┐
│Resident │─────▶│Governor │─────▶│AI Analysis│─────▶│ Vote    │
│Submits  │      │Contract │      │(Feasibility)│    │(On-Chain)│
└─────────┘      └─────────┘      └──────────┘      └─────────┘
                                                           │
                                                           ▼
                                               ┌────────────────────┐
                                               │ Proposal Succeeds  │
                                               │ (Quorum Met)       │
                                               └─────────┬──────────┘
                                                         ▼
Stage 2: Company Bidding
┌──────────┐      ┌─────────┐      ┌──────────┐      ┌─────────┐
│Companies │─────▶│Backend  │─────▶│AI Agent  │─────▶│ Residents│
│Submit    │      │Stores   │      │Ranks Bids│      │Vote Again│
│Estimates │      │Bids     │      │          │      │          │
└──────────┘      └─────────┘      └──────────┘      └─────────┘
                                                           │
                                                           ▼
                                               ┌────────────────────┐
                                               │ Winning Contractor │
                                               │ Selected           │
                                               └─────────┬──────────┘
                                                         ▼
Stage 3: Milestone Execution
┌──────────┐      ┌─────────┐      ┌──────────┐      ┌─────────┐
│Contractor│─────▶│Completes│─────▶│Residents │─────▶│Timelock │
│Works     │      │Milestone│      │Vote to   │      │Releases │
│          │      │         │      │Approve   │      │30% Funds│
└──────────┘      └─────────┘      └──────────┘      └─────────┘
                                         │                  │
                                         │                  ▼
                                         │         (Repeat 3 times)
                                         ▼
Stage 4: Project Completion
                                   ┌────────────┐
                                   │ Verified & │
                                   │  Archived  │
                                   └────────────┘
```

---

## 📂 Project Structure

```
BlockEstate/
├── frontend/                  # React + Vite Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx       # Resident voting interface
│   │   │   ├── RaiseProposal.jsx   # Submit new proposals
│   │   │   ├── PayDues.jsx         # Maintenance payment
│   │   │   ├── company/
│   │   │   │   ├── CompanyDashboard.jsx  # Contractor portal
│   │   │   │   └── CompanyBid.jsx         # Bid submission
│   │   ├── components/
│   │   │   ├── Layout.jsx          # Main navigation
│   │   │   └── walletButton.js     # RainbowKit config
│   │   ├── services/
│   │   │   └── auth.js             # API client (Axios)
│   │   └── abis/                   # Smart contract ABIs
│   └── package.json
│
├── backend/                   # Node.js + Express Server
│   ├── controllers/
│   │   ├── proposal.controller.js  # CRUD + blockchain sync
│   │   ├── bid.controller.js       # Company bid management
│   │   ├── vote.controller.js      # Vote tracking
│   │   ├── ai.controller.js        # Gemini AI integration
│   │   └── user.controller.js      # Auth + SBT minting
│   ├── models/
│   │   ├── proposal.model.js       # MongoDB schemas
│   │   ├── bid.model.js
│   │   ├── company.model.js
│   │   └── vote.model.js
│   ├── routes/                     # Express routing
│   ├── ProposalAI/                 # AI Agent orchestration
│   │   ├── agents/
│   │   │   ├── proposalUnderstandingAgent.js
│   │   │   ├── proposalEvaluationAgent.js
│   │   │   └── proposalDecisionAgent.js
│   │   └── orchestrator/
│   │       └── proposalOrchestrator.js
│   └── index.js
│
├── smartContracts/            # Foundry Solidity Project
│   ├── src/
│   │   ├── HousingToken.sol        # Soulbound governance token
│   │   ├── HousingGovernor.sol     # DAO voting logic
│   │   └── HousingTimelock.sol     # Fund vault controller
│   ├── script/
│   │   └── DeployDAO.s.sol         # Deployment automation
│   └── foundry.toml
│
└── agents/                    # Standalone AI Modules (Legacy)
    ├── compony_agent/              # Bid evaluation system
    └── proposal_judge/             # Proposal ranking
```

---

## 🔧 Technology Stack

### Frontend
- **React 19.2** - UI framework
- **Vite** - Build tool
- **RainbowKit** - Wallet connection
- **Wagmi/Viem** - Ethereum interactions
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

### Backend
- **Node.js + Express** - REST API
- **MongoDB** - Database
- **Ethers.js** - Smart contract calls
- **JWT** - Authentication
- **Google Generative AI** - Gemini integration

### Blockchain
- **Solidity 0.8.20** - Smart contracts
- **OpenZeppelin** - Security standards
- **Foundry** - Development framework
- **Sepolia Testnet** - Deployment network

### AI Layer
- **Gemini 2.5 Flash** - Proposal analysis
- **Agent Architecture**:
  - Understanding Agent (NLP)
  - Evaluation Agent (Scoring)
  - Decision Agent (Explanation)

---

## 🚀 Getting Started

### Prerequisites
```bash
# Required
Node.js >= 18
Foundry (https://getfoundry.sh)
MongoDB >= 7.0
MetaMask wallet

# Environment Variables
SEPOLIA_RPC_URL=your_alchemy_endpoint
ADMIN_PRIVATE_KEY=your_deployer_key
HOUSING_TOKEN_ADDRESS=deployed_token_address
GOVERNOR_ADDRESS=deployed_governor_address
GEMINI_API_KEY=your_google_ai_key
MONGODB_URL=mongodb://localhost:27017/blockestate
JWT_ACCESSES_TOKEN=your_secret
```

### Installation

#### 1. Clone Repository
```bash
git clone https://github.com/yourusername/blockestate.git
cd blockestate
```

#### 2. Deploy Smart Contracts
```bash
cd smartContracts
forge install
forge build
forge script script/DeployDAO.s.sol --rpc-url sepolia --broadcast --verify
# Copy deployed addresses to .env
```

#### 3. Start Backend
```bash
cd backend
npm install
cp .env.example .env  # Fill in your values
npm run dev           # Runs on port 8000
```

#### 4. Start Frontend
```bash
cd frontend
npm install
cp .env.example .env  # Add contract addresses
npm run dev           # Runs on port 5173
```

#### 5. Test Blockchain Minting
```bash
cd backend
node test-mint.js  # Verifies SBT minting works
```

---

## 📖 Usage Guide

### For Residents

1. **Register**
   - Sign up with wallet address
   - Receive 1 Soulbound Token (auto-minted)
   
2. **Pay Maintenance**
   - Navigate to "Pay Dues"
   - Send 0.04 ETH to Timelock
   - Voting rights activated

3. **Create Proposal**
   - Click "Raise Proposal"
   - Fill title, description
   - Submit to Governor contract
   - Wait for AI feasibility report

4. **Vote on Proposals**
   - View proposals in Dashboard
   - Click "?" icon to see AI analysis
   - Cast vote (Approve/Reject)
   - Vote recorded on-chain

5. **Select Contractor**
   - After Stage 1 approval, review company bids
   - Vote on preferred contractor
   - Track project milestones

### For Companies

1. **Register Company**
   - Create company profile
   - Await admin verification

2. **Browse Opportunities**
   - View active proposals (Stage 2)
   - See estimated budgets

3. **Submit Bid**
   - Provide detailed estimate
   - Include timeline & methodology
   - AI ranks against competitors

4. **Execute Project**
   - Upon selection, begin work
   - Submit milestone completion requests
   - Receive staged payments

---

## 🧪 Smart Contract Details

### HousingToken.sol (Soulbound)
```solidity
// Key Features:
- ERC20Votes (governance power)
- safeMint() - Admin issues 1 token per resident
- Transfer blocked (Soulbound)
- Ownership transferred to backend for auto-minting
```

### HousingGovernor.sol
```solidity
// Parameters:
- Voting Delay: 1 block
- Voting Period: 25 blocks (~5 min on Sepolia)
- Quorum: 0% (simple majority)
- Proposal Threshold: 0 (anyone can propose)
```

### HousingTimelock.sol
```solidity
// Configuration:
- Min Delay: 1 day (before execution)
- Proposer: Governor contract
- Executor: Anyone (address(0))
```

### Deployment Addresses (Sepolia)
```
HousingToken: 0x...
HousingGovernor: 0x...
HousingTimelock: 0x...
```

---

## 🤖 AI Agent Workflow

### Proposal Understanding Agent
```javascript
Input: Proposal description (string)
Output: {
  relevance: 0.85,
  feasibility: 0.72,
  impact: 0.9,
  clarity: 0.95,
  risk: 0.15,
  approxTimeMonths: 6,
  approxBudgetLevel: "medium",
  keyRisks: ["Weather delays", "Material shortage"],
  requirements: ["Building permit", "Safety clearance"]
}
```

### Evaluation Agent
```javascript
// Scoring Formula:
score = (
  relevance * 0.25 +
  feasibility * 0.25 +
  impact * 0.25 +
  clarity * 0.1 +
  timeScore * 0.1 +
  budgetScore * 0.1 -
  risk * 0.15
)
```

### Decision Agent
```javascript
Input: Ranked proposals
Output: "The top-ranked contractor was selected due to 
        superior feasibility (95%), competitive pricing, 
        and proven track record in similar projects."
```

---

## 🔐 Security Considerations

### Implemented Safeguards
- ✅ Soulbound tokens prevent vote selling
- ✅ Timelock prevents instant fund drain
- ✅ Multi-stage fund release limits contractor risk
- ✅ On-chain voting creates immutable audit trail
- ✅ JWT authentication for backend API
- ✅ Environment variables for sensitive keys

### Audit Status
⚠️ **Not Yet Audited** - Do not use in production with real funds

### Known Limitations
- No emergency pause mechanism
- Quorum set to 0% (vulnerable to low turnout)
- Backend private key stored in .env (use HSM in prod)

---

## 🛣️ Roadmap

### Phase 1: MVP (Current)
- [x] Core DAO contracts
- [x] Resident voting interface
- [x] Company bidding portal
- [x] AI feasibility analysis
- [x] Milestone-based payments

### Phase 2: Enhancement (Q2 2025)
- [ ] Multi-signature emergency controls
- [ ] IPFS integration for proposal documents
- [ ] Mobile app (React Native)
- [ ] Layer 2 deployment (Arbitrum/Optimism)
- [ ] Reputation system for contractors

### Phase 3: Scale (Q3 2025)
- [ ] Multi-society federation
- [ ] Fiat on/off ramps (Stripe integration)
- [ ] Insurance integration for projects
- [ ] DAO treasury yield farming
- [ ] Governance token distribution (optional)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Standards
- Follow existing code style
- Write tests for smart contract changes
- Update documentation for new features
- Use conventional commits

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 👥 Team

**Core Contributors**
- Blockchain Lead - Tathagat Gupta
- Full-Stack Developer - Mohammad Ibrahim
- UI/UX Designer - Mohammed Wasif Ansari
- AI Engineer - Uttkarsh Shrivastav
---

## 📊 Project Status

![Development Status](https://img.shields.io/badge/Status-MVP_Complete-brightgreen?style=for-the-badge)
![Test Coverage](https://img.shields.io/badge/Coverage-65%25-yellow?style=flat-square)
![Last Commit](https://img.shields.io/github/last-commit/yourusername/blockestate?style=flat-square)

**Current Version**: v0.1.0 (Sepolia Testnet)

---

*Built with ❤️ for transparent, democratic community governance*
