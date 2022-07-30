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
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error("No hay contexto de autenticación");
    return context;
};
export function AuthProvider({ children }) {
    const dbUrl= 'https://colombia-emprende.herokuapp.com/';
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [userEmprendimiento, setUserEmprendimiento] = useState(null);
    const signup = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };
    const emailAuth = (email, password) => {
        return EmailAuthProvider.credential(email, password);
    };
    const updateName = async (displayName) => {
        await updateProfile(auth.currentUser, {displayName}).then(() => {
            return setUser(auth.currentUser);
        });
    };
    const updatePhotoURL = (photoURL) => {
        updateProfile(auth.currentUser, {photoURL}).then(() => {
            setUser(auth.currentUser);
            return;
        });
    };
    const uploadPhoto = (email, file, photoName) => {
        return uploadBytes(ref(storage, `${email}/${photoName}`), file)
    };
    const getPhotoURL = async (email,photoLocation) => {
        return await getDownloadURL(ref(storage, `${email}/${photoLocation}`));
    };
    const deletePhoto = async (email,photoLocation) => {
        return await deleteObject(ref(storage, `${email}/${photoLocation}`));
    };
    const passwordUpdate = (password) => {
        updatePassword(auth.currentUser, password).then(() => {
            setUser(auth.currentUser);
            return;
        });
    };
    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    };
    const loginWithGoogle = () => {
        const googleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, googleProvider)
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
    const logout = () => signOut(auth);
    const resetPassword = async (email) => sendPasswordResetEmail(auth, email);
    const emailVerification = () => sendEmailVerification(auth.currentUser);
    const emailReVerification = (email) => sendEmailVerification(email);
    const delUser = async () => await deleteUser(auth.currentUser);
    const reAuthenticate = (credential) => {
        return reauthenticateWithCredential(auth.currentUser, credential)
    };
    const createUser = async (user) => {
        await axios.post(`${dbUrl}users/create-user`, user)
        .catch(error => {})
    }

    const updateUser = async (data) => {
        if (!token){
            let config = localStorage.getItem('token')
            setToken(config) 
        }
        await axios.put(`${dbUrl}users/update-user`, data, token)
        .then(res => {
            if (res)
            setUserData(data);
        })
        .catch(error => {})
        return;
    };
    const deleteUserDoc = async (id) => {
        if (!token){
            let config = localStorage.getItem('token')
            setToken(config) 
        }
        await axios.delete(`${dbUrl}users/delete-user`, id, token);
        return;
    }
    const createStore = async (emprendimiento) => {
        let id = {};
        if (!token){
            let config = localStorage.getItem('token')
            setToken(config) 
        }
        await axios.post(`${dbUrl}create-store`, emprendimiento, token)
        .then(res => {id={Emprendimiento_id:res.data._id}; setUserEmprendimiento(res.data)})
        updateUser(id);
        return;
    }
    useEffect(() => {
        const getUserData = async (user) => {
            await axios.get(`${dbUrl}users/get-user/${user.uid}`)
            .then((response) => {
                if (response.data.data.length > 0) {
                    setUserData(response.data.data[0]);
                    let config = {
                        headers: {
                            token: `Bearer ${response.data.token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                    localStorage.setItem("token", config);
                    setToken(config);
                } else {
                    const userData = {
                        Uid: user.uid,
                        Email: user.email,
                        Nombre: user.displayName,
                        Emprendimiento_id: "",
                        Celular: "",
                        Ciudad: "",
                        Direccion: "",
                    }
                    createUser(userData);
                    getUserData(user);
                }
                return
            })
            .catch((error) => {
                console.log(error);
                return
            });
            setLoading(false);
        }
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log(currentUser);
            if (currentUser) {
                getUserData(currentUser);
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
                userData,
                logout,
                loading,
                emailAuth,
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
            }}
        >
            {children}
        </authContext.Provider>
    );
}