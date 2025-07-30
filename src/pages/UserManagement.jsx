
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const UsersManagement = () => {
  const queryClient = useQueryClient();
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      return res.data;
    },
  });

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

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Users Management</h1>
      <Helmet>
              <title>All-User | admin | NewsHub</title>
              <meta name="description" content="Create an account for NewsHub." />
            </Helmet>
      <div className="bg-base-100 p-4 rounded-lg shadow mb-8">
        <h2 className="text-xl font-bold mb-4">All Users ({users.length})</h2>
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
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.roles?.includes('admin') 
                      ? <span className="badge badge-primary">Admin</span>
                      : <span className="badge">User</span>}
                  </td>
                  <td>
                    {user.premiumTaken 
                      ? <span className="badge badge-success">Premium</span>
                      : <span className="badge">Normal</span>}
                  </td>
                  <td>
                    {!user.roles?.includes('admin') && (
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
        </div>
      </div>
    </>
  );
};

export default UsersManagement;