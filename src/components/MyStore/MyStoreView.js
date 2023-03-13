import { useAuth } from "../../context/AuthContext";
import StoreDelete from "./StoreDelete";
import StoreImgUpdate from "./StoreImgUpdate";
import StoreInfoUpdate from "./StoreInfoUpdate";
import { useMyStore } from "../../context/MyStoreContext";
import CreateProduct from "./StoreProducts/CreateProduct";
import { useEffect } from "react";
function MyStoreView() {
  const {
    userStore,
    alertEditStoreFalse,
    alertEditStore,
    alertEditImgStoreFalse,
    alertEditImgStore,
    loadingStore,
    userProducts,
  } = useMyStore();
  const { user, loading } = useAuth();
  useEffect(() => {
    const edit = () => {
      setTimeout(() => {
        alertEditStoreFalse();
      }, 5000);
    };
    if (alertEditStore) {
      return () => {
        edit();
      };
    }
  }, [alertEditStore, alertEditStoreFalse]);
  useEffect(() => {
    const edit = () => {
      setTimeout(() => {
        alertEditImgStoreFalse();
      }, 5000);
    };
    if (alertEditImgStore) {
      return () => {
        edit();
      };
    }
  }, [alertEditImgStore, alertEditImgStoreFalse]);
  const AlertEdit = () => {
    return (
      <div
        className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
        <h5 className=" m-1 sm:inline text-success align-middle ">
          Informacion de la tienda editada con exito.
        </h5>
      </div>
    );
  };
  const AlertEditImg = () => {
    return (
      <div
        className=" alert alert-success d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-success"></i>
        <h5 className=" m-1 sm:inline text-success align-middle ">
          Imagenes de la tienda actualizadas con exito.
        </h5>
      </div>
    );
  };
  if (loading || !userStore || loadingStore )
    return (
      <div className="d-flex justify-content-center mt-5 mb-5">
        <div className="spinner-border" style={{ width: "3rem", height: "3rem" }} role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );

  return (
    <div className="d-block">
      {alertEditStore && <AlertEdit />}
      {alertEditImgStore && <AlertEditImg />}
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
              <h4 className="align-items-center m-2 me-2">Mi Emprendimiento</h4>
            </button>
          </h2>
          <div
            id="flush-collapse0"
            className="accordion-collapse collapse show"
            aria-labelledby="myProfile"
            data-bs-parent="#acordionProfile"
          >
            <div className="accordion-body">
              <div className="flex-column text-center">
                <h4 className="m-2">Hola <span className="admin-dif-color">{user.displayName}</span></h4>
                {userStore && (
                  <h5 className="m-3 panel-admin-view">Bienvenido al panel de administración de tu emprendimiento <span className="admin-dif-color">{userStore.Nombre}</span></h5>
                )}
              </div>
              <div className="fw-light text-center mb-1 panel-admin-view-peq">Desde aqui puedes manejar todas las funciones relacionadas a tu emprendimiento y administrar sus datos.
              <br /> Tambien puedes administrar los productos, cotizaciones y pedidos de tu emprendimiento.</div>
              {(!userProducts || userProducts.length === 0) && <div className="text-center fs-6 fw-light mt-2 panel-admin-view-peq">
              Haciendo click en el botón de abajo puedes agregar productos a tu emprendimiento.
              </div>}
            </div>

            {userStore && <div className="mb-4"><CreateProduct /></div> }
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
              <h4 className="align-items-center m-2 me-2">
                Editar Emprendimiento
              </h4>
            </button>
          </h2>
          <div
            id="flush-collapse1"
            className="accordion-collapse collapse"
            aria-labelledby="updateProfile"
            data-bs-parent="#acordionProfile"
          >
            <div className="accordion-body">
              <StoreInfoUpdate />
            </div>
          </div>
        </div>
        <div className="">
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
                <h4 className="align-items-center m-2 me-2">Editar Imagenes</h4>
              </button>
            </h2>
            <div
              id="flush-collapse2"
              className="accordion-collapse collapse"
              aria-labelledby="changePassword"
              data-bs-parent="#acordionProfile"
            >
              <div className="accordion-body img-update-home">
                <StoreImgUpdate />
              </div>
            </div>
          </div>
          <div className="accordion-item  w-100  boton-delete-store">
            <h2 className="accordion-header" id="deleteAccount">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#flush-collapse3"
                aria-expanded="false"
                aria-controls="flush-collapse3"
              >
                <h4 className="align-items-center m-2 me-2">Eliminar Emprendimiento</h4>
              </button>
            </h2>
            <div
              id="flush-collapse3"
              className="accordion-collapse collapse"
              aria-labelledby="deleteAccount"
              data-bs-parent="#acordionProfile"
            >
              <div className="accordion-body ac-delete">
                <StoreDelete />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default MyStoreView;