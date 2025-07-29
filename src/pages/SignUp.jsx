import React, { useContext, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import { updateProfile } from 'firebase/auth';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Helmet } from 'react-helmet';
import { getJWT } from '../utils/getJWT';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const { createUser, setUser, signInWithGoogle } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
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

  const handleGoogleLogin = () => {
    signInWithGoogle()
      .then(async (result) => {
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
          onClose: () => navigate(from),
        });
      })
      .catch(err => {
        toast.error('Google login failed: ' + err.message, {
          position: 'top-center',
          autoClose: 2000,
        });
      });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const photo = form.photoURL.value;
    const email = form.email.value;
    const password = form.password.value;

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error('Password must be at least 6 chars and include both upper and lower case letters.', {
        position: 'top-center',
        autoClose: 2000,
      });
      setLoading(false);
      return;
    }

    try {
      const result = await createUser(email, password);
      const user = result.user;

      await updateProfile(user, {
        displayName: name,
        photoURL: photo,
      });

      setUser({ ...user, displayName: name, photoURL: photo });

      const token = await getJWT();
      localStorage.setItem('token', token);

      await saveUserToDB({ name, photo, email }, token);

      toast.success('Register successfully', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate(from),
      });
    } catch (error) {
      toast.error('Register failed: ' + error.message, {
        position: 'top-center',
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-7 mb-7 flex items-center justify-center px-4">
      <Helmet>
        <title>Sign Up | NewsHub</title>
        <meta name="description" content="Create an account for our library system." />
        <meta property="og:title" content="Sign Up - LibraryManage" />
      </Helmet>

      <div className="w-full max-w-md border border-amber-200 bg-white p-8 rounded-md shadow">
        <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span>Sign up with Google</span>
        </button>

        <div className="my-6 flex items-center">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">or</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
            disabled={loading}
          />
          <input
            name="photoURL"
            type="text"
            placeholder="Photo URL"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
            disabled={loading}
          />
          <input
            name="email"
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            required
            disabled={loading}
          />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg focus:outline-none"
              disabled={loading}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md transition ${
              loading
                ? 'bg-gray-500 cursor-not-allowed text-white'
                : 'bg-black hover:bg-gray-800 text-white'
            }`}
          >
            {loading ? 'Processing Registering...' : 'Register Now'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{' '}
          <NavLink to="/auth/signIn" className="text-black font-medium underline hover:text-blue-500">
            Login here
          </NavLink>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
