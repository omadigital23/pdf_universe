import { ImageResponse } from "next/og";

export const alt = "OMA PDF par OMA Digital";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 28,
          background: "#f5f4ef",
          color: "#18181b",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 30,
            fontWeight: 700,
            color: "#0f766e",
          }}
        >
          <div
            style={{
              width: 54,
              height: 54,
              display: "flex",
              borderRadius: 12,
              background: "#18181b",
            }}
          />
          OMA Digital
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <h1 style={{ margin: 0, fontSize: 76, lineHeight: 1, letterSpacing: 0 }}>
            OMA PDF Universe
          </h1>
          <p style={{ margin: 0, maxWidth: 880, fontSize: 34, lineHeight: 1.25, color: "#3f3f46" }}>
            Fusionner, convertir, signer et modifier vos PDF dans le navigateur.
          </p>
        </div>
      </div>
    ),
    size,
  );
}
