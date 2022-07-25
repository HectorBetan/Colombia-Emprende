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
    export function Provider({ children }) {
        return (
            <authContext.Provider
                value={{

                }}
            >
            {children}
            </authContext.Provider>
        );
    }