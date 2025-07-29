import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebase.config';
import axios from 'axios';
import { toast } from 'react-toastify';

const PublisherRequest = () => {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);
  const [isPublisher, setIsPublisher] = useState(false);
  const [existingRequest, setExistingRequest] = useState(null);

  useEffect(() => {
    if (user?.email) {
      checkPublisherStatus();
    }
  }, [user]);

  const checkPublisherStatus = async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get('/publisher-request/check', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setRequestStatus(response.data.status);
      setIsPublisher(response.data.isPublisher);
      setExistingRequest(response.data.exists);
    } catch (error) {
      console.error('Error checking publisher status:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      setLoading(true);
      const token = await user.getIdToken();
      
      await axios.post('/publisher-request', {
        ...formData,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success('Publisher request submitted successfully!');
      setRequestStatus('pending');
      setExistingRequest(true);
    } catch (error) {
      console.error('Error submitting publisher request:', error);
      toast.error(error.response?.data?.error || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (isPublisher) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Publisher Status</h2>
        <p className="text-gray-700">
          You are already a verified publisher. You can now post articles under your publisher name.
        </p>
      </div>
    );
  }

  if (existingRequest) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">
          {requestStatus === 'pending' ? 'Request Pending' : 'Request Status'}
        </h2>
        
        {requestStatus === 'pending' ? (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4">
            <p>Your publisher request is currently under review.</p>
            <p className="mt-2 text-sm">We'll notify you once a decision has been made.</p>
          </div>
        ) : (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
            <p>Your previous publisher request was declined.</p>
            <p className="mt-2 text-sm">You can submit a new request with updated information.</p>
            <button 
              onClick={() => setExistingRequest(false)}
              className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
            >
              Submit New Request
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Become a Publisher</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Publisher Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your publication name"
          />
        </div>
        
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700">
            Logo URL (Optional)
          </label>
          <input
            type="url"
            id="logo"
            name="logo"
            value={formData.logo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/logo.png"
          />
        </div>
        
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
            Why do you want to become a publisher? *
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Tell us about your publication and why you should be approved..."
          />
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Request'}
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-4">
          <p>* Your request will be reviewed by our team. You'll receive an email notification once a decision is made.</p>
          <p className="mt-1">* As a publisher, you'll be able to post articles under your publisher name.</p>
        </div>
      </form>
    </div>
  );
};

export default PublisherRequest;