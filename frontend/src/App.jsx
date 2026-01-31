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
// import { CompanyBid } from './pages/company/CompanyBid';
// import { CompanyBid } from './pages/company/CompanyBid';
// import { CompanyBid } from './pages/company/CompanyBid';
import VotePage from './pages/VotePages';
import CreateCompany from './pages/CreatCompany';
import Companies from './pages/Compaines';
import BidPage from './pages/BidPage';
import CreateBid from './pages/CreateBid';
import ProposalBids from './pages/ProposalBids';



// 1. Initialize QueryClient OUTSIDE the component to prevent resets
const queryClient = new QueryClient();

// 2. Define ALL routes here (Consolidated)
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />, // This wraps your pages with the Navbar/Footer
    children: [
      { index: true, element: <Landing /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "propose", element: <RaiseProposal /> },
      { path: "pay", element: <PayDues /> },
      { path: "company/dashboard", element: <CompanyDashboard /> },
      // { path: "company/bid/:id", element: <CompanyBid /> },
      // { path: "company/bid/:id", element: <CompanyBid /> },
      {path:"/votepages",element:<VotePage/>},
      {path:"/creatCompaines",element:<CreateCompany/>},
      {path:"/companies",element:<Companies/>},
      {path:"/createbid",element:<CreateBid/>},
      {path:"/proposalbids",element:<ProposalBids/>},
      {path:"/bidpage",element:<BidPage/>},

      
      {path:"/companies",element:<Companies/>},
      {path:"/createbid",element:<CreateBid/>},
      {path:"/proposalbids",element:<ProposalBids/>},
      {path:"/bidpage",element:<BidPage/>},

      
      { path: "company/bid/:id", element: <CompanyBid /> },
      {path:"/votepages",element:<VotePage/>},
      {path:"/creatCompaines",element:<CreateCompany/>},
      {path:"/companies",element:<Companies/>}
    ],
  },
  // Auth pages usually don't need the main Layout (Navbar), so we keep them separate
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {/* The RouterProvider handles all navigation */}
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;