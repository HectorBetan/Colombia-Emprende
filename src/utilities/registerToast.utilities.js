import { useAuth } from "../context/AuthContext"
import { useNavigate  } from "react-router-dom";
export const RegisterToast = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const handleRegistro = (e) => {
        e.preventDefault();
        document.getElementById("msj-emprendedor").style.display = "none";
        navigate("/admin/registro-emprendimiento");
    };
    if (!user.Emprendimiento_id)
    return (
        <div className="text-bottom">
            <div className="toast show w-100" role="alert" aria-live="assertive" aria-atomic="true" id="msj-emprendedor">
                <div className="toast-header">
                <h6 className="me-auto">¿Eres un Emprendedor Colombiano
                y Deseas registrar tu emprendimiento?</h6>
                <button type="button" className="btn btn-primary btn-sm me-2" onClick={handleRegistro}>Si deseo</button>
                <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="toast">No</button>
                </div>
            </div>
        </div>
    );
}  