import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User } from "@/types";



interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (user: User) => void
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null)


export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const updateUser = (updatedUser: User) => {
        setUser(updatedUser)
        localStorage.setItem('gh_user', JSON.stringify(updatedUser))
    }

    //On app load, check if there's a token in localStorage and validate it
    useEffect(() => {
        const savedToken = localStorage.getItem("authToken");
        const savedUser = localStorage.getItem("authUser");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
        }
        setIsLoading(false);
    }, [])

    const login = (token: string, user: User) => {
        setToken(token);
        setUser(user);
        localStorage.setItem("authToken", token);
        localStorage.setItem("authUser", JSON.stringify(user));
    }

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
    }

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isLoading,
            login,
            logout,
            updateUser,
            isAuthenticated: !!token,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthContext must be used within an AuthProvider");
    }
    return context;
}