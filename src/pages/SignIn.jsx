import React, { useState, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { getJWT } from '../utils/getJWT';
import axios from 'axios';

const SignIn = () => {
  const { signIn, signInWithGoogle, setUser } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const saveUserToDB = async (userData, token) => {
    try {
      await axios.put(`${API_URL}/users/${userData.email}`, {
        ...userData,
        roles: ['user'],
        createdAt: new Date(),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Failed to save user to DB", err);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const token = await getJWT();

      localStorage.setItem('token', token);
      setUser(user);

      await saveUserToDB({
        name: user.displayName,
        photo: user.photoURL,
        email: user.email,
      }, token);

      toast.success('Signed in with Google successfully', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate(from, { replace: true }),
      });
    } catch (error) {
      toast.error(`Google sign-in failed: ${error.message}`, { position: 'top-center', autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.target;
    const password = form.password.value;

    if (!email || !password) {
      toast.warning('Please enter both email and password', { position: 'top-center', autoClose: 2000 });
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn(email, password);
      const token = await getJWT();

      localStorage.setItem('token', token);
      setUser(result.user);

      toast.success('Login successful! Redirecting...', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate(from, { replace: true }),
      });
    } catch (error) {
      toast.error(`Login failed: ${error.message}`, { position: 'top-center', autoClose: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <Helmet>
        <title>Sign In | NewsHub</title>
        <meta name="description" content="Login to access NewsHub content." />
        <meta property="og:title" content="Sign In - NewsHub" />
      </Helmet>

      <div className="max-w-4xl w-full border-1 bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Side */}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-700 to-purple-700 p-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png"
            alt="News Illustration"
            className="w-48 h-48 mb-6"
          />
          <h2 className="text-3xl font-bold text-white text-center">Welcome Back!</h2>
          <p className="text-white/80 text-center mt-2">Login to stay updated with the latest news.</p>
        </div>

        {/* Right Side*/}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Sign In to NewsHub</h2>

        
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={`w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 mb-6 transition ${
              isLoading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>{isLoading ? 'Processing...' : 'Continue with Google'}</span>
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={handleSignIn} className="space-y-4">
            <input
              name="email"
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              disabled={isLoading}
            />

            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800'
              }`}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Don’t have an account?{' '}
            <NavLink
              to="/auth/signUp"
              className="text-purple-700 font-medium underline hover:text-purple-900"
            >
              Create one now
            </NavLink>
          </p>

          <p className="text-center mt-2 text-sm">
            <NavLink
              to="/auth/forgate"
              state={{ email }}
              className="text-purple-700 underline font-medium hover:text-purple-900"
            >
              Forgot password?
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
