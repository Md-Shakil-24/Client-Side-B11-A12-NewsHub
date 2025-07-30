import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../provider/AuthProvider";
import ThemeToggle from './ThemeToggle';

const Nav = () => {
  const { user, logOut, isAdmin, isPremiumUser: initialPremiumStatus, refreshUserStatus } = useContext(AuthContext);
  const [currentPremiumStatus, setCurrentPremiumStatus] = useState(initialPremiumStatus);
  const subscriptionCheckInterval = useRef(null);

  const handleLogout = () => {
    logOut().catch((error) => console.error("Logout error:", error));
    if (subscriptionCheckInterval.current) {
      clearInterval(subscriptionCheckInterval.current);
      subscriptionCheckInterval.current = null;
    }
  };

  useEffect(() => {
    setCurrentPremiumStatus(initialPremiumStatus);

    let isMounted = true;

    if (initialPremiumStatus && user) {
      subscriptionCheckInterval.current = setInterval(async () => {
        try {
          await refreshUserStatus();

          const now = new Date();
          const premiumUntil = user?.premiumTaken ? new Date(user.premiumTaken) : null;

          if (!premiumUntil || premiumUntil <= now) {
            if (isMounted) {
              setCurrentPremiumStatus(false);
            }
            if (subscriptionCheckInterval.current) {
              clearInterval(subscriptionCheckInterval.current);
              subscriptionCheckInterval.current = null;
            }
          }
        } catch (error) {
          console.error("Error checking subscription status:", error);
        }
      }, 60000);
    }

    return () => {
      isMounted = false;
      if (subscriptionCheckInterval.current) {
        clearInterval(subscriptionCheckInterval.current);
        subscriptionCheckInterval.current = null;
      }
    };
  }, [initialPremiumStatus, user, refreshUserStatus]);

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "font-bold text-primary" : "")}
        >
          Home
        </NavLink>
      </li>

      {user && (
        <>
          <li>
            <NavLink
              to="/add-article"
              className={({ isActive }) => (isActive ? "font-bold text-primary" : "")}
            >
              Add Article
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/subscription"
              className={({ isActive }) => (isActive ? "font-bold text-primary" : "")}
            >
              Subscription
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/myArticle"
              className={({ isActive }) => (isActive ? "font-bold text-primary" : "")}
            >
              My Articles
            </NavLink>
          </li>
        </>
      )}

      <li>
        <NavLink
          to="/all-articles"
          className={({ isActive }) => (isActive ? "font-bold text-primary" : "")}
        >
          All Articles
        </NavLink>
      </li>

      {currentPremiumStatus && (
        <li>
          <NavLink
            to="/premium-articles"
            className={({ isActive }) => (isActive ? "font-bold text-primary" : "")}
          >
            Premium Articles
          </NavLink>
        </li>
      )}

      {isAdmin && (
        <li>
          <NavLink
            to="/admin"
            className={({ isActive }) => (isActive ? "font-bold text-primary" : "")}
          >
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="bg-base-100/10 shadow-lg ">
    <div className="navbar container mx-auto px-2 lg:px-4  ">
      
      <div className="navbar-start">
        <div className="dropdown">
          <label
            tabIndex={0}
            className="btn btn-ghost lg:hidden"
            aria-label="Open navigation menu"
          >
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
          <span className="text-xl font-bold">NewsHub</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      <div className="navbar-end gap-2">
        {user ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar"
              aria-label="User menu"
            >
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
                <ThemeToggle />
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link to="/auth/signIn" className="btn btn-primary">
              Login
            </Link>
            <Link to="/auth/signUp" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </div>
    </div>
    
  );
};

export default Nav;
