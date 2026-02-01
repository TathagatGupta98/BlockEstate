import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";

import { config } from "./components/walletButton";
import { Layout } from "./components/Layout";
import AuthLayout from "./components/AuthLayout";

import { Dashboard } from "./pages/Dashboard";
import { RaiseProposal } from "./pages/RaiseProposal";
import { PayDues } from "./pages/PayDues";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { CompanyDashboard } from "./pages/company/CompanyDashboard";
import VotePage from "./pages/VotePages";
import CompanyRegister from "./pages/CompanyRegister";
import Companies from "./pages/Compaines";
import BidPage from "./pages/BidPage";
import CreateBid from "./pages/CreateBid";
import ProposalBids from "./pages/ProposalBids";
import Webpage from "./pages/Webpage";
import CompanyLogin from "./pages/CompanyLogin";

import { DashboardHome } from "./pages/DashboardHome";
import { ProposalDetails } from "./pages/ProposalDetails";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  // ✅ MAIN APP ROUTES (Navbar + animations)
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Webpage /> },

      { path: "home", element: <DashboardHome /> },
      { path: "proposal/:id", element: <ProposalDetails /> },

      { path: "dashboard", element: <Dashboard /> },
      { path: "propose", element: <RaiseProposal /> },
      { path: "pay", element: <PayDues /> },

      { path: "votepages", element: <VotePage /> },

      // ✅ IMPORTANT: remove leading "/" in child routes
      { path: "open", element: <Companies /> },

      { path: "createbid", element: <CreateBid /> },
      { path: "proposalbids", element: <ProposalBids /> },
      { path: "bidpage", element: <BidPage /> },
    ],
  },

  // ✅ AUTH ROUTES (No navbar + animations)
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "companyregister", element: <CompanyRegister /> },
      { path: "companylogin", element: <CompanyLogin /> },
    ],
  },

  // Standalone pages (if you want them WITHOUT Layout)
  { path: "/company/dashboard_", element: <CompanyDashboard /> },
  { path: "/openCompany", element: <Companies /> },
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
