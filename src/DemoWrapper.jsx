import { useState } from "react";
import {
  Calendar, TrendingUp, Users, Heart, Sparkles, Layers, CreditCard,
  Bell, Headphones, ChevronRight, Monitor, Smartphone, Shield, Zap,
  CalendarDays, MapPin, BookOpen, Activity
} from "lucide-react";
import App from "./App.jsx";
import { DEMO_CONFIG } from "./demo.config.js";

const iconMap = {
  Sparkles, Layers, Heart, Shield, Zap, Calendar, TrendingUp, Users, Bell,
  Headphones, Monitor, Smartphone, CreditCard, CalendarDays, MapPin, BookOpen, Activity
};
const getIcon = (name) => iconMap[name] || Sparkles;

const featureIconFor = (label) => {
  const k = (label || "").toLowerCase();
  if (k.includes("schedul")) return Calendar;
  if (k.includes("practice") || k.includes("track")) return Activity;
  if (k.includes("communit")) return Heart;
  if (k.includes("teacher")) return Users;
  if (k.includes("member")) return CreditCard;
  if (k.includes("event") || k.includes("workshop")) return CalendarDays;
  if (k.includes("notif")) return Bell;
  if (k.includes("admin") || k.includes("dashboard")) return Shield;
  if (k.includes("locat")) return MapPin;
  if (k.includes("video") || k.includes("library")) return BookOpen;
  return Sparkles;
};

export default function DemoWrapper() {
  const c = DEMO_CONFIG;
  const accent = c.accent;
  const accentDark = c.accentDark;
  const [isFullAdmin, setIsFullAdmin] = useState(false);

  if (isFullAdmin) {
    return <App startInAdmin={true} onExitAdmin={() => setIsFullAdmin(false)} />;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f5f5", fontFamily: "'Outfit', system-ui, sans-serif", color: "#1a1a1a" }}>

      {/* --- LEFT SIDEBAR --- */}
      <aside style={{ width: 320, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", position: "fixed", top: 0, left: 0, zIndex: 10 }}>

        {/* Scrollable inner column (everything above the sticky footer) */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", display: "flex", flexDirection: "column" }} className="lumi-scroll">

          {/* Prototype Label */}
          <div style={{ padding: "16px 24px 0" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: accent, background: `${accent}12`, padding: "4px 10px", borderRadius: 4 }}>Prototype Demo</span>
          </div>

          {/* Studio Identity */}
          <div style={{ padding: "20px 24px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Gelasio', serif", fontSize: 22, fontWeight: 700, color: "#fff" }}>
                {c.studio.logo}
              </div>
              <div>
                <div style={{ fontFamily: "'Gelasio', serif", fontSize: 18, fontWeight: 600, letterSpacing: "0.02em", color: "#111827" }}>{c.studio.name}</div>
                <div style={{ fontSize: 11, color: "#6b7280", marginTop: 1 }}>{c.studio.tagline}</div>
              </div>
            </div>
          </div>

          {/* Feature List */}
          <div style={{ padding: "0 24px 16px", flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#9ca3af", marginBottom: 12 }}>App Features</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {c.features.map((f, i) => {
                const Icon = f.icon ? (iconMap[f.icon] || featureIconFor(f.label)) : featureIconFor(f.label);
                return (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 12px", borderRadius: 8, background: "#f9fafb" }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                      <Icon size={16} color={accent} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#374151", lineHeight: 1.2 }}>{f.label}</div>
                      <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 3, lineHeight: 1.35 }}>{f.description}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div style={{ position: "sticky", bottom: 0, padding: "16px 24px", background: "#fff", borderTop: "1px solid #eee", zIndex: 10 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9ca3af", textAlign: "center" }}>
            Built by <span style={{ color: accent }}>LUMI</span> — LumiClass.App
          </div>
        </div>
      </aside>

      {/* --- CENTER: PHONE FRAME --- */}
      <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", paddingTop: 32, paddingBottom: 32, marginLeft: 320, marginRight: 340 }}>
        <div style={{ position: "relative" }}>
          <div style={{
            width: 414, background: "#1a1a24", borderRadius: 44, padding: "12px 12px",
            boxShadow: `0 0 0 1px #2a2a34, 0 20px 60px rgba(0,0,0,.3), 0 0 120px ${accent}22`
          }}>
            <div style={{ width: 120, height: 6, background: "#2a2a34", borderRadius: 3, margin: "0 auto 8px" }} />
            <div style={{
              width: 390, height: 720, borderRadius: 28, overflow: "hidden", background: "white",
              position: "relative"
            }}>
              <App onEnterAdmin={() => setIsFullAdmin(true)} />
            </div>
            <div style={{ width: 134, height: 5, background: "#3a3a44", borderRadius: 3, margin: "8px auto 4px" }} />
          </div>
        </div>
      </main>

      {/* --- RIGHT SIDEBAR --- */}
      <aside style={{ width: 340, flexShrink: 0, background: "#fff", borderLeft: "1px solid #e5e7eb", position: "fixed", top: 0, right: 0, bottom: 0, overflowY: "auto", padding: "24px 20px", scrollbarWidth: "none", msOverflowStyle: "none" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {c.salesCards.map((card, i) => {
            const IconComp = getIcon(card.icon);
            const isAdminCard = card.title === "Admin Dashboard";
            return (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${accent}12`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <IconComp size={18} color={accent} />
                  </div>
                  <h3 style={{ fontFamily: "'Gelasio', serif", fontSize: 18, fontWeight: 600, color: "#111827", margin: 0 }}>{card.title}</h3>
                </div>
                <p style={{ fontSize: 12, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>{card.description}</p>
                {isAdminCard && (
                  <button onClick={() => setIsFullAdmin(true)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", padding: "10px 0", marginTop: 14, borderRadius: 8, border: "none", background: accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>
                    <Shield size={16} /> Open Admin
                  </button>
                )}
              </div>
            );
          })}

          {/* CTA Card */}
          <div style={{ background: `linear-gradient(135deg, ${accent}12, ${accentDark}08)`, border: `1px solid ${accent}30`, borderRadius: 14, padding: "22px 18px", textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Gelasio', serif", fontSize: 22, fontWeight: 600, color: "#111827", margin: "0 0 6px" }}>{c.cta.heading}</h3>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px", lineHeight: 1.4 }}>{c.cta.subheading}</p>
            <a href={c.cta.buttonUrl} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 28px",
              borderRadius: 10, background: accent, color: "#fff", fontWeight: 700, fontSize: 14,
              textDecoration: "none", letterSpacing: "0.02em"
            }}>
              {c.cta.buttonText} <ChevronRight size={16} />
            </a>
          </div>
        </div>
      </aside>

      {/* Responsive collapse for small viewports */}
      <style>{`
        @media (max-width: 1100px) {
          aside { display: none !important; }
          main { margin-left: 0 !important; margin-right: 0 !important; }
        }
        aside::-webkit-scrollbar { display: none; }
        .lumi-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
