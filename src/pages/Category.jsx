
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import ArticleCard from "./ArticleCard";
import { useEffect } from "react";

const Category = () => {
  const { tag } = useParams();


  const {
    data: articles = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["articlesByTag", tag],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/articles?tag=${tag}`);
      return res.data;
    },
  });

  
  const { data: allTags = [] } = useQuery({
    queryKey: ["allTags"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tags`);
      return res.data;
    },
  });

 
  useEffect(() => {
    document.title = `${tag.charAt(0).toUpperCase() + tag.slice(1)} News - NewsHub`;
  }, [tag]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error max-w-md mx-auto mt-8">
        <span>Error loading articles. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">
          {tag.charAt(0).toUpperCase() + tag.slice(1)} News
        </h1>
        <div className="flex items-center">
          <div className="badge badge-primary mr-2">Tag</div>
          <span className="text-lg">{articles.length} articles found</span>
        </div>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-2">No articles found</h2>
          <p className="mb-6">We couldn't find any articles with the "{tag}" tag</p>
          <Link to="/" className="btn btn-primary">
            Browse All News
          </Link>
        </div>
      )}

    
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6">Explore More Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {allTags
            .filter((t) => t.name !== tag)
            .slice(0, 4)
            .map((relatedTag) => (
              <Link
                to={`/category/${relatedTag.name.toLowerCase()}`}
                key={relatedTag.name}
                className="card bg-base-100 hover:bg-base-200 transition-all shadow-sm hover:shadow-md"
              >
                <div className="card-body p-4 text-center">
                  <h3 className="font-bold capitalize">{relatedTag.name}</h3>
                  <p className="text-sm opacity-70">
                    {relatedTag.count} articles
                  </p>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Category;