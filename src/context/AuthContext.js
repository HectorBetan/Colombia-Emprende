import { createContext, useContext, useEffect, useState } from "react";
import { storage, auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  reauthenticateWithCredential,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  sendPasswordResetEmail,
  updateProfile,
  sendEmailVerification,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithPopup,
  deleteUser,
} from "firebase/auth";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from "firebase/storage";
const authContext = createContext();
export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("No hay contexto de autenticación");
  return context;
};
export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const dbUrl = "https://colombia-emprende-server-production.up.railway.app/";
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [alertDeleteUser, setAlertDeleteUser] = useState(false);
  const [alert1DeleteUser, setAlert1DeleteUser] = useState(false);
  const [alertEdit, setAlertEdit] = useState(false)
  const [alertUser, setAlertUser] = useState(false)
  const [alertPassword, setAlertPassword] = useState(false)
  const [alert1CreateUser, setAlert1CreateUser] = useState(false);
  const alertDeleteUserFalse = () => {
    setAlertDeleteUser(false);
  };
  const alertUserFalse = () => {
    setAlertUser(false);
  };
  const alertUserTrue = () => {
    setAlertUser(true);
  };
  const alertPasswordFalse = () => {
    setAlertPassword(false);
  };
  const alertPasswordTrue = () => {
    setAlertPassword(true);
  };
  const alertEditFalse = () => {
    setAlertEdit(false);
  };
  const alertEditTrue = () => {
    setAlertEdit(true);
  };
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const emailAuth = (email, password) => {
    return EmailAuthProvider.credential(email, password);
  };
  const updateName = async (displayName) => {
    await updateProfile(auth.currentUser, { displayName }).then(() => {
      setUser({ ...user, displayName: displayName });
      return;
    });
  };
  const updatePhotoURL = async (photoURL) => {
    await updateProfile(auth.currentUser, { photoURL }).then(() => {
      setUser({ ...user, photoURL: photoURL });
      return;
    });
  };
  const deletePhotoURL = async () => {
    await updateProfile(auth.currentUser, { photoURL:null }).then(() => {
      setUser({ ...user, photoURL: null });
      return;
    });
  };
  const uploadPhoto = (file, photoName) => {
    return uploadBytes(ref(storage, `${user.uid}/${photoName}`), file);
  };
  const getPhotoURL = async (photoLocation) => {
    console.log(photoLocation)
    return await getDownloadURL(ref(storage, `${user.uid}/${photoLocation}`))
    .catch((error)=>{
      console.log(error)
    });
  };
  const deletePhoto = async (photoLocation) => {
    return await deleteObject(ref(storage, `${user.uid}/${photoLocation}`)).catch(error => {});
  };
  const passwordUpdate = (password) => {
    updatePassword(auth.currentUser, password).then(() => {
      setUser(auth.currentUser);
      return;
    });
  };
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const loginWithGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };
  const loginWithGoogleRedirect = async () => {
    const googleProvider = new GoogleAuthProvider();
    await signInWithRedirect(auth, googleProvider);
    await getRedirectResult(auth);
  };
  const reAuthenticateGoogle = async () => {
    const googleProvider = new GoogleAuthProvider();
    await reauthenticateWithPopup(auth.currentUser, googleProvider);
  };
  const getUserData = async () => {
    await axios
      .get(`${dbUrl}users/get-user/${user.uid}`)
      .then((response) => {
        setUserData(response.data.data[0]);
        let config = {
          headers: {
            token: `Bearer ${response.data.token}`,
            "Content-Type": "application/json",
          },
        };
        localStorage.setItem("token", config);
        setToken(config);
        setLoading(false);
        return;
      })
      .catch((error) => {
        setLoading(false);
        return;
      });
  };
  const logout = () => {
    setUserData(null);
    signOut(auth);
  };
  const resetPassword = async (email) => sendPasswordResetEmail(auth, email);
  const emailVerification = () => sendEmailVerification(auth.currentUser);
  const emailReVerification = (email) => sendEmailVerification(email);
  const delUser = async () => {
    setLoading(true);
    await deletePhotoURL();
    await deleteUser(auth.currentUser).then(()=>{
      setUserData(null);
      setAlert1DeleteUser(false)
      setAlertDeleteUser(true);
      setLoading(false);
    }) 
  };
  const reAuthenticate = (credential) => {
    return reauthenticateWithCredential(auth.currentUser, credential);
  };
  const createUser = async (userD) => {
    await axios.post(`${dbUrl}users/create-user`, userD)
    .then(()=>{
      setAlert1CreateUser(false)
      if (user.emailVerified){
        navigate("/admin", {replace:true})
      }
    })
    .catch((error) => {console.log(error)});
  };
  const updateUser = async (data) => {
    if (!token) {
      let config = localStorage.getItem("token");
      setToken(config);
    }
    await axios
      .put(`${dbUrl}users/update-user`, data, token)
      .then((res) => {
        getUserData();
      })
      .catch((error) => {});
    return;
  };
  const updateUserStore = async (data) => {
    if (!token) {
      let config = localStorage.getItem("token");
      setToken(config);
    }
    await axios
      .put(`${dbUrl}users/update-user`, data, token)
      .then(() => {
        setUserData({ ...userData, Emprendimiento_id: data.Emprendimiento_id });
      })
      .catch((error) => {});
    return;
  };
  const deleteUserDoc = async (id) => {
    setLoading(true)
    if (!token) {
      let config = localStorage.getItem("token");
      setToken(config);
    }
    setAlert1DeleteUser(true)
    await axios.delete(`${dbUrl}users/delete-user/${id}`, id, token)
    .catch((err) => {
    });
    await delUser()
    .catch((err) => {
      if (err){
        try {
          loginWithGoogle();
          delUser();
        } catch (error) {
        }
      }
    });
  };
  const createStoreAuth = async (id) => {
    await updateUserStore(id);  
    setUserData(null);
    setLoading(false);
  };
  const findPath = async (path) => {
    return await axios.get(`${dbUrl}stores/find-store-path/${path}`);
  };
  const createCart = async (pedido) => {
    await axios.post(`${dbUrl}cart/create-cart`, pedido);
    return;
  };
  const readCart = async (id) => {
    const response = await axios.get(`${dbUrl}cart/get-cart/${id}`);
    return response;
  };
  const readProducts = async (productos) => {
    const response = await axios.post(
      `${dbUrl}products/get-products`,
      productos
    );
    return response;
  };
  const readStores = async (tiendas) => {
    const response = await axios.post(`${dbUrl}stores/get-stores`, tiendas);
    return response;
  };
  const updateCart = async (id, pedido) => {
    await axios.put(`${dbUrl}cart/update-cart/${id}`, pedido);
    return;
  };
  const deleteCart = async (id) => {
    await axios.delete(`${dbUrl}cart/delete-cart/${id}`);
    return;
  };
  const deleteCarts = async (id) => {
    await axios.post(`${dbUrl}cart/delete-carts`, id);
    return;
  };
  const createPricing = async (cotizacion) => {
    await axios.post(`${dbUrl}pricing/create-pricing`, cotizacion);
    return;
  };
  const createEnvio = async (id, envio) => {
    await axios.put(`${dbUrl}pricing/create-envio/${id}`, envio);
    return;
  };
  const readPricing = async (id) => {
    const response = await axios.get(`${dbUrl}pricing/get-pricing/${id}`);
    return response;
  };
  const readStorePricing = async (id) => {
    const response = await axios.get(`${dbUrl}pricing/get-store-pricing/${id}`);
    return response;
  };
  const readUserInfo = async (usuarios) => {
    const response = await axios.post(`${dbUrl}users/get-user-info`, usuarios);
    return response;
  };
  const updatePricing = async (id, pedido) => {
    await axios.put(`${dbUrl}pricing/update-pricing/${id}`, pedido);
  };
  const deletePricing = async (id) => {
    await axios.delete(`${dbUrl}pricing/delete-pricing/${id}`);
  };
  const createOrder = async (id, pago) => {
    await axios.put(`${dbUrl}pricing/create-order/${id}`, pago);
  };
  const readOrders = async (id) => {
    const response = await axios.get(`${dbUrl}pricing/get-orders/${id}`);
    return response;
  };
  const readStoreOrders = async (id) => {
    const response = await axios.get(`${dbUrl}pricing/get-store-orders/${id}`);
    return response;
  };
  const readStorePays = async (id) => {
    const response = await axios.get(`${dbUrl}pricing/get-store-pays/${id}`);
    return response;
  };
  const readUserPays = async (id) => {
    const response = await axios.get(`${dbUrl}pricing/get-user-pays/${id}`);
    return response;
  };
  const setStars = async (id, calificacion) => {
    await axios.put(`${dbUrl}stores/set-stars/${id}`, calificacion);
  };
  const setUserProblem = async (id, msg) => {
    await axios.put(`${dbUrl}pricing/set-user-problem/${id}`, msg);
  };
  const setStoreProblem = async (id, msg) => {
    await axios.put(`${dbUrl}pricing/set-store-problem/${id}`, msg);
  };
  useEffect(() => {
    const getUserData = async () => {
      await axios
        .get(`${dbUrl}users/get-user/${user.uid}`)
        .then((response) => {
          if (response.data.data.length > 0) {
            setUserData(response.data.data[0]);
            let config = {
              headers: {
                token: `Bearer ${response.data.token}`,
                "Content-Type": "application/json",
              },
            };
            localStorage.setItem("token", config);
            setToken(config);
            setLoading(false);
            return;
          } else {
            setAlert1CreateUser(true)
            const userData = {
              Uid: user.uid,
              Email: user.email,
              Nombre: user.displayName,
              Emprendimiento_id: "",
              Celular: "",
              Ciudad: "",
              Direccion: "",
            };
            window.scroll(0, 0);
            axios.post(`${dbUrl}users/create-user`, userData)
            .then(()=>{
              setAlert1CreateUser(false)
              if (user.emailVerified){
                navigate("/admin")
              }
            })
            .catch((error) => {console.log(error)});
          }

        })
        .catch((error) => {
          setLoading(false);
        });
    };
    if (user && !userData) {
      setLoading(true);
      getUserData();
    }
  }, [user, userData, loading, navigate]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser){
        setLoading(false)
      }
    });
    return () => unsubscribe();
  }, [user]);
  return (
    <authContext.Provider
      value={{
        signup,
        login,
        user,
        token,
        userData,
        logout,
        loading,
        emailAuth,
        createCart,
        passwordUpdate,
        reAuthenticate,
        loginWithGoogle,
        loginWithGoogleRedirect,
        resetPassword,
        uploadPhoto,
        updatePhotoURL,
        updateName,
        getPhotoURL,
        deletePhoto,
        emailVerification,
        delUser,
        reAuthenticateGoogle,
        emailReVerification,
        createUser,
        updateUser,
        deleteUserDoc,
        createStoreAuth,
        findPath,
        updateUserStore,
        readCart,
        readProducts,
        readStores,
        updateCart,
        deleteCart,
        deleteCarts,
        createPricing,
        readPricing,
        readStorePricing,
        readUserInfo,
        updatePricing,
        createOrder,
        readOrders,
        readStoreOrders,
        deletePricing,
        createEnvio,
        setStars,
        setUserProblem,
        setStoreProblem,
        readStorePays,
        readUserPays,
        alertDeleteUser,
        alertDeleteUserFalse,
        alert1DeleteUser,
        alert1CreateUser,
        alertEdit,
        alertEditFalse,
        alertEditTrue,
        alertPassword,
        alertPasswordFalse,
        alertPasswordTrue,
        alertUser,
        alertUserFalse,
        alertUserTrue,
      }}
    >
      {children}
    </authContext.Provider>
  );
}