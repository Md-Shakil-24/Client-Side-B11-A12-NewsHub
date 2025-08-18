import { Link, NavLink } from "react-router-dom";
import { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../provider/AuthProvider";
import ThemeToggle from "./ThemeToggle";

const Nav = () => {
  const {
    user,
    logOut,
    isAdmin,
    isPremiumUser: initialPremiumStatus,
    refreshUserStatus,
  } = useContext(AuthContext);

  const [currentPremiumStatus, setCurrentPremiumStatus] = useState(
    initialPremiumStatus
  );
  const subscriptionCheckInterval = useRef(null);

  const [moreOpen, setMoreOpen] = useState(false);

  
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY.current) {
        setShowNav(false); 
      } else {
        setShowNav(true); 
      }
      lastScrollY.current = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    setCurrentPremiumStatus(initialPremiumStatus);
    let isMounted = true;

    if (initialPremiumStatus && user) {
      subscriptionCheckInterval.current = setInterval(async () => {
        try {
          await refreshUserStatus();
          const now = new Date();
          const premiumUntil = user?.premiumTaken
            ? new Date(user.premiumTaken)
            : null;

          if (!premiumUntil || premiumUntil <= now) {
            if (isMounted) setCurrentPremiumStatus(false);
            clearInterval(subscriptionCheckInterval.current);
            subscriptionCheckInterval.current = null;
          }
        } catch (error) {
          console.error("Subscription check error:", error);
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

  const handleLogout = () => {
    logOut().catch((error) => console.error("Logout error:", error));
    if (subscriptionCheckInterval.current) {
      clearInterval(subscriptionCheckInterval.current);
      subscriptionCheckInterval.current = null;
    }
  };

 
  const dropdownLinks = (
    <>
      {isAdmin && (
        <li>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              isActive ? "font-bold text-primary" : "hover:text-primary"
            }
          >
            Dashboard
          </NavLink>
        </li>
      )}
      {user && (
        <>
          <li>
            <NavLink
              to="/myArticle"
              className={({ isActive }) =>
                isActive ? "font-bold text-primary" : "hover:text-primary"
              }
            >
              My Articles
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add-article"
              className={({ isActive }) =>
                isActive ? "font-bold text-primary" : "hover:text-primary"
              }
            >
              Add Article
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/subscription"
              className={({ isActive }) =>
                isActive ? "font-bold text-primary" : "hover:text-primary"
              }
            >
              Subscription
            </NavLink>
          </li>
        </>
      )}
      {currentPremiumStatus && (
        <li>
          <NavLink
            to="/premium-articles"
            className={({ isActive }) =>
              isActive ? "font-bold text-primary" : "hover:text-primary"
            }
          >
            Premium Articles
          </NavLink>
        </li>
      )}
    </>
  );

  return (
    <nav
      className={`bg-base-100/10 backdrop-blur-md sticky top-0 z-50 shadow-md transition-transform duration-300 ${
        showNav ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="px-4 lg:px-6">
        <div className="mx-auto max-w-[1580px] flex items-center justify-between py-1">
         
          <Link to="/" className="text-3xl font-extrabold tracking-wide">
            {"NewsHub".split("").map((letter, i) => (
              <span
                key={i}
                className="wave-letter"
                style={{ animationDelay: `${i * 0.15}s` }}
              >
                {letter}
              </span>
            ))}
          </Link>

         
          <div className="hidden lg:flex lg:items-center lg:gap-6 relative">
            <ul className="menu menu-horizontal gap-4">
              <li>
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-primary bg-amber-300 border-1 px-10 rounded-4xl" : "hover:text-primary border-1 bg-amber-200/30 px-10 hover:bg-amber-300 rounded-4xl"
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/all-articles"
                  className={({ isActive }) =>
                    isActive ? "font-bold text-primary bg-amber-300 px-10 rounded-4xl border-1" : "hover:text-primary hover:bg-amber-300  border-1 bg-amber-200/30 px-10 rounded-4xl"
                  }
                >
                  All Articles
                </NavLink>
              </li>

              {user && (
                <li className="relative">
                  <button
                    className=" bg-amber-200/30 hover:bg-amber-300 rounded-4xl px-6 border-1 flex items-center  gap-1"
                    onClick={() => setMoreOpen(!moreOpen)}
                  >
                    More
                    <svg
                      className={`w-4 h-4 ml-1 transition-transform ${
                        moreOpen ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {moreOpen && (
                    <ul className="absolute top-full left-0 dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 mt-1 z-50">
                      {dropdownLinks}
                    </ul>
                  )}
                </li>
              )}
            </ul>

          
            {user && (
              <div className="dropdown dropdown-end ml-4">
                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                  <div className="w-10 rounded-full">
                    <img
                      src={user.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
                      alt={user.displayName || "User"}
                    />
                  </div>
                </label>
                <ul className="dropdown-content menu p-2 mt-2 shadow bg-base-100 rounded-box w-52">
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
            )}

            {!user && (
              <div className="flex gap-2">
                <Link to="/auth/signIn" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/auth/signUp" className="btn btn-outline btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

         
          <div className="flex items-center gap-3 lg:hidden">
            {user && (
              <div className="dropdown">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </label>
                <ul className="dropdown-content menu p-2 mt-2 shadow bg-base-100 rounded-box w-52 right-0">
                  <li>
                    <NavLink
                      to="/"
                      className={({ isActive }) =>
                        isActive ? "font-bold text-primary" : "hover:text-primary"
                      }
                    >
                      Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/all-articles"
                      className={({ isActive }) =>
                        isActive ? "font-bold text-primary" : "hover:text-primary"
                      }
                    >
                      All Articles
                    </NavLink>
                  </li>
                  {dropdownLinks}
                </ul>
              </div>
            )}

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
                <ul className="dropdown-content menu p-2 mt-2 shadow bg-base-100 rounded-box w-52">
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
              <>
                <Link to="/auth/signIn" className="btn btn-primary">
                  Login
                </Link>
                <Link to="/auth/signUp" className="btn btn-outline btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
