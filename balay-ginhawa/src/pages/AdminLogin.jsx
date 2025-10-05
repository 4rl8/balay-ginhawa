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

  // ✅ Auto-redirect if already logged in
  useEffect(() => {
    if (admin) {
      navigate("/frontdesk/bookings", { replace: true });
    }
  }, [admin, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Hash entered password to compare with stored hashed password
      const hashPassword = async (pw) => {
        if (!pw) return "";
        const enc = new TextEncoder();
        const data = enc.encode(pw);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      };

      const hashedLoginPw = await hashPassword(password);

      const q = query(
        collection(db, "admins"),
        where("adminId", "==", adminId),
        where("password", "==", hashedLoginPw)
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
        // Fallback for existing accounts that still have plaintext passwords in DB.
        // Try querying with the plaintext password; if found, re-hash and update the doc.
        const qPlain = query(
          collection(db, "admins"),
          where("adminId", "==", adminId),
          where("password", "==", password)
        );

        const snapPlain = await getDocs(qPlain);
        if (!snapPlain.empty) {
          const docPlain = snapPlain.docs[0];

          // Re-hash the plaintext password and update the stored password to the hash
          const hashPassword = async (pw) => {
            if (!pw) return "";
            const enc = new TextEncoder();
            const data = enc.encode(pw);
            const hashBuffer = await crypto.subtle.digest("SHA-256", data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
          };

          const hashedLoginPw = await hashPassword(password);
          try {
            await updateDoc(docPlain.ref, { password: hashedLoginPw });
          } catch (updErr) {
            console.error("Failed to migrate plaintext password:", updErr);
          }

          const adminData = { id: docPlain.id, ...docPlain.data(), password: hashedLoginPw };

          // Save admin to context and update timeIn
          login(adminData);
          await updateDoc(docPlain.ref, { timeIn: serverTimestamp(), timeOut: null });
          navigate("/frontdesk", { replace: true });
          return;
        }

        setError("Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Login failed");
    }
  };

  // Create a new admin account in Firestore and immediately log them in
  const handleSignup = async (e) => {
    e?.preventDefault();
    setSignupError("");

    if (!signupId.trim() || !signupPassword.trim() || !signupName.trim()) {
      setSignupError("Please fill all fields");
      return;
    }

    if (signupPassword !== signupConfirm) {
      setSignupError("Passwords do not match");
      return;
    }

    try {
      // Hash password client-side before storing
      const hashPassword = async (pw) => {
        if (!pw) return "";
        const enc = new TextEncoder();
        const data = enc.encode(pw);
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
      };

      const hashed = await hashPassword(signupPassword);
      // Check for existing adminId
      const q = query(
        collection(db, "admins"),
        where("adminId", "==", signupId.trim())
      );
      const snap = await getDocs(q);
      if (!snap.empty) {
        setSignupError("Admin ID already exists");
        return;
      }

      // Create new admin doc (store hashed password and name)
      console.log("Creating admin with:", { adminId: signupId.trim(), name: signupName.trim() });
      const docRef = await addDoc(collection(db, "admins"), {
        adminId: signupId.trim(),
        name: signupName.trim(),
        password: hashed,
        createdAt: serverTimestamp(),
        timeIn: serverTimestamp(),
        timeOut: null,
      });

      console.log("Created admin doc id:", docRef.id);
      const adminData = {
        id: docRef.id,
        adminId: signupId.trim(),
        name: signupName.trim(),
      };

      // Save to context and redirect to front desk
      login(adminData);

      // Close popup and reset signup state
      setShowSignup(false);
      setSignupId("");
      setSignupName("");
      setSignupPassword("");
      setSignupConfirm("");

      // Show success message briefly then redirect
      setSignupError(`Account created (id: ${docRef.id})`);
      setTimeout(() => navigate("/frontdesk", { replace: true }), 700);
    } catch (err) {
      console.error("Signup failed:", err);
      setSignupError(`Signup failed: ${err?.message || err}`);
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

        <div className="text-center mt-3">
          <button
            type="button"
            onClick={() => setShowSignup(true)}
            className="text-sm text-gray-600 underline"
          >
            Create admin account
          </button>
        </div>

        {/* Signup popup */}
        <Popup isOpen={showSignup} onClose={() => setShowSignup(false)}>
          <h2 className="text-2xl font-bold mb-4">Create Admin Account</h2>
          {signupError && <p className="text-red-500 mb-2">{signupError}</p>}
          <div className="space-y-2" role="form" aria-label="Create Admin Account">
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
              <button type="button" onClick={handleSignup} className="px-4 py-2 bg-green-600 text-white rounded">
                Create
              </button>
            </div>
          </div>
        </Popup>
      </form>
    </div>
  );
}
