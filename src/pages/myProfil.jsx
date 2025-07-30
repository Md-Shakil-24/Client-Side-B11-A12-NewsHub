import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const MyProfile = () => {
  const { user, updateUserProfile, setUser } = useContext(AuthContext);
  const [show, setShow] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const url = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;
    const response = await axios.post(url, formData);
    return response.data?.data?.url;
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const displayName = e.target.displayName.value;
    let photoURL = user.photoURL;

    if (selectedImage) {
      try {
        setUploading(true);
        photoURL = await uploadImageToImgBB(selectedImage);
        setUploading(false);
      } catch (error) {
        setUploading(false);
        toast.error("Image upload failed.");
        return;
      }
    }

    try {
      await updateUserProfile(displayName, photoURL);
      setUser({ ...user, displayName, photoURL });
      toast.success("Profile updated successfully!");
      setShow(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Helmet>
          <title>My Profile | LibraryManage</title>
        </Helmet>
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Welcome Guest</h2>
          <p className="text-gray-600 mb-8">Please sign in to access your profile</p>
          <Link to="/auth/signIn">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition duration-300 font-semibold">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 ">
      <Helmet>
        <title>My Profile | LibraryManage</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-10 md:p-14 transition-all">
          <div className="text-center mb-10">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img
                className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                src={user.photoURL || "https://via.placeholder.com/150"}
                alt="Profile"
              />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">{user.displayName}</h1>
            <p className="text-md text-gray-600 mt-2">
              <span className="font-semibold">Email:</span> {user.email}
            </p>
          </div>

          <div className="flex justify-center mb-8">
            <button
              onClick={() => setShow(!show)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition duration-300 shadow ${
                show
                  ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              {show ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          {show && (
            <div className="bg-gray-50 rounded-xl p-6 shadow-inner border">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Update Profile
              </h2>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Display Name
                  </label>
                  <input
                    defaultValue={user.displayName}
                    type="text"
                    name="displayName"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload New Profile Photo
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedImage(e.target.files[0])}
                    className="w-full file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  className={`w-full py-3 rounded-full font-semibold transition duration-300 ${
                    uploading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {uploading ? "Uploading..." : "Save Changes"}
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
