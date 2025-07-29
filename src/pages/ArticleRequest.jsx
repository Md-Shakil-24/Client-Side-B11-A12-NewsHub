
import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ArticleRequests = () => {
  const queryClient = useQueryClient();

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/articles`);
      return res.data;
    },
  });

  const pendingArticles = articles.filter(a => a.status === "pending");

  const approveArticle = async (id) => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/admin/articles/approve/${id}`);
      toast.success("Article approved");
      queryClient.invalidateQueries(["admin-articles"]);
    } catch (error) {
      toast.error("Failed to approve article");
    }
  };

  const declineArticle = async (id) => {
    const { value: reason } = await Swal.fire({
      title: "Decline Article",
      input: "text",
      inputLabel: "Reason for declining",
      inputPlaceholder: "Enter the reason...",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to provide a reason!";
        }
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

  if (isLoading) return <p>Loading...</p>;

  if (!pendingArticles.length) {
    return (
      <div className="bg-info text-info-content p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold">No Pending Article Requests</h2>
        <p className="mt-2">All articles have been reviewed.</p>
      </div>
    );
  }

  return (
    <div className="bg-warning text-warning-content p-4 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Pending Articles ({pendingArticles.length})</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author Email</th>
              <th>Publisher</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingArticles.map(article => (
              <tr key={article._id}>
                <td>{article.title}</td>
                <td>{article.authorEmail}</td>
                <td>{article.publisher || "N/A"}</td>
                <td className="flex justify-center gap-2">
                  <button
                    className="btn btn-xs btn-success"
                    onClick={() => approveArticle(article._id)}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-xs btn-error"
                    onClick={() => declineArticle(article._id)}
                  >
                    Decline
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ArticleRequests;
