import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
const storeContext = createContext();

export const useStore = () => {
    const context = useContext(storeContext);
    if (!context) throw new Error("No hay contexto de autenticación");
    return context;
};
export function StoreProvider({ children }) {
    const dbUrl= 'https://colombia-emprende.herokuapp.com/';
    const { updateUser } = useAuth();
    const token = localStorage.getItem("token");
    const [emprendimientos, setEmprendimientos] = useState(null);
    const [userEmprendimiento, setUserEmprendimiento] = useState(null);
    const [loadingStore, setLoadingStore] = useState(true);
    const createStore = async (emprendimiento) => {
        let id = {};
        let config = {
            headers: {
                token: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        };
        await axios.post(`${dbUrl}create-store`, emprendimiento, config)
        .then(res => {id={Emprendimiento_id:res.data._id}; setUserEmprendimiento(res.data)})
        updateUser(id);
        return;
      }
    return (
        <storeContext.Provider
            value={{
                userEmprendimiento,
                createStore,
            }} 
        >
            {children}
        </storeContext.Provider>
    );
}