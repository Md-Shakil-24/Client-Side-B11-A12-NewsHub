
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const PublisherRequests = () => {
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading, isError } = useQuery({
    queryKey: ["publisher-requests"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/publisher-requests`);
      return res.data;
    },
  });

  const approve = useMutation({
    mutationFn: (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/admin/publisher-requests/approve/${id}`),
    onSuccess: () => {
      toast.success("Publisher approved");
      queryClient.invalidateQueries(["publisher-requests"]);
    },
  });

  const decline = useMutation({
    mutationFn: (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/admin/publisher-requests/decline/${id}`),
    onSuccess: () => {
      toast.success("Request declined");
      queryClient.invalidateQueries(["publisher-requests"]);
    },
  });

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load requests.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Publisher Requests</h2>

      {requests.length === 0 ? (
        <div className="text-center text-gray-500 text-lg py-10">📭 No publisher requests found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Reason</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id}>
                  <td>{req.name}</td>
                  <td>{req.email}</td>
                  <td>{req.reason}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => approve.mutate(req._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => decline.mutate(req._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PublisherRequests;
