
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useContext } from 'react';
import { AuthContext } from '../provider/AuthProvider';

const UseArticle = (id) => {
  const { user } = useContext(AuthContext);
  
  return useQuery({
    queryKey: ['article', id],
    queryFn: async () => {
      const token = await user?.getIdToken();
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return res.data;
    },
    enabled: !!user && !!id
  });
};

export default UseArticle;