import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
export const GetMyStore = async () => {
    const { token } = useAuth();
    const dbUrl= 'https://colombia-emprende.herokuapp.com/';
    const [userStore, setUserStore] = useState(null);
    const [loadingStore, setLoadingStore] = useState(true);
    const getStore = async () => {
        let storeToken = {};
        if (!token) {
            storeToken = localStorage.getItem("token");
        } else {
            storeToken = token;
        }
        const id = {id:"userStore"}
        await axios.post(`${dbUrl}stores/get-store`, id, storeToken)
        .then(res => {setUserStore(res.data); setLoadingStore(false)})
        .catch(err => {})
        .finally(() => {setLoadingStore(false);console.log("finally")});
        return;
    }
    if (!userStore) {
        getStore();
    }
    return { userStore, loadingStore };
}