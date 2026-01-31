import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Internal Imports
import { config } from './config';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { RaiseProposal } from './pages/RaiseProposal';
import { PayDues } from './pages/PayDues';

// Initialize the Query Client for TanStack Query
const queryClient = new QueryClient();

// Define your routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "propose", element: <RaiseProposal /> },
      { path: "pay", element: <PayDues /> },
    ],
  },
]);

function App() {
  const queryClient=new QueryClient();
  return (
    <WagmiProvider config={config}>
      {/* 2. QueryClientProvider is required for Wagmi v2 hooks like useBalance */}
      <QueryClientProvider client={queryClient}>
        {/* 3. RouterProvider handles the multi-page navigation */}
        <RouterProvider router={router} />
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;