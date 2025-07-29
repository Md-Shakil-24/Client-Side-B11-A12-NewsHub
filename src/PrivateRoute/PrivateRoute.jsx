import { use } from "react";

import { Navigate } from "react-router";
import { AuthContext } from "../provider/AuthProvider";

const PrivateRoute = ({children}) => {
    const { user, loading } = use(AuthContext);

   if(loading){
    return <div className="flex justify-center min-h-screen"><span className="loading loading-ring loading-xl"></span></div>
   }
    if(!user) {
        return <Navigate state={location.pathname} to="/auth/signIN"></Navigate>
    }
    
    return children
};

export default PrivateRoute;