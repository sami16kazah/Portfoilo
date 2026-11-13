import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import path from "node:path";

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

function getAvatarDataUri(): string | null {
  try {
    const filePath = path.join(process.cwd(), "public", "assets", "images", "sami.jpg");
    const buffer = readFileSync(filePath);
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}

export function createPortfolioOgImage() {
  const avatarDataUri = getAvatarDataUri();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background:
            "radial-gradient(circle at 15% 15%, rgba(79,70,229,0.35), transparent 45%), radial-gradient(circle at 85% 85%, rgba(16,185,129,0.22), transparent 45%), #060911",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
            {avatarDataUri && (
              <img
                src={avatarDataUri}
                alt="Sami Kazah"
                width={64}
                height={64}
                style={{
                  borderRadius: "16px",
                  objectFit: "cover",
                  border: "1px solid #334155",
                }}
              />
            )}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "20px", fontWeight: 700, color: "#E2E8F0" }}>
                Sami Kazah
              </span>
              <span style={{ fontSize: "15px", color: "#94A3B8" }}>
                Germany · EN · DE · AR
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 20px",
              borderRadius: "999px",
              background: "rgba(6, 78, 59, 0.7)",
              border: "1px solid rgba(52, 211, 153, 0.5)",
              color: "#A7F3D0",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            cloudvibe GmbH · Goch
          </div>
        </div>

        {/* Center Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div
            style={{
              fontSize: "68px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "#FFFFFF",
              display: "flex",
            }}
          >
            Sami Kazah
          </div>
          <div
            style={{
              fontSize: "34px",
              fontWeight: 600,
              color: "#A5B4FC",
              display: "flex",
            }}
          >
            Software &amp; Full-Stack Engineer
          </div>
          <div
            style={{
              fontSize: "23px",
              color: "#CBD5E1",
              lineHeight: 1.45,
              maxWidth: "960px",
              display: "flex",
            }}
          >
            Co-architect of shelforia.de cloud ERP · Published computer science author · TypeScript, Next.js, React, PostgreSQL &amp; AWS
          </div>
        </div>

        {/* Bottom Badges */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {["shelforia.de", "cloudvibe.de", "TypeScript / Next.js", "GoBD & XRechnung", "Damascus University"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  display: "flex",
                  padding: "10px 18px",
                  borderRadius: "12px",
                  background: "#0F172A",
                  border: "1px solid #334155",
                  color: "#E2E8F0",
                  fontSize: "18px",
                  fontWeight: 600,
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>
      </div>
    ),
    OG_IMAGE_SIZE
  );
}

