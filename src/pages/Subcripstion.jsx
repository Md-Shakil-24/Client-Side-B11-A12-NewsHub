import React, { useContext, useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../provider/AuthProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaArrowRight, FaCrown, FaGem, FaStar, FaClock } from "react-icons/fa";
import LoadingSpinner from "../component/Spinner";
import { Helmet } from "react-helmet";

const Subscription = () => {
  const { user, refreshUserStatus } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [activePlanId, setActivePlanId] = useState(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);


  const planCardStyle = {
    minHeight: '480px', 
    transition: 'all 0.3s ease-out'
  };

  const plans = useMemo(() => [
    { 
      id: "test", 
      name: "1-Minute Test", 
      duration: 1,
      price: 0.01,
      features: ["Full access for 1 minute", "Test all premium features", "Instant activation"],
      icon: <FaClock className="text-blue-500" />,
      testPlan: true
    },
    { 
      id: "trial", 
      name: "1-Day Trial", 
      duration: 1440, 
      price: 0.99,
      features: ["Full access for 24 hours", "Cancel anytime", "Try premium features"],
      icon: <FaStar className="text-yellow-400" />,
      popular: false
    },
    { 
      id: "weekly", 
      name: "Weekly Pass", 
      duration: 10080, 
      price: 4.99,
      features: ["7 days unlimited access", "All premium content", "Priority support"],
      icon: <FaGem className="text-purple-500" />,
      popular: true
    },
    { 
      id: "monthly", 
      name: "Monthly Premium", 
      duration: 43200, 
      price: 14.99,
      features: ["30 days unlimited access", "Exclusive content", "Ad-free experience", "Premium badge"],
      icon: <FaCrown className="text-amber-500" />,
      popular: false
    },
  ], []);

  const {
    data: mongoUser,
    isLoading: isUserLoading,
    isError: isUserError,
    error: userError,
    refetch: refetchUser,
  } = useQuery({
    queryKey: ["user", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      try {
        const token = await user.getIdToken();
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${user.email}`,
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000
          }
        );
        return res.data;
      } catch (error) {
        console.error("Failed to fetch user:", error);
        throw error;
      }
    },
    retry: 2,
    staleTime: 1000 * 60 * 5,
    onSettled: () => setInitialLoadComplete(true),
  });

  const { mutate: handleSubscribe } = useMutation({
    mutationFn: async (plan) => {
      try {
        const token = await user.getIdToken(true);
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/subscribe/${user.email}`,
          { duration: plan.duration },
          { 
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000
          }
        );
        return res.data;
      } catch (error) {
        console.error("Subscription failed:", error);
        throw error;
      }
    },
    onMutate: (plan) => {
      setActivePlanId(plan.id);
      toast.info(
        <div className="flex items-center">
          <div className="animate-spin mr-2">
            <LoadingSpinner size="small" />
          </div>
          {plan.id === 'test' ? 'Activating test plan...' : `Processing your ${plan.name} subscription...`}
        </div>,
        { autoClose: false }
      );
    },
    onSuccess: async (data, plan) => {
      
      await queryClient.setQueryData(["user", user.email], data.user);
      
     
      await refreshUserStatus();

      toast.dismiss();
      toast.success(
        <div className="flex items-center">
          <FaCrown className="text-green-500 mr-2" />
          {plan.id === 'test' 
            ? 'Test plan activated! You have 1 minute of premium access.' 
            : 'Subscription successful! Premium articles are now available.'}
        </div>,
        { autoClose: 5000 }
      );
      
      if (plan.id === 'test') {
        let secondsLeft = 60;
        const toastId = toast.info(
          <div>
            <div className="font-semibold">Test plan active:</div>
            <div className="flex items-center">
              <span className="mr-2">{secondsLeft}</span> seconds remaining
            </div>
          </div>,
          { autoClose: false }
        );

        const interval = setInterval(() => {
          secondsLeft -= 1;
          if (secondsLeft <= 0) {
            clearInterval(interval);
            toast.update(toastId, {
              render: (
                <div className="flex items-center">
                  <span className="text-yellow-500 mr-2">⚠️</span>
                  Your test plan has expired
                </div>
              ),
              autoClose: 5000
            });
          } else {
            toast.update(toastId, {
              render: (
                <div>
                  <div className="font-semibold">Test plan active:</div>
                  <div className="flex items-center">
                    <span className="mr-2">{secondsLeft}</span> seconds remaining
                  </div>
                </div>
              )
            });
          }
        }, 1000);
      }
    },
    onError: (error) => {
      toast.dismiss();
      const errorMessage = error.response?.data?.error || 
                         error.message || 
                         "Subscription failed. Please try again.";
      toast.error(
        <div className="flex items-center">
          <span className="text-red-500 mr-2">✕</span>
          {errorMessage}
        </div>,
        { autoClose: 5000 }
      );
    },
    onSettled: () => {
      setActivePlanId(null);
      refetchUser();
    },
  });



  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">




<Helmet>
        <title>Subscription | NewsHub</title>
        <meta name="description" content="Create an account for NewsHub." />
      </Helmet>






      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl mb-4">
            Upgrade Your Experience
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs and unlock premium features
          </p>
        </div>

        {mongoUser?.premiumTaken && (
          <div className="max-w-2xl mx-auto mb-10 bg-gradient-to-r from-green-100 to-teal-100 p-6 rounded-xl shadow-md border border-green-200">
            <div className="flex items-center justify-center">
              <FaCrown className="text-green-600 text-2xl mr-3" />
              <h3 className="text-xl font-semibold text-green-800">
                {new Date(mongoUser.premiumTaken) > new Date() 
                  ? "You're a Premium Member!" 
                  : "Your Premium Membership Has Expired"}
              </h3>
            </div>
            <p className="text-center text-green-700 mt-2">
              {new Date(mongoUser.premiumTaken) > new Date() 
                ? `Active until ${new Date(mongoUser.premiumTaken).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}`
                : `Expired on ${new Date(mongoUser.premiumTaken).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}`}
            </p>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${
                plan.popular ? "ring-2 ring-purple-500 transform scale-105" : 
                plan.testPlan ? "ring-2 ring-blue-500" : 
                "border border-gray-200"
              } ${activePlanId === plan.id ? "bg-gray-50" : "bg-white"}`}
              style={planCardStyle} 
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-purple-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              {plan.testPlan && (
                <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-bold rounded-bl-lg">
                  TEST PLAN
                </div>
              )}
              
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center mb-4">
                  <div className="text-3xl mr-3">
                    {plan.icon}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                </div>
                
                <div className="mb-4">
                  <span className="text-3xl font-extrabold text-gray-900">${plan.price.toFixed(2)}</span>
                  {!plan.testPlan && (
                    <span className="text-gray-500 text-sm"> / {plan.id === 'trial' ? 'day' : plan.id === 'weekly' ? 'week' : 'month'}</span>
                  )}
                </div>
                
                <ul className="space-y-2 mb-6 flex-grow">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <svg className="h-4 w-4 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={activePlanId === plan.id || 
                           (mongoUser?.premiumTaken && new Date(mongoUser.premiumTaken) > new Date() && !plan.testPlan)}
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-all ${
                    activePlanId === plan.id 
                      ? 'bg-blue-400 cursor-not-allowed'
                      : plan.popular
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white'
                        : plan.testPlan
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-gray-800 hover:bg-gray-900 text-white'
                  } ${
                    (mongoUser?.premiumTaken && new Date(mongoUser.premiumTaken) > new Date() && !plan.testPlan)
                      ? 'opacity-50 cursor-not-allowed'
                      : ''
                  }`}
                >
                  {activePlanId === plan.id ? (
                    <>
                      <LoadingSpinner size="small" className="mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      {mongoUser?.premiumTaken && new Date(mongoUser.premiumTaken) > new Date() && !plan.testPlan
                        ? 'Already Subscribed' 
                        : plan.testPlan 
                          ? 'Try Now' 
                          : 'Subscribe'}
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        
      </div>
    </div>
  );
};

export default Subscription;