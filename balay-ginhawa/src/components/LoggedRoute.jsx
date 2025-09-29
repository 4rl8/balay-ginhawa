import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoggedRoute({ children }) {
  const { admin } = useAuth();

  // If logged in, redirect to default dashboard route
  if (admin) {
    return <Navigate to="/frontdesk" replace />;
  }

  return children;
}
