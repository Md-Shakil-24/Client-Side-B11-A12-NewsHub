import React, { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import LoadingSpinner from "../component/Spinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const PremiumArticles = () => {
  const { user, isPremiumUser } = useContext(AuthContext);
  const token = localStorage.getItem("access-token");
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const { data: articles = [], isLoading, error } = useQuery({
    queryKey: ["premium-articles", user?.email],
    queryFn: async () => {
      const res = await axios.get(`${API_URL}/premium-articles`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    },
    enabled: !!token,
  });

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    toast.error("Failed to load premium articles");
    return <p className="text-center text-red-500">Error loading premium content.</p>;
  }

 
  const handleReadMore = (article) => {
    if (article.isPremium && !isPremiumUser) {
      toast.error(
        <div className="flex flex-col">
          <span className="font-medium">Premium Content Locked</span>
          <span className="text-sm">Subscribe to access this exclusive article</span>
          <button
            onClick={() => navigate("/subscription")}
            className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
          >
            Upgrade Now
          </button>
        </div>,
        { autoClose: 5000 }
      );
      return;
    }
    navigate(`/article/${article._id}`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-primary">
        Premium Articles
      </h1>

      {articles.length === 0 ? (
        <p className="text-center text-gray-500">No premium articles available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <div
              key={article._id}
              className="card bg-gradient-to-tr from-amber-100 via-yellow-50 to-white shadow-xl hover:shadow-2xl transition"
            >
              <figure>
                <img
                  src={article.image}
                  alt={article.title}
                  className="h-48 w-full object-cover rounded-t-xl"
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{article.title}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Publisher:</strong> {article.publisher}
                </p>
                <p className="line-clamp-3">{article.description}</p>
                <div className="card-actions justify-end mt-4">
                  <button
                    className="btn btn-sm btn-outline btn-warning"
                    onClick={() => handleReadMore(article)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PremiumArticles;
