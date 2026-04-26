import { useState, useEffect, useCallback, createContext, useContext, useRef } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search, Info,
  CircleCheck, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Gift, Share2, MapPin, Trash2, Filter,
  Headphones, Waves, CircleDot
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const STUDIO_CONFIG = {
  name: "YOGA CIRCLE",
  subtitle: "STUDIO",
  tagline: "Calm the fluctuations of the mind.",
  logoMark: "Y",
  description: "Classical yoga in historic Snohomish. Unite body, mind, spirit.",
  heroLine1: "CIRCLE.",
  heroLine2: "UNITE.",
  address: { street: "707 Pine Ave, Ste A103", city: "Snohomish", state: "WA", zip: "98290" },
  phone: "(360) 568-1000",
  email: "Karen@KarenGuzak.com",
  neighborhood: "Historic Snohomish",
  website: "https://www.yogacirclestudio.com",
  features: {
    workshops: true, practiceTracking: true, communityFeed: true, guestPasses: true,
    milestones: true, yogaTherapy: true, videoLibrary: true, beginnerSeries: true,
  },
  classCapacity: 18,
  specialtyCapacity: 12,
};

const STUDIO_IMAGES = {
  home: "https://www.yogacirclestudio.com/wp-content/uploads/2018/09/header_5429.jpg",
  classes: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?w=1200&q=80",
  schedule: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?w=1200&q=80",
  practice: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=1200&q=80",
  community: "https://images.unsplash.com/photo-1588286840104-8957b019727f?w=1200&q=80",
  teachers: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=1200&q=80",
  events: "https://images.unsplash.com/photo-1545389336-cf090694435e?w=1200&q=80",
  membership: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&q=80",
};

const GRADIENTS = {
  home: `linear-gradient(135deg, hsl(190,42%,28%) 0%, hsl(195,22%,14%) 100%)`,
  classes: `linear-gradient(160deg, hsl(200,38%,32%) 0%, hsl(190,36%,18%) 100%)`,
  schedule: `linear-gradient(150deg, hsl(185,34%,30%) 0%, hsl(200,28%,16%) 100%)`,
  practice: `linear-gradient(135deg, hsl(195,32%,32%) 0%, hsl(205,24%,16%) 100%)`,
  community: `linear-gradient(150deg, hsl(30,34%,32%) 0%, hsl(190,28%,18%) 100%)`,
  teachers: `linear-gradient(160deg, hsl(190,40%,30%) 0%, hsl(210,24%,18%) 100%)`,
  events: `linear-gradient(135deg, hsl(35,40%,30%) 0%, hsl(190,30%,18%) 100%)`,
  membership: `linear-gradient(150deg, hsl(200,36%,28%) 0%, hsl(30,24%,22%) 100%)`,
};

const THEME = {
  accent: { h: 190, s: 42, l: 40 },
  accentAlt: { h: 35, s: 45, l: 50 },
  warning: { h: 15, s: 50, l: 50 },
  primary: { h: 195, s: 22, l: 10 },
  surface: { h: 190, s: 6, l: 99 },
  surfaceDim: { h: 188, s: 5, l: 95 },
};

const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(THEME.accent), accentDark: hslShift(THEME.accent, -12),
  accentLight: hslShift(THEME.accent, 30), accentGhost: hsl(THEME.accent, 0.08),
  accentBorder: hsl(THEME.accent, 0.18), success: hsl(THEME.accentAlt),
  successGhost: hsl(THEME.accentAlt, 0.08), successBorder: hsl(THEME.accentAlt, 0.18),
  warning: hsl(THEME.warning), warningGhost: hsl(THEME.warning, 0.08),
  warningBorder: hsl(THEME.warning, 0.2), bg: hsl(THEME.primary),
  bgCard: "#ffffff", bgDim: hsl(THEME.surfaceDim),
  text: "#0e161a", textMuted: "#506070", textFaint: "#78889a",
  border: "#e2e8ec", borderLight: "#eef2f5",
};

const today = new Date().toISOString().split('T')[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

const TEACHERS = [
  { id: "t1", firstName: "Karen", lastName: "Guzak", role: "Founder & Lead Teacher", certs: ["Studio Founder", "Yoga Educator"], specialties: ["Flow", "Classical Yoga", "Studio Vision"], yearsTeaching: 20, bio: "Karen founded Yoga Circle Studio in historic Snohomish to uphold the wisdom traditions of yoga. Her teaching carries a torch that lights the path ahead, guiding every student to their authentic self." },
  { id: "t2", firstName: "Elizabeth", lastName: "Gray", role: "Yoga Therapist & Teacher", certs: ["E-RYT 500", "Yoga Therapist (800hr)"], specialties: ["Yoga Therapy", "Gentle", "Strength + Flexibility"], yearsTeaching: 14, bio: "Elizabeth took her first yoga class in 1997. RYT-500 from Essential Yoga Therapy plus 800 additional hours of yoga therapy training. Her classes explore the potential of yoga to build strength and flexibility on all levels of being." },
  { id: "t3", firstName: "Laurie", lastName: "Dunston", role: "Teacher", certs: ["RYT-200"], specialties: ["Flow", "Gentle", "Morning Practice"], yearsTeaching: 10, bio: "Laurie leads the early morning and flow classes at Yoga Circle. Her teaching brings steady warmth and consistency to the practice." },
  { id: "t4", firstName: "Candace", lastName: "McKenna", role: "Teacher", certs: ["RYT-200"], specialties: ["Gentle", "Prenatal", "Restorative"], yearsTeaching: 8, bio: "Candace brings gentleness and compassion to every class. Her slow-paced practice is ideal for anyone recovering from injuries, with limited range, or pre and post natal students." },
  { id: "t5", firstName: "Sierra", lastName: "Rediger", role: "Teacher", certs: ["RYT-200"], specialties: ["Flow", "Vinyasa", "Sun Salutations"], yearsTeaching: 5, bio: "Sierra teaches the more vigorous side of the schedule. Her flow classes are energetic, with Sun Salutations as the foundation. The room temperature rises naturally to about 80 degrees." },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Flow Yoga", type: "FLOW", style: "Flow Yoga", temp: "Room to ~80F", duration: 75,
  description: "An energetic practice flowing from one posture to the next. Sun Salutations are the foundation. The room warms naturally through movement.",
  intention: "Calm the fluctuations of the mind. Unite body, mind, and spirit.",
  teacherTip: "Mat rental $1. Arrive on time. Wear nonrestrictive clothing and bare feet.",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Gentle Yoga", type: "GENTLE", style: "Gentle", temp: "Room Temp", duration: 75, description: "Slow paced and gentle. Ideal for anyone recovering from injuries, with limited range, or pre and post natal.", intention: "Gentleness is not weakness. It is wisdom." },
  { id: "p-y2", date: offsetDate(-2), name: "Early Morning", type: "MORNING", style: "Early Morning", temp: "Room Temp", duration: 60, description: "A supportive and basic practice. Stretching and mindful breathing that create a greater sense of well-being.", intention: "Begin the day on the mat." },
  { id: "p-y3", date: offsetDate(-3), name: "Flow Yoga", type: "FLOW", style: "Flow Yoga", temp: "Room to ~80F", duration: 75, description: "Sun Salutation sequences building heat, strength, and coordination. Cooling relaxation to close.", intention: "Movement is meditation when the mind is focused." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Gentle Yoga", type: "GENTLE", style: "Gentle", temp: "Room Temp", duration: 75, description: "Slow, supportive, accessible. Pre and post natal welcome.", intention: "The overriding goal of yoga is peace." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:30", type: "Early Morning", coach: "Laurie Dunston", capacity: 18, registered: 12, waitlist: 0 },
  { id: "cl2", time: "10:00", type: "Flow Yoga", coach: "Sierra Rediger", capacity: 18, registered: 16, waitlist: 0 },
  { id: "cl3", time: "17:30", type: "Gentle Yoga", coach: "Candace McKenna", capacity: 18, registered: 14, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:30", type: "Early Morning", coach: "Laurie" }, { time: "10:00", type: "Flow Yoga", coach: "Sierra" }, { time: "17:30", type: "Flow Yoga", coach: "Karen" }] },
  { day: "Tuesday", classes: [{ time: "06:30", type: "Early Morning", coach: "Laurie" }, { time: "10:00", type: "Gentle Yoga", coach: "Elizabeth" }, { time: "17:30", type: "Gentle Yoga", coach: "Candace" }] },
  { day: "Wednesday", classes: [{ time: "06:30", type: "Early Morning", coach: "Laurie" }, { time: "10:00", type: "Flow Yoga", coach: "Sierra" }, { time: "17:30", type: "Flow Yoga", coach: "Karen" }] },
  { day: "Thursday", classes: [{ time: "10:00", type: "Gentle Yoga", coach: "Elizabeth" }, { time: "17:30", type: "Gentle Yoga", coach: "Candace" }] },
  { day: "Friday", classes: [{ time: "06:30", type: "Early Morning", coach: "Laurie" }, { time: "10:00", type: "Flow Yoga", coach: "Karen" }] },
  { day: "Saturday", classes: [{ time: "08:30", type: "Flow Yoga", coach: "Sierra" }, { time: "10:00", type: "Gentle Yoga", coach: "Elizabeth" }] },
  { day: "Sunday", classes: [{ time: "08:30", type: "Flow Yoga", coach: "Karen" }, { time: "10:00", type: "Gentle Yoga", coach: "Candace" }, { time: "14:00", type: "Sunday Workshop", coach: "Guest" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Lya B.", milestone: "500 Classes", message: "Five hundred classes at Yoga Circle. Karen and the teachers carry a torch that lights the path.", date: today, celebrations: 42 },
  { id: "cf2", user: "Thomas K.", milestone: "Yoga Therapy Journey", message: "Elizabeth guided me through yoga therapy after my injury. My body healed. My mind found peace.", date: today, celebrations: 28 },
  { id: "cf3", user: "Margaret R.", milestone: "Beginner Course Graduate", message: "The five-week beginner course gave me confidence. Now I attend flow classes and keep up.", date: offsetDate(-1), celebrations: 24 },
  { id: "cf4", user: "John C.", milestone: "1 Year Member", message: "One year. Three classes a week. The flexibility and stress reduction have been transformative.", date: offsetDate(-2), celebrations: 32 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: CircleDot, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Star, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "Beginner Graduate": { icon: Award, color: "#8b5cf6" },
  "Video Library": { icon: Headphones, color: "#3b82f6" },
  "5 Year Member": { icon: Heart, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Sunday Workshop: Meditation with the Leveys", date: "2026-06-07", startTime: "14:00", type: "Workshop", description: "World-renowned meditation teachers Dr. Joel and Michelle Levey return to Yoga Circle. Wisdom, presence, and guided meditation.", fee: 45, maxParticipants: 18, registered: 14, status: "Registration Open" },
  { id: "ev2", name: "5-Week Beginner Course", date: "2026-05-12", startTime: "17:30", type: "Course", description: "An introduction to yoga for those who have never practiced. Five weeks of guided instruction. In-studio $75, Virtual $65.", fee: 75, maxParticipants: 14, registered: 8, status: "Registration Open" },
  { id: "ev3", name: "Yoga Therapy: 3-Part Wellness Series", date: "2026-06-14", startTime: "10:00", type: "Wellness", description: "Elizabeth Gray leads a private 3-part series: Ayurveda assessment, posture and breath evaluation, and personalized yoga.", fee: 250, maxParticipants: 1, registered: 0, status: "Inquire" },
];

const MEMBERSHIP_TIERS = [
  { id: "m0", name: "New Student: 2 Weeks", type: "intro", price: 50, period: "2 weeks", features: ["Unlimited for 14 days", "All class types", "Mat rental included", "New students only"], popular: false },
  { id: "m1", name: "Drop-In", type: "drop-in", price: 20, period: "per class", features: ["Single class credit", "Any class type", "Mat rental $1"], popular: false },
  { id: "m2", name: "10 Class Pack", type: "pack", price: 140, period: "10 classes", features: ["$14 per class", "Any class type", "No expiration"], popular: false },
  { id: "m3", name: "20 Class Pack", type: "pack", price: 240, period: "20 classes", features: ["$12 per class", "Best per-class rate", "No expiration"], popular: true },
  { id: "m4", name: "Annual Membership", type: "unlimited", price: 120, period: "/month", features: ["Unlimited studio + Zoom", "Up to 156 classes/year", "Video library included", "$120/mo or $1,400/year"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "New Students: 2 Weeks for $50", message: "Unlimited yoga in historic Snohomish. Flow, Gentle, Early Morning. 8 teachers. The classical path.", type: "celebration", pinned: true },
  { id: "a2", title: "Video Library: $20/month", message: "Over a dozen yoga videos from 8 minutes to 75 minutes. Practice at home with your favorite teachers.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Lya Badgley", email: "lya@email.com", membership: "Annual Membership", status: "active", joined: "2018-03-01", checkIns: 686, lastVisit: today },
  { id: "mem2", name: "Thomas Kim", email: "thomas@email.com", membership: "10 Class Pack", status: "active", joined: "2025-09-01", checkIns: 8, lastVisit: offsetDate(-2) },
  { id: "mem3", name: "Margaret Rivera", email: "margaret@email.com", membership: "20 Class Pack", status: "active", joined: "2025-06-01", checkIns: 16, lastVisit: today },
  { id: "mem4", name: "John Chen", email: "john@email.com", membership: "Annual Membership", status: "active", joined: "2025-04-01", checkIns: 142, lastVisit: offsetDate(-1) },
  { id: "mem5", name: "Candace Park", email: "candace@email.com", membership: "10 Class Pack", status: "active", joined: "2026-01-15", checkIns: 6, lastVisit: offsetDate(-3) },
  { id: "mem6", name: "Sam Torres", email: "sam@email.com", membership: "New Student Intro", status: "active", joined: "2026-04-10", checkIns: 4, lastVisit: offsetDate(-1) },
];

const ADMIN_METRICS = { activeMembers: 86, memberChange: 4, todayCheckIns: 24, weekCheckIns: 144, monthlyRevenue: 10200, revenueChange: 5.4, renewalRate: 94.6, workshopRevenue: 1800 };

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 24 }, { day: "Tue", total: 22 }, { day: "Wed", total: 24 },
    { day: "Thu", total: 18 }, { day: "Fri", total: 16 }, { day: "Sat", total: 22 }, { day: "Sun", total: 18 },
  ],
  revenue: [
    { month: "Sep", revenue: 8200 }, { month: "Oct", revenue: 8800 }, { month: "Nov", revenue: 9200 },
    { month: "Dec", revenue: 8600 }, { month: "Jan", revenue: 9600 }, { month: "Feb", revenue: 9800 }, { month: "Mar", revenue: 10200 },
  ],
  classPopularity: [
    { name: "6:30 AM", pct: 68 }, { name: "10:00 AM", pct: 90 }, { name: "5:30 PM", pct: 80 }, { name: "Weekend", pct: 86 },
  ],
  membershipBreakdown: [
    { name: "Annual Members", value: 28, color: T.accent },
    { name: "20 Class Pack", value: 14, color: T.success },
    { name: "10 Class Pack", value: 18, color: T.warning },
    { name: "Drop-In / Intro", value: 26, color: "#8b9aa5" },
  ],
};

const AppContext = createContext(null);

function TeacherAvatar({ teacher, size = 48 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: size > 48 ? 14 : 10, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Gelasio', serif", fontSize: size * 0.38, color: "#fff", flexShrink: 0, fontWeight: 600 }}>
      {teacher.firstName[0]}{teacher.lastName[0]}
    </div>
  );
}

function PageHero({ image, gradient, title, subtitle, tall = false }) {
  const height = tall ? 300 : 220;
  const padTop = tall ? 48 : 32;
  const headlineSize = tall ? 64 : 56;
  return (
    <div style={{ position: "relative", height, marginBottom: 16, overflow: "hidden", background: gradient || "#1a2a30" }}>
      {image && (
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.75)",
        }} />
      )}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.04) 50%, rgba(0,0,0,0.35) 100%)"
      }} />
      <div style={{ position: "relative", padding: `${padTop}px 20px 22px`, height: "100%", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "flex-end", color: "#fff" }}>
        <h1 style={{ fontFamily: "'Gelasio', serif", fontSize: headlineSize, fontWeight: 700, lineHeight: 0.98, margin: 0, textShadow: "0 2px 12px rgba(0,0,0,0.35)", letterSpacing: "-0.01em" }}>{title}</h1>
        {subtitle && <p style={{ maxWidth: "90%", fontSize: 14, lineHeight: 1.4, margin: "12px 0 0", textShadow: "0 1px 6px rgba(0,0,0,0.4)", color: "#f5f5f5" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, linkText, linkPage }) {
  const { setPage } = useContext(AppContext);
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, padding: "0 16px" }}>
      <h2 style={{ fontFamily: "'Gelasio', serif", fontSize: 22, margin: 0, fontWeight: 600, color: T.text }}>{title}</h2>
      {linkText && <button onClick={() => setPage(linkPage)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>{linkText} <ChevronRight size={16} /></button>}
    </div>
  );
}

function QuickAction({ icon: Icon, label, page, color }) {
  const { setPage } = useContext(AppContext);
  return (
    <button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, borderRadius: 12, border: `1px solid ${T.borderLight}`, cursor: "pointer", boxShadow: "0 2px 8px rgba(10,30,50,.06)" }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color="#fff" /></div>
      <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{label}</span>
    </button>
  );
}

function PracticeCard({ practice, variant, expanded, onToggle }) {
  const isFeatured = variant === "featured";
  const isExpanded = expanded !== undefined ? expanded : isFeatured;
  const typeColors = { FLOW: T.accent, GENTLE: T.success, MORNING: T.warning, RESTORATIVE: "#8b5cf6" };
  return (
    <div onClick={onToggle} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderLeft: `4px solid ${typeColors[practice.type] || T.accent}`, borderRadius: 12, padding: isFeatured ? "18px 18px" : "14px 16px", cursor: onToggle ? "pointer" : "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isExpanded ? 10 : 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
            {practice.date === today ? <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>TODAY</span> : <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>{formatDateShort(practice.date)}</span>}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${typeColors[practice.type] || T.accent}18`, color: typeColors[practice.type] || T.accent }}>{practice.style}</span>
            {practice.duration && <span style={{ fontSize: 11, color: T.textFaint }}>{practice.duration} min</span>}
          </div>
          <h3 style={{ fontFamily: "'Gelasio', serif", fontSize: isFeatured ? 24 : 18, margin: 0, color: T.text, fontWeight: 600 }}>{practice.name}</h3>
        </div>
        {onToggle && <ChevronDown size={18} color={T.textFaint} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
      </div>
      {isExpanded && (
        <div>
          {practice.temp && <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><Sun size={14} color={T.success} /><span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{practice.temp}</span></div>}
          <p style={{ fontSize: 14, color: T.textMuted, lineHeight: 1.55, margin: "0 0 12px" }}>{practice.description}</p>
          {practice.intention && <div style={{ padding: "10px 12px", background: T.accentGhost, borderRadius: 8, marginBottom: 8 }}><span style={{ fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intention</span><p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>{practice.intention}</p></div>}
          {practice.teacherTip && <div style={{ padding: "10px 12px", background: T.successGhost, borderRadius: 8 }}><span style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.05em" }}>Teacher Note</span><p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0", lineHeight: 1.5 }}>{practice.teacherTip}</p></div>}
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange, placeholder, multiline }) {
  const style = { width: "100%", padding: "10px 12px", background: T.bgDim, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.text, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };
  return (
    <div>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>
      {multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...style, resize: "vertical" }} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />}
    </div>
  );
}

function EmptyState({ icon: Icon, message, sub }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
      <Icon size={36} color={T.textFaint} style={{ margin: "0 auto 8px" }} /><p style={{ color: T.textMuted, margin: 0 }}>{message}</p>
      {sub && <p style={{ fontSize: 13, color: T.accent, margin: "6px 0 0" }}>{sub}</p>}
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div style={{ background: T.bgDim, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 2px" }}>{label}</p>
      <p style={{ fontFamily: "'Gelasio', serif", fontSize: 22, color: T.text, margin: 0, fontWeight: 700 }}>{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div style={{ width: "100%" }}>
      <PageHero
        image={STUDIO_IMAGES.home}
        gradient={GRADIENTS.home}
        tall
        title={<>{STUDIO_CONFIG.heroLine1}<br/><span style={{ color: T.accentLight, fontStyle: "italic" }}>{STUDIO_CONFIG.heroLine2}</span></>}
        subtitle={STUDIO_CONFIG.description}
      />

      <section style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Users, label: "Teachers", page: "teachers", color: T.accentDark },
          ].map(a => <QuickAction key={a.label} {...a} />)}
        </div>
      </section>

      <section style={{ marginTop: 24 }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <div style={{ padding: "0 16px" }}><PracticeCard practice={TODAYS_FOCUS} variant="featured" /></div>
      </section>

      <section style={{ marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 48 }}>
                  <span style={{ fontFamily: "'Gelasio', serif", fontSize: 20, color: T.text, fontWeight: 600 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 10, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: isFull ? T.warning : totalReg >= c.capacity * 0.8 ? T.success : T.accent }}>{totalReg}/{c.capacity}</span>
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : <EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />}
        </div>
      </section>

      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={18} color="#fff" /></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: T.text, margin: 0 }}>{item.user} <span style={{ color: T.success }}>{item.milestone}</span></p>
                    <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.message.length > 55 ? item.message.slice(0, 55) + "..." : item.message}</p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} /><span style={{ fontSize: 11, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ marginTop: 28, padding: "0 16px" }}>
          <h2 style={{ fontFamily: "'Gelasio', serif", fontSize: 22, margin: "0 0 12px", fontWeight: 600, color: T.text }}>Announcements</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 10, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: "16px 16px 24px", marginTop: 20 }}>
        <div style={{ background: `linear-gradient(165deg, ${T.accent}, ${T.accentDark})`, borderRadius: 16, padding: "24px 20px", color: "#fff" }}>
          <h3 style={{ fontFamily: "'Gelasio', serif", fontSize: 22, margin: "0 0 6px", fontWeight: 600 }}>New to Yoga Circle Studio?</h3>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", margin: "0 0 16px", lineHeight: 1.5 }}>New students: 2 weeks for $50. All classes. Mat rental included.</p>
          <button onClick={() => {}} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 8, border: "none", background: "#fff", color: T.accentDark, fontFamily: "'Gelasio', serif", fontSize: 15, cursor: "pointer", fontWeight: 600 }}>View Memberships <ChevronRight size={16} /></button>
        </div>
      </section>
    </div>
  );
}

function ClassesPage() {
  const [exp, setExp] = useState(null);
  const all = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div style={{ width: "100%" }}>
      <PageHero image={STUDIO_IMAGES.classes} gradient={GRADIENTS.classes} title="Classes" subtitle="Flow, Gentle, Early Morning, and specialty classes" />
      <div style={{ padding: "20px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {all.map(p => <PracticeCard key={p.id} practice={p} expanded={exp === p.id} onToggle={() => setExp(exp === p.id ? null : p.id)} />)}
      </div>
    </div>
  );
}

function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div style={{ width: "100%" }}>
      <PageHero image={STUDIO_IMAGES.schedule} gradient={GRADIENTS.schedule} title="Schedule" subtitle="Reserve your spot. Classes fill up fast." />
      <div style={{ padding: "20px 16px 24px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {days.map((d, i) => (
            <button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted }}>{d}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
            const isSpecial = cls.type.includes("Gentle") || cls.type.includes("Morning") || cls.type.includes("Workshop") || cls.type.includes("Therapy");
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 54 }}>
                  <span style={{ fontFamily: "'Gelasio', serif", fontSize: 15, color: T.text, fontWeight: 600 }}>{fmtTime(cls.time)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: T.text, margin: 0 }}>{cls.type}</p>
                    {isSpecial && <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", padding: "1px 5px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Specialty</span>}
                  </div>
                  <p style={{ fontSize: 11, color: T.textMuted, margin: "2px 0 0" }}>{cls.coach}</p>
                </div>
                <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: isSpecial ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 15, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>Reserve</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);
  const streakDays = 18; const totalClasses = 142;

  return (
    <div style={{ width: "100%" }}>
      <PageHero image={STUDIO_IMAGES.practice} gradient={GRADIENTS.practice} title="My Practice" subtitle="Track your journey and celebrate growth" />
      <div style={{ padding: "20px 16px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[
            { icon: Flame, val: streakDays, label: "Day Streak", color: T.accent, ghost: T.accentGhost, bdr: T.accentBorder },
            { icon: Star, val: totalClasses, label: "Total Classes", color: T.success, ghost: T.successGhost, bdr: T.successBorder },
            { icon: Mountain, val: 8, label: "Milestones", color: T.warning, ghost: T.warningGhost, bdr: T.warningBorder },
          ].map((s, i) => (
            <div key={i} style={{ background: s.ghost, border: `1px solid ${s.bdr}`, borderRadius: 12, padding: "14px 10px", textAlign: "center" }}>
              <s.icon size={20} color={s.color} style={{ margin: "0 auto 4px" }} />
              <div style={{ fontFamily: "'Gelasio', serif", fontSize: 26, fontWeight: 700, color: T.text }}>{s.val}</div>
              <div style={{ fontSize: 10, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
          {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none" }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "log" && (
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Leaf size={18} color={T.accent} /><h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: T.text }}>Post-Practice Reflection</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Energy Level</label>
                <div style={{ display: "flex", gap: 6 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={() => setReflection({...reflection, energy: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${reflection.energy >= n ? T.accent : T.border}`, background: reflection.energy >= n ? T.accentGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {n <= 2 ? <Moon size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : n <= 4 ? <Sun size={18} color={reflection.energy >= n ? T.accent : T.textFaint} /> : <Sparkles size={18} color={reflection.energy >= n ? T.accent : T.textFaint} />}
                    </button>
                  ))}
                </div>
              </div>
              <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What arose during practice today?" multiline />
              <button onClick={() => { setSaved(true); setTimeout(() => setSaved(null), 2000); setReflection({ energy: 4, focus: 4, notes: "" }); }} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Gelasio', serif", fontSize: 16 }}>
                {saved ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
              </button>
            </div>
          </div>
        )}

        {activeTab === "milestones" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {Object.entries(MILESTONE_BADGES).map(([name, badge], i) => {
              const earned = i < 8;
              return (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? T.border : T.borderLight}`, borderRadius: 12, opacity: earned ? 1 : 0.55 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: earned ? `${badge.color}18` : T.bgDim, display: "flex", alignItems: "center", justifyContent: "center" }}><badge.icon size={22} color={earned ? badge.color : T.textFaint} /></div>
                  <div style={{ flex: 1 }}><p style={{ fontSize: 14, fontWeight: 600, margin: 0, color: T.text }}>{name}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{earned ? "Earned" : "Keep practicing"}</p></div>
                  {earned && <CircleCheck size={18} color={T.accent} />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);
  return (
    <div style={{ width: "100%" }}>
      <PageHero image={STUDIO_IMAGES.community} gradient={GRADIENTS.community} title="Community" subtitle="Celebrate each other's practice" />
      <div style={{ padding: "20px 16px 24px" }}>
        {STUDIO_CONFIG.features.guestPasses && (
          <div style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, borderRadius: 14, padding: "18px", marginBottom: 20, color: "#fff" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}><Gift size={20} color="#fff" /><h3 style={{ fontFamily: "'Gelasio', serif", fontSize: 17, margin: 0, fontWeight: 600 }}>Guest Passes</h3></div>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.9)", margin: "0 0 14px", lineHeight: 1.5 }}>You have <span style={{ fontWeight: 700 }}>2 guest passes</span> this month. Share the gift of practice.</p>
            <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 8, border: "none", background: "#fff", color: T.accentDark, fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Share2 size={16} /> Share a Guest Pass</button>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {COMMUNITY_FEED.map(item => {
            const myC = feedCelebrations[item.id] || 0;
            return (
              <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Gelasio', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{item.user[0]}</div>
                  <div><p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p><p style={{ fontSize: 11, color: T.textMuted, margin: 0 }}>{formatDateShort(item.date)}</p></div>
                  <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.successGhost, color: T.success }}>{item.milestone}</span>
                </div>
                <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.55, margin: "0 0 12px" }}>{item.message}</p>
                <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.successBorder : T.border}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                  <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} /><span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  return (
    <div style={{ width: "100%" }}>
      <PageHero image={STUDIO_IMAGES.teachers} gradient={GRADIENTS.teachers} title="Teachers" subtitle="Carrying the torch of wisdom" />
      <div style={{ padding: "20px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                <TeacherAvatar teacher={teacher} size={56} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: T.text }}>{teacher.firstName} {teacher.lastName}</h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching}+ years</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {teacher.specialties.map(s => <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>)}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {teacher.certs.map(c => <span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MembershipPage() {
  return (
    <div style={{ width: "100%" }}>
      <PageHero image={STUDIO_IMAGES.membership} gradient={GRADIENTS.membership} title="Membership" subtitle="Find your path to practice" />
      <div style={{ padding: "20px 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && <div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase" }}>Popular</div>}
            <h3 style={{ fontFamily: "'Gelasio', serif", fontSize: 20, margin: "0 0 4px", color: T.text, fontWeight: 600 }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Gelasio', serif", fontSize: 36, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => <li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: T.textMuted }}><CircleCheck size={14} color={T.accent} style={{ flexShrink: 0 }} />{f}</li>)}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Gelasio', serif", background: tier.popular ? T.accent : T.accentDark, color: "#fff" }}>Get Started</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function EventsPage() {
  return (
    <div style={{ width: "100%" }}>
      <PageHero image={STUDIO_IMAGES.events} gradient={GRADIENTS.events} title="Events" subtitle="Workshops, courses, and wellness offerings" />
      <div style={{ padding: "20px 16px 24px" }}>
        {EVENTS.map(ev => (
          <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, padding: "18px", color: "#fff" }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#fff", opacity: 0.85 }}>{ev.type}</span>
              <h3 style={{ fontFamily: "'Gelasio', serif", fontSize: 18, margin: "6px 0 4px", fontWeight: 600 }}>{ev.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12, color: "rgba(255,255,255,0.88)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
              </div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <StatBox label="Price" value={ev.fee >= 1000 ? `$${(ev.fee/1000).toFixed(1)}k` : `$${ev.fee}`} />
                <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
              </div>
              <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'Gelasio', serif", background: T.accent, color: "#fff" }}>Register</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES — LIGHT COLOR SCHEME
// ═══════════════════════════════════════════════════════════════

const ADMIN_T = {
  bg: "#f5f7f9",
  cardBg: "#ffffff",
  border: "#e3e9ee",
  borderLight: "#edf1f4",
  text: "#111827",
  textMuted: "#4b5563",
  textFaint: "#9ca3af",
  input: "#ffffff",
  inputBg: "#f9fafb",
};

function AdminCard({ title, children }) {
  return (
    <div style={{ background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 12, padding: 18 }}>
      <h3 style={{ fontFamily: "'Gelasio', serif", fontSize: 16, color: ADMIN_T.text, margin: "0 0 14px", fontWeight: 600 }}>{title}</h3>
      {children}
    </div>
  );
}

function AdminCrudBar({ onAdd, addLabel = "Add New" }) {
  return (
    <button onClick={onAdd} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
      <Plus size={16} /> {addLabel}
    </button>
  );
}

function AdminCrudActions() {
  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.cardBg, color: ADMIN_T.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Edit3 size={14} /></button>
      <button style={{ width: 32, height: 32, borderRadius: 6, border: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.cardBg, color: ADMIN_T.textMuted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
    </div>
  );
}

function AdminPageHeader({ title, subtitle, action }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
      <div>
        <h1 style={{ fontFamily: "'Gelasio', serif", fontSize: 26, color: ADMIN_T.text, margin: 0, fontWeight: 700 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 13, color: ADMIN_T.textMuted, margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns}/wk`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Workshop Revenue", value: `$${ADMIN_METRICS.workshopRevenue.toLocaleString()}`, change: "+16 registrations", positive: true, icon: Award, color: "#8b5cf6" },
  ];
  const chartGrid = "#e5e7eb";
  const axisColor = "#9ca3af";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <AdminPageHeader title="Dashboard" subtitle={`Welcome back. Here is what is happening at ${STUDIO_CONFIG.name} ${STUDIO_CONFIG.subtitle}.`} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><m.icon size={18} color={m.color} /></div>
            <div style={{ fontFamily: "'Gelasio', serif", fontSize: 28, color: ADMIN_T.text, fontWeight: 700 }}>{m.value}</div>
            <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: m.positive ? "#16a34a" : "#dc2626", marginTop: 4 }}>{m.positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {m.change}</span>
            <p style={{ fontSize: 13, color: ADMIN_T.textMuted, margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.attendance}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="day" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: `1px solid ${ADMIN_T.border}`, borderRadius: 8, color: ADMIN_T.text }} />
                <Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Revenue Trend">
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={ADMIN_CHARTS.revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} />
                <XAxis dataKey="month" stroke={axisColor} fontSize={12} />
                <YAxis stroke={axisColor} fontSize={12} tickFormatter={v => `$${v / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: `1px solid ${ADMIN_T.border}`, borderRadius: 8, color: ADMIN_T.text }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
                <defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.accent} stopOpacity={0.35} /><stop offset="100%" stopColor={T.accent} stopOpacity={0} /></linearGradient></defs>
                <Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>
                  {ADMIN_CHARTS.membershipBreakdown.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: `1px solid ${ADMIN_T.border}`, borderRadius: 8, color: ADMIN_T.text }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            {ADMIN_CHARTS.membershipBreakdown.map((e, i) => <div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} /><span style={{ fontSize: 11, color: ADMIN_T.textMuted }}>{e.name} ({e.value})</span></div>)}
          </div>
        </AdminCard>
        <AdminCard title="Class Popularity (% Capacity)">
          <div style={{ height: 210 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CHARTS.classPopularity} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={chartGrid} horizontal={false} />
                <XAxis type="number" stroke={axisColor} fontSize={12} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" stroke={axisColor} fontSize={11} width={70} />
                <Tooltip contentStyle={{ backgroundColor: "#fff", border: `1px solid ${ADMIN_T.border}`, borderRadius: 8, color: ADMIN_T.text }} formatter={v => [`${v}%`, "Capacity"]} />
                <Bar dataKey="pct" fill={T.accent} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </AdminCard>
        <AdminCard title="Recent Activity">
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { text: "New member signup", detail: "Sam Torres - New Student Intro", time: "5 min ago", color: T.accent },
              { text: "Workshop registration", detail: "Yoga Therapy - Thomas K.", time: "12 min ago", color: "#8b5cf6" },
              { text: "Class waitlist full", detail: "5:30 PM Gentle Yoga", time: "18 min ago", color: T.success },
              { text: "Payment received", detail: "Annual Membership - Lya Badgley", time: "25 min ago", color: T.warning },
              { text: "Guest pass redeemed", detail: "Lya Badgley's guest", time: "1 hr ago", color: "#3b82f6" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "6px 0" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, marginTop: 6, flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, color: ADMIN_T.text, margin: 0, fontWeight: 500 }}>{a.text}</p>
                  <p style={{ fontSize: 12, color: ADMIN_T.textMuted, margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.detail}</p>
                </div>
                <span style={{ fontSize: 11, color: ADMIN_T.textFaint, whiteSpace: "nowrap" }}>{a.time}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState("all");
  const filtered = MEMBERS_DATA.filter(m => { if (filter !== "all" && m.status !== filter) return false; if (search && !m.name.toLowerCase().includes(search.toLowerCase())) return false; return true; });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AdminPageHeader title="Members" subtitle="Manage studio members, memberships, and check-ins" action={<AdminCrudBar addLabel="Add Member" />} />
      <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: ADMIN_T.textFaint }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." style={{ width: "100%", padding: "10px 12px 10px 36px", background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 8, color: ADMIN_T.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {["all", "active", "frozen"].map(f => <button key={f} onClick={() => setFilter(f)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: filter === f ? T.accent : ADMIN_T.cardBg, color: filter === f ? "#fff" : ADMIN_T.textMuted }}>{f}</button>)}
        </div>
      </div>
      <div style={{ background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ borderBottom: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.inputBg }}>{["Member", "Plan", "Status", "Classes", "Actions"].map(h => <th key={h} style={{ padding: "12px 16px", textAlign: "left", color: ADMIN_T.textMuted, fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(m => (
            <tr key={m.id} style={{ borderBottom: `1px solid ${ADMIN_T.borderLight}` }}>
              <td style={{ padding: "12px 16px" }}><p style={{ color: ADMIN_T.text, fontWeight: 600, margin: 0 }}>{m.name}</p><p style={{ color: ADMIN_T.textFaint, fontSize: 12, margin: "2px 0 0" }}>{m.email}</p></td>
              <td style={{ padding: "12px 16px", color: ADMIN_T.textMuted, fontSize: 12 }}>{m.membership}</td>
              <td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, textTransform: "capitalize", background: m.status === "active" ? `${T.accent}18` : `${T.warning}18`, color: m.status === "active" ? T.accent : T.warning }}>{m.status}</span></td>
              <td style={{ padding: "12px 16px", color: ADMIN_T.textMuted, fontFamily: "monospace" }}>{m.checkIns}</td>
              <td style={{ padding: "12px 16px" }}><AdminCrudActions /></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AdminPageHeader title="Schedule" subtitle="Today's classes, waitlists, and reservations" action={<AdminCrudBar addLabel="Add Class" />} />
      <div style={{ background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ borderBottom: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.inputBg }}>{["Time", "Class", "Teacher", "Capacity", "Actions"].map(h => <th key={h} style={{ padding: "12px 14px", textAlign: "left", color: ADMIN_T.textMuted, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
          <tbody>{CLASSES_TODAY.map(c => (
            <tr key={c.id} style={{ borderBottom: `1px solid ${ADMIN_T.borderLight}` }}>
              <td style={{ padding: "12px 14px", color: ADMIN_T.text, fontFamily: "monospace", fontWeight: 600 }}>{fmtTime(c.time)}</td>
              <td style={{ padding: "12px 14px", color: ADMIN_T.text, fontWeight: 600 }}>{c.type}</td>
              <td style={{ padding: "12px 14px", color: ADMIN_T.textMuted }}>{c.coach}</td>
              <td style={{ padding: "12px 14px" }}><span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span></td>
              <td style={{ padding: "12px 14px" }}><AdminCrudActions /></td>
            </tr>
          ))}</tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AdminPageHeader title="Teachers" subtitle="Manage teacher profiles and assignments" action={<AdminCrudBar addLabel="Add Teacher" />} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {TEACHERS.map(t => (
          <div key={t.id} style={{ background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <TeacherAvatar teacher={t} size={48} />
              <div><h3 style={{ fontSize: 15, fontWeight: 700, color: ADMIN_T.text, margin: 0 }}>{t.firstName} {t.lastName}</h3><p style={{ fontSize: 12, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{t.role}</p></div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 10 }}>
              {t.certs.slice(0,3).map(c => <span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: ADMIN_T.inputBg, color: ADMIN_T.textMuted }}>{c}</span>)}
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.cardBg, color: ADMIN_T.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.cardBg, color: ADMIN_T.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Schedule</button>
              <button style={{ width: 36, padding: "8px 0", borderRadius: 6, border: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.cardBg, color: ADMIN_T.textFaint, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AdminPageHeader title="Events & Workshops" subtitle="Manage workshops, courses, and wellness offerings" action={<AdminCrudBar addLabel="New Event" />} />
      {EVENTS.map(ev => (
        <div key={ev.id} style={{ background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 12, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: `${T.accent}18`, color: T.accent }}>{ev.status}</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, color: ADMIN_T.text, margin: "8px 0 4px" }}>{ev.name}</h3>
              <p style={{ fontSize: 13, color: ADMIN_T.textMuted, margin: 0 }}>{formatDateShort(ev.date)} — {ev.type} — ${ev.fee}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Gelasio', serif", fontSize: 26, color: T.accent, fontWeight: 700 }}>{ev.registered}</div>
                <p style={{ fontSize: 11, color: ADMIN_T.textFaint, margin: 0 }}>of {ev.maxParticipants}</p>
              </div>
              <AdminCrudActions />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function AdminPricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AdminPageHeader title="Pricing & Memberships" subtitle="Manage membership tiers and class packs" action={<AdminCrudBar addLabel="Add Tier" />} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: ADMIN_T.cardBg, border: `1px solid ${tier.popular ? T.accent : ADMIN_T.border}`, borderRadius: 12, padding: 18 }}>
            {tier.popular && <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent, marginBottom: 8, display: "inline-block" }}>POPULAR</span>}
            <h3 style={{ fontFamily: "'Gelasio', serif", fontSize: 18, color: ADMIN_T.text, margin: "0 0 4px", fontWeight: 600 }}>{tier.name}</h3>
            <div style={{ fontFamily: "'Gelasio', serif", fontSize: 28, color: T.accent, fontWeight: 700 }}>${tier.price}<span style={{ fontSize: 13, color: ADMIN_T.textMuted, fontWeight: 400 }}> {tier.period}</span></div>
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.cardBg, color: ADMIN_T.textMuted, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
              <button style={{ width: 36, padding: "8px 0", borderRadius: 6, border: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.cardBg, color: ADMIN_T.textFaint, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminBroadcastPage() {
  const [message, setMessage] = useState(""); const [audience, setAudience] = useState("all");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AdminPageHeader title="Broadcast" subtitle="Send announcements and notifications to members" />
      <div style={{ background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: ADMIN_T.text, fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>New Broadcast</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Title" style={{ padding: "10px 14px", background: ADMIN_T.inputBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 8, color: ADMIN_T.text, fontSize: 13, outline: "none" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={4} style={{ padding: "10px 14px", background: ADMIN_T.inputBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 8, color: ADMIN_T.text, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {["all", "unlimited", "class packs", "teachers"].map(a => <button key={a} onClick={() => setAudience(a)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: audience === a ? T.accent : ADMIN_T.inputBg, color: audience === a ? "#fff" : ADMIN_T.textMuted }}>{a}</button>)}
          </div>
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Send size={16} /> Send Broadcast</button>
        </div>
      </div>
      <div>
        <h3 style={{ color: ADMIN_T.text, fontSize: 15, fontWeight: 700, margin: "0 0 12px" }}>Sent</h3>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{ background: ADMIN_T.cardBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 10, padding: 14, marginBottom: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
              <h4 style={{ color: ADMIN_T.text, margin: 0, fontSize: 14, fontWeight: 600 }}>{a.title}</h4>
              <AdminCrudActions />
            </div>
            <p style={{ fontSize: 12, color: ADMIN_T.textMuted, margin: "4px 0 0" }}>{a.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSettingsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <AdminPageHeader title="Studio Settings" subtitle="Configure studio information and integrations" />
      <AdminCard title="Studio Information">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "Studio Name", value: `${STUDIO_CONFIG.name} ${STUDIO_CONFIG.subtitle}` },
            { label: "Address", value: `${STUDIO_CONFIG.address.street}, ${STUDIO_CONFIG.address.city}` },
            { label: "Phone", value: STUDIO_CONFIG.phone },
            { label: "Email", value: STUDIO_CONFIG.email },
          ].map((f, i) => (
            <div key={i}>
              <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: ADMIN_T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>{f.label}</label>
              <input defaultValue={f.value} style={{ width: "100%", padding: "10px 12px", background: ADMIN_T.inputBg, border: `1px solid ${ADMIN_T.border}`, borderRadius: 8, color: ADMIN_T.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
          ))}
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Save Changes</button>
        </div>
      </AdminCard>
      <AdminCard title="Integrations">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {["Stripe Payments", "Mailchimp", "Google Calendar", "Zoom"].map((name, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: ADMIN_T.inputBg, borderRadius: 8 }}>
              <span style={{ fontSize: 13, color: ADMIN_T.text, fontWeight: 600 }}>{name}</span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: i < 2 ? `${T.accent}18` : ADMIN_T.border, color: i < 2 ? T.accent : ADMIN_T.textMuted }}>{i < 2 ? "Connected" : "Connect"}</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MODALS
// ═══════════════════════════════════════════════════════════════

function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [addedCal, setAddedCal] = useState(false);
  const isFull = classData.registered >= classData.capacity;
  const spotsLeft = classData.capacity - classData.registered;
  const dateLabel = classData.date ? formatDateShort(classData.date) : classData.dayLabel || "This week";

  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, padding: "24px 20px 36px", animation: "slideUp 0.25s ease-out", boxSizing: "border-box" }}>
        {!confirmed ? (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ fontFamily: "'Gelasio', serif", fontSize: 22, margin: 0, color: T.text, fontWeight: 600 }}>Confirm Reservation</h2>
              <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} color={T.textMuted} /></button>
            </div>
            <div style={{ background: T.bgDim, borderRadius: 14, padding: "18px 16px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                <div style={{ width: 52, height: 52, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Calendar size={24} color="#fff" /></div>
                <div style={{ flex: 1, minWidth: 0 }}><h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 3px" }}>{classData.type}</h3><p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{classData.coach}</p></div>
              </div>
              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Clock size={16} color={T.textMuted} /><span style={{ fontSize: 14, color: T.text }}>{fmtTime(classData.time)}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><CalendarDays size={16} color={T.textMuted} /><span style={{ fontSize: 14, color: T.text }}>{dateLabel}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Users size={16} color={T.textMuted} /><span style={{ fontSize: 14, color: isFull ? T.warning : spotsLeft <= 5 ? T.success : T.text }}>{isFull ? "Full - join the waitlist" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining`}</span></div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}><MapPin size={16} color={T.textMuted} /><span style={{ fontSize: 14, color: T.text }}>707 Pine Ave, Snohomish</span></div>
              </div>
            </div>
            <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 10, padding: "12px 14px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}><Info size={16} color={T.accent} /><span style={{ fontSize: 13, fontWeight: 700, color: T.accent }}>Reminders</span></div>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "0 0 4px", lineHeight: 1.4 }}>Arrive 10-15 minutes early. Doors close when class begins.</p>
              <p style={{ fontSize: 12, color: T.textMuted, margin: 0, lineHeight: 1.4 }}>Mat rental $1. Nonrestrictive clothing. Bare feet.</p>
            </div>
            <button onClick={() => { setConfirmed(true); onConfirm(classData.id); }} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Gelasio', serif", background: isFull ? T.success : T.accent, color: "#fff", marginBottom: 8 }}>{isFull ? "Join Waitlist" : "Confirm Reservation"}</button>
            <button onClick={onClose} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: `1px solid ${T.border}`, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: T.textMuted }}>Cancel</button>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "10px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Check size={32} color={T.accent} /></div>
            <h2 style={{ fontFamily: "'Gelasio', serif", fontSize: 22, margin: "0 0 4px", color: T.text, fontWeight: 600 }}>{isFull ? "Added to Waitlist" : "You're In"}</h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 20px" }}>{classData.type} with {classData.coach.split(" ")[0]} at {fmtTime(classData.time)}.</p>
            <div style={{ background: T.bgDim, borderRadius: 12, padding: "14px 16px", marginBottom: 16, textAlign: "left" }}>
              {[["Class", classData.type], ["Teacher", classData.coach], ["Time", fmtTime(classData.time)], ["Date", dateLabel]].map(([l, v], i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: i < 3 ? 8 : 0 }}><span style={{ fontSize: 13, color: T.textMuted }}>{l}</span><span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>{v}</span></div>)}
            </div>
            <button onClick={() => setAddedCal(true)} style={{ width: "100%", padding: "12px 0", borderRadius: 10, border: `1px solid ${addedCal ? T.accentBorder : T.border}`, background: addedCal ? T.accentGhost : "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer", color: addedCal ? T.accent : T.textMuted, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 8 }}>{addedCal ? <><Check size={16} /> Added to Calendar</> : <><CalendarDays size={16} /> Add to Calendar</>}</button>
            <button onClick={onClose} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Gelasio', serif", background: T.accent, color: "#fff" }}>Done</button>
          </div>
        )}
      </div>
      <style>{`@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }`}</style>
    </div>
  );
}

function SettingsModal({ onClose }) {
  const [notifClass, setNotifClass] = useState(true); const [notifCommunity, setNotifCommunity] = useState(true); const [notifEvents, setNotifEvents] = useState(true);
  const Toggle = ({ active, onClick }) => <button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: active ? T.accent : T.border, position: "relative" }}><div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} /></button>;
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h2 style={{ fontFamily: "'Gelasio', serif", fontSize: 24, margin: 0, fontWeight: 600, color: T.text }}>Settings</h2><button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button></div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Profile</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Gelasio', serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>LB</div>
            <div><p style={{ fontWeight: 700, margin: 0, fontSize: 15, color: T.text }}>Lya Badgley</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Annual Membership — Since 2018</p></div>
          </div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Notifications</h3>
          {[
            { label: "Class Reminders", active: notifClass, toggle: () => setNotifClass(!notifClass) },
            { label: "Community Milestones", active: notifCommunity, toggle: () => setNotifCommunity(!notifCommunity) },
            { label: "Events & Workshops", active: notifEvents, toggle: () => setNotifEvents(!notifEvents) },
          ].map(n => <div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}><span style={{ fontSize: 14, color: T.text }}>{n.label}</span><Toggle active={n.active} onClick={n.toggle} /></div>)}
        </div>
        <div style={{ padding: "14px 0" }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>About</h3>
          <p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle} App v1.0</p>
          <p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>Built by Lumi — LumiClass.App</p>
        </div>
        <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>Sign Out</button>
      </div>
    </div>
  );
}

function NotificationsModal({ onClose }) {
  const notifications = [
    { id: 1, title: "Tomorrow: Gentle Yoga", message: "Slow paced and supportive. Pre and post natal welcome.", type: "class", time: "2 hours ago", read: false },
    { id: 2, title: "New Milestone", message: "Margaret R. graduated the Beginner Course. Celebrate together.", type: "community", time: "4 hours ago", read: false },
    { id: 3, title: "Class Reminder", message: "Reserved for 5:30 PM Gentle Yoga with Candace.", type: "class", time: "6 hours ago", read: true },
    { id: 4, title: "Sunday Workshop: Meditation with the Leveys", message: "World-renowned meditation teachers. June 7. Register now.", type: "event", time: "1 day ago", read: true },
  ];
  return (
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "80vh", overflow: "auto", padding: "20px 20px 40px", boxSizing: "border-box" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h2 style={{ fontFamily: "'Gelasio', serif", fontSize: 24, margin: 0, fontWeight: 600, color: T.text }}>Notifications</h2><button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifications.map(n => (
            <div key={n.id} style={{ display: "flex", gap: 12, padding: "12px 14px", background: n.read ? "transparent" : T.accentGhost, border: `1px solid ${n.read ? T.borderLight : T.accentBorder}`, borderRadius: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: n.type === "class" ? T.accentGhost : n.type === "community" ? T.successGhost : T.warningGhost, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n.type === "class" ? <Calendar size={16} color={T.accent} /> : n.type === "community" ? <Heart size={16} color={T.success} /> : <CalendarDays size={16} color={T.warning} />}</div>
              <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: 14, fontWeight: n.read ? 500 : 700, color: T.text, margin: 0 }}>{n.title}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{n.message}</p><p style={{ fontSize: 11, color: T.textFaint, margin: "4px 0 0" }}>{n.time}</p></div>
              {!n.read && <div style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent, marginTop: 4, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  PHONE APP (consumer-facing within the phone frame)
// ═══════════════════════════════════════════════════════════════

function PhoneApp({ onEnterAdmin }) {
  const [page, setPage] = useState("home");
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);
  const contentRef = useRef(null);

  const registerForClass = useCallback((classId) => { setClassRegistrations(prev => ({ ...prev, [classId]: (prev[classId] || 0) + 1 })); setReservationClass(null); }, []);
  const openReservation = useCallback((classData) => { setReservationClass(classData); }, []);
  const celebrateFeed = useCallback((feedId) => { setFeedCelebrations(prev => ({ ...prev, [feedId]: (prev[feedId] || 0) + 1 })); }, []);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0;
  }, [page]);

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "community", label: "Community", icon: Heart },
    { id: "more", label: "More", icon: Menu },
  ];
  const moreItems = [
    { id: "classes", label: "Classes", icon: Filter },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "membership", label: "Membership", icon: CreditCard },
    { id: "events", label: "Events", icon: CalendarDays },
  ];

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />;
      case "classes": return <ClassesPage />;
      case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />;
      case "community": return <CommunityPage />;
      case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />;
      case "events": return <EventsPage />;
      default: return <HomePage />;
    }
  };

  const isMoreActive = moreItems.some(item => item.id === page);
  const unreadCount = 2;

  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <div style={{ position: "absolute", inset: 0, background: T.bgDim, fontFamily: "'IBM Plex Sans', system-ui, sans-serif", overflow: "hidden" }}>
        <header style={{ position: "absolute", top: 0, left: 0, right: 0, height: 56, background: T.bg, color: "#fff", padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 30, boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div style={{ width: 34, height: 34, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Gelasio', serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{STUDIO_CONFIG.logoMark}</div>
            <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
              <span style={{ fontFamily: "'Gelasio', serif", fontSize: 16, lineHeight: 1, fontWeight: 600 }}>{STUDIO_CONFIG.name}</span>
              <span style={{ fontSize: 8, color: "#a1b0b8", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <button onClick={onEnterAdmin} title="Open Admin" style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accentLight, display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={20} /></button>
            <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}><Bell size={20} />{unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}</button>
            <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Settings size={20} /></button>
          </div>
        </header>

        <main ref={contentRef} style={{ position: "absolute", top: 56, left: 0, right: 0, bottom: 60, overflowY: "auto", overflowX: "hidden", scrollbarWidth: "none", msOverflowStyle: "none" }} className="phone-scroll">
          {renderPage()}
        </main>

        {showMore && (
          <div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}>
            <div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}><span style={{ fontFamily: "'Gelasio', serif", fontSize: 18, fontWeight: 600, color: T.text }}>More</span><button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button></div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {moreItems.map(item => {
                  const active = page === item.id;
                  return <button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "16px 8px", borderRadius: 10, border: `1px solid ${T.borderLight}`, cursor: "pointer", background: active ? T.accentGhost : T.bgCard, color: active ? T.accent : T.textMuted }}><item.icon size={24} /><span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span></button>;
                })}
              </div>
            </div>
          </div>
        )}

        <nav style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 60, background: T.bgCard, borderTop: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "space-around", zIndex: 50 }}>
          {mainTabs.map(tab => {
            const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
            return (
              <button key={tab.id} onClick={() => tab.id === "more" ? setShowMore(true) : setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 8px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}>
                <tab.icon size={20} strokeWidth={active ? 2.5 : 2} /><span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
        {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}

        <style>{`
          .phone-scroll::-webkit-scrollbar { display: none; }
        `}</style>
      </div>
    </AppContext.Provider>
  );
}

// ═══════════════════════════════════════════════════════════════
//  FULL-SCREEN ADMIN (100vw x 100vh, outside phone frame)
// ═══════════════════════════════════════════════════════════════

function FullScreenAdmin({ onExit }) {
  const [page, setPage] = useState("admin-dashboard");

  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-schedule", label: "Schedule", icon: Calendar },
    { id: "admin-teachers", label: "Teachers", icon: UserCheck },
    { id: "admin-members", label: "Members", icon: Users },
    { id: "admin-events", label: "Events", icon: CalendarDays },
    { id: "admin-pricing", label: "Pricing", icon: DollarSign },
    { id: "admin-broadcast", label: "Broadcast", icon: Megaphone },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];

  const renderAdmin = () => {
    switch (page) {
      case "admin-dashboard": return <AdminDashboard />;
      case "admin-schedule": return <AdminSchedulePage />;
      case "admin-teachers": return <AdminTeachersPage />;
      case "admin-members": return <AdminMembersPage />;
      case "admin-events": return <AdminEventsPage />;
      case "admin-pricing": return <AdminPricingPage />;
      case "admin-broadcast": return <AdminBroadcastPage />;
      case "admin-settings": return <AdminSettingsPage />;
      default: return <AdminDashboard />;
    }
  };

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh", fontFamily: "'Outfit', 'IBM Plex Sans', system-ui, sans-serif", background: ADMIN_T.bg, color: ADMIN_T.text, overflow: "hidden" }}>
      <aside style={{ width: 240, flexShrink: 0, background: ADMIN_T.cardBg, borderRight: `1px solid ${ADMIN_T.border}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ padding: "20px 18px", borderBottom: `1px solid ${ADMIN_T.border}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Gelasio', serif", fontSize: 17, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
            <div>
              <div style={{ fontFamily: "'Gelasio', serif", fontSize: 15, color: ADMIN_T.text, fontWeight: 700, lineHeight: 1.1 }}>{STUDIO_CONFIG.name}</div>
              <div style={{ fontSize: 10, color: ADMIN_T.textFaint, textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 2 }}>Admin Console</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "10px 8px", overflow: "auto" }}>
          {adminTabs.map(tab => {
            const active = page === tab.id;
            return (
              <button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accentGhost : "transparent", color: active ? T.accent : ADMIN_T.textMuted, fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer", marginBottom: 2, textAlign: "left" }}>
                <tab.icon size={17} /><span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
        <div style={{ borderTop: `1px solid ${ADMIN_T.border}`, padding: "12px 8px" }}>
          <button onClick={onExit} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${ADMIN_T.border}`, background: ADMIN_T.cardBg, color: ADMIN_T.textMuted, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
            <LogOut size={16} /><span>Exit Admin</span>
          </button>
        </div>
      </aside>
      <main style={{ flex: 1, padding: "28px 36px", overflow: "auto" }}>
        {renderAdmin()}
      </main>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  APP ENTRY
// ═══════════════════════════════════════════════════════════════

export default function App({ startInAdmin = false, onEnterAdmin, onExitAdmin }) {
  if (startInAdmin) {
    return <FullScreenAdmin onExit={onExitAdmin} />;
  }
  return <PhoneApp onEnterAdmin={onEnterAdmin} />;
}
