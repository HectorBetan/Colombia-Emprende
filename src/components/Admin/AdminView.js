import { useAuth } from "../../context/AuthContext";
import UserUpdate from "./UserUpdate";
import PasswordChange from "./PasswordChange";
import UserDelete from "./UserDelete";
import { useNavigate  } from "react-router-dom";
function AdminView() {
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    if (loading) return (
        <div style={{width:"239.61px"}} className="text-end me-5">
        <div className="spinner-border text-primary text-start" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
        </div> 
    );
    return (
        <div className="d-block">
            <div className="d-flex flex-row w-100">
                <div className="flex-column text-center w-100">
                    <div>Hola {user.displayName}</div>
                    <div>Bienvenido a Colombia Emprende</div>
                    Desde aquí podrás actualizar tus datos, fotografía y contraseña.
                    <div className="">
                        Y podras registrar tu emprendimiento haciendo click en el botón de abajo.<br />
                        <button className="btn btn-primary" onClick={(e) => {e.preventDefault(); navigate("/admin/registrar-emprendimiento");}} >Registrar Emprendimiento</button>
                    </div>
                </div>
            </div>
            <div className="accordion accordion-flush" id="#acordionProfile">
                <div className="accordion-item">
                    <h2 className="accordion-header" id="updateProfile">
                        <button className="accordion-button collapsed" type="button" 
                        data-bs-toggle="collapse" data-bs-target="#flush-collapse1" 
                        aria-expanded="false" aria-controls="flush-collapse1">
                            <h6 className="align-items-center m-2 me-2">Editar Perfil</h6>
                        </button>
                    </h2>
                    <div id="flush-collapse1" className="accordion-collapse collapse" 
                    aria-labelledby="updateProfile" data-bs-parent="#acordionProfile">
                        <div className="accordion-body">
                            <UserUpdate />
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-row justify-contet-evenly">
                    <div className="accordion-item w-50">
                        <h2 className="accordion-header" id="changePassword">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse2" 
                            aria-expanded="false" aria-controls="flush-collapse2">
                                <h6 className="align-items-center">Cambiar Contraseña</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse2" className="accordion-collapse collapse" 
                        aria-labelledby="changePassword" data-bs-parent="#acordionProfile">
                            <div className="accordion-body">
                                <PasswordChange />
                            </div>
                        </div>
                    </div>
                    <div className="accordion-item  w-50 ">
                        <h2 className="accordion-header" id="deleteAccount">
                            <button className="accordion-button collapsed" type="button" 
                            data-bs-toggle="collapse" data-bs-target="#flush-collapse3" 
                            aria-expanded="false" aria-controls="flush-collapse3">
                                <h6 className="align-items-center">Eliminar Cuenta</h6>
                            </button>
                        </h2>
                        <div id="flush-collapse3" className="accordion-collapse collapse" 
                        aria-labelledby="deleteAccount" data-bs-parent="#acordionProfile">
                            <div className="accordion-body">
                                <UserDelete />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AdminView;