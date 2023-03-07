import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
const myStoreContext = createContext();
export const useMyStore = () => {
  const context = useContext(myStoreContext);
  if (!context) throw new Error("No hay contexto de myShop");
  return context;
};
export function MyStoreProvider({ children }) {
  const { token, updateUserStore, userData } = useAuth();
  const dbUrl = "https://colombia-emprende-server.onrender.com/";
  const [userStore, setUserStore] = useState(null);
  const [userProducts, setUserProducts] = useState(null);
  const [showProducts, setShowProducts] = useState("");
  const [loadingStore, setLoadingStore] = useState(true);
  const [alertCreateProduct, setAlertCreateProduct] = useState(false);
  const [alertEditProduct, setAlertEditProduct] = useState(false);
  const [alertEditImgProduct, setAlertEditImgProduct] = useState(false);
  const [alertDeleteProduct, setAlertDeleteProduct] = useState(false);
  const alertCreateProdFalse = () => {
    setAlertCreateProduct(false);
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
  const getMyStore = async (data) => {
    const id = { user_id: data };
    await axios
      .post(`${dbUrl}stores/get-store`, id)
      .then((res) => {
        setUserStore(res.data[0]);
        setLoadingStore(false);
      })
      .catch((err) => {
        console.log(err);
      });
    return;
  };
  const updateStore = async (emprendimiento) => {
    await axios
      .put(`${dbUrl}stores/update-store`, emprendimiento, token)
      .then(() => {
        setUserStore(emprendimiento);
        setAlertEditStore(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateStoreImage = async (emprendimiento) => {
    await axios
      .put(`${dbUrl}stores/update-store`, emprendimiento, token)
      .then(() => {
        setUserStore(emprendimiento);
        setAlertEditImgStore(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteStore = async (emprendimiento) => {
    await axios
      .put(`${dbUrl}stores/delete-store`, emprendimiento, token)
      .then(() => {
        setUserStore(null);
        const id = { Emprendimiento_id: "" };
        updateUserStore(id);
      })
      .catch((err) => {
        console.log(err);
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
        console.log(err);
        setLoadingStore(false);
      });
    return;
  };
  const deleteProduct = async (id) => {
    const data = {
      User_id: userData._id,
    };
    await axios.put(`${dbUrl}products/delete-product/${id}`, data, token);
    setShowProducts("show");
    getStoreProducts();
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
      }}
    >
      {children}
    </myStoreContext.Provider>
  );
}