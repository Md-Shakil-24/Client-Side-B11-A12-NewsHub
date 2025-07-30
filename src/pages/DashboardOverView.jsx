import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Chart } from "react-google-charts";
import { toast } from "react-toastify";

const DashboardOverview = () => {
  const queryClient = useQueryClient();

  const { data: stats = {} } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
      return res.data;
    },
  });

  const { data: articles = [] } = useQuery({
    queryKey: ["admin-articles"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/admin/articles`);
      // Safely return the articles array
      return Array.isArray(res.data) ? res.data : res.data.articles || [];
    },
  });

  const publisherStats = {};
  articles.forEach(article => {
    const publisher = article.publisher || "Unknown";
    publisherStats[publisher] = (publisherStats[publisher] || 0) + 1;
  });

  const pieChartData = [
    ["Publisher", "Articles"],
    ...Object.entries(publisherStats),
  ];

  const userStats = [
    ["Type", "Count"],
    ["Total Users", stats.total || 0],
    ["Premium Users", stats.premium || 0],
    ["Normal Users", (stats.total || 0) - (stats.premium || 0)],
  ];

  const articleStatusStats = [
    ["Status", "Count"],
    ["Approved", articles.filter(a => a.status === "approved").length],
    ["Pending", articles.filter(a => a.status === "pending").length],
    ["Declined", articles.filter(a => a.status === "declined").length],
  ];

  return (
    <>
      <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>

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
                legend: { position: "right" },
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
                legend: { position: "right" },
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
              legend: { position: "none" },
            }}
            width="100%"
            height="400px"
          />
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;
