import React, { createContext, useContext, ReactNode, useState } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore"
import { Alert } from "react-native";

type AuthContextData = {
  signIn: (email: string, password: string) => Promise<void>;
  isLogging: boolean;
  user: User | null;
};

type AuthProviderProps = {
  children: ReactNode;
};

type User = {
  id: string;
  name: string;
  isAdmin: boolean;
};

export const AuthContext = createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [isLogging, setIsLogging] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  async function signIn(email: string, password: string) {
    if (!email || !password) {
      return Alert.alert("Favor informar email e senha!");
    }
    setIsLogging(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((account) => {
        firestore()
        .collection("users")
        .doc(account.user.uid)
        .get()
        .then(profile => {
          // const { name , isAdmin } = profile.data()
          // setUser()
        })
      })
      .catch((error) => {
        const { code } = error;
        if (code === "auth/user-not-found" || code === "auth/wrong-password") {
          return Alert.alert("Email ou Senha Inválida!");
        } else {
          return Alert.alert("Não foi possível fazer o login");
        }
      })
      .finally(() => setIsLogging(false));
  }

  return (
    <AuthContext.Provider value={{ user, signIn, isLogging }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
