import React, { useEffect, useState, useContext } from "react"; 
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import ArticleCard from "../pages/ArticleCard";
import PublisherCard from "../pages/PublisherCard";
import CountUp from "react-countup";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import SubscriptionModal from "../component/SubcripstionModal";
import { Helmet } from "react-helmet";
import Slider from "react-slick";
import Swal from "sweetalert2";
import { AuthContext } from "../provider/AuthProvider";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const { isPremiumUser } = useContext(AuthContext);
  const navigate = useNavigate();

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
          font: { size: 12 }
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

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const handleBreakingNewsClick = (article) => {
    if (article.isPremium && !isPremiumUser) {
      Swal.fire({
        icon: "info",
        title: "Premium Content",
        text: "Please subscribe to access premium articles.",
        showCancelButton: true,
        confirmButtonText: "Subscribe",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/subscription");
        }
      });
    } else {
      navigate(`/article/${article._id}`);
    }
  };

  return (
    <div className="max-w-[1580px] mx-auto px-2 py-8">
      <Helmet>
        <title>Home | NewsHub</title>
        <meta name="description" content="Learn more about MyApp and what we do." />
        <meta property="og:title" content="About Us - MyApp" />
      </Helmet>

      
      <div className="hero  rounded-xl mb-12">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl text-blue-600 font-bold">Stay Informed with NewsHub</h1>
            <p className="text-blue-600  py-6">
              Breaking news, trusted publishers, and powerful features at your fingertips.
            </p>
          </div>
        </div>
      </div>

     
      {latestArticles.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center mb-6">
            <div className="w-4 h-8 bg-red-600 rounded mr-3"></div>
            <h2 className="text-3xl text-blue-600  font-bold">BREAKING NEWS</h2>
            <div className="flex-1 ml-3 h-[2px] bg-gradient-to-r from-red-600 to-transparent"></div>
          </div>
          <div className="bg-red-50/20 p-4 mb-6 rounded-lg overflow-hidden">
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
            {latestArticles.slice(0, 2).map((article) => (
              <div
                key={article._id}
                className="relative overflow-hidden rounded-xl h-96 cursor-pointer"
                onClick={() => handleBreakingNewsClick(article)}
                style={{ userSelect: "none" }}
              >
                <img src={article.image} alt={article.title} className="w-full h-full object-cover"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white text-xl font-bold mt-1">{article.title}</h3>
                    <p className="text-gray-300 mt-2 line-clamp-2">{article.summary}</p>
                  </div>
                </div>
                {article.isPremium && !isPremiumUser && (
                  <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.25) 100%)",
                      backdropFilter: "blur(4px)",
                      WebkitBackdropFilter: "blur(4px)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-16 w-16 text-white drop-shadow-lg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c.552 0 1 .448 1 1v2c0 .552-.448 1-1 1s-1-.448-1-1v-2c0-.552.448-1 1-1z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8V7a5 5 0 00-10 0v1H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2h-2z"/>
                    </svg>
                  </div>
                )}
                {latestArticles[0]._id === article._id && (
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
        <Slider {...sliderSettings}>
          {trendingArticles.map(article => (
            <div key={article._id} className="px-2">
              <ArticleCard article={article} />
            </div>
          ))}
        </Slider>
      </section>

      
      <section className="mb-16 ">
        <h2 className="text-3xl font-bold mb-8 text-center">📰 Our Publishers</h2>
        <div className="grid grid-cols-2 md:grid-cols-3  lg:grid-cols-5 gap-6">
          {publishers.map((publisher) => (
            <PublisherCard key={publisher._id} publisher={publisher} />
          ))}
        </div>
      </section>

     
      <section className="mb-16 pb-20 p-8 rounded-xl">
        <h2 className="text-3xl text-blue-600 font-bold mb-8 text-center">📊 Platform Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-4xl font-bold text-primary">
              <CountUp end={stats.total || 0} duration={2} />
            </h3>
            <p className="text-blue-600"> Total Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-secondary">
              <CountUp end={stats.normal || 0} duration={2} />
            </h3>
            <p className="text-blue-600">Regular Users</p>
          </div>
          <div>
            <h3 className="text-4xl font-bold text-accent">
              <CountUp end={stats.premium || 0} duration={2} />
            </h3>
            <p className="text-blue-600">Premium Users</p>
          </div>
        </div>
        <div className="mt-8 max-w-md mx-auto" style={{ height: '400px' }}>
          <Pie data={publisherData} options={pieOptions} />
          <p className="text-center text-blue-600 mt-4 ml-[-100px]  text-sm font-bold">
            Each slice represents one publisher (total: {publishers.length})
          </p>
        </div>
      </section>

      {/* Key Features */}
      <section className="mb-16 py-8 rounded-xl">
        <h2 className="text-3xl font-bold mb-8 text-blue-600 text-center">✨ Key Features</h2>
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

      
      <section className="mb-16 rounded-xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
              alt="About NewsHub"
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-3xl text-blue-600 font-bold mb-4">About NewsHub</h2>
            <p className="text-blue-600 font-semibold mb-4">
              NewsHub is a revolutionary platform that brings you the latest news from trusted sources around the world.
              Our mission is to deliver accurate, timely, and diverse news coverage to keep you informed.
            </p>
            <p className="text-blue-600 mb-6">
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

     
      <section className="mb-16 rounded-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">💬 Testimonials</h2>
        <div className=" grid md:grid-cols-2 gap-8">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <p>"NewsHub keeps me updated with all the latest trends! The interface is super friendly."</p>
            <h4 className="mt-4 font-bold">- Sarah L.</h4>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <p>"The premium articles are insightful and well-written. Highly recommend the subscription."</p>
            <h4 className="mt-4 font-bold">- David K.</h4>
          </div>
        </div>
      </section>

  
      <section className=" mb-16 rounded-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">✍️ Editorial Team</h2>
        <div className=" items-center flex justify-center gap-10">
          <div className="flex flex-col justify-center items-center">
            <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Editor" className="w-32 h-32 rounded-full mx-auto"/>
            <h3 className="mt-4 font-bold">James Carter</h3>
            <p className="text-sm text-gray-500">Senior Editor</p>
          </div>
          <div className="flex flex-col justify-center items-center">
            <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Editor" className="w-32 h-32 rounded-full mx-auto"/>
            <h3 className="mt-4 font-bold">Olivia Brown</h3>
            <p className="text-sm text-gray-500">Content Manager</p>
          </div>
        </div>
      </section>

     
      <section className=" rounded-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">❓ Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h4 className="font-bold mb-2">How do I subscribe to premium content?</h4>
            <p>Simply choose a Premium or Family plan above, and you will get access immediately after subscribing.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h4 className="font-bold mb-2">Can I cancel my subscription?</h4>
            <p>Yes, you can cancel anytime from your account settings. You will retain access until the end of your billing period.</p>
          </div>
          <div className="p-6 bg-white shadow-lg rounded-lg">
            <h4 className="font-bold mb-2">How are articles selected for my personalized feed?</h4>
            <p>Our smart algorithm analyzes your reading habits and preferred topics to deliver news tailored specifically for you.</p>
          </div>
        </div>
      </section>

      <SubscriptionModal showModal={showModal} setShowModal={setShowModal} />

      <style jsx>{`
        .marquee-container {
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
        }
        .marquee-content {
          display: inline-block;
          padding-left: 100%;
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
