"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// Types for NEO data
interface CloseApproachData {
  close_approach_date_full: string;
  miss_distance: { kilometers: string };
  relative_velocity: { kilometers_per_hour: string };
  orbiting_body: string;
}

interface Neo {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  close_approach_data: CloseApproachData[];
  nasa_jpl_url: string;
}

export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string }; // Ensure TypeScript knows id is a string

  const [neo, setNeo] = useState<Neo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("asteroids") || "[]";
    try {
      const all: Neo[] = JSON.parse(stored);
      const found = all.find((e) => e.id === id) || null;
      setNeo(found);
    } catch (error) {
      console.error("Failed to parse NEOs:", error);
      setNeo(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!neo) return <p>NEO not found.</p>;

  const approach = neo.close_approach_data[0];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">{neo.name}</h1>
      <p
        className={
          neo.is_potentially_hazardous_asteroid
            ? "text-red-600 font-bold"
            : "text-green-600"
        }
      >
        {neo.is_potentially_hazardous_asteroid ? "⚠️ Hazardous" : "✅ Safe"}
      </p>
      <p>
        Diameter:{" "}
        {neo.estimated_diameter.kilometers.estimated_diameter_min.toFixed(2)} –{" "}
        {neo.estimated_diameter.kilometers.estimated_diameter_max.toFixed(2)} km
      </p>
      <p>Approach Date: {approach.close_approach_date_full}</p>
      <p>
        Miss Distance:{" "}
        {parseFloat(approach.miss_distance.kilometers).toFixed(2)} km
      </p>
      <p>
        Velocity:{" "}
        {parseFloat(approach.relative_velocity.kilometers_per_hour).toFixed(2)}{" "}
        km/h
      </p>
      <p>Orbiting Body: {approach.orbiting_body}</p>
      <p>
        NASA JPL URL:{" "}
        <a
          href={neo.nasa_jpl_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline"
        >
          {neo.nasa_jpl_url}
        </a>
      </p>
      <button
        onClick={() => router.back()}
        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
      >
        Back
      </button>
    </div>
  );
}
