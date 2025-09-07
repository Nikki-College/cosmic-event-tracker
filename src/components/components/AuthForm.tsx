"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return setMsg(error.message);
    setMsg("Signup successful! Check your email for confirmation.");
    router.push("/dashboard"); // redirect after signup
  }

  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-col gap-3 max-w-sm mx-auto mt-10"
    >
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Sign Up
      </button>
      {msg && <p className="text-sm text-gray-600">{msg}</p>}
    </form>
  );
}
