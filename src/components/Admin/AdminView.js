import { useAuth } from "../../context/AuthContext";
import UserUpdate from "./UserUpdate";
import PasswordChange from "./PasswordChange";
import UserDelete from "./UserDelete";
import { useNavigate } from "react-router-dom";
function AdminView() {
  const navigate = useNavigate();
  const { user, loading, userData } = useAuth();
  const RegisterStore = () => {
    if (userData) {
      if (!userData.Emprendimiento_id){
        return (
          <div className="">
            <div className="text-center fs-6 fw-light mt-2 panel-admin-view-peq">
              Haciendo click en el botón de abajo puedes Resgistrar un Emprendimiento.
              </div>
            
            <br />
            <button
              className="btn btn-primary m-3"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/registrar-emprendimiento");
              }}
            >
              Registrar Emprendimiento
            </button>
          </div>
        );
      }
      if (userData.Emprendimiento_id){
        return (
          <div className="">
            <button
              className="btn btn-primary m-3"
              onClick={(e) => {
                e.preventDefault();
                navigate("/admin/mi-emprendimiento");
              }}
            >
              Ir a Mi Emprendimiento
            </button>
          </div>
        );
      }
    }
  };
  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div
          className="spinner-border"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        >
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  return (
    <div className="d-block">
      <div className="accordion accordion-flush" id="#acordionProfile">
        <div className="accordion-item">
          <h2 className="accordion-header" id="myProfile">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse0"
              aria-expanded="false"
              aria-controls="flush-collapse0"
            >
              <h4 className="align-items-center m-2 me-2">Mi Perfil</h4>
            </button>
          </h2>
          <div
            id="flush-collapse0"
            className="accordion-collapse collapse show"
            aria-labelledby="myProfile"
            data-bs-parent="#acordionProfile"
          >
            <div className="accordion-body">
              <div className="flex-column text-center w-100">
                <h4 className="m-2">Hola <span className="admin-dif-color">{user.displayName}</span></h4>
                <h5 className="m-3  panel-admin-view">Bienvenido al panel de administración de cuenta en <span className="admin-dif-color">Colombia Emprende</span></h5>
                <div className="fw-light text-center mb-1 panel-admin-view-peq">Desde aqui puedes manejar todas las funciones relacionadas a tu usuario y administrar tus datos.</div>
                <div className="fw-light text-center mb-1 panel-admin-view-peq">Tambien tienes tu carrito de mercado y puedes acceder a las cotizaciones y pedidos y que hayas realizado a alguna tienda.</div>
                <RegisterStore />
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header" id="updateProfile">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapse1"
              aria-expanded="false"
              aria-controls="flush-collapse1"
            >
              <h4 className="align-items-center m-2 me-2">Editar Perfil</h4>
            </button>
          </h2>
          <div
            id="flush-collapse1"
            className="accordion-collapse collapse"
            aria-labelledby="updateProfile"
            data-bs-parent="#acordionProfile"
          >
            <div className="accordion-body">
              <UserUpdate />
            </div>
          </div>
        </div>
        <div className="d-block d-xl-flex d-xxl-flex  flex-row justify-contet-evenly">
          <div className="accordion-item w-100">
            <h2 className="accordion-header" id="changePassword">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapse2"
                aria-expanded="false"
                aria-controls="flush-collapse2"
              >
                <h4 className="align-items-center m-2 me-2">
                  Cambiar Contraseña
                </h4>
              </button>
            </h2>
            <div
              id="flush-collapse2"
              className="accordion-collapse collapse"
              aria-labelledby="changePassword"
              data-bs-parent="#acordionProfile"
            >
              <div className="accordion-body">
                <PasswordChange />
              </div>
            </div>
          </div>
          <div className="accordion-item w-100 boton-delete-cuenta">
            <h2 className="accordion-header" id="deleteAccount">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapse3"
                aria-expanded="false"
                aria-controls="flush-collapse3"
              >
                <h4 className="align-items-center m-2 me-2 ">
                  Eliminar Cuenta
                </h4>
              </button>
            </h2>
            <div
              id="flush-collapse3"
              className="accordion-collapse collapse"
              aria-labelledby="deleteAccount"
              data-bs-parent="#acordionProfile"
            >
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
