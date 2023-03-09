import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export function UserVerified({ children }) {
  const { user, loading } = useAuth();
  if (user.emailVerified === false)
    return <Navigate to={`/reverificacion`} replace={true} />;
  if (user) {
    if (user.emailVerified === true) {
      sessionStorage.removeItem("location");
    }
  }
  if (loading)
    return (
      <div
        style={{ minHeight: "300px" }}
        className="d-flex flex-row justify-content-center"
      >
        <div className="col-3 bg-dark"></div>
        <div className="col-9"><div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div></div>
      </div>
    );
  if (!user) {
    sessionStorage.removeItem("location");
    return <Navigate to="/" replace={true} />;
  }

  return <>{children}</>;
}