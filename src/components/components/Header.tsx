"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-gray-950 text-white">
      <span className="font-semibold">Cosmic Event Tracker</span>
      <nav className="flex items-center gap-6">
        <Link href="/">Home</Link>
        {user && <Link href="/compare">Compare</Link>}
        {user ? (
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
