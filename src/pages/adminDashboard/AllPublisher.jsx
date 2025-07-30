
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";

const AllPublishers = () => {
  const queryClient = useQueryClient();

  const { data: publishers = [] } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/publishers`);
      return res.data;
    },
  });

  const deletePublisher = useMutation({
    mutationFn: (id) =>
      axios.delete(`${import.meta.env.VITE_API_URL}/admin/publishers/${id}`),
    onSuccess: () => {
      toast.success("Publisher deleted");
      queryClient.invalidateQueries(["publishers"]);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Publisher?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        deletePublisher.mutate(id);
      }
    });
  };

  return (
    <div className="p-6">

 <Helmet>
        <title>All-Publisher | admin | NewsHub</title>
        <meta name="description" content="Create an account for NewsHub." />
      </Helmet>

      <h2 className="text-2xl font-bold mb-6">All Publishers</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {publishers.map((publisher) => (
            <tr key={publisher._id}>
              <td>{publisher.name}</td>
              <td>{publisher.email}</td>
              <td>
                <button
                  className="btn btn-xs btn-error"
                  onClick={() => handleDelete(publisher._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllPublishers;