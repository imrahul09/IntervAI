import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// why ? because now can someone manually erite /dashboard and can use , but if i use protected route so
// so that  it check if the user is login then he can access it otherwise access denied

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
