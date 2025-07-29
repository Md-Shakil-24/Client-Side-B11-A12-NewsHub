import { useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../provider/AuthProvider';
import { toast } from 'react-toastify';
import useArticle from '../PrivateRoute/useArticle';

const CheckPremium = ({ children }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const { user, isPremiumUser } = useContext(AuthContext);

  const { data: article, isLoading } = useArticle(id);

  useEffect(() => {
   
    if (id) {
      if (!isLoading && article?.isPremium) {
        if (!user) {
          toast.warn("Please login to access premium content.");
          return navigate("/auth/signIn");
        }
        if (!isPremiumUser) {
          toast.error("This is a premium article. Please subscribe.");
          return navigate("/subscription");
        }
      }
    } else {
   
      if (!user) {
        toast.warn("Please login to access premium content.");
        return navigate("/auth/signIn");
      }
      if (!isPremiumUser) {
        toast.error("Please subscribe to view premium content.");
        return navigate("/subscription");
      }
    }
  }, [id, article, isLoading, isPremiumUser, user, navigate]);

  if (id && isLoading) return <div className="text-center py-20 text-lg font-semibold">Loading article...</div>;

  return children;
};

export default CheckPremium;
