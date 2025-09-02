"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EventDetail() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [neo, setNeo] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("asteroids") || "[]";
    const all = JSON.parse(stored);
    const found = all.find((e: any) => e.id === id);
    setNeo(found);
    setLoading(false);
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
