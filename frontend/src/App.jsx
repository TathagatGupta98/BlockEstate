import { BrowserRouter, createBrowserRouter, RouterProvider, Routes,Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { RaiseProposal } from './pages/RaiseProposal';
import { PayDues } from './pages/PayDues';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config } from './components/walletButton';
import Header from './components/Header';

// ... Imports for Wagmi Providers (same as before) ...

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Layout />,
//     children: [
//       { index: true, element: <Landing /> },
//       { path: "dashboard", element: <Dashboard /> },
//       { path: "propose", element: <RaiseProposal /> },
//       { path: "pay", element: <PayDues /> },
//     ],
//   },
// ]);

function App() {
  const queryClient=new QueryClient();
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
         {/* <Header/> */}
    
          <BrowserRouter>
           
            <Routes>
              <Route path="/" element={<Landing/>}/>
              <Route path="/payfess"  element={<PayDues/>}/>
              <Route path="/dashboard" element={<Dashboard/>}/>
              <Route path="/raiseproposal" element={<RaiseProposal/>}/>

            </Routes>
          </BrowserRouter>
      </QueryClientProvider>
    </WagmiProvider>

  );
}

export default App;