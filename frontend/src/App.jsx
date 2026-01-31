import { BrowserRouter, createBrowserRouter, RouterProvider, Routes,Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Dashboard } from './pages/Dashboard';
import { RaiseProposal } from './pages/RaiseProposal';
import { PayDues } from './pages/PayDues';

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
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/payfess"  element={<PayDues/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/raiseproposal" element={<RaiseProposal/>}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;