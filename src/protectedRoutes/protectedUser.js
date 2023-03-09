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
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  if (!user) {
    sessionStorage.removeItem("location");
    return <Navigate to="/" replace={true} />;
  }
  return <>{children}</>;
}