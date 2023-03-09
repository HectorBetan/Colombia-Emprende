import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyStore } from "../context/MyStoreContext";
export function ProtectedStore({ children }) {
  const { loading } = useAuth();
  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  return <>{children}</>;
}
export function ProtectedRegisterStore({ children }) {
  const { loading } = useAuth();
  const { userStore } = useMyStore();
  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  if (userStore) {
    return <Navigate to="/admin/mi-emprendimiento" replace={true} />;
  }
  return <>{children}</>;
}