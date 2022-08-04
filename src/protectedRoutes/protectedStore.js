import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProtectedStore({ children }) {
    const { userData, loading } = useAuth();
    if (loading) return(
        <div className="spinner-border text-primary text-center align-middle" role="status">
        <span className="visually-hidden">Loading...</span>
        </div>
    );
    if (!userData) {return <Navigate to="/" replace={true} />;}
    if (!userData.Emprendimiento_id) {return <Navigate to="/admin" replace={true} />;}
    return <>{children}</>;
}
export function ProtectedRegisterStore({ children }) {
    const { userData, loading } = useAuth();
    if (loading) return(
        <div className="spinner-border text-primary text-center align-middle" role="status">
        <span className="visually-hidden">Loading...</span>
        </div>
    );
    if(userData){
        if(userData.Emprendimiento_id){
            console.log("Ya tiene un emprendimiento");
            return <Navigate to="/admin/mi-emprendimiento" replace={true} />;
        }
    }
    return <>{children}</>;
}