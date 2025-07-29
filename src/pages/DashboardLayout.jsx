import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FaBars,
  FaUsers,
  FaNewspaper,
  FaPlus,
  FaChartPie,
  FaCheckSquare,
  FaTimes,
  FaHome,
  FaClipboardList,
  FaNewspaper as LogoIcon,
  FaFileAlt,        
} from "react-icons/fa";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";


const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);


  const { data: pendingArticleCount = 0 } = useQuery({
    queryKey: ["pending-article-requests-count"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/article-requests/count-pending`
      );
      return res.data.count || 0;
    },
    refetchInterval: 60000, 
  });

 
  const { data: pendingPublisherCount = 0 } = useQuery({
    queryKey: ["pending-publisher-requests-count"],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/publisher-requests/count-pending`
      );

      return res.data.count || 0;
    },
    refetchInterval: 60000,
  });

  const navItems = [
    { name: "Overview", path: "/admin", icon: <FaChartPie /> },
    { name: "All Users", path: "/admin/users", icon: <FaUsers /> },
    {
      name: "All Publishers",
      path: "/admin/publishers",
      icon: <FaNewspaper />,
    },
    {
      name: "All Articles",          
      path: "/admin/all-articles",
      icon: <FaFileAlt />,
    },
    {
      name: "Publisher Requests",
      path: "/admin/publisher-requests",
      icon: <FaCheckSquare />,
      badgeCount: pendingPublisherCount,
    },
    { name: "Add Publisher", path: "/admin/add-publisher", icon: <FaPlus /> },
    {
      name: "Article Requests",
      path: "/admin/article-requests",
      icon: <FaClipboardList />,
      badgeCount: pendingArticleCount,
    },
  ];

  const SidebarContent = () => (
    <div className="h-full w-72 bg-gradient-to-br from-blue-700 via-indigo-600 to-purple-700 text-white shadow-2xl backdrop-blur-md p-6 flex flex-col">
    
      <div className="flex-1 overflow-y-auto">
      
        <div className="flex items-center gap-3 mb-10">
          <LogoIcon className="text-3xl text-white animate-bounce" />
          <h2 className="text-2xl font-bold tracking-wide">NewsHub Admin</h2>
        </div>

       
        <ul className="space-y-3">
          {navItems.map((item) => (
            <li key={item.path} className="relative">
              <NavLink
                to={item.path}
                end={item.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ease-in-out group ${
                    isActive
                      ? "bg-white/20 text-white shadow-inner scale-[1.02]"
                      : "hover:bg-white/10 hover:scale-[1.02]"
                  }`
                }
              >
                <span className="text-lg transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                  {item.icon}
                </span>
                <span className="font-medium transition-colors duration-300 group-hover:text-white whitespace-nowrap">
                  {item.name}
                </span>

               
                {item.badgeCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold leading-none text-red-100 bg-red-600 rounded-full whitespace-nowrap">
                    {item.badgeCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

     
      <div className="pt-6 mt-auto">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 hover:brightness-110 active:scale-95 backdrop-blur-md"
        >
          <FaHome className="text-xl animate-pulse" />
          <span className="font-semibold whitespace-nowrap">Back to Home</span>
        </button>

        

        <p className="text-xs text-slate-100 mt-6 text-center">
          © {new Date().getFullYear()} NewsHub
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
    
      <aside className="hidden lg:block fixed top-0 left-0 h-full z-40">
        <SidebarContent />
      </aside>

  
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="text-2xl text-white bg-indigo-600 shadow-md p-2 rounded-md"
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

    
      {isSidebarOpen && (
        <div className="lg:hidden fixed top-0 left-0 w-72 h-full z-50">
          <div className="relative h-full">
            <SidebarContent />
            <button
              onClick={toggleSidebar}
              className="absolute top-4 right-4 text-white text-xl hover:text-red-400"
              aria-label="Close sidebar"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

    
      <main className="flex-1 lg:ml-72 p-6 w-full overflow-y-auto min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
