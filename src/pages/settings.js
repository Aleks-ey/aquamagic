import { useAuth } from "@/utils/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/utils/supabaseClient";

export default function Settings() {
  const { user } = useAuth();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) router.push("/auth/signin");
  }, [user]);

  async function handlePasswordChange(e) {
    e.preventDefault();

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setPassword("");
    setConfirm("");
    setSuccess(true);
  }

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto mt-32 p-6 border rounded">
      <h1 className="text-2xl mb-6">Settings</h1>

      <h2 className="text-lg font-semibold mb-2">Change Password</h2>

      <form onSubmit={handlePasswordChange}>
        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-4"
          placeholder="Confirm new password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Update Password
        </button>

        {success && (
          <p className="text-green-600 text-sm mt-3">
            Password updated successfully.
          </p>
        )}
      </form>
    </div>
  );
}
