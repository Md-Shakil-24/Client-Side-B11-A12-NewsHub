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
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const saveUserToDB = async (userData, token) => {
    try {
      await axios.put(
        `${API_URL}/users/${userData.email}`,
        { ...userData, roles: ['user'], createdAt: new Date() },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Failed to save user to DB', err);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
    const response = await axios.post(url, formData);
    return response.data?.data?.url;
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const user = result.user;
      const token = await getJWT();
      localStorage.setItem('token', token);
      setUser(user);

      await saveUserToDB({ name: user.displayName, photo: user.photoURL || '', email: user.email }, token);

      toast.success('Signed in with Google successfully', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate(from),
      });
    } catch (err) {
      toast.error('Google login failed: ' + err.message, { position: 'top-center', autoClose: 2000 });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;

    if (!imageFile) {
      toast.error('Please select a photo to upload.');
      setLoading(false);
      return;
    }

    if (password.length < 6 || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      toast.error('Password must be at least 6 characters and include upper and lower case letters.');
      setLoading(false);
      return;
    }

    try {
      const uploadedImageUrl = await uploadImageToImgBB(imageFile);

      const result = await createUser(email, password);
      const user = result.user;

      await updateProfile(user, { displayName: name, photoURL: uploadedImageUrl });
      setUser({ ...user, displayName: name, photoURL: uploadedImageUrl });

      const token = await getJWT();
      localStorage.setItem('token', token);

      await saveUserToDB({ name, photo: uploadedImageUrl, email }, token);

      toast.success('Registered successfully', {
        position: 'top-center',
        autoClose: 2000,
        onClose: () => navigate(from),
      });
    } catch (error) {
      toast.error('Register failed: ' + error.message, { position: 'top-center', autoClose: 2000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  ">
      <Helmet>
        <title>Sign Up | NewsHub</title>
        <meta name="description" content="Create an account for NewsHub." />
      </Helmet>

      <div className="max-w-4xl w-full border-1 bg-white rounded-2xl shadow-xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Side*/}
        <div className="hidden md:flex flex-col items-center justify-center bg-gradient-to-tr from-indigo-700 to-purple-700 p-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2838/2838912.png"
            alt="News Illustration"
            className="w-48 h-48 mb-6"
          />
          <h2 className="text-3xl font-bold text-white text-center">Join NewsHub!</h2>
          <p className="text-white/80 text-center mt-2">Sign up and stay updated with breaking news.</p>
        </div>

        {/* Right Side*/}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create Account</h2>

        
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2 mb-6 transition ${
              loading ? 'bg-gray-100 cursor-not-allowed' : 'hover:bg-gray-100'
            }`}
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            <span>{loading ? 'Processing...' : 'Sign up with Google'}</span>
          </button>

          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-300" />
            <span className="mx-2 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-300" />
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              name="name"
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
              disabled={loading}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              required
              disabled={loading}
            />
            <input
              name="email"
              type="email"
              placeholder="Email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
              required
              disabled={loading}
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-700"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg focus:outline-none"
                disabled={loading}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg text-white font-semibold transition ${
                loading ? 'bg-gray-500 cursor-not-allowed' : 'bg-purple-700 hover:bg-purple-800'
              }`}
            >
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{' '}
            <NavLink to="/auth/signIn" className="text-purple-700 font-medium underline hover:text-purple-900">
              Login here
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
