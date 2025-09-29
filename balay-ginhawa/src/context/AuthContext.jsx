import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase-config";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) {
      setAdmin(JSON.parse(stored));
    }
  }, []);

  const login = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem("admin", JSON.stringify(adminData));
  };

  const logout = async () => {
    try {
      if (admin?.id) {
        // 🔹 update timeOut in Firestore
        const ref = doc(db, "admins", admin.id);
        await updateDoc(ref, { timeOut: serverTimestamp() });
      }
    } catch (err) {
      console.error("Error updating timeOut:", err);
    }

    setAdmin(null);
    localStorage.removeItem("admin");
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
