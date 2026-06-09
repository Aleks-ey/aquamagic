import { useState } from "react";
import { supabase } from "../../utils/supabaseClient";
import { useRouter } from "next/router";

export default function SignUp() {
  const [form, setForm] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "user",
  });

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();

    // Validate passwords match
    if (form.password !== form.confirm_password) {
      alert("Passwords do not match");
      return;
    }

    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          first_name: form.first_name,
          middle_name: form.middle_name,
          last_name: form.last_name,
        },
      },
    });

    if (error) return alert(error.message);

    const user = data.user;
    if (!user) return alert("Signup succeeded but no user returned.");

    // 2. Insert into profiles table
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      first_name: form.first_name,
      middle_name: form.middle_name,
      last_name: form.last_name,
      email: form.email,
    });

    if (profileError) {
      console.error(profileError);
      alert("User created, but profile insertion failed.");
    }

    // 3. Redirect to dashboard
    router.push("/dashboard");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-24 p-6 border rounded"
    >
      <h2 className="text-xl mb-4">Create Account</h2>
      <input
        className="border p-2 w-full mb-4"
        placeholder="First Name"
        onChange={(e) => setForm({ ...form, first_name: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Middle Name (optional)"
        onChange={(e) => setForm({ ...form, middle_name: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Last Name"
        onChange={(e) => setForm({ ...form, last_name: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-4"
        type="email"
        placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-4"
        type="password"
        placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <input
        className={`border p-2 w-full mb-4 ${
          form.confirm_password && form.confirm_password !== form.password
            ? "border-red-500"
            : ""
        }`}
        type="password"
        placeholder="Confirm Password"
        onChange={(e) => setForm({ ...form, confirm_password: e.target.value })}
      />
      {form.confirm_password && form.confirm_password !== form.password && (
        <p className="text-red-500 mb-4">Passwords do not match</p>
      )}

      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Sign Up
      </button>
    </form>
  );
}
