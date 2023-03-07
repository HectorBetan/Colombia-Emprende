import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function ProtectedUser({ children }) {
  const { user, loading } = useAuth();
  if (user) {
    if (user.emailVerified === true) {
      sessionStorage.removeItem("location");
    }
  }
  if (loading)
    return (
      <div
        className="spinner-border text-primary text-center align-middle"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  if (!user) {
    sessionStorage.removeItem("location");
    return <Navigate to="/" replace={true} />;
  }
  return <>{children}</>;
}