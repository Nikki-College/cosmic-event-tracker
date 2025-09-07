"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function NotFoundPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    setMessage("Page not found");
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-4">404</h1>
      <p className="text-gray-600 mb-4">{message}</p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  );
}
