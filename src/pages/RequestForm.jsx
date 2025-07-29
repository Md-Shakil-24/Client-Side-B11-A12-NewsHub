import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";
import { toast } from "react-toastify";

const PublisherRequestForm = () => {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState(user?.displayName || "");
  const [logo, setLogo] = useState(user?.photoURL || "");
  const [reason, setReason] = useState("");
  const [status, setStatus] = useState(null); // "pending", "approved", or null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRequestStatus = async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get("http://localhost:3000/publisher-request/check", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data?.isPublisher) {
          setStatus("approved");
        } else if (res.data?.exists) {
          setStatus("pending");
        } else {
          setStatus(null);
        }
      } catch (error) {
        console.error("Status check failed", error);
        toast.error("Failed to fetch request status");
      } finally {
        setLoading(false);
      }
    };

    if (user?.email) checkRequestStatus();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !logo || !reason) {
      toast.error("All fields are required!");
      return;
    }

    try {
      const token = await user.getIdToken();
      const res = await axios.post(
        "http://localhost:3000/publisher-request",
        { name, logo, reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.insertedId || res.data.success) {
        toast.success("Publisher request submitted successfully!");
        setStatus("pending");
      } else {
        toast.error(res.data.error || "Failed to submit request.");
      }
    } catch (error) {
      console.error("Request Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.error || "Failed to submit request");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Checking request status...</p>;
  }

  if (status === "approved") {
    return <p className="text-center text-green-600 font-semibold mt-10">✅ You are already a publisher.</p>;
  }

  if (status === "pending") {
    return <p className="text-center text-yellow-600 font-semibold mt-10">⏳ Your request is under review.</p>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Become a Publisher</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Your Name</label>
          <input
            type="text"
            className="w-full input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Logo URL</label>
          <input
            type="text"
            className="w-full input input-bordered"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            placeholder="Enter logo image URL"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Why do you want to become a publisher?</label>
          <textarea
            className="w-full textarea textarea-bordered"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Describe your motivation or intent"
            rows={4}
            required
          ></textarea>
        </div>
        <button className="btn btn-primary w-full">Submit Request</button>
      </form>
    </div>
  );
};

export default PublisherRequestForm;
