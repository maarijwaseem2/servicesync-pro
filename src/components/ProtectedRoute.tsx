import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export const ProtectedRoute = ({
  allowedRoles,
}: {
  allowedRoles?: string[];
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>Loading account...</div>;

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
    if (user.role === "PROVIDER") return <Navigate to="/provider" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
