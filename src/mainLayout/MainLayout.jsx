import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import { useState, useEffect } from "react";
import Nav from "../component/Nav";
import Footer from "../component/Footer";
import ScrollToTop from "../component/ScrollToTop";
import { Home } from "lucide-react";

const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
    <span className="loading loading-spinner loading-lg text-indigo-600"></span>
  </div>
);

const MainLayout = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 300); 
    return () => clearTimeout(timer);
  }, [location.key]); 

  return (
    <div className="flex flex-col min-h-screen" >
      <Nav />
      

      {loading && <Spinner />}

      <ScrollToTop></ScrollToTop>

      <main className={`flex-grow px-4 py-6 ${loading ? "pointer-events-none select-none" : ""}`}>
        <Outlet />
      </main>

      <Footer />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default MainLayout;
