"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Login successful!");
      router.push("/"); // ✅ redirect to home (events) after login
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleLogin}
        className="flex flex-col gap-3 max-w-sm w-full p-6 border rounded shadow"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white p-2 rounded disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {msg && <p className="text-sm text-center text-gray-600">{msg}</p>}

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <a href="/signup" className="text-blue-500 underline">
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
