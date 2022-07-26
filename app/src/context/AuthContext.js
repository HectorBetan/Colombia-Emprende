import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { storage, auth } from "../firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    reauthenticateWithCredential,
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    sendPasswordResetEmail,
    updateProfile,
    sendEmailVerification,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithPopup,
    deleteUser,
} from "firebase/auth";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import axios from "axios";
const authContext = createContext();

export const useAuth = () => {
    const context = useContext(authContext);
    if (!context) throw new Error("No hay contexto de autenticación");
    return context;
};
export function AuthProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
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
            setUser(auth.currentUser);
        });
        return;
    };
    const updatePhotoURL = (photoURL) => {
        setLoading(true);
        updateProfile(auth.currentUser, {photoURL}).then(() => {
            setUser(auth.currentUser);
            setLoading(false);
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
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            console.log(currentUser);
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
            }}
        >
            {children}
        </authContext.Provider>
    );
}