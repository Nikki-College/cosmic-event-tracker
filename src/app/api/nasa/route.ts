// // // import { NextResponse } from "next/server";

// // // export async function GET(req: Request) {
// // //   try {
// // //     const { searchParams } = new URL(req.url);
// // //     const start = searchParams.get("start") || "2025-09-01";
// // //     const end = searchParams.get("end") || "2025-09-02";

// // //     const response = await fetch(
// // //       `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${process.env.NEXT_PUBLIC_NASA_KEY}`
// // //     );

// // //     if (!response.ok) {
// // //       return NextResponse.json(
// // //         { error: "NASA API failed" },
// // //         { status: response.status }
// // //       );
// // //     }

// // //     const raw = await response.json();

// // //     // Flatten near_earth_objects into a single array
// // //     const events = Object.values(raw.near_earth_objects).flat();

// // //     return NextResponse.json(events);
// // //   } catch (err) {
// // //     return NextResponse.json({ error: "Server error" }, { status: 500 });
// // //   }
// // // }
// // // app/api/nasa/route.ts
// // import { NextResponse } from "next/server";

// // export async function GET(req: Request) {
// //   const { searchParams } = new URL(req.url);
// //   const start = searchParams.get("start") || "2025-09-01";
// //   const end = searchParams.get("end") || "2025-09-02";

// //   const apiKey = process.env.NASA_API_KEY || "DEMO_KEY";
// //   const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`;

// //   try {
// //     const res = await fetch(url);
// //     const data = await res.json();

// //     if (!data.near_earth_objects) {
// //       return NextResponse.json([]);
// //     }

// //     // Flatten all events into a single array
// //     const events = Object.values(data.near_earth_objects).flat();

// //     return NextResponse.json(events);
// //   } catch (err) {
// //     console.error("NASA API error:", err);
// //     return NextResponse.json([]);
// //   }
// // }
// import { NextResponse } from "next/server";

// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const start = searchParams.get("start") || "2025-09-01";
//     const end = searchParams.get("end") || "2025-09-02";
//     const apiKey = process.env.NEXT_PUBLIC_NASA_KEY || "DEMO_KEY";

//     const res = await fetch(
//       `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`
//     );

//     if (!res.ok) throw new Error("NASA API request failed");

//     const data = await res.json();
//     const events = Object.values(data.near_earth_objects).flat();
//     return NextResponse.json(events);
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 500 });
//   }
// }
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start") || "2025-09-01";
  const end = searchParams.get("end") || "2025-09-02";

  const apiKey = process.env.NEXT_PUBLIC_NASA_KEY || "DEMO_KEY";
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data.near_earth_objects) return NextResponse.json([]);
    const events = Object.values(data.near_earth_objects).flat();
    return NextResponse.json(events);
  } catch (err) {
    console.error("NASA API error:", err);
    return NextResponse.json([]);
  }
}
