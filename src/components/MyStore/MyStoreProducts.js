import { useAuth } from "../../context/AuthContext";
import { useMyStore } from "../../context/MyStoreContext";
import { useState, useEffect } from "react";
import MyProducts from "./StoreProducts/MyProducts";
import CreateProduct from "./StoreProducts/CreateProduct";
function MyStoreProducts() {
  const { loading, userData } = useAuth();
  const {
    userStore,
    loadingStore,
    userProducts,
    getStoreProducts,
    getMyStore,
    showProducts,
    alertDeleteProduct,
    alertDeleteProdFalse,
  } = useMyStore();
  const [cargando, setCargando] = useState(true);
  useEffect(() => {
    const setStore = async () => {
      if (!userStore && loadingStore && !loading && userData) {
        await getMyStore(userData._id);
      }
    };
    setStore();
  }, [userStore, loading, getMyStore, loadingStore, userData]);
  useEffect(() => {
    const setStoreProducts = async () => {
      if (!userProducts && !loading && userStore && userData) {
        await getStoreProducts();
      }
    };
    setStoreProducts();
  }, [
    userProducts,
    loading,
    getStoreProducts,
    loadingStore,
    userStore,
    userData,
  ]);
  useEffect(() => {
    const setLoading = async () => {
      if (
        userProducts !== null &&
        userStore !== null &&
        !loading &&
        !loadingStore
      ) {
        setCargando(false);
      }
    };
    setLoading();
  }, [userProducts, userStore, loading, loadingStore, getStoreProducts]);
  useEffect(() => {
    const del = () => {
      setTimeout(() => {
        alertDeleteProdFalse();
      }, 5000);
    };
    if (alertDeleteProduct) {
      return () => {
        del();
      };
    }
  }, [alertDeleteProduct, alertDeleteProdFalse]);
  const AlertDelete = () => {
    return (
      <div
        className=" alert alert-danger d-flex flex-row flex-wrap justify-content-center"
        role="alert"
      >
        <i className="fa-solid fa-circle-check fa-2x me-1 text-danger"></i>
        <h5 className=" m-1 sm:inline text-danger align-middle ">
          Producto Eliminado
        </h5>
      </div>
    );
  };
  const Products = () => {
    if (userProducts) {
      if (userProducts.length > 0) {
        return (
          <div className="w-100">
            <div id="" className={`${showProducts}`}>
              <h1 className="text-center admin-titles-cel">Mis Productos</h1>
              <div className="accordion-body">
                <MyProducts products={userProducts} />
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div className="m-3">
            <div className="text-center m-md-4 m-sm-3 m-2">
              {alertDeleteProduct && <AlertDelete />}
              <h3>Tu Emprendimiento <span className="admin-dif-color">{userStore.Nombre}</span> aun no tiene Productos registrados.</h3>
              
            </div>
            <h6 className="text-center m-3">
                Haz click en el boton de abajo para añadir un nuevo producto.
              </h6>
            <CreateProduct />
          </div>
        );
      }
    } else {
      return (
        <div>
          <div className="text-center m-3">
            {alertDeleteProduct && <AlertDelete />}
            <h3>Tu Emprendimiento aun no tiene Productos registrados.</h3>
            <h6>
              Haz click en el boton de abajo para añadir un nuevo producto.
            </h6>
          </div>
          <CreateProduct />
        </div>
      );
    }
  };
  if (loading || loadingStore || cargando)
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
      <div className="accordion accordion-flush" id="#acordionShop">
        <Products />
      </div>
    </div>
  );
}
export default MyStoreProducts;
