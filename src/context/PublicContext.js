import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
//import { useAuth } from "./AuthContext";
const publicContext = createContext();
export const usePublic = () => {
  const context = useContext(publicContext);
  if (!context) throw new Error("No hay contexto de myShop");
  return context;
};
export function PublicProvider({ children }) {
  //const { token, loading, userData } = useAuth();
  const dbUrl = "https://colombia-emprende-server-production.up.railway.app/";
  const [stores, setStores] = useState(null);
  const [products, setProducts] = useState(null);
  const [storesData, setStoresData] = useState(null);
  const [sixStores, setSixStores] = useState(null);
  const [loadingPublic, setLoadingPublic] = useState(true);
  useEffect(() => {
    const getSixStores = async () => {
      await axios
        .get(`${dbUrl}six-stores`)
        .then((res) => {
          setSixStores(res.data);
        })
        .catch((err) => {
        });
    };
    const set5Store = async () => {
      if (sixStores === null) {
        await getSixStores();
      }
    };
    set5Store();
  }, [sixStores]);
  useEffect(() => {
    const getStores = async () => {
      await axios
        .get(`${dbUrl}`)
        .then((res) => {
          setStoresData(res.data);
        })
        .catch((err) => {
        });
    };
    const setStore = async () => {
      if (storesData === null) {
        await getStores();
      }
    };
    setStore();
  }, [stores, storesData]);
  useEffect(() => {
    const getProducts = async () => {
      await axios
        .get(`${dbUrl}products`)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
        });
    };
    const setProductsData = async () => {
      if (products === null) {
        await getProducts();
      }
    };
    setProductsData();
  }, [products]);
  useEffect(() => {
    const resolveStores = () => {
      if (storesData !== null && products !== null && stores === null) {
        let lista = [];
        storesData.map((store) => {
          let storeProducts = products.filter(
            (product) => product.User_id === store.User_id
          );
          let newStore = { store: store, products: storeProducts };
          lista.push(newStore);
          return stores;
        });
        setStores(lista);
        setLoadingPublic(false);
      }
    };
    return resolveStores();
  }, [stores, products, storesData, loadingPublic]);
  return (
    <publicContext.Provider
      value={{
        stores,
        products,
        loadingPublic,
        sixStores,
      }}
    >
      {children}
    </publicContext.Provider>
  );
}