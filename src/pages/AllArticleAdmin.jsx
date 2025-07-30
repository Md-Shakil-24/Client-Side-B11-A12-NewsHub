import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useState } from "react";
import { Helmet } from "react-helmet";

const AllArticleAdmin = () => {
  const queryClient = useQueryClient();
  const [articlesState, setArticlesState] = useState([]); 

  const { data: articles = [] } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/articles`);
      setArticlesState(res.data); 
      return res.data;
    },
  });

  const handleDeclineArticle = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Decline Article",
      input: "text",
      inputLabel: "Reason for declining",
      inputPlaceholder: "Enter the reason...",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) return "You need to provide a reason!";
      },
    });

    if (reason) {
      try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/admin/articles/decline/${id}`, { reason });
        toast.success("Article declined");
        queryClient.invalidateQueries(["admin-articles"]);
      } catch (error) {
        toast.error("Failed to decline article");
      }
    }
  };

  const handleMakePremium = async (id, currentStatus) => {
    
    setArticlesState((prev) =>
      prev.map((article) =>
        article._id === id ? { ...article, isPremium: !currentStatus } : article
      )
    );

    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/articles/premium/${id}`, {
        isPremium: !currentStatus,
      });
      toast.success("Premium status updated");
      queryClient.invalidateQueries(["admin-articles"]);
    } catch (error) {
      toast.error("Failed to update premium status");
      
      setArticlesState((prev) =>
        prev.map((article) =>
          article._id === id ? { ...article, isPremium: currentStatus } : article
        )
      );
    }
  };

  const handleDeleteArticle = async (id) => {
    const result = await Swal.fire({
      title: "Delete Article?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/articles/${id}`);
        toast.success("Article deleted");
        queryClient.invalidateQueries(["admin-articles"]);
      } catch (error) {
        toast.error("Failed to delete article");
      }
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Articles Management</h1>


<Helmet>
        <title>All-Articles | admin | NewsHub</title>
        <meta name="description" content="Create an account for NewsHub." />
      </Helmet>


      <div className="bg-base-100 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">All Articles ({articles.length})</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Status</th>
                <th>Premium</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articlesState.map((article) => (
                <tr key={article._id}>
                  <td>{article.title}</td>
                  <td>{article.authorEmail}</td>
                  <td>{article.publisher || "N/A"}</td>
                  <td>
                    <span className={`badge ${
                      article.status === "approved" ? "badge-success" :
                      article.status === "declined" ? "badge-error" :
                      "badge-warning"
                    }`}>
                      {article.status}
                    </span>
                    {article.status === "declined" && article.declineReason && (
                      <div className="tooltip" data-tip={article.declineReason}>
                        <button className="btn btn-xs btn-ghost">ℹ️</button>
                      </div>
                    )}
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={article.isPremium}
                      onChange={() => handleMakePremium(article._id, article.isPremium)}
                    />
                  </td>
                  <td>{article.viewCount || 0}</td>
                  <td>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => handleDeleteArticle(article._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AllArticleAdmin;
