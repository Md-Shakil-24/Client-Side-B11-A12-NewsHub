

import React, { useState, useContext, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import { Helmet } from 'react-helmet';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);
  const { resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await resetPassword(email);
      setEmailSent(true);
      setError(null);

      
      setTimeout(() => {
        window.location.href = 'https://mail.google.com';
      }, 1000);
    } catch (error) {
      setError(error.message);
    }
  };

  

  return (
    <div className="mt-7 mb-7 flex items-center justify-center px-4">
      <Helmet>
        <title>Forgot Password | NewsHub</title>
        <meta name="description" content="Reset your password securely via MyApp." />
        <meta property="og:title" content="Forgot Password - MyApp" />
      </Helmet>

      <div className="w-full max-w-md bg-white border border-amber-200 p-8 rounded-md shadow">
        {emailSent ? (
          <div className="flex flex-col items-center justify-center mt-10 mb-10" role="status">
            <span className="loading loading-spinner text-error"></span>
            <span className="sr-only">Sending reset email...</span>
            <p className="mt-4 text-center text-sm text-gray-700">
              If your email is correct, a reset link has been sent. Please check your inbox or spam folder.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center mb-6">Forgot Password?</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
              Enter your email address and we’ll send you a link to reset your password.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                aria-label="Email address"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}
              <button
                type="submit"
                aria-label="Send password reset link"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
              >
                Send Reset Link
              </button>
            </form>

            <p className="text-center mt-4 text-sm text-gray-600">
              Remembered your password?{' '}
              <NavLink to="/auth/signIn" className="text-black font-medium underline hover:text-blue-500">
                Go back to login
              </NavLink>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
