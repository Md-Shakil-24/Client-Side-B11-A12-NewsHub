import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";

const MyProfile = () => {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [show, setShow] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const displayName = e.target.displayName.value;
    const photoURL = e.target.photoURL.value;

    try {
      await updateUserProfile(displayName, photoURL);
      toast.success('Profile updated successfully!');
      setShow(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  if (!user) {
    return (
      <div className=" min-h-screen flex items-center justify-center">
         <Helmet>
        <title>My Profile | LibraryManage</title>
        <meta name="description" content="Learn more about MyApp and what we do." />
        <meta property="og:title" content="About Us - MyApp" />
      </Helmet>
        <div className="max-w-md w-full  bg-green-100 p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome Guest</h2>
          <p className="text-gray-600 mb-8">Please sign in to access your profile</p>
          <Link to="/auth/signIn">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">



      <Helmet>
        <title>My Profile | Library-Manage</title>
        <meta name="description" content="Learn more about MyApp and what we do." />
        <meta property="og:title" content="About Us - MyApp" />
      </Helmet>



      <div className="max-w-5xl mx-auto">
        <div className="bg-green-100 rounded-xl shadow-md overflow-hidden p-8">
         
          <div className="text-center mb-10">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img 
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg" 
                src={user.photoURL || "https://via.placeholder.com/150"} 
                alt="Profile" 
              />
              <div className="absolute -bottom-2 right-2 bg-blue-500 rounded-full p-2 shadow-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{user.displayName}</h1>
            <p className="text-lg text-gray-600 mt-2"><span className="font-bold">Email : </span>{user.email}</p>
            <p className="text-lg text-gray-600 mt-2"><span className="font-bold">Photo-URL : </span>{user.photoURL}</p>
          </div>

        
          <div className="flex justify-center mb-10">
            <button 
              onClick={() => setShow(!show)} 
              className={`px-6 py-3 rounded-lg font-medium transition duration-300 ${show ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : 'bg-green-500 text-white hover:bg-green-600'}`}
            >
              {show ? "Cancel Editing" : "Edit Profile"}
            </button>
          </div>

        
          {show && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Update Your Profile</h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
                  <input
                    defaultValue={user.displayName}
                    type="text"
                    name="displayName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo URL</label>
                  <input
                    defaultValue={user.photoURL}
                    type="text"
                    name="photoURL"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/photo.jpg"
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;