"use client";
import { useState } from "react";
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

interface EventListProps {
  grouped: Record<string, Event[]>;
}

export default function EventList({ grouped }: EventListProps) {
  const [selectedEvents, setSelectedEvents] = useState<{
    [key: string]: boolean;
  }>({});

  const handleSelect = (id: string) => {
    setSelectedEvents((prev) => {
      const newState = { ...prev, [id]: !prev[id] };

      const selectedList = Object.values(grouped)
        .flat()
        .filter((e) => newState[e.id]);
      localStorage.setItem("selectedNEOs", JSON.stringify(selectedList));

      window.dispatchEvent(
        new CustomEvent("neo-storage", { detail: selectedList.length })
      );

      return newState;
    });
  };

  const selectedEventList: Event[] = Object.values(grouped)
    .flat()
    .filter((e) => selectedEvents[e.id]);

  if (!grouped || Object.keys(grouped).length === 0) {
    return <p className="text-center text-gray-500">No events found.</p>;
  }

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

      {Object.keys(grouped).map((date) => (
        <div key={date}>
          <h2 className="text-xl font-bold mb-2">{date}</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {grouped[date].map((event) => {
              const approach = event.close_approach_data[0];
              return (
                <EventCard
                  key={event.id}
                  id={event.id}
                  name={event.name}
                  hazardous={event.is_potentially_hazardous_asteroid}
                  diameter={
                    event.estimated_diameter.kilometers.estimated_diameter_max
                  }
                  distance={parseFloat(approach.miss_distance.kilometers)}
                  approachDate={approach.close_approach_date_full}
                  selected={!!selectedEvents[event.id]}
                  onSelect={handleSelect}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
