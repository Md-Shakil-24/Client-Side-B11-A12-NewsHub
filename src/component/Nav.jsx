import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import logo from "../assets/react.svg";
import ThemeToggle from './ThemeToggle';

const Nav = () => {
  const { user, logOut, isAdmin, isPremiumUser: initialPremiumStatus, refreshUserStatus } = useContext(AuthContext);
  const [currentPremiumStatus, setCurrentPremiumStatus] = useState(initialPremiumStatus);
  const [subscriptionCheckInterval, setSubscriptionCheckInterval] = useState(null);

  const handleLogout = () => {
    logOut().catch((error) => console.error("Logout error:", error));
    if (subscriptionCheckInterval) {
      clearInterval(subscriptionCheckInterval);
    }
  };

  
  useEffect(() => {
    setCurrentPremiumStatus(initialPremiumStatus);

    
    if (initialPremiumStatus && user) {
      const interval = setInterval(async () => {
        try {
          await refreshUserStatus();
         
          const now = new Date();
          const premiumUntil = new Date(user.premiumTaken);
          const isStillPremium = premiumUntil > now;
          
          if (!isStillPremium) {
            setCurrentPremiumStatus(false);
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      }, 60000); 

      setSubscriptionCheckInterval(interval);

      return () => {
        clearInterval(interval);
      };
    }
  }, [initialPremiumStatus, user, refreshUserStatus]);

  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>

      {user && (
        <>
          <li>
            <NavLink to="/add-article">Add Article</NavLink>
          </li>
          <li>
            <NavLink to="/subscription">Subscription</NavLink>
          </li>
          <li>
            <NavLink to="/myArticle">My Articles</NavLink>
          </li>
        </>
      )}

      <li>
        <NavLink to="/all-articles">All Articles</NavLink>
      </li>

      {currentPremiumStatus && (
        <li>
          <NavLink to="/premium-articles">Premium Articles</NavLink>
        </li>
      )}

      {isAdmin && (
        <li>
          <NavLink to="/admin">Dashboard</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-lg px-4 md:px-8">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks}
          </ul>
        </div>
        <Link to="/" className="flex items-center">
          {/* <img src={logo} alt="NewsHub Logo" className="h-10" /> */}
          <span className="text-xl font-bold ml-2">NewsHub</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  src={user.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                  alt={user.displayName || "User"}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <Link to="/myProfile">Profile</Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
              <li>
                <ThemeToggle></ThemeToggle>
              </li>

            </ul>
          </div>
        ) : (
          <Link to="/auth/signIn" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Nav;