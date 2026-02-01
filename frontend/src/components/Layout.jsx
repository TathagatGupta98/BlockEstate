import { Link, useLocation, useOutlet } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Wallet, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function Layout() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const location = useLocation();
  const outlet = useOutlet(); // ✅ important

  const isActive = (path) =>
      location.pathname === path
          ? "text-maroon-900 font-bold border-b-2 border-maroon-900"
          : "text-gray-600 hover:text-maroon-700";

  const pageVariants = {
    initial: {
      opacity: 0,
      y: 50, // coming from below
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        type: "tween",
        ease: "easeIn", // ✅ ease in for incoming page
        duration: 0.4,
      },
    },
    exit: {
      opacity: 0,
      y: -50, // ✅ leaving page moves UP
      transition: {
        type: "tween",
        ease: "easeOut", // ✅ ease out for outgoing page
        duration: 0.4,
      },
    },
  };

  return (
      <div className="min-h-screen bg-white font-sans text-gray-800">
        {/* Navigation Bar */}
        <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="text-2xl font-extrabold text-maroon-900 flex items-center gap-2">
                  <div className="w-8 h-8 bg-maroon-900 rounded-lg"></div>
                  ResiDAO
                </Link>

                {isConnected && (
                    <div className="hidden md:flex ml-10 space-x-8">
                      <Link to="/Home" className={isActive("/dashboard")}>Overview</Link>
                      <Link to="/propose" className={isActive("/propose")}>Raise Proposal</Link>
                      <Link to="/pay" className={isActive("/pay")}>Pay Dues</Link>
                      <Link to="/companies" className={isActive("/companies")}>companies</Link>
                    </div>
                )}
              </div>

              <div className="flex items-center">
                {isConnected ? (
                    <div className="flex items-center gap-4">
                  <span className="hidden md:block text-sm font-medium text-maroon-800 bg-maroon-50 px-3 py-1 rounded-full border border-maroon-100">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                      <button
                          onClick={() => disconnect()}
                          className="p-2 text-gray-500 hover:text-maroon-900 transition"
                      >
                        <LogOut size={20} />
                      </button>
                    </div>
                ) : (
                    <button
                        onClick={() => connect({ connector: injected() })}
                        className="bg-maroon-900 text-white px-5 py-2 rounded-lg font-medium hover:bg-maroon-800 transition flex items-center gap-2"
                    >
                      <Wallet size={18} /> Connect Wallet
                    </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Page Content with Animations */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
              {outlet} {/* ✅ this is the actual route element */}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
  );
}
