import { createContext, useContext, useState, useEffect } from "react";
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
    const dbUrl= 'https://colombia-emprende.herokuapp.com/';
    const [userStore, setUserStore] = useState(null);
    const [userProducts, setUserProducts] = useState(null);
    const [showProducts, setShowProducts] = useState("");
    const [loadingStore, setLoadingStore] = useState(true);
    const getMyStore = async () => {
        const id = {id:"userStore"}
        await axios.post(`${dbUrl}stores/get-store`, id, token)
        .then(res => {setUserStore(res.data[0]); setLoadingStore(false)})
        .catch(err => {console.log(err)})
        return;
    }
    const updateStore = async (emprendimiento) => {
        await axios.put(`${dbUrl}stores/update-store`, emprendimiento, token)
        .then(getMyStore())
        .catch(err => {console.log(err)})
    };
    const deleteStore = async () => {
        setLoadingStore(true);
        const id = {id:"userStore"}
        await axios.post(`${dbUrl}stores/delete-store`, id, token)
        .then(()=>{
            setUserStore(null);
            const id = {Emprendimiento_id:""} 
            updateUserStore(id);
        })
        .catch(err => {console.log(err)})
    };
    const createProduct = async (producto) => {
        setLoadingStore(true);
        await axios.post(`${dbUrl}products/create-product`, producto, token)
        .then(() => {getStoreProducts(); setShowProducts("show")})
        return;
    };
    const updateProduct = async (producto) => {
        setLoadingStore(true);
        await axios.post(`${dbUrl}products/update-product/${producto._id}`, producto, token)
        .then(()=>{getStoreProducts(); setShowProducts("show")})
        return;
    };
    const getStoreProducts = async () => {
        setLoadingStore(true);
        const id = {id:userData._id}
        await axios.post(`${dbUrl}products/get-store-products`,id)
        .then(res => {
            setUserProducts(res.data);
            console.log(res.data);
            setLoadingStore(false);
        })
        .catch(err => {
            console.log(err); 
            setLoadingStore(false)
        });
        return;
    };
    const deleteProduct = async (id) => {
        const data = {
            User_id:userData._id,
        }
        await axios.post(`${dbUrl}products/delete-product/${id}`, data, token);
        setShowProducts("show");
        getStoreProducts();
        return;
    };
    const readStorePricing = async (id) => {
        const response = await axios.get(`${dbUrl}pricing/get-store-pricing/${id}`);
        return response;
      }
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
            }} 
        >
            {children}
            
        </myStoreContext.Provider>
    );
}