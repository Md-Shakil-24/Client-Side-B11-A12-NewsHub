import React, { createContext, useEffect, useState, useCallback } from "react";
import app from "../firebase/firebase.config";
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [mongoUser, setMongoUser] = useState(null);
  const [subscriptionCheckInterval, setSubscriptionCheckInterval] = useState(null);

  const googleProvider = new GoogleAuthProvider();

  const updateUserProfile = (displayName, photoURL) => {
    if (auth.currentUser) {
      return updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      }).then(() => setUser({ ...auth.currentUser }));
    } else {
      return Promise.reject("No user is logged in");
    }
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const resetPassword = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email);
  };

  const logOut = () => {
    setLoading(true);
    if (subscriptionCheckInterval) {
      clearInterval(subscriptionCheckInterval);
      setSubscriptionCheckInterval(null);
    }
    return signOut(auth);
  };

  const fetchUserDetails = async (firebaseUser) => {
    if (!firebaseUser?.email) return;

    try {
      const token = await firebaseUser.getIdToken(true);
      localStorage.setItem("access-token", token);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${firebaseUser.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const dbUser = res.data;
      setMongoUser(dbUser);

     
      const roles = dbUser?.roles || [];
      if (dbUser?.role && !roles.includes(dbUser.role)) {
        roles.push(dbUser.role);
      }

      setIsAdmin(roles.includes("admin"));
      const premiumStatus = dbUser?.premiumTaken && new Date(dbUser.premiumTaken) > new Date();
      setIsPremiumUser(premiumStatus);

   
      if (premiumStatus && !subscriptionCheckInterval) {
        const interval = setInterval(() => {
          checkSubscriptionStatus(firebaseUser);
        }, 60000);
        setSubscriptionCheckInterval(interval);
      }

      return dbUser;
    } catch (err) {
      console.error("DB user fetch failed:", err);
      setIsAdmin(false);
      setIsPremiumUser(false);
      setMongoUser(null);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkSubscriptionStatus = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${firebaseUser.email}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const dbUser = res.data;
      const isStillPremium = dbUser?.premiumTaken && new Date(dbUser.premiumTaken) > new Date();
      
      if (!isStillPremium) {
        setIsPremiumUser(false);
        if (subscriptionCheckInterval) {
          clearInterval(subscriptionCheckInterval);
          setSubscriptionCheckInterval(null);
        }
      }
      
      return isStillPremium;
    } catch (err) {
      console.error("Subscription status check failed:", err);
      return false;
    }
  };

  const refreshUserStatus = useCallback(async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      try {
       
        const token = await currentUser.getIdToken(true);
        localStorage.setItem("access-token", token);
        
       
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${currentUser.email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
        const dbUser = res.data;
        setMongoUser(dbUser);
        
       
        const premiumStatus = dbUser?.premiumTaken && new Date(dbUser.premiumTaken) > new Date();
        setIsPremiumUser(premiumStatus);

      
        if (premiumStatus && !subscriptionCheckInterval) {
          const interval = setInterval(() => {
            checkSubscriptionStatus(currentUser);
          }, 60000);
          setSubscriptionCheckInterval(interval);
        } else if (!premiumStatus && subscriptionCheckInterval) {
          clearInterval(subscriptionCheckInterval);
          setSubscriptionCheckInterval(null);
        }
        
        return true;
      } catch (err) {
        console.error("Refresh failed:", err);
        return false;
      }
    }
    return false;
  }, [subscriptionCheckInterval]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(true);

      if (currentUser) {
        await fetchUserDetails(currentUser);
      } else {
        localStorage.removeItem("access-token");
        setIsAdmin(false);
        setIsPremiumUser(false);
        setMongoUser(null);
        if (subscriptionCheckInterval) {
          clearInterval(subscriptionCheckInterval);
          setSubscriptionCheckInterval(null);
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      if (subscriptionCheckInterval) {
        clearInterval(subscriptionCheckInterval);
      }
    };
  }, [subscriptionCheckInterval]);

  const authData = {
    user,
    setUser,
    mongoUser,
    isAdmin,
    isPremiumUser,
    loading,
    createUser,
    signIn,
    signInWithGoogle,
    updateUserProfile,
    resetPassword,
    logOut,
    refreshUserStatus,
  };

  return (
    <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;