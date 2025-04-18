import React, { ReactNode } from 'react';
interface User {
    id: string;
    email: string;
    name: string;
    firstName?: string;
    lastName?: string;
    role?: 'user' | 'admin';
}
interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    selectedCounty: string | null;
    login: (email: string, password: string, county?: string | null) => Promise<void>;
    logout: () => void;
}
interface AuthProviderProps {
    children: ReactNode;
}
export declare const AuthProvider: React.FC<AuthProviderProps>;
export declare const useAuth: () => AuthContextType;
export {};
