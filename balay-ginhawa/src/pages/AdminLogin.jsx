import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Popup from "@/components/Popup";

export default function AdminLogin() {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const [showSignup, setShowSignup] = useState(false);

  // Signup form state
  const [signupId, setSignupId] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupError, setSignupError] = useState("");

  useEffect(() => {
    if (admin) {
      navigate("/frontdesk/bookings", { replace: true });
    }
  }, [admin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const q = query(
        collection(db, "admins"),
        where("adminId", "==", adminId.trim()),
        where("password", "==", password.trim())
      );

      const snap = await getDocs(q);
      if (snap.empty) {
        setError("Invalid Admin ID or password");
        return;
      }

      const doc = snap.docs[0];
      const adminData = { id: doc.id, ...doc.data() };

      // Record timeIn
      await updateDoc(doc.ref, { timeIn: serverTimestamp(), timeOut: null });

      login(adminData);
      navigate("/frontdesk", { replace: true });
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please check console for details.");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");

    if (!signupId.trim() || !signupName.trim() || !signupPassword.trim()) {
      setSignupError("Please fill all fields");
      return;
    }
    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match");
      return;
    }

    try {
      const q = query(collection(db, "admins"), where("adminId", "==", signupId.trim()));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setSignupError("Admin ID already exists");
        return;
      }

      const docRef = await addDoc(collection(db, "admins"), {
        adminId: signupId.trim(),
        name: signupName.trim(),
        password: signupPassword.trim(),
        createdAt: serverTimestamp(),
        timeIn: serverTimestamp(),
        timeOut: null,
      });

      const adminData = { id: docRef.id, adminId: signupId.trim(), name: signupName.trim() };
      login(adminData);

      setShowSignup(false);
      navigate("/frontdesk", { replace: true });
    } catch (err) {
      console.error("Signup failed:", err);
      setSignupError(`Signup failed: ${err.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 shadow-md rounded-md w-96">
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

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Login
        </button>

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => setShowSignup(true)}
            className="text-sm text-gray-600 underline"
          >
            Create admin account
          </button>
        </div>

        <Popup isOpen={showSignup} onClose={() => setShowSignup(false)}>
          <h2 className="text-2xl font-bold mb-4">Create Admin Account</h2>
          {signupError && <p className="text-red-500 mb-2">{signupError}</p>}

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Admin ID"
              value={signupId}
              onChange={(e) => setSignupId(e.target.value)}
              className="border w-full p-2"
            />
            <input
              type="text"
              placeholder="Full Name"
              value={signupName}
              onChange={(e) => setSignupName(e.target.value)}
              className="border w-full p-2"
            />
            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="border w-full p-2"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={signupConfirm}
              onChange={(e) => setSignupConfirm(e.target.value)}
              className="border w-full p-2"
            />

            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSignup}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </Popup>
      </form>
    </div>
  );
}
