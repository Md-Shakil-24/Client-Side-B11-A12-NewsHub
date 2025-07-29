import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useUserData = (email, enabled = true) => {
  return useQuery({
    queryKey: ["user", email],
    enabled: !!email && enabled,
    queryFn: async () => {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/${email}`);
      return res.data;
    },
  });
};

export default useUserData;
