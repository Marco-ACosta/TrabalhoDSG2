"use client";

import { createContext, useContext } from "react";
import { User } from "../services/firebase/";

interface AuthContextType {
    userAuth: User | null;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const useAuthContext = () => useContext(AuthContext);