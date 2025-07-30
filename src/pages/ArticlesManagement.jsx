import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const ArticlesManagement = () => {
  const queryClient = useQueryClient();

  const { data: articles = [] } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/articles`);
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

  const handleMakePremium = async (id, newStatus) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/articles/premium/${id}`, {
        isPremium: newStatus,
      });
      toast.success(`Marked as ${newStatus ? "Premium" : "General"}`);
      queryClient.invalidateQueries(["admin-articles"]);
    } catch (error) {
      toast.error("Failed to update premium status");
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
              <title>Article-Manage | NewsHub</title>
              <meta name="description" content="Learn more about MyApp and what we do." />
              <meta property="og:title" content="About Us - MyApp" />
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
              {articles.map(article => (
                <tr key={article._id}>
                  <td>{article.title}</td>
                  <td>{article.authorEmail}</td>
                  <td>{article.publisher || "N/A"}</td>
                  <td>
                    <span className={`badge ${
                      article.status === 'approved' ? 'badge-success' :
                      article.status === 'declined' ? 'badge-error' : 'badge-warning'
                    }`}>
                      {article.status}
                    </span>
                    {article.status === 'declined' && article.declineReason && (
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
                      onChange={(e) => handleMakePremium(article._id, e.target.checked)}
                    />
                  </td>
                  <td>{article.viewCount || 0}</td>
                  <td className="space-x-2">
                    <button 
                      className="btn btn-xs btn-error"
                      onClick={() => handleDeleteArticle(article._id)}
                    >
                      Delete
                    </button>
                    {article.status !== 'declined' && (
                      <button 
                        className="btn btn-xs btn-warning"
                        onClick={() => handleDeclineArticle(article._id)}
                      >
                        Decline
                      </button>
                    )}
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

export default ArticlesManagement;
