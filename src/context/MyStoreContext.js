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
    const { token, updateUserStore, loading } = useAuth();
    const dbUrl= 'https://colombia-emprende.herokuapp.com/';
    const [userStore, setUserStore] = useState(null);
    const [userProducts, setUserProducts] = useState(null);
    const [loadingStore, setLoadingStore] = useState(true);
    const getMyStore = async () => {
        const id = {id:"userStore"}
        await axios.post(`${dbUrl}stores/get-store`, id, token)
        .then(res => {setUserStore(res.data[0]); setLoadingStore(false)})
        .catch(err => {console.log(err)})
        .finally(() => {setLoadingStore(false)});
        return;
    }
    const updateStore = async (emprendimiento) => {
        setLoadingStore(true);
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
        .then(getStoreProducts())
        return;
    };
    const getStoreProducts = async () => {
        setLoadingStore(true);
        const id = {id:"userProducts"}
        await axios.post(`${dbUrl}products/get-store-products`,id, token)
        .then(res => {
            setUserProducts(res.data);
            setLoadingStore(false);
        })
        .catch(err => {
            console.log(err); 
            setLoadingStore(false)
        });
        return;
    };
    useEffect(() => {
        const getStore = async () => {
            const id = {id:"userStore"}
            await axios.post(`${dbUrl}stores/get-store`, id, token)
            .then(res => {setUserStore(res.data[0]); setLoadingStore(false)})
            .catch(err => {console.log(err)})
            .finally(() => {getProducts()});
        }
        const getProducts = async () => {
            setLoadingStore(true);
            const id = {id:"userProducts"}
            await axios.post(`${dbUrl}products/get-store-products`,id, token)
            .then(res => {
                setUserProducts(res.data);
            })
            .catch(err => {
                console.log(err); 
            });
        };
        const setStore = async () => {
            if (userStore === null && !loading){
                await getStore();
            }
            if (userProducts !== null && userStore !== null){
                setLoadingStore(false);
            }
        }
        setStore();
    }
    , [ userStore, token, userProducts, loading ]);
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
            }} 
        >
            {children}
            
        </myStoreContext.Provider>
    );
}