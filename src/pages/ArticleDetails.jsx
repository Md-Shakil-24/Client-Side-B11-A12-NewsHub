import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import axios from "axios";
import LoadingSpinner from "../component/Spinner"; 
import { toast } from "react-toastify";

const ArticleDetailsPage = () => {
  const { id } = useParams();
  const { user, isPremiumUser } = useContext(AuthContext);
  const [token, setToken] = useState(null);

 
  useEffect(() => {
    let isMounted = true;
    const getToken = async () => {
      const localToken = localStorage.getItem("access-token");
      if (user?.getIdToken) {
        const freshToken = await user.getIdToken();
        if (isMounted) setToken(freshToken);
      } else if (localToken) {
        setToken(localToken);
      }
    };
    getToken();
    return () => {
      isMounted = false;
    };
  }, [user]);

 
  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article", id],
    enabled: !!id && !!token,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError || !article) {
    toast.error("Could not load article.");
    return <p className="text-center text-red-500 mt-10">Error loading article.</p>;
  }

 
  const blocked =
    article?.isPremium && (!user || !isPremiumUser);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <img
        src={article?.image}
        alt={article?.title}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />

      <h1 className="text-4xl font-bold mb-2">{article?.title}</h1>
      <p className="text-gray-500 mb-6">
        Published by <strong>{article?.publisher}</strong> •{" "}
        {new Date(article?.postedAt).toLocaleDateString()} • {article?.viewCount} views
      </p>

      {article?.isPremium && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 flex items-center">
          <svg
            className="w-6 h-6 text-yellow-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="font-bold">Premium Content</h3>
        </div>
      )}

      {blocked ? (
        <div className="text-center bg-gray-100 p-6 rounded-lg mt-10">
          <h3 className="text-xl font-semibold mb-2 text-gray-700">This is premium content</h3>
          <p className="mb-4">Subscribe to view the full article</p>
          <Link to="/subscription" className="btn btn-warning">
            Subscribe Now
          </Link>
        </div>
      ) : (
        <div className="prose max-w-none">
          <p className="text-lg mb-6">{article?.description}</p>
          {article?.isPremium && article?.premiumContent && (
            <div className="mt-8 p-4 rounded-lg bg-blue-50 border border-blue-300">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Premium Section</h2>
              <p className="whitespace-pre-line">{article.premiumContent}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArticleDetailsPage;
