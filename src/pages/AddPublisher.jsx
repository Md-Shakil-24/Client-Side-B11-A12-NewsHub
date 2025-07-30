import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const AddPublisher = () => {
  const [name, setName] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [email, setEmail] = useState("");
  const [emailTaken, setEmailTaken] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const imgbb_api_key = import.meta.env.VITE_IMGBB_API_KEY;


  useEffect(() => {
    if (!email) return;
    const delayDebounce = setTimeout(() => {
      axios
        .get(`${API_URL}/publishers/check-email/${email}`)
        .then((res) => setEmailTaken(res.data.exists))
        .catch(() => setEmailTaken(false));
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [email]);

  const handleImageUpload = async (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
      formData
    );
    return res.data.data.url;
  };

  const handleAddPublisher = async (e) => {
    e.preventDefault();

    if (!name || !logoFile || !email) {
      toast.error("All fields are required!");
      return;
    }

    if (emailTaken) {
      toast.error("This email is already associated with a publisher.");
      return;
    }

    try {
      const logoUrl = await handleImageUpload(logoFile);

      const res = await axios.post(`${API_URL}/publishers`, {
        name,
        logo: logoUrl,
        email,
      });

      if (res.data.insertedId) {
        toast.success("Publisher added successfully!");
        setName("");
        setLogoFile(null);
        setEmail("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add publisher.");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-10">
      <Helmet>
        <title>Add-Publisher | admin | NewsHub</title>
        <meta name="description" content="Create an account for NewsHub." />
      </Helmet>
      <h2 className="text-2xl font-bold mb-4 text-center">Add Publisher</h2>

      <form onSubmit={handleAddPublisher} className="space-y-4">
        <div>
          <label className="block font-semibold">Publisher Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold">Publisher Email</label>
          <input
            type="email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailTaken && (
            <p className="text-red-600 text-sm mt-1">
              ⚠️ This email is already a publisher!
            </p>
          )}
        </div>

        <div>
          <label className="block font-semibold">Logo Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => setLogoFile(e.target.files[0])}
            required
          />
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded text-white transition ${
            emailTaken
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={emailTaken}
        >
          Add Publisher
        </button>
      </form>
    </div>
  );
};

export default AddPublisher;
