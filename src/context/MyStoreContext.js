import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
const myStoreContext = createContext();
export const useMyStore = () => {
  const context = useContext(myStoreContext);
  if (!context) throw new Error("No hay contexto de myShop");
  return context;
};
export function MyStoreProvider({ children }) {
  const { token, userData, createStoreAuth } = useAuth();
  const navigate = useNavigate();
  let location = useLocation();
  const dbUrl = "https://colombia-emprende-server-production.up.railway.app/";
  const [userStore, setUserStore] = useState(null);
  const [userProducts, setUserProducts] = useState(null);
  const [showProducts, setShowProducts] = useState("");
  const [loadingStore, setLoadingStore] = useState(false);
  const [alertCreateProduct, setAlertCreateProduct] = useState(false);
  const [alertEditProduct, setAlertEditProduct] = useState(false);
  const [alertEditImgProduct, setAlertEditImgProduct] = useState(false);
  const [alertDeleteProduct, setAlertDeleteProduct] = useState(false);
  const [alert1CreateStore, setAlert1CreateStore] = useState(false);
  const alertCreateProdFalse = () => {
    setAlertCreateProduct(false);
  };
  const alert1CreateStoreTrue = () => {
    setAlert1CreateStore(true);
  };
  const alertEditProdFalse = () => {
    setAlertEditProduct(false);
  };
  const alertEditImgProdFalse = () => {
    setAlertEditImgProduct(false);
  };
  const alertDeleteProdFalse = () => {
    setAlertDeleteProduct(false);
  };
  const [alertCreateStore, setAlertCreateStore] = useState(false);
  
  const [alertEditStore, setAlertEditStore] = useState(false);
  const [alertEditImgStore, setAlertEditImgStore] = useState(false);
  const [alertDeleteStore, setAlertDeleteStore] = useState(false);
  const [alert1DeleteStore, setAlert1DeleteStore] = useState(false);
  const alertCreateStoreFalse = () => {
    setAlertCreateStore(false);
  };
  const alertEditStoreFalse = () => {
    setAlertEditStore(false);
  };
  const alertEditImgStoreFalse = () => {
    setAlertEditImgStore(false);
  };
  const alertDeleteStoreFalse = () => {
    setAlertDeleteStore(false);
  };
  const alert1DeleteStoreTrue = () => {
    setAlert1DeleteStore(true);
  };
  const getMyStore = async (data) => {
    let id
    if(data){
      id = { user_id: data };
    }
    if (!data){
      id = { user_id: userData._id };
    }
    await axios
      .post(`${dbUrl}stores/get-store`, id)
      .then((res) => {
        setUserStore(res.data[0]);
        setLoadingStore(false);
      })
      .catch((err) => {
      });
    return;
  };
  const createStore = async (emprendimiento, storeName, photos, path) => {
    setLoadingStore(true)
    let id = {};
    let data = {
      Nombre: storeName,
      Email: emprendimiento.Email,
      Celular: emprendimiento.Celular,
      Telefono: emprendimiento.Telefono,
      Ciudad: emprendimiento.Ciudad,
      Direccion: emprendimiento.Direccion,
      Categoria: emprendimiento.Categoria,
      Imagen: photos,
      Facebook: emprendimiento.Facebook,
      Instagram: emprendimiento.Instagram,
      Web: emprendimiento.Web,
      Descripcion: emprendimiento.Descripcion,
      Calificacion: emprendimiento.Calificacion,
      Path: path,
    };
    await axios.post(`${dbUrl}stores/create-store`, data, token).then((res) => {
      id = { Emprendimiento_id: res.data._id };
      createStoreAuth(id);
      setUserStore(res.data)
      setAlertCreateStore(true);
      setAlert1CreateStore(false);
      setLoadingStore(false);
      navigate("/admin/mi-emprendimiento");
      return;
    });
  };
  const updateStore = async (emprendimiento) => {
    setLoadingStore(true)
    await axios
      .put(`${dbUrl}stores/update-store`, emprendimiento, token)
      .then((res) => {
        const data = res.data
        setUserStore(data);
        setAlertEditStore(true);
        setAlert1CreateStore(false);
        setLoadingStore(false)
      })
      .catch((err) => {

      });
  };
  const updateStoreImage = async (emprendimiento) => {
    setLoadingStore(true)
    await axios
      .put(`${dbUrl}stores/update-store`, emprendimiento, token)
      .then(() => {
        setUserStore(emprendimiento);
        setAlertEditImgStore(true);
        setAlert1CreateStore(false);
        setLoadingStore(false)
      })
      .catch((err) => {
      });
  };
  const deleteStore = async (emprendimiento) => {
    
    setLoadingStore(true);
    setAlertDeleteStore(true);
    await axios
      .put(`${dbUrl}stores/delete-store`, emprendimiento, token)
      .then(() => {
        setUserStore(null);
        setUserProducts(null);
        const id = { Emprendimiento_id: "" };
        createStoreAuth(id);
        setAlert1DeleteStore(false);
        setLoadingStore(false)
      })
      .catch((err) => {
      });
  };
  const createProduct = async (producto) => {
    setLoadingStore(true);
    await axios
      .post(`${dbUrl}products/create-product`, producto, token)
      .then(() => {
        getStoreProducts();
        setShowProducts("show");
        setAlertCreateProduct(true);
        setLoadingStore(false)
        if (location.pathname !== "/admin/mi-emprendimiento/productos"){
          navigate("/admin/mi-emprendimiento/productos")
        }
      });
    return;
  };
  const updateProduct = async (producto) => {
    setLoadingStore(true);
    await axios
      .put(`${dbUrl}products/update-product/${producto._id}`, producto, token)
      .then(() => {
        getStoreProducts();
        setShowProducts("show");
        setLoadingStore(false)
        setAlertEditProduct(true);
      });
    return;
  };
  const updateProductImage = async (producto) => {
    setLoadingStore(true);
    await axios
      .put(`${dbUrl}products/update-product/${producto._id}`, producto, token)
      .then(() => {
        getStoreProducts();
        setShowProducts("show");
        setLoadingStore(false)
        setAlertEditImgProduct(true);
      });
    return;
  };
  const getStoreProducts = async () => {
    setLoadingStore(true);
    const id = { id: userData._id };
    await axios
      .post(`${dbUrl}products/get-store-products`, id)
      .then((res) => {
        setUserProducts(res.data);
        setLoadingStore(false);
      })
      .catch((err) => {
        setLoadingStore(false);
      });
    return;
  };
  const deleteProduct = async (id) => {
    setLoadingStore(true);
    const data = {
      User_id: userData._id,
    };
    await axios.put(`${dbUrl}products/delete-product/${id}`, data, token);
    setShowProducts("show");
    getStoreProducts();
    setLoadingStore(false)
    setAlertDeleteProduct(true);
    return;
  };
  const readStorePricing = async (id) => {
    const response = await axios.get(`${dbUrl}pricing/get-store-pricing/${id}`);
    return response;
  };
  return (
    <myStoreContext.Provider
      value={{
        userStore,
        loadingStore,
        getMyStore,
        updateStore,
        deleteStore,
        createStore,
        createProduct,
        getStoreProducts,
        userProducts,
        updateProduct,
        deleteProduct,
        showProducts,
        readStorePricing,
        alertCreateProdFalse,
        alertEditProdFalse,
        alertDeleteProdFalse,
        alertCreateProduct,
        alertEditProduct,
        alertDeleteProduct,
        alertCreateStoreFalse,
        alertEditStoreFalse,
        alertDeleteStoreFalse,
        alertCreateStore,
        alertEditStore,
        alertDeleteStore,
        alertEditImgStore,
        alertEditImgStoreFalse,
        updateStoreImage,
        updateProductImage,
        alertEditImgProduct,
        alertEditImgProdFalse,
        alert1CreateStoreTrue,
        alert1CreateStore,
        alert1DeleteStoreTrue,
        alert1DeleteStore,
      }}
    >
      {children}
    </myStoreContext.Provider>
  );
}