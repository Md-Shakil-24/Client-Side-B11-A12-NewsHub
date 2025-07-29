import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../mainLayout/MainLayout";
import AuthLayout from "../mainLayout/AuthLayout";
import ErrorPage from "../pages/ErrorPage";

import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";

import AddArticle from "../pages/AddArticle";
import ArticleDetails from "../pages/ArticleDetails";
import Dashboard from "../pages/Dashboard";

import ForgetPassword from "../pages/ForgatePassward";
import MyProfile from "../pages/MyProfil";
import AllArticles from "../pages/AllArticles";
import AdminRoute from "../PrivateRoute/AdminRoute";
import Home from "../pages/Home";
import MyArticles from "../pages/MyArticles";

import PremiumArticles from "../pages/PremiumArticles";
import AddPublisher from "../pages/AddPublisher";

import PrivateRoute from "../PrivateRoute/PrivateRoute"
import CheckPremium from "../PrivateRoute/CheckPremium";
import Subscription from "../pages/Subcripstion";
import DashboardLayout from "../pages/DashboardLayout";
import DashboardOverview from "../pages/DashboardOverView";
import UsersManagement from './../pages/UserManagement';
import PublisherRequests from "../pages/adminDashboard/PublisherRequest";
import AllPublishers from "../pages/adminDashboard/AllPublisher";
import ArticleRequests from "../pages/ArticleRequest"
import AllArticlesAdmin from "../pages/AllArticleAdmin";
import Category from "../pages/Category";
import LearnMoreAbout from "../pages/LearnMoreAbout";
import PublisherRequestForm from "../pages/RequestForm";
// import PublisherRequest from "../pages/RequestPublisher";
// import RequestPublisher from "../pages/RequestPublisher";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "add-article",
        element: (
          <PrivateRoute>
            <AddArticle />
          </PrivateRoute>
        ),
      },

      {
        path: "subscription",
        element: (
          <PrivateRoute>
            <Subscription />
          </PrivateRoute>
        ),
      },
      {
        path: "learnMore",
        element: (
          <PrivateRoute>
            <LearnMoreAbout />
          </PrivateRoute>
        ),
      },
      {
        path : "/category/:tag",
        element: (
          <PrivateRoute>
            <Category></Category>
          </PrivateRoute>
        ),
      },

      { path: "all-articles", element: <AllArticles /> },
      { path: "forgate", element: <ForgetPassword /> },

      {
        path: "/article/:id",
        element: (
          <CheckPremium>
         
            <ArticleDetails />
          </CheckPremium>
        ),
      },
      // {
      //   path: "article/:id",
      //   element: (
      //     <PrivateRoute>
      //       <ArticleDetails />
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "premium-articles",
        element: <PremiumArticles></PremiumArticles>
         
          
        
      },
      {
        path: "myProfile",
        element: (
          <PrivateRoute>
            <MyProfile />
          </PrivateRoute>
        ),
      },
      {
        path: "/request-publisher",
        element: (
          <PrivateRoute>
            <PublisherRequestForm />
          </PrivateRoute>
        ),
      },
      {
        path: "myArticle",
        element: (
          <PrivateRoute>
            <MyArticles />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "signIn", element: <SignIn /> },
      { path: "signUp", element: <SignUp /> },
    ],
  },
  // {
  //   path: "/admin",
  //   element: <AdminRoute />, // Protect all /admin routes here
  //   children: [
  //     { path: "dashboard", element: <Dashboard /> },
  //     { path: "add-publisher", element: <AddPublisher /> },
  //     // Add more admin routes here if needed
  //   ],
  // },

  
 {
  path: "/admin",
  element: (
    <AdminRoute>
      <DashboardLayout />
    </AdminRoute>
  ),
  children: [
    { index: true, element: <DashboardOverview /> },
    { path: "users", element: <UsersManagement /> },
    { path: "publishers", element: <AllPublishers /> },
    { path: "publisher-requests", element: <PublisherRequests /> },
    { path: "add-publisher", element: <AddPublisher /> },
    {  path: "article-requests", element: <ArticleRequests /> },
    {  path: "all-articles", element: <AllArticlesAdmin /> },
  ],
},

]);
