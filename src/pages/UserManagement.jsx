import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useState } from "react";
import { Helmet } from "react-helmet";

const UsersManagement = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data = {}, isLoading } = useQuery({
    queryKey: ["users", page],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users?page=${page}&limit=${limit}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const users = data.users || [];
  const total = data.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleMakeAdmin = async (email) => {
    const result = await Swal.fire({
      title: "Make Admin?",
      text: "This user will have admin privileges",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, make admin!",
    });

    if (result.isConfirmed) {
      try {
        await axios.patch(`${import.meta.env.VITE_API_URL}/users/admin/${email}`);
        toast.success("User made admin successfully");
        queryClient.invalidateQueries(["users"]);
      } catch (error) {
        toast.error("Failed to make user admin");
      }
    }
  };

  if (isLoading) return <p>Loading users...</p>;

  return (
    <>
      <Helmet>
        <title>All-User | admin | NewsHub</title>
        <meta name="description" content="Manage all users." />
      </Helmet>

      <h1 className="text-3xl font-bold mb-8">Users Management</h1>

      <div className="bg-base-100 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">All Users ({total})</h2>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Premium</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.roles?.includes("admin") ? (
                      <span className="badge badge-primary">Admin</span>
                    ) : (
                      <span className="badge">User</span>
                    )}
                  </td>
                  <td>
                    {user.premiumTaken ? (
                      <span className="badge badge-success">Premium</span>
                    ) : (
                      <span className="badge">Normal</span>
                    )}
                  </td>
                  <td>
                    {!user.roles?.includes("admin") && (
                      <button
                        className="btn btn-xs btn-primary"
                        onClick={() => handleMakeAdmin(user.email)}
                      >
                        Make Admin
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-center mt-4 gap-2">
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Prev
            </button>
            {[...Array(totalPages).keys()].map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num + 1)}
                className={`btn btn-sm ${page === num + 1 ? "btn-active" : ""}`}
              >
                {num + 1}
              </button>
            ))}
            <button
              className="btn btn-sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsersManagement;
