import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { FaSearch, FaTimes, FaLock, FaEye } from "react-icons/fa";
import LoadingSpinner from "../component/Spinner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet";

const AllArticles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [tags, setTags] = useState([]);
  const { isPremiumUser } = useContext(AuthContext);
  const navigate = useNavigate();

  
  const {
    data: publishersData = [],
    isLoading: publishersLoading,
  } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/publishers`);
      return res.data;
    },
    select: (data) =>
      data.map((publisher) => ({
        value: publisher.name,
        label: publisher.name,
      })),
  });

 
  const {
    data: articles = [],
    isLoading: articlesLoading,
  } = useQuery({
    queryKey: [
      "articles",
      selectedPublisher?.value || "",
      selectedTag?.value || "",
      searchTerm,
    ],
    queryFn: async () => {
      const params = {};
      if (selectedPublisher?.value) params.publisher = selectedPublisher.value;
      if (selectedTag?.value) params.tag = selectedTag.value;
      if (searchTerm) params.search = searchTerm;

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/articles`, {
        params,
      });
      return res.data;
    },
    keepPreviousData: true,
  });

 
  useEffect(() => {
    if (articles.length > 0) {
      const allTags = articles.flatMap((article) => article.tags || []);
      const uniqueTags = [...new Set(allTags)].map((tag) => ({
        value: tag,
        label: tag,
      }));
      setTags(uniqueTags);
    } else {
      setTags([]);
    }
  }, [articles]);

 
  const filteredArticles = articles.filter(
    (article) => article.status === "approved"
  );

  const handlePublisherChange = (selectedOption) => {
    setSelectedPublisher(selectedOption);
  };

  const handleTagChange = (selectedOption) => {
    setSelectedTag(selectedOption);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedPublisher(null);
    setSelectedTag(null);
  };

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

  if (articlesLoading || publishersLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">





      <div className="max-w-7xl mx-auto">


         <Helmet>
        <title>All-Articles | NewsHub</title>
        <meta name="description" content="Learn more about MyApp and what we do." />
        <meta property="og:title" content="About Us - MyApp" />
      </Helmet>
    
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Browse All Articles
          </h1>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Discover the latest news and stories
          </p>
        </div>

     
       
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
            <div>
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search Articles
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="search"
                  placeholder="Search by title..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <FaTimes className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>

         
            <div>
              <label
                htmlFor="publisher"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Publisher
              </label>
              <Select
                id="publisher"
                options={publishersData}
                value={selectedPublisher}
                onChange={handlePublisherChange}
                placeholder="Select publisher..."
                isClearable
                classNamePrefix="select"
              />
            </div>

          
            <div>
              <label
                htmlFor="tags"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Filter by Tag
              </label>
              <Select
                id="tags"
                options={tags}
                value={selectedTag}
                onChange={handleTagChange}
                placeholder="Select tag..."
                isClearable
                classNamePrefix="select"
              />
            </div>
          </div>

         
          {(searchTerm || selectedPublisher || selectedTag) && (
            <div className="mt-4 flex justify-end">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

     
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm text-gray-600">
            Showing <span className="font-medium">{filteredArticles.length}</span>{" "}
            articles
          </span>
          <span className="text-sm text-gray-600">
            {filteredArticles.length} {filteredArticles.length === 1 ? "result" : "results"}
          </span>
        </div>

      
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <div
                key={article._id}
                className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg ${
                  article.isPremium ? "border-l-4 border-yellow-400" : ""
                }`}
              >
                <div className="relative">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                  {article.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                      <FaLock className="mr-1" size={10} />
                      Premium
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {article.publisher} •{" "}
                    {new Date(article.postedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <FaEye className="mr-1" />
                    {article.viewCount} views
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{article.description}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-wrap gap-1">
                      {article.tags?.slice(0, 3).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button
                      onClick={() => handleReadMore(article)}
                      className={`inline-flex items-center px-3 py-1.5 border text-sm font-medium rounded-md ${
                        article.isPremium
                          ? "border-yellow-400 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                          : "border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No articles found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedPublisher || selectedTag
                ? "Try adjusting your search or filter to find what you are looking for."
                : "There are currently no articles available."}
            </p>
            <div className="mt-6">
              <button
                onClick={clearFilters}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {searchTerm || selectedPublisher || selectedTag ? "Clear All Filters" : "Refresh Page"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllArticles;
