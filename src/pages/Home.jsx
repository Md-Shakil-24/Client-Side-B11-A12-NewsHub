import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import ArticleCard from "../pages/ArticleCard";
import PublisherCard from "../pages/PublisherCard";
import CountUp from "react-countup";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import SubscriptionModal from "../component/SubcripstionModal";
import { Helmet } from "react-helmet";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [showModal, setShowModal] = useState(false);

 
  useEffect(() => {
    const timer = setTimeout(() => setShowModal(true), 10000);
    return () => clearTimeout(timer);
  }, []);

 
  const {
    data: latestArticles = [],
    isLoading: latestLoading,
    error: latestError,
  } = useQuery({
    queryKey: ["latestArticles"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/latest`);
      return res.data;
    },
  });

 
  const {
    data: trendingArticles = [],
    isLoading: trendingLoading,
    error: trendingError,
  } = useQuery({
    queryKey: ["trendingArticles"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/trending`);
      return res.data;
    },
  });

 
  const {
    data: publishers = [],
    isLoading: publishersLoading,
    error: publishersError,
  } = useQuery({
    queryKey: ["publishers"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/publishers`);
      return res.data;
    },
  });


  const {
    data: stats = {},
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/stats`);
      return res.data;
    },
  });


  const publisherData = {
    labels: publishers.map((p) => p.name),
    datasets: [
      {
        label: "Publishers",
        data: publishers.map(() => 1), 
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', 
          '#FF9F40', '#8AC249', '#EA5545', '#F46A9B', '#EF9B20',
          '#EDBF33', '#87BC45', '#27AEEF', '#B33DC6', '#00CC99',
          '#FF99CC', '#FF6666', '#6699FF', '#CC99FF', '#FFCC99'
        ].slice(0, publishers.length),
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 10
      }
    ]
  };

  
  const pieOptions = {
    plugins: {
      legend: {
        position: 'right',
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const publisher = publishers.find(p => p.name === label);
            return `${label}: ${publisher?.articleCount || 0} articles`;
          }
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true
  };

  if (latestLoading || trendingLoading || publishersLoading || statsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loading loading-spinner loading-lg" />
      </div>
    );
  }

  if (latestError || trendingError || publishersError || statsError) {
    return (
      <div className="alert alert-error max-w-md mx-auto mt-8">
        <span>Error loading data. Please try again later.</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">

           <Helmet>
              <title>Home | NewsHub</title>
              <meta name="description" content="Learn more about MyApp and what we do." />
              <meta property="og:title" content="About Us - MyApp" />
            </Helmet>
    
      <div className="hero min-h-[60vh] bg-base-200 rounded-xl mb-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold">Stay Informed with NewsHub</h1>
            <p className="py-6">
              Breaking news, trusted publishers, and powerful features at your fingertips.
            </p>
          </div>
        </div>
      </div>

    
      {latestArticles.length > 0 && (
        <section className="mb-16">
       
          <div className="flex items-center mb-6">
            <div className="w-4 h-8 bg-red-600 rounded mr-3"></div>
            <h2 className="text-3xl font-bold">BREAKING NEWS</h2>
            <div className="flex-1 ml-3 h-[2px] bg-gradient-to-r from-red-600 to-transparent"></div>
          </div>
          
       
<div className="bg-red-50 p-4 mb-6 rounded-lg overflow-hidden">
  <div className="marquee-container">
    <div className="marquee-content">
      {latestArticles.map((article, index) => (
        <span key={index} className="marquee-item">
          {article.title} • 
        </span>
      ))}
    </div>
  </div>
</div>
          
       
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {latestArticles.slice(0, 2).map((article, index) => (
              <div 
                key={article._id} 
                className="relative overflow-hidden rounded-xl h-96"
              >
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white text-xl font-bold mt-1">
                      <Link to={`/article/${article._id}`} className="hover:underline">
                        {article.title}
                      </Link>
                    </h3>
                    <p className="text-gray-300 mt-2 line-clamp-2">
                      {article.summary}
                    </p>
                  </div>
                </div>
                {index === 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    LATEST
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

  
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">🔥 Trending Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingArticles.map((article) => (
            <ArticleCard key={article._id} article={article} />
          ))}
        </div>
      </section>

    
      <section className="mb-16 ">
        <h2 className="text-3xl font-bold mb-8 text-center">📰 Our Publishers</h2>
        <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-5 gap-6">
          {publishers.map((publisher) => (
            <PublisherCard key={publisher._id} publisher={publisher} />
          ))}
        </div>
      </section>

    
      <section className="mb-16 pb-20 bg-base-200 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">📊 Platform Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-primary">
              <CountUp end={stats.total || 0} duration={2} />
            </h3>
            <p>Total Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-secondary">
              <CountUp end={stats.normal || 0} duration={2} />
            </h3>
            <p>Regular Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-accent">
              <CountUp end={stats.premium || 0} duration={2} />
            </h3>
            <p>Premium Users</p>
          </div>
        </div>
        <div className="mt-8 max-w-md mx-auto" style={{ height: '400px' }}>
          <Pie data={publisherData} options={pieOptions} />
          <p className="text-center mt-4 ml-[-100px]  text-sm text-gray-500">
            Each slice represents one publisher (total: {publishers.length})
          </p>
        </div>
      </section>

     
      <section className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">✨ Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card bg-white shadow-lg">
            <div className="card-body items-center text-center">
              <div className="text-blue-500 text-4xl mb-4">📰</div>
              <h3 className="text-xl font-bold">Personalized Feed</h3>
              <p className="mt-2">Get news tailored to your interests with our smart algorithm.</p>
            </div>
          </div>
          <div className="card bg-white shadow-lg">
            <div className="card-body items-center text-center">
              <div className="text-purple-500 text-4xl mb-4">🔔</div>
              <h3 className="text-xl font-bold">Instant Alerts</h3>
              <p className="mt-2">Never miss important updates with real-time notifications.</p>
            </div>
          </div>
          <div className="card bg-white shadow-lg">
            <div className="card-body items-center text-center">
              <div className="text-green-500 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold">In-depth Analytics</h3>
              <p className="mt-2">Understand news trends with our comprehensive data visualizations.</p>
            </div>
          </div>
        </div>
      </section>

     
      <section className="mb-16 bg-base-200 p-8 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img 
              src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
              alt="About NewsHub" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl font-bold mb-4">About NewsHub</h2>
            <p className="mb-4">
              NewsHub is a revolutionary platform that brings you the latest news from trusted sources around the world. 
              Our mission is to deliver accurate, timely, and diverse news coverage to keep you informed.
            </p>
            <p className="mb-6">
              Founded in 2023, we've grown to become one of the most comprehensive news aggregators, 
              partnering with over 50 publishers across various industries.
            </p>
            <Link to="/learnMore" className="btn btn-primary">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

  
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">📦 Choose Your Plan</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="text-xl font-bold">Free Plan</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✓ Basic article access</li>
                <li>✓ 1 article/month</li>
                <li>✗ Premium content</li>
              </ul>
              <button className="btn btn-outline mt-4 w-full">Current</button>
            </div>
          </div>
          <div className="card bg-primary text-white shadow">
            <div className="card-body">
              <h3 className="text-xl font-bold">Premium</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✓ Unlimited articles</li>
                <li>✓ All publishers</li>
                <li>✓ Premium content</li>
              </ul>
              <Link to="/subscription" className="btn btn-secondary mt-4 w-full">
                Subscribe
              </Link>
            </div>
          </div>
          <div className="card bg-base-100 border-2 border-primary shadow">
            <div className="card-body">
              <h3 className="text-xl font-bold">Family</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>✓ 6 Members</li>
                <li>✓ Shared reading list</li>
                <li>✓ Family controls</li>
              </ul>
              <Link to="/subscription" className="btn btn-primary mt-4 w-full">
                Get Family Plan
              </Link>
            </div>
          </div>
        </div>
      </section>

    
      <div className="text-center mb-16">
        <Link to="/request-publisher" className="btn btn-primary">
          Request to Become Publisher
        </Link>
      </div>

      {/* Modal */}
      <SubscriptionModal showModal={showModal} setShowModal={setShowModal} />

      

<style jsx>{`
  .marquee-container {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
  }
  .marquee-content {
    display: inline-block;
    padding-left: 100%; /* Start off-screen to the right */
    animation: marquee 15s linear infinite;
  }
  .marquee-item {
    display: inline-block;
    padding: 0 2rem;
    font-weight: bold;
    color: #dc2626;
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-100%); }
  }
`}</style>
    </div>
  );
};

export default Home;