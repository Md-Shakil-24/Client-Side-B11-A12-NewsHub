import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaBookmark, FaLock, FaCrown } from "react-icons/fa";
import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const ArticleCard = ({ article }) => {
  const { user, isPremiumUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const isLocked = article.isPremium && !isPremiumUser;

  const handleReadMore = (e) => {
    if (isLocked) {
      e.preventDefault();
      toast(
        <div className="flex flex-col">
          <div className="flex items-center text-yellow-600">
            <FaLock className="mr-2" />
            <span className="font-medium">Premium Content Locked</span>
          </div>
          <p className="mt-1 text-sm">Subscribe to read this exclusive article</p>
          <button
            onClick={() => navigate('/subscription')}
            className="mt-2 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
          >
            Upgrade Now
          </button>
        </div>,
        { autoClose: false }
      );
    }
  };

  return (
    <div
      className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
        isLocked ? "border-l-4 border-yellow-400" : ""
      }`}
    >

       <Helmet>
              <title>Article-Card | NewsHub</title>
              <meta name="description" content="Learn more about MyApp and what we do." />
              <meta property="og:title" content="About Us - MyApp" />
            </Helmet>
      
      {article.isPremium && (
        <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <FaCrown className="mr-1" size={10} />
          Premium
        </div>
      )}

      <figure className="relative h-48 w-full overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title} 
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        {isLocked && (
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="bg-white bg-opacity-90 rounded-full p-3 text-yellow-600">
              <FaLock size={24} />
            </div>
          </div>
        )}
      </figure>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {article.publisher}
          </span>
          <div className="flex items-center space-x-2 text-gray-500">
            <span className="flex items-center text-sm">
              <FaEye className="mr-1" size={12} />
              {article.viewCount || 0}
            </span>
            <button 
              className="hover:text-blue-500 transition-colors"
              onClick={(e) => {
                e.preventDefault();
               
                toast.success("Article bookmarked");
              }}
            >
              <FaBookmark size={14} />
            </button>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {article.description}
        </p>

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {article.tags.slice(0, 3).map((tag, i) => (
              <span 
                key={i} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">
            {new Date(article.postedAt).toLocaleDateString()}
          </span>
          <Link
            to={`/article/${article._id}`}
            onClick={handleReadMore}
            className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium ${
              isLocked
                ? "border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100 cursor-not-allowed"
                : "border-blue-500 bg-blue-50 text-blue-700 hover:bg-blue-100"
            }`}
          >
            {isLocked ? (
              <>
                <FaLock className="mr-1" size={12} />
                Premium
              </>
            ) : (
              "Read More"
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;