import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow p-8 rounded max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>

        {!sent ? (
          <>
            <p className="mb-4 text-gray-700">
              Enter your email and we’ll send you a password reset link.
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="email"
                className="border p-2 w-full mb-4 rounded"
                placeholder="Email address"
                required
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                type="submit"
                className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700"
              >
                Send Reset Email
              </button>
            </form>
          </>
        ) : (
          <p className="text-green-600">
            If that email exists in our system, a reset link has been sent.
          </p>
        )}
      </div>
    </div>
  );
}
