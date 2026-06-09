import { useEffect, useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function ResetPassword() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [allowReset, setAllowReset] = useState(false);

  // Supabase automatically provides a reset session via URL params
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data?.session) {
        setAllowReset(true);
      }
    }
    checkSession();
  }, []);

  async function handleSubmit(e) {
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

    alert("Password updated successfully!");
    router.push("/auth/signin");
  }

  if (!allowReset) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        <p>Verifying reset link…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow p-8 rounded max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Reset Your Password</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            className="border p-2 w-full mb-4 rounded"
            placeholder="New password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            className="border p-2 w-full mb-4 rounded"
            placeholder="Confirm new password"
            onChange={(e) => setConfirm(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
