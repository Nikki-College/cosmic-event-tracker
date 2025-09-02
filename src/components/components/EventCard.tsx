"use client";
import Link from "next/link";

interface EventCardProps {
  id: string;
  name: string;
  hazardous: boolean;
  diameter: number;
  distance: number;
  approachDate: string;
  selected: boolean;
  onSelect: (id: string, selected: boolean) => void;
}

export default function EventCard({
  id,
  name,
  hazardous,
  diameter,
  approachDate,
  distance,
  selected,
  onSelect,
}: EventCardProps) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center shadow">
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={(e) => onSelect(id, e.target.checked)}
        />
        <div>
          <Link
            href={`/event/${id}`}
            className="text-lg font-semibold hover:underline"
          >
            {name}
          </Link>
          <p className="text-sm text-gray-600">
            Diameter: {diameter.toFixed(2)} km | Distance: {distance.toFixed(0)}{" "}
            km
          </p>
          <p
            className={`text-sm ${
              hazardous ? "text-red-600 font-bold" : "text-green-600"
            }`}
          >
            {hazardous ? "⚠️ Hazardous" : "✅ Safe"}
          </p>
          <p className="text-sm text-gray-500">Approach: {approachDate}</p>
        </div>
      </div>
    </div>
  );
}
