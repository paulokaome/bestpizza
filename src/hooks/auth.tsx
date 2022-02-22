import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
  signIn: (email: string, password: string) => Promise<void>;
  isLogging: boolean;
  user: User | null;
  Logout: () => Promise<void>;
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

const USER_COLLECTION = "@bestpizza:users";

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
          .then(async (profile) => {
            const { isAdmin, name } = profile.data() as User;
            if (profile.exists) {
              const userData = {
                name,
                isAdmin,
                id: account.user.uid,
              };
              setUser(userData);
              await AsyncStorage.setItem(
                USER_COLLECTION,
                JSON.stringify(userData)
              );
            }
          });
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

  async function loadStorageData() {
    setIsLogging(true);
    const storageUser = await AsyncStorage.getItem(USER_COLLECTION);
    if (storageUser) {
      const userData = JSON.parse(storageUser) as User;
      setUser(userData);
    }
    setIsLogging(false);
  }

  async function Logout() {
    await auth().signOut();
    await AsyncStorage.removeItem(USER_COLLECTION);
    setUser(null);
  }

  useEffect(() => {
    loadStorageData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, isLogging, Logout }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
