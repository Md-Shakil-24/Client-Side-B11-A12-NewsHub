import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Chart } from "react-google-charts";
import { useContext, useState } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { FaHome, FaUsers, FaNewspaper, FaPlus, FaChartPie, FaBars, FaTimes } from "react-icons/fa";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("articles");
  const [sidebarOpen, setSidebarOpen] = useState(false);


  const isActive = (path) => {
    return location.pathname.includes(path);
  };

 
  const { data: stats = {} } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
      return res.data;
    },
  });

  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/articles`);
      return res.data;
    },
  });

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
      return res.data;
    },
  });

  const { data: publishers = [], isLoading: publishersLoading } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/publishers`);
      return res.data;
    },
  });

  const { data: publisherRequests = [] } = useQuery({
    queryKey: ["publisher-requests"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/publisher-requests`);
      return res.data;
    },
  });

 
  const makeAdminMutation = useMutation({
    mutationFn: async (email) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/users/admin/${email}`),
    onSuccess: () => {
      toast.success("User made admin successfully");
      queryClient.invalidateQueries(["users"]);
    },
  });

  const approveArticleMutation = useMutation({
    mutationFn: async (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/admin/articles/approve/${id}`),
    onSuccess: () => {
      toast.success("Article approved");
      queryClient.invalidateQueries(["admin-articles"]);
    },
  });

  const declineArticleMutation = useMutation({
    mutationFn: async ({ id, reason }) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/admin/articles/decline/${id}`, { reason }),
    onSuccess: () => {
      toast.success("Article declined");
      queryClient.invalidateQueries(["admin-articles"]);
    },
  });

  const makePremiumArticleMutation = useMutation({
    mutationFn: async (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/admin/articles/premium/${id}`),
    onSuccess: () => {
      toast.success("Article premium status updated");
      queryClient.invalidateQueries(["admin-articles"]);
    },
  });

  const deleteArticleMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(`${import.meta.env.VITE_API_URL}/admin/articles/${id}`),
    onSuccess: () => {
      toast.success("Article deleted");
      queryClient.invalidateQueries(["admin-articles"]);
    },
  });

  const approvePublisherRequestMutation = useMutation({
    mutationFn: async (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/admin/publisher-requests/approve/${id}`),
    onSuccess: () => {
      toast.success("Publisher request approved");
      queryClient.invalidateQueries(["publisher-requests"]);
      queryClient.invalidateQueries(["publishers"]);
    },
  });

  const rejectPublisherRequestMutation = useMutation({
    mutationFn: async (id) =>
      axios.patch(`${import.meta.env.VITE_API_URL}/admin/publisher-requests/decline/${id}`),
    onSuccess: () => {
      toast.success("Publisher request rejected");
      queryClient.invalidateQueries(["publisher-requests"]);
    },
  });

  const deletePublisherMutation = useMutation({
    mutationFn: async (id) =>
      axios.delete(`${import.meta.env.VITE_API_URL}/admin/publishers/${id}`),
    onSuccess: () => {
      toast.success("Publisher deleted");
      queryClient.invalidateQueries(["publishers"]);
    },
  });

  
  const handleMakeAdmin = (email) => {
    Swal.fire({
      title: "Make Admin?",
      text: "This user will have admin privileges",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, make admin!",
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdminMutation.mutate(email);
      }
    });
  };

  const handleDeclineArticle = async (id) => {
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
      declineArticleMutation.mutate({ id, reason });
    }
  };

  const handleDeleteArticle = (id) => {
    Swal.fire({
      title: "Delete Article?",
      text: "This cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteArticleMutation.mutate(id);
      }
    });
  };

  const handleDeletePublisher = (id) => {
    Swal.fire({
      title: "Delete Publisher?",
      text: "This will remove all associated articles",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deletePublisherMutation.mutate(id);
      }
    });
  };

  
  const publisherStats = {};
  articles.forEach(article => {
    const publisher = article.publisher || "Unknown";
    publisherStats[publisher] = (publisherStats[publisher] || 0) + 1;
  });

  const pieChartData = [
    ["Publisher", "Articles"],
    ...Object.entries(publisherStats)
  ];

  const userStats = [
    ["Type", "Count"],
    ["Total Users", stats.total || 0],
    ["Premium Users", stats.premium || 0],
    ["Normal Users", (stats.total || 0) - (stats.premium || 0)]
  ];

  const articleStatusStats = [
    ["Status", "Count"],
    ["Approved", articles.filter(a => a.status === "approved").length],
    ["Pending", articles.filter(a => a.status === "pending").length],
    ["Declined", articles.filter(a => a.status === "declined").length]
  ];

  const pendingArticles = articles.filter(a => a.status === "pending");

  return (
    <div className="flex min-h-screen bg-gray-100">
     
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-md text-white"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

    
      <div
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 transform fixed md:static inset-y-0 left-0 w-64 
          bg-gray-800 text-white p-4 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>
        
        <ul className="space-y-2">
         
          <li>
            <button
              onClick={() => {
                setActiveTab("overview");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full p-2 rounded-lg ${activeTab === "overview" ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <FaChartPie className="mr-3" />
              <span>Dashboard Overview</span>
            </button>
          </li>
          
       
          <li>
            <button
              onClick={() => {
                setActiveTab("users");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full p-2 rounded-lg ${activeTab === "users" ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <FaUsers className="mr-3" />
              <span>All Users</span>
            </button>
          </li>
          
         
          <li>
            <button
              onClick={() => {
                setActiveTab("articles");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full p-2 rounded-lg ${activeTab === "articles" ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <FaNewspaper className="mr-3" />
              <span>All Articles</span>
            </button>
          </li>
          
          
          <li>
            <button
              onClick={() => {
                setActiveTab("publishers");
                setSidebarOpen(false);
              }}
              className={`flex items-center w-full p-2 rounded-lg ${activeTab === "publishers" ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
            >
              <FaPlus className="mr-3" />
              <span>Add Publisher</span>
            </button>
          </li>
          
         
          <li className="mt-8 border-t border-gray-700 pt-4">
            <Link
              to="/"
              className="flex items-center p-2 rounded-lg hover:bg-gray-700"
              onClick={() => setSidebarOpen(false)}
            >
              <FaHome className="mr-3" />
              <span>Back to Home</span>
            </Link>
          </li>
        </ul>
      </div>

    
      <div className="flex-1 overflow-auto md:ml-64">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

         
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="stats bg-primary text-primary-content shadow">
                <div className="stat">
                  <div className="stat-title">Total Users</div>
                  <div className="stat-value">{stats.total || 0}</div>
                </div>
              </div>
              <div className="stats bg-secondary text-secondary-content shadow">
                <div className="stat">
                  <div className="stat-title">Premium Users</div>
                  <div className="stat-value">{stats.premium || 0}</div>
                </div>
              </div>
              <div className="stats bg-accent text-accent-content shadow">
                <div className="stat">
                  <div className="stat-title">Total Articles</div>
                  <div className="stat-value">{articles.length}</div>
                </div>
              </div>
            </div>
          )}

      
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h2 className="card-title">Articles by Publisher</h2>
                    <Chart
                      chartType="PieChart"
                      data={pieChartData}
                      options={{ 
                        is3D: true,
                        pieSliceText: "value",
                        backgroundColor: "transparent",
                        legend: { position: "right" }
                      }}
                      width="100%"
                      height="400px"
                    />
                  </div>
                </div>
                <div className="card bg-base-100 shadow">
                  <div className="card-body">
                    <h2 className="card-title">User Distribution</h2>
                    <Chart
                      chartType="PieChart"
                      data={userStats}
                      options={{ 
                        is3D: true,
                        pieSliceText: "value",
                        backgroundColor: "transparent",
                        legend: { position: "right" }
                      }}
                      width="100%"
                      height="400px"
                    />
                  </div>
                </div>
              </div>

             
              <div className="card bg-base-100 shadow mb-8">
                <div className="card-body">
                  <h2 className="card-title">Article Status</h2>
                  <Chart
                    chartType="BarChart"
                    data={articleStatusStats}
                    options={{
                      title: "Article Status Distribution",
                      hAxis: { title: "Count" },
                      vAxis: { title: "Status" },
                      backgroundColor: "transparent",
                      legend: { position: "none" }
                    }}
                    width="100%"
                    height="400px"
                  />
                </div>
              </div>
            </>
          )}

        
          {activeTab === "overview" && pendingArticles.length > 0 && (
            <div className="bg-warning text-warning-content p-4 rounded-lg shadow mb-8">
              <h2 className="text-xl font-bold mb-4">Pending Articles ({pendingArticles.length})</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Publisher</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingArticles.map(article => (
                      <tr key={article._id}>
                        <td>{article.title}</td>
                        <td>{article.authorEmail}</td>
                        <td>{article.publisher || "N/A"}</td>
                        <td className="flex gap-2">
                          <button 
                            className="btn btn-xs btn-success"
                            onClick={() => approveArticleMutation.mutate(article._id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-xs btn-error"
                            onClick={() => handleDeclineArticle(article._id)}
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
          )}

       
          {activeTab === "articles" && (
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
                            onChange={() => makePremiumArticleMutation.mutate(article._id)}
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
          )}

        
          {activeTab === "users" && (
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
          )}

        
          {activeTab === "publishers" && (
            <div className="bg-base-100 p-4 rounded-lg shadow mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">All Publishers ({publishers.length})</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate("/admin/add-publisher")}
                >
                  Add New Publisher
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Articles</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publishers.map(publisher => (
                      <tr key={publisher._id}>
                        <td>{publisher.name}</td>
                        <td>{publisher.email}</td>
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
          )}

         
          {activeTab === "requests" && publisherRequests.length > 0 && (
            <div className="bg-base-100 p-4 rounded-lg shadow mb-8">
              <h2 className="text-xl font-bold mb-4">Publisher Requests ({publisherRequests.length})</h2>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Reason</th>
                      <th>Requested At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publisherRequests.map(request => (
                      <tr key={request._id}>
                        <td>{request.name}</td>
                        <td>{request.email}</td>
                        <td>{request.reason}</td>
                        <td>{new Date(request.requestedAt).toLocaleDateString()}</td>
                        <td className="flex gap-2">
                          <button 
                            className="btn btn-xs btn-success"
                            onClick={() => approvePublisherRequestMutation.mutate(request._id)}
                          >
                            Approve
                          </button>
                          <button 
                            className="btn btn-xs btn-error"
                            onClick={() => rejectPublisherRequestMutation.mutate(request._id)}
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;