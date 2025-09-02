"use client";
import { useEffect, useState, useCallback } from "react";
import { fmt, addDays } from "@/lib/date";
import Header from "@/components/components/Header";
import EventList from "@/components/components/EventList";

export default function Home() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(addDays(new Date(), 3));
  const [eventsByDate, setEventsByDate] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRange = useCallback(async (s: Date, e: Date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nasa?start=${fmt(s)}&end=${fmt(e)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEventsByDate((prev) => ({
        ...prev,
        ...data.reduce((acc: any, cur: any) => {
          const date =
            cur.close_approach_data[0]?.close_approach_date_full?.split(
              " "
            )[0] || "Unknown";
          if (!acc[date]) acc[date] = [];
          acc[date].push(cur);
          return acc;
        }, {}),
      }));
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch NEOs");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRange(start, end);
  }, [fetchRange, start, end]);

  const loadMore = async () => {
    const newEnd = addDays(end, 3);
    await fetchRange(addDays(end, 1), newEnd);
    setEnd(newEnd);
  };

  return (
    <>
      {/* <Header /> */}
      <main className="p-6 space-y-4">
        {error && (
          <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>
        )}
        {loading && <p className="text-gray-600">Loading…</p>}
        <EventList grouped={eventsByDate} />
        <button
          onClick={loadMore}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Load more (+3 days)
        </button>
      </main>
    </>
  );
}
