"use client";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

// Type for processed asteroid data used in chart
interface Asteroid {
  id: string;
  name: string;
  diameter: number;
  distance: number;
  hazardous: boolean;
}

// Type for raw stored data in localStorage
interface StoredNEO {
  id: string;
  name: string;
  is_potentially_hazardous_asteroid: boolean;
  estimated_diameter: { kilometers: { estimated_diameter_max: number } };
  close_approach_data: {
    miss_distance: { kilometers: string };
    close_approach_date_full: string;
  }[];
}

export default function ComparePage() {
  const [data, setData] = useState<Asteroid[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedNEOs");
    if (!stored) return;

    try {
      const parsed: StoredNEO[] = JSON.parse(stored);
      const processed: Asteroid[] = parsed
        .filter(
          (e) =>
            e.estimated_diameter?.kilometers &&
            e.close_approach_data?.[0]?.miss_distance?.kilometers
        )
        .map((e) => ({
          id: e.id,
          name: e.name,
          diameter: e.estimated_diameter.kilometers.estimated_diameter_max,
          distance: parseFloat(
            e.close_approach_data[0].miss_distance.kilometers
          ),
          hazardous: e.is_potentially_hazardous_asteroid,
        }));

      setData(processed);
    } catch (error) {
      console.error("Failed to parse selected NEOs:", error);
      setData([]);
    }
  }, []);

  if (data.length === 0) return <p>No asteroids selected for comparison.</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Asteroid Comparison</h1>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="diameter" fill="#8884d8" name="Diameter (km)" />
          <Bar dataKey="distance" fill="#82ca9d" name="Distance (km)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
