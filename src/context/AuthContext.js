import { createContext, useContext, useEffect, useState } from "react";
import { storage, auth } from "../firebase";
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
  const dbUrl = "https://colombia-emprende-server.onrender.com/";
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);
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
  const uploadPhoto = (file, photoName) => {
    return uploadBytes(ref(storage, `${user.uid}/${photoName}`), file);
  };
  const getPhotoURL = async (photoLocation) => {
    return await getDownloadURL(ref(storage, `${user.uid}/${photoLocation}`));
  };
  const deletePhoto = async (photoLocation) => {
    return await deleteObject(ref(storage, `${user.uid}/${photoLocation}`));
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
  const reAuthenticateGoogle = () => {
    const googleProvider = new GoogleAuthProvider();
    return reauthenticateWithPopup(auth.currentUser, googleProvider);
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
  const delUser = async () => await deleteUser(auth.currentUser);
  const reAuthenticate = (credential) => {
    return reauthenticateWithCredential(auth.currentUser, credential);
  };
  const createUser = async (user) => {
    await axios.post(`${dbUrl}users/create-user`, user).catch((error) => {});
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
    await axios.put(`${dbUrl}users/delete-user`, id, token).catch((err) => {
      console.log(err);
    });
  };
  const createStore = async (emprendimiento, storeName, photos, path) => {
    setLoading(true);
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
    if (!token) {
      let config = localStorage.getItem("token");
      setToken(config);
    }
    await axios.post(`${dbUrl}stores/create-store`, data, token).then((res) => {
      id = { Emprendimiento_id: res.data._id };
      setUserData({ ...userData, Emprendimiento_id: res.data._id });
      updateUserStore(id);
      setLoading(false);
      return;
    });
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
            const userData = {
              Uid: user.uid,
              Email: user.email,
              Nombre: user.displayName,
              Emprendimiento_id: "",
              Celular: "",
              Ciudad: "",
              Direccion: "",
            };
            createUser(userData).then((res) => {
              getUserData();
            });
          }
          return;
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          return;
        });
    };
    if (user && !userData) {
      getUserData();
    }
  }, [user, userData]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
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
        createStore,
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
      }}
    >
      {children}
    </authContext.Provider>
  );
}