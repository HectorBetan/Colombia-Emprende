import React from "react";
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
    const userUrl= 'http://localhost:4000/users/';
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
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
        await getRedirectResult(auth).then((result) => {
            console.log(result.credential);
            console.log(result.user);
        });
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
        await axios.post(`${userUrl}create-user`, user);
    }
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, [user]);
    return (
        <authContext.Provider
            value={{
                signup,
                login,
                user,
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
            }}
        >
            {children}
        </authContext.Provider>
    );
}