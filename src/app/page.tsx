"use client";
import { useEffect, useState, useCallback } from "react";
import { fmt, addDays } from "@/lib/date";
import EventList from "@/components/components/EventList";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const [start] = useState(new Date());
  const [end, setEnd] = useState(addDays(new Date(), 3));
  const [eventsByDate, setEventsByDate] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRange = useCallback(async (s: Date, e: Date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nasa?start=${fmt(s)}&end=${fmt(e)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const grouped: Record<string, any[]> = {};
      data.forEach((cur: any) => {
        const date =
          cur.close_approach_data[0]?.close_approach_date_full?.split(" ")[0] ||
          "Unknown";
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(cur);
      });
      setEventsByDate((prev) => ({ ...prev, ...grouped }));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch NEOs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchRange(start, end);
    }
  }, [user, fetchRange, start, end]);

  if (!user) {
    return (
      <main className="p-6 flex flex-col min-h-screen">
        <div className="flex-grow">
          <p className="text-gray-600">
            Please log in to view cosmic events 🚀
          </p>
        </div>
        <footer className="text-center text-sm text-gray-500 py-4">
          Developed by @Nikki
        </footer>
      </main>
    );
  }

  return (
    <main className="p-6 flex flex-col min-h-screen space-y-4">
      <div className="flex-grow space-y-4">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
        )}
        {loading && <p className="text-gray-600">Loading…</p>}
        <EventList grouped={eventsByDate} />
        <button
          onClick={async () => {
            const newEnd = addDays(end, 3);
            await fetchRange(addDays(end, 1), newEnd);
            setEnd(newEnd);
          }}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Load more (+3 days)
        </button>
      </div>
      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-200 bg-gray-50 py-3 shadow-inner">
        <p className="text-center text-xs md:text-sm text-gray-600">
          Developed by{" "}
          <span className="font-medium text-black hover:text-blue-600 transition-colors">
            @Nikki
          </span>
        </p>
      </footer>
    </main>
  );
}
