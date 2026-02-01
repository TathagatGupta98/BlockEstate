import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

// Internal Imports
import { config } from './components/walletButton';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { RaiseProposal } from './pages/RaiseProposal';
import { PayDues } from './pages/PayDues';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { CompanyDashboard } from './pages/company/CompanyDashboard';
import VotePage from './pages/VotePages';
import CompanyRegister from './pages/CompanyRegister';
import Companies from './pages/Compaines';
import BidPage from './pages/BidPage';
import CreateBid from './pages/CreateBid';
import ProposalBids from './pages/ProposalBids';
import Webpage from './pages/Webpage';
import CompanyLogin from './pages/CompanyLogin';

// ✅ 1. IMPORT THE NEW PAGES
import { DashboardHome } from './pages/DashboardHome';
import { ProposalDetails } from './pages/ProposalDetails'; 

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Webpage /> },

      { path: "home", element: <DashboardHome /> },

      
      { path: "proposal/:id", element: <ProposalDetails /> },

      { path: "dashboard", element: <Dashboard /> }, // Old Dashboard (keep if needed)
      { path: "propose", element: <RaiseProposal /> },
      { path: "pay", element: <PayDues /> },
      
      
      // Other Pages
      { path: "votepages", element: <VotePage /> },
      { path: "/open", element: <Companies/> },
      { path: "createbid", element: <CreateBid /> },
      { path: "proposalbids", element: <ProposalBids /> },
      { path: "bidpage", element: <BidPage /> },
    ],
  },
  
  // Auth Pages (No Navbar)
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  { path: "/companyregister", element: <CompanyRegister /> },
  { path: "/companylogin", element: <CompanyLogin /> },
  { path: "/company/dashboard_", element: <CompanyDashboard /> },
]);

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;