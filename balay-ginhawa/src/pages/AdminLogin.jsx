import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { admin, login } = useAuth();
  const navigate = useNavigate();

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate("/frontdesk/bookings", { replace: true });
    }
  }, [admin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const q = query(
        collection(db, "admins"),
        where("adminId", "==", adminId),
        where("password", "==", password)
      );

      const snap = await getDocs(q);
      if (!snap.empty) {
        const doc = snap.docs[0];
        const adminData = { id: doc.id, ...doc.data() };

        // Save admin to context
        login(adminData);

        // Update timeIn
        await updateDoc(doc.ref, { timeIn: serverTimestamp(), timeOut: null });

        navigate("/frontdesk", { replace: true }); // redirect to dashboard
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 shadow-md rounded-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Admin ID"
          value={adminId}
          onChange={(e) => setAdminId(e.target.value)}
          className="border w-full p-2 mb-3"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border w-full p-2 mb-3"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
}
