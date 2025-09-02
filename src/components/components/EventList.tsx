"use client";
import { useEffect, useState } from "react";
import EventCard from "./EventCard";
import Link from "next/link";

interface Event {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: { kilometers: { estimated_diameter_max: number } };
  close_approach_data: {
    close_approach_date_full: string;
    miss_distance: { kilometers: string };
  }[];
}

export default function EventList() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<{
    [key: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/nasa");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleSelect = (id: string) => {
    setSelectedEvents((prev) => {
      const newState = { ...prev, [id]: !prev[id] };

      // Update localStorage with selected asteroids
      const selectedList = events.filter((e) => newState[e.id]);
      localStorage.setItem("selectedNEOs", JSON.stringify(selectedList));

      // Dispatch a custom event so Header can update count
      window.dispatchEvent(
        new CustomEvent("neo-storage", { detail: selectedList.length })
      );

      return newState;
    });
  };

  const selectedEventList = events.filter((e) => selectedEvents[e.id]);

  if (loading) return <p className="text-center">Loading events...</p>;

  return (
    <div className="space-y-6">
      {selectedEventList.length > 0 && (
        <div className="flex justify-end">
          <Link
            href={{
              pathname: "/compare",
              query: { ids: selectedEventList.map((e) => e.id).join(",") },
            }}
          >
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              Compare ({selectedEventList.length})
            </button>
          </Link>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.length ? (
          events.map((event) => {
            const diameter =
              event.estimated_diameter.kilometers.estimated_diameter_max;
            const approach = event.close_approach_data[0];
            return (
              <EventCard
                key={event.id}
                id={event.id}
                name={event.name}
                hazardous={event.is_potentially_hazardous_asteroid}
                diameter={diameter}
                distance={parseFloat(approach.miss_distance.kilometers)}
                approachDate={approach.close_approach_date_full}
                selected={!!selectedEvents[event.id]}
                onSelect={handleSelect}
              />
            );
          })
        ) : (
          <p className="text-center text-gray-500">No events found.</p>
        )}
      </div>
    </div>
  );
}
