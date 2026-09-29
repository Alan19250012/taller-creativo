import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Taller Creativo EK — Regalos personalizados";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #DA1D2A 0%, #244093 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: 48
        }}
      >
        <div style={{ fontSize: 84, fontWeight: 800, letterSpacing: -2 }}>Taller Creativo EK</div>
        <div style={{ fontSize: 34, opacity: 0.92, marginTop: 24, fontWeight: 500 }}>
          Regalos personalizados para toda ocasión
        </div>
      </div>
    ),
    { ...size }
  );
}
