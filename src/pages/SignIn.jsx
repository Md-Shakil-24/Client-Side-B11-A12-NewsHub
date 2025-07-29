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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      toast.error(`Google sign-in failed: ${error.message}`, {
        position: 'top-center',
        autoClose: 3000,
      });
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
      toast.warning('Please enter both email and password', {
        position: 'top-center',
        autoClose: 2000,
      });
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
      toast.error(`Login failed: ${error.message}`, {
        position: 'top-center',
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-7 mb-7 flex items-center justify-center px-4">
      <Helmet>
        <title>Sign In | NewsHub</title>
        <meta name="description" content="Login to access NewsHub content." />
        <meta property="og:title" content="Sign In - NewsHub" />
      </Helmet>

      <div className="w-full max-w-md bg-white p-8 border border-amber-200 rounded-md shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={`w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 transition ${
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

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            disabled={isLoading}
          />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-800 text-sm"
              disabled={isLoading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 rounded-md transition ${
              isLoading
                ? 'bg-gray-500 cursor-not-allowed text-white'
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{' '}
          <NavLink
            to="/auth/signUp"
            className="text-black font-medium underline hover:text-blue-600"
          >
            Create your account now
          </NavLink>
        </p>

        <p className="text-center mt-2 text-sm">
          <NavLink
            to="/auth/forgate"
            state={{ email }}
            className="text-black underline font-medium hover:text-blue-600"
          >
            Forgot password?
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
