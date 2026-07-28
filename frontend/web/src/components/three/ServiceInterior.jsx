import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";

export default function ServiceInterior({ service, index, total, radius, height, doorOpen, onClose }) {
  const groupRef = useRef();
  const glowRef = useRef();
  const [showContent, setShowContent] = useState(false);

  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const faceX = Math.cos(angle) * (radius + 0.008);
  const faceZ = Math.sin(angle) * (radius + 0.008);

  const faceWidth = (2 * Math.PI * radius) / total * 0.8;

  const features = service.features
    ? (typeof service.features === "string" ? JSON.parse(service.features) : service.features)
    : [];

  const technologies = service.technologies
    ? (typeof service.technologies === "string" ? JSON.parse(service.technologies) : service.technologies)
    : [];

  const gallery = service.galleryImages
    ? (typeof service.galleryImages === "string" ? JSON.parse(service.galleryImages) : service.galleryImages || [])
    : [];

  useEffect(() => {
    if (doorOpen) {
      const timer = setTimeout(() => setShowContent(true), 600);
      return () => clearTimeout(timer);
    } else {
      setShowContent(false);
    }
  }, [doorOpen]);

  useFrame((state) => {
    if (!glowRef.current) return;
    const t = state.clock.elapsedTime;
    glowRef.current.intensity = doorOpen ? 1.5 + Math.sin(t * 2) * 0.3 : 0;
  });

  if (!doorOpen) return null;

  return (
    <group
      ref={groupRef}
      position={[faceX, 0, faceZ]}
      rotation={[0, -angle + Math.PI / 2, 0]}
    >
      <pointLight
        ref={glowRef}
        position={[0, 0, -0.5]}
        color="#fef3c7"
        intensity={1.5}
        distance={4}
        decay={2}
      />

      <Html
        position={[0, 0, -0.6]}
        transform
        occlude={false}
        style={{
          width: `${Math.max(faceWidth * 180, 320)}px`,
          pointerEvents: showContent ? "auto" : "none",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
            borderRadius: "16px",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            padding: "24px",
            color: "#e2e8f0",
            fontFamily: "'Inter', sans-serif",
            boxShadow: "0 0 40px rgba(37, 99, 235, 0.15), inset 0 1px 0 rgba(255,255,255,0.05)",
            maxHeight: "55vh",
            overflowY: "auto",
            backdropFilter: "blur(10px)",
            transform: showContent ? "translateX(0)" : "translateX(-120%)",
            opacity: showContent ? 1 : 0,
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease",
          }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                  {service.title || "Service"}
                </h2>
                <p style={{ fontSize: "13px", color: "#60a5fa", margin: "4px 0 0 0" }}>
                  {service.shortDescription || ""}
                </p>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  color: "#f87171",
                  borderRadius: "8px",
                  padding: "6px 14px",
                  cursor: "pointer",
                  fontSize: "12px",
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                Close
              </button>
            </div>

            {service.heroImage && (
              <img
                src={service.heroImage}
                alt={service.title}
                style={{
                  width: "100%",
                  height: "140px",
                  objectFit: "cover",
                  borderRadius: "10px",
                  marginBottom: "16px",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            )}

            <p style={{ fontSize: "13px", lineHeight: 1.7, color: "#cbd5e1", margin: "0 0 16px 0" }}>
              {service.fullDescription || service.description || ""}
            </p>

            {technologies.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Technologies
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {technologies.map((tech, i) => (
                    <span
                      key={i}
                      style={{
                        background: "rgba(37, 99, 235, 0.15)",
                        border: "1px solid rgba(37, 99, 235, 0.25)",
                        color: "#93c5fd",
                        borderRadius: "6px",
                        padding: "4px 10px",
                        fontSize: "11px",
                        fontWeight: 500,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {features.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Features
                </h4>
                <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: "12px", lineHeight: 1.8, color: "#cbd5e1" }}>
                  {features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            )}

            {gallery.length > 0 && (
              <div style={{ marginBottom: "16px" }}>
                <h4 style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", margin: "0 0 8px 0", textTransform: "uppercase", letterSpacing: "1px" }}>
                  Gallery
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
                  {gallery.slice(0, 4).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: "80px",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "12px" }}>
              {service.liveUrl && (
                <a
                  href={service.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  Live Demo
                </a>
              )}
              {service.githubUrl && (
                <a
                  href={service.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "#e2e8f0",
                    borderRadius: "8px",
                    padding: "8px 16px",
                    fontSize: "12px",
                    fontWeight: 600,
                    textDecoration: "none",
                    display: "inline-block",
                  }}
                >
                  GitHub
                </a>
              )}
              <button
                onClick={onClose}
                style={{
                  background: "rgba(37, 99, 235, 0.1)",
                  border: "1px solid rgba(37, 99, 235, 0.25)",
                  color: "#60a5fa",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Contact
              </button>
            </div>
          </div>
        </Html>
    </group>
  );
}
