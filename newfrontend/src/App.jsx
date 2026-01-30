import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { RaiseProposal } from './pages/RaiseProposal';
import { PayDues } from './pages/PayDues';

// ... Imports for Wagmi Providers (same as before) ...

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
  return (
    // ... Wrap with WagmiProvider & QueryProvider ...
    <RouterProvider router={router} />
    // ...
  );
}

export default App;