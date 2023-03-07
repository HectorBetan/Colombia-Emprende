import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useMyStore } from "../context/MyStoreContext";
export function ProtectedStore({ children }) {
  const { loading } = useAuth();
  if (loading)
    return (
      <div
        className="spinner-border text-primary text-center align-middle"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  return <>{children}</>;
}
export function ProtectedRegisterStore({ children }) {
  const { loading } = useAuth();
  const { userStore } = useMyStore();
  if (loading)
    return (
      <div
        className="spinner-border text-primary text-center align-middle"
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    );
  if (userStore) {
    return <Navigate to="/admin/mi-emprendimiento" replace={true} />;
  }
  return <>{children}</>;
}