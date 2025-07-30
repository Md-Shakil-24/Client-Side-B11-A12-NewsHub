
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet";

const PublishersManagement = () => {
  const queryClient = useQueryClient();
  const { data: publishers = [] } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/publishers`);
      return res.data;
    },
  });

  const handleDeletePublisher = async (id) => {
    const result = await Swal.fire({
      title: "Delete Publisher?",
      text: "This will remove all associated articles",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/admin/publishers/${id}`);
        toast.success("Publisher deleted");
        queryClient.invalidateQueries(["publishers"]);
      } catch (error) {
        toast.error("Failed to delete publisher");
      }
    }
  };

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Publishers Management</h1>


<Helmet>
        <title>Publisher-Manage | admin | NewsHub</title>
        <meta name="description" content="Create an account for NewsHub." />
      </Helmet>

      <div className="bg-base-100 p-4 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">All Publishers ({publishers.length})</h2>
          <Link to="/dashboard/add-publisher" className="btn btn-primary">
            Add New Publisher
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Logo</th>
                <th>Articles</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {publishers.map(publisher => (
                <tr key={publisher._id}>
                  <td>{publisher.name}</td>
                  <td>
                    {publisher.logo && (
                      <img src={publisher.logo} alt={publisher.name} className="w-12 h-12 object-contain" />
                    )}
                  </td>
                  <td>{publisher.articleCount || 0}</td>
                  <td>
                    <button 
                      className="btn btn-xs btn-error"
                      onClick={() => handleDeletePublisher(publisher._id)}
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

export default PublishersManagement;