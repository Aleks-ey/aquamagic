import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function SignIn() {
  const [form, setForm] = useState({ email: "", password: "" });
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword(form);
    if (error) return alert(error.message);
    router.push("/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-24 p-6 border rounded"
    >
      <h2 className="text-xl mb-4">Sign In</h2>
      <input
        className="block w-full mb-3 border p-2"
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        className="block w-full mb-3 border p-2"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Sign In
      </button>
      {/* Forgot Password? */}
      <div className="text-center mt-4">
        <a href="/auth/forgot-password" className="text-blue-600">
          Forgot Password?
        </a>
      </div>
      {/* No account? Sign up */}
      <div className="text-center mt-4">
        <a href="/auth/signup" className="text-blue-600">
          No account? Sign up
        </a>
      </div>
    </form>
  );
}
