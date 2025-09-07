"use client";
import { useEffect, useState, useCallback } from "react";
import { fmt, addDays } from "@/lib/date";
import EventList from "@/components/components/EventList";

// Define Event type
export interface Event {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: { kilometers: { estimated_diameter_max: number } };
  close_approach_data: {
    close_approach_date_full: string;
    miss_distance: { kilometers: string };
  }[];
}

export default function Home() {
  const [start, setStart] = useState(new Date());
  const [end, setEnd] = useState(addDays(new Date(), 3));
  const [eventsByDate, setEventsByDate] = useState<Record<string, Event[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRange = useCallback(async (s: Date, e: Date) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nasa?start=${fmt(s)}&end=${fmt(e)}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: Event[] = await res.json();

      setEventsByDate((prev) => {
        const grouped: Record<string, Event[]> = {};
        data.forEach((cur) => {
          const date =
            cur.close_approach_data[0]?.close_approach_date_full?.split(
              " "
            )[0] || "Unknown";
          if (!grouped[date]) grouped[date] = [];
          grouped[date].push(cur);
        });
        return { ...prev, ...grouped };
      });
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to fetch NEOs");
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
  );
}
