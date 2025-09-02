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

interface Asteroid {
  id: string;
  name: string;
  diameter: number;
  distance: number;
  hazardous: boolean;
}

export default function ComparePage() {
  const [data, setData] = useState<Asteroid[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("selectedNEOs");
    if (stored) {
      const parsed = JSON.parse(stored)
        .filter(
          (e: any) =>
            e.estimated_diameter?.kilometers &&
            e.close_approach_data?.[0]?.miss_distance?.kilometers
        )
        .map((e: any) => ({
          id: e.id,
          name: e.name,
          diameter: e.estimated_diameter.kilometers.estimated_diameter_max,
          distance: parseFloat(
            e.close_approach_data[0].miss_distance.kilometers
          ),
          hazardous: e.is_potentially_hazardous_asteroid,
        }));
      setData(parsed);
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
