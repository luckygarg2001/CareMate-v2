const {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  createContext,
  useContext
} = React;

/* =========================================================================
   ICONS — hand-authored stroke icon set (feather-style), single source
   ========================================================================= */
const ICONS = {
  heart: "M12 20.6 4.6 13.2a5 5 0 0 1 7.1-7.1l.3.3.3-.3a5 5 0 0 1 7.1 7.1L12 20.6Z",
  home: "M4 11.5 12 4l8 7.5 M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9",
  pill: "M5.5 15.5 15.5 5.5a4.2 4.2 0 1 1 6 6L11.5 21.5a4.2 4.2 0 0 1-6-6Z M9 8.5 15.5 15",
  users: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z M3.5 20.5c0-3.6 2.5-6 5.5-6s5.5 2.4 5.5 6 M17 12.5a3 3 0 1 0 0-6 M20.5 20.5c0-3-2-5.2-4.5-5.8",
  history: "M4 12a8 8 0 1 1 2.6 5.9 M4 12V6 M4 12H10",
  bell: "M7 9a5 5 0 0 1 10 0v4.5l1.6 2.7H5.4L7 13.5Z M10 19a2 2 0 0 0 4 0",
  calendar: "M5 8h14 M7 4v3 M17 4v3 M5.5 6h13A1.5 1.5 0 0 1 20 7.5V19a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6Z M9 12h1.5 M9 15.5h1.5 M13.5 12H15 M13.5 15.5H15",
  settings: "M12 15.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M19.4 12a7.3 7.3 0 0 0-.1-1.3l1.9-1.5-2-3.4-2.2.9a7.4 7.4 0 0 0-2.3-1.3L14.3 3h-4l-.4 2.4a7.4 7.4 0 0 0-2.3 1.3l-2.2-.9-2 3.4L5.3 11a7.6 7.6 0 0 0 0 2.6l-1.9 1.5 2 3.4 2.2-.9c.7.6 1.5 1 2.3 1.3l.4 2.4h4l.4-2.4a7.4 7.4 0 0 0 2.3-1.3l2.2.9 2-3.4-1.9-1.5c.1-.4.1-.9.1-1.3Z",
  phone: "M7.5 3.5 10 5.4a1.3 1.3 0 0 1 .3 1.7L9 9.4a10 10 0 0 0 5.6 5.6l2.3-1.3a1.3 1.3 0 0 1 1.7.3l1.9 2.5a1.4 1.4 0 0 1-.2 1.9l-1.3 1.1a2.4 2.4 0 0 1-2.1.5A17 17 0 0 1 4.9 8.1a2.4 2.4 0 0 1 .5-2.1L6.5 3.7a1.4 1.4 0 0 1 1-.2Z",
  message: "M4 5.5A1.5 1.5 0 0 1 5.5 4h13A1.5 1.5 0 0 1 20 5.5v9A1.5 1.5 0 0 1 18.5 16H10l-4.5 4V16H5.5A1.5 1.5 0 0 1 4 14.5v-9Z",
  plus: "M12 5v14 M5 12h14",
  edit: "M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5.5 16 4 20Z M14.5 5 19 9.5",
  trash: "M5 7h14 M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2 M7 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13 M10 11v6 M14 11v6",
  check: "M4.5 12.5 9.5 17.5 19.5 6.5",
  x: "M6 6 18 18 M18 6 6 18",
  chevronRight: "M9 5.5 15.5 12 9 18.5",
  chevronLeft: "M15 5.5 8.5 12 15 18.5",
  chevronDown: "M5.5 9 12 15.5 18.5 9",
  arrowLeft: "M19 12H5 M11 5.5 4.5 12 11 18.5",
  clock: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M12 7.5V12l3 2",
  package: "M3.5 8 12 3.5 20.5 8 12 12.5 3.5 8Z M3.5 8v8L12 20.5 20.5 16V8 M12 12.5V20.5",
  alert: "M12 3.5 22 20.5H2L12 3.5Z M12 10v4 M12 17h.01",
  moon: "M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z M12 2.5V4.5 M12 19.5v2 M4.2 4.2l1.4 1.4 M18.4 18.4l1.4 1.4 M2.5 12h2 M19.5 12h2 M4.2 19.8l1.4-1.4 M18.4 5.6l1.4-1.4",
  logout: "M9 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3 M15.5 16.5 20 12l-4.5-4.5 M9 12h11",
  google: "GOOGLE",
  camera: "M4 8.5A1.5 1.5 0 0 1 5.5 7h1.7l1-1.7A1 1 0 0 1 9 4.8h6a1 1 0 0 1 .87.5l1 1.7h1.63A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5v-9Z M12 16.2a3.7 3.7 0 1 0 0-7.4 3.7 3.7 0 0 0 0 7.4Z",
  search: "M11 18.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z M21 21l-4.35-4.35",
  filter: "M4 6h16 M7 12h10 M10 18h4",
  refresh: "M20 11A8 8 0 0 0 6.3 6.3L4 8.6 M4 4v4.6h4.6 M4 13a8 8 0 0 0 13.7 4.7l2.3-2.3 M20 20v-4.6h-4.6",
  download: "M12 4v11.5 M7 12l5 5 5-5 M5 20h14",
  stethoscope: "M6 4v6a4 4 0 0 0 8 0V4 M10 4H4.5 M14 4h-1.5 M14 10a4 4 0 1 0 4 4c0-1.5-.6-2.2-1-3 M18 14v1a1 1 0 1 1-2 0",
  eye: "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z M12 14.7a2.7 2.7 0 1 0 0-5.4 2.7 2.7 0 0 0 0 5.4Z",
  eyeOff: "M4 4l16 16 M9.9 9.9a2.7 2.7 0 0 0 3.9 3.9 M6.2 6.5C4 8 2.5 12 2.5 12s3.5 6.5 9.5 6.5c1.6 0 3-.4 4.2-1.1 M9.5 5.7A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a15.3 15.3 0 0 1-2.9 3.6",
  info: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M12 11v5.5 M12 8h.01",
  globe: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z M4.2 12h15.6 M12 4c2.2 2.2 3.3 5 3.3 8s-1.1 5.8-3.3 8c-2.2-2.2-3.3-5-3.3-8s1.1-5.8 3.3-8Z",
  layers: "M12 3.5 21 8l-9 4.5L3 8l9-4.5Z M3 12l9 4.5 9-4.5 M3 16l9 4.5 9-4.5",
  type: "M6 5h12 M12 5v14 M9.5 19h5",
  sparkle: "M12 3l1.6 5.4L19 10l-5.4 1.6L12 17l-1.6-5.4L5 10l5.4-1.6L12 3Z",
  volume: "M4 9.5h3.5L12 5.5v13L7.5 14.5H4Z M16 8.5a5 5 0 0 1 0 7 M18.5 6a8.5 8.5 0 0 1 0 12",
  volumeOff: "M4 9.5h3.5L12 5.5v13L7.5 14.5H4Z M16.5 9.5l4 4 M20.5 9.5l-4 4",
  scan: "M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8 M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8 M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16 M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16 M4 12h16",
  fileText: "M14 3.5H7A1.5 1.5 0 0 0 5.5 5v14A1.5 1.5 0 0 0 7 20.5h10a1.5 1.5 0 0 0 1.5-1.5V8Z M14 3.5V8h4.5 M8.5 12.5h7 M8.5 15.5h7 M8.5 9.5h2",
  mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3Z M19 10v2a7 7 0 0 1-14 0v-2 M12 19v4 M8 23h8",
  stop: "M6.5 6.5h11v11h-11Z",
  play: "M7 4.5 19.5 12 7 19.5Z",
  pause: "M8 5h3.2v14H8Z M12.8 5H16v14h-3.2Z",
  music: "M9 18V5l12-2v13 M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z M21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 8l5-5 5 5 M12 3v12",
  lock: "M6.5 10.5h11v9h-11Z M8.5 10.5v-3a3.5 3.5 0 0 1 7 0v3 M12 14.2v2",
  activity: "M2 12h4l3-9 6 18 3-9h4",
  droplet: "M12 2.5S5.5 10 5.5 15a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5Z",
  thermometer: "M14 4a2 2 0 0 0-4 0v9.5a4 4 0 1 0 4 0Z M12 9.5v4",
  scale: "M12 3v18 M6 7h12 M3.5 7l2.5 5a2.5 2.5 0 0 1-5 0Z M17.5 7 20 12a2.5 2.5 0 0 1-5 0Z"
};
function Icon({
  name,
  size = 20,
  className = "",
  strokeWidth = 2,
  filled = false
}) {
  const d = ICONS[name];
  if (!d) return null;
  if (d === "GOOGLE") {
    return /*#__PURE__*/React.createElement("svg", {
      width: size,
      height: size,
      viewBox: "0 0 48 48",
      className: className
    }, /*#__PURE__*/React.createElement("path", {
      fill: "#FFC107",
      d: "M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#FF3D00",
      d: "M6.3 14.7l6.6 4.8C14.5 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#4CAF50",
      d: "M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6C29.6 35.1 26.9 36 24 36c-5.3 0-9.7-3.1-11.3-7.4l-6.6 5.1C9.6 39.6 16.2 44 24 44z"
    }), /*#__PURE__*/React.createElement("path", {
      fill: "#1976D2",
      d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.6 5.6C39.6 37.3 44 31.6 44 24c0-1.3-.1-2.7-.4-3.5z"
    }));
  }
  const paths = d.split(" M").map((p, i) => i === 0 ? p : "M" + p);
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    className: className
  }, paths.map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p,
    stroke: "currentColor",
    strokeWidth: strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    fill: filled ? "currentColor" : "none"
  })));
}

/* =========================================================================
   HELPERS
   ========================================================================= */
const uid = () => Math.random().toString(36).slice(2, 10);
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I to avoid ambiguity
const genCareCode = () => Array.from({
  length: 6
}, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join("");
const genOtp = () => String(Math.floor(100000 + Math.random() * 900000)); // 6-digit numeric OTP
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const todayStr = () => new Date().toISOString().slice(0, 10);
const fmtTime12 = t => {
  if (!t) return "";
  let [h, m] = t.split(":").map(Number);
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${String(m).padStart(2, "0")} ${ap}`;
};
const fmtDateLong = d => new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
  weekday: "long",
  day: "numeric",
  month: "long"
});
const fmtDateShort = d => new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short"
});
const fmtWeekday = d => new Date(d + "T00:00:00").toLocaleDateString("en-IN", {
  weekday: "short"
});
const minutesNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const toMin = t => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const nextDaysArr = n => {
  const arr = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
};

/* Client-side adherence PDF report — no server involved, generated entirely
   in the browser via jsPDF (loaded from CDN in index.html). */
function exportAdherencePDF({
  patientLabel,
  rangeLabel,
  pct,
  taken,
  skipped,
  snoozed,
  rows,
  medicines,
  patients
}) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert("The PDF library hasn't finished loading yet — please try again in a moment.");
    return;
  }
  const {
    jsPDF
  } = window.jspdf;
  const doc = new jsPDF({
    unit: "pt",
    format: "a4"
  });
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 48;
  let y = 56;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42);
  doc.text("CareMate — Adherence Report", margin, y);
  y += 22;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text(`${patientLabel} · ${rangeLabel} · Generated ${new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric"
  })}`, margin, y);
  y += 28;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, pageW - margin, y);
  y += 28;

  // Summary tiles
  const tiles = [{
    label: "Adherence rate",
    value: `${pct}%`,
    color: [37, 99, 235]
  }, {
    label: "Taken",
    value: String(taken),
    color: [5, 150, 105]
  }, {
    label: "Snoozed",
    value: String(snoozed),
    color: [217, 119, 6]
  }, {
    label: "Skipped",
    value: String(skipped),
    color: [220, 38, 38]
  }];
  const tileW = (pageW - margin * 2 - 3 * 12) / 4;
  tiles.forEach((tile, i) => {
    const x = margin + i * (tileW + 12);
    doc.setDrawColor(226, 232, 240);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, tileW, 62, 8, 8, "FD");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...tile.color);
    doc.text(tile.value, x + 14, y + 30);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(tile.label, x + 14, y + 46);
  });
  y += 62 + 32;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(15, 23, 42);
  doc.text("Dose log", margin, y);
  y += 18;

  // Table header
  const cols = [{
    key: "date",
    label: "Date",
    w: 70
  }, {
    key: "time",
    label: "Time",
    w: 55
  }, {
    key: "patient",
    label: "Patient",
    w: 95
  }, {
    key: "med",
    label: "Medicine",
    w: 130
  }, {
    key: "status",
    label: "Status",
    w: 60
  }, {
    key: "reason",
    label: "Note",
    w: pageW - margin * 2 - (70 + 55 + 95 + 130 + 60)
  }];
  const drawHeader = () => {
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, y, pageW - margin * 2, 22, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    let cx = margin + 8;
    cols.forEach(c => {
      doc.text(c.label, cx, y + 15);
      cx += c.w;
    });
    y += 26;
  };
  drawHeader();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const sorted = [...rows].sort((a, b) => a.date + a.time < b.date + b.time ? 1 : -1);
  sorted.forEach(r => {
    if (y > 780) {
      doc.addPage();
      y = 56;
      drawHeader();
    }
    const med = medicines.find(m => m.id === r.medicineId);
    const pat = patients.find(p => p.id === r.patientId);
    const statusColor = r.status === "Taken" ? [5, 150, 105] : r.status === "Snoozed" ? [217, 119, 6] : [220, 38, 38];
    const cells = {
      date: fmtDateShort(r.date),
      time: fmtTime12(r.time),
      patient: pat ? pat.name : "—",
      med: med ? `${med.name}${med.strength && med.strength !== "N/A" ? " " + med.strength : ""}` : "—",
      status: r.status,
      reason: r.reason || (r.snoozeMin ? `+${r.snoozeMin}m` : "")
    };
    let cx = margin + 8;
    doc.setTextColor(51, 65, 85);
    cols.forEach(c => {
      if (c.key === "status") doc.setTextColor(...statusColor);else doc.setTextColor(51, 65, 85);
      const text = String(cells[c.key] || "").slice(0, c.key === "reason" ? 40 : 20);
      doc.text(text, cx, y);
      cx += c.w;
    });
    y += 16;
  });
  if (sorted.length === 0) {
    doc.setTextColor(148, 163, 184);
    doc.text("No dose activity recorded in this range.", margin + 8, y);
  }
  doc.save(`CareMate-Adherence-${patientLabel.replace(/\s+/g, "_")}-${todayStr()}.pdf`);
}
function useLocalState(key, initial) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch (e) {
      return initial;
    }
  });
  const prevValRef = useRef(val);
  const fetchedRef = useRef(false); // To avoid syncing back the initial fetch

  const tableMap = {
    cm_accounts: "accounts",
    cm_patients: "patients",
    cm_medicines: "medicines",
    cm_history: "history",
    cm_appointments: "appointments",
    cm_connreq: "connection_requests",
    cm_health: "health_records",
    cm_settings: "settings"
  };
  const tableName = tableMap[key];

  // Global Supabase client getter
  const getSupabase = () => {
    if (tableName && window.SUPABASE_URL && window.SUPABASE_URL !== "YOUR_SUPABASE_URL" && window.supabase) {
      if (!window.supabaseClient) {
        window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
      }
      return window.supabaseClient;
    }
    return null;
  };

  // Fetch from Supabase once on mount
  useEffect(() => {
    const supabase = getSupabase();
    if (supabase) {
      const fetchData = async () => {
        try {
          const {
            data,
            error
          } = await supabase.from(tableName).select('*');
          if (error) throw error;
          if (data && data.length > 0) {
            fetchedRef.current = true; // Flag that next render is from fetch
            setVal(tableName === "settings" ? data[0] : data);
            prevValRef.current = tableName === "settings" ? data[0] : data;
          }
        } catch (err) {
          console.error("Supabase fetch failed for", tableName, err);
        }
      };
      fetchData();
    }
  }, [tableName]);

  // Sync to Supabase in the background
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {}
    const supabase = getSupabase();
    if (supabase && !fetchedRef.current) {
      const syncData = async () => {
        try {
          // Handle Upserts
          if (Array.isArray(val) && val.length > 0) {
            await supabase.from(tableName).upsert(val, {
              onConflict: 'id'
            });
          } else if (!Array.isArray(val) && val && val.id) {
            await supabase.from(tableName).upsert([val], {
              onConflict: 'id'
            });
          }

          // Handle Deletes (only for arrays)
          const prevVal = prevValRef.current;
          if (Array.isArray(val) && Array.isArray(prevVal)) {
            const currentIds = new Set(val.map(item => item.id).filter(Boolean));
            const deletedItems = prevVal.filter(item => item.id && !currentIds.has(item.id));
            for (const deletedItem of deletedItems) {
              await supabase.from(tableName).delete().eq('id', deletedItem.id);
            }
          }
        } catch (err) {
          console.error("Supabase sync failed for", tableName, err);
        }
      };
      syncData();
    }

    // Clear the flag after skipping the sync for the initial fetch
    if (fetchedRef.current) {
      fetchedRef.current = false;
    } else {
      prevValRef.current = val;
    }
  }, [key, val, tableName]);
  return [val, setVal];
}
function toast(setToasts, msg, type = "success") {
  const id = uid();
  setToasts(t => [...t, {
    id,
    msg,
    type
  }]);
  setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3200);
}

/* =========================================================================
   SEED DATA — so the product is usable the instant it loads
   ========================================================================= */
function seedData() {
  const patientId = "p_asha";
  const patient2 = "p_ramesh";
  const medMorning = "m_amlodipine";
  const medNoon = "m_metformin";
  const medNight = "m_atorvastatin";
  const medRamesh = "m_donepezil";
  const demoCaregiverId = "acc_demo_caregiver";
  const demoPatientAccountId = "acc_demo_patient";
  const accounts = [{
    id: demoCaregiverId,
    name: "Rohan Verma",
    email: "demo.caregiver@caremate.app",
    password: "demo1234",
    role: "caregiver",
    careCode: "DEMO01"
  }, {
    id: demoPatientAccountId,
    name: "Asha Verma",
    loginId: "P-123456",
    password: "demo1234",
    role: "patient",
    patientId,
    isActive: true
  }];
  const patients = [{
    id: patientId,
    name: "Asha Verma",
    age: 68,
    gender: "Female",
    caregiverIds: [demoCaregiverId],
    photo: "",
    medicalNotes: "Hypertension, Type 2 Diabetes. No known drug allergies.",
    emergencyContacts: [{
      id: uid(),
      name: "Rohan Verma (Son)",
      phone: "+91 98200 11223",
      relation: "Family"
    }, {
      id: uid(),
      name: "Dr. Nalini Rao",
      phone: "+91 22 6612 4400",
      relation: "Doctor"
    }]
  }, {
    id: patient2,
    name: "Ramesh Iyer",
    age: 74,
    gender: "Male",
    caregiverIds: [demoCaregiverId],
    photo: "",
    medicalNotes: "Early-stage memory loss. Needs visual reminders.",
    emergencyContacts: [{
      id: uid(),
      name: "Meera Iyer (Daughter)",
      phone: "+91 98765 44110",
      relation: "Family"
    }]
  }];
  const medicines = [{
    id: medMorning,
    patientId,
    name: "Amlodipine",
    strength: "5mg",
    form: "Tablet",
    foodTiming: "After Food",
    times: ["08:00"],
    trackStock: true,
    stock: 18,
    minStock: 6,
    startDate: todayStr(),
    endDate: "",
    repeatDaily: true,
    photo: ""
  }, {
    id: medNoon,
    patientId,
    name: "Metformin",
    strength: "500mg",
    form: "Tablet",
    foodTiming: "After Food",
    times: ["14:00"],
    trackStock: true,
    stock: 4,
    minStock: 6,
    startDate: todayStr(),
    endDate: "",
    repeatDaily: true,
    photo: ""
  }, {
    id: medNight,
    patientId,
    name: "Atorvastatin",
    strength: "10mg",
    form: "Tablet",
    foodTiming: "Before Food",
    times: ["21:00"],
    trackStock: true,
    stock: 24,
    minStock: 6,
    startDate: todayStr(),
    endDate: "",
    repeatDaily: true,
    photo: ""
  }, {
    id: medRamesh,
    patientId: patient2,
    name: "Donepezil",
    strength: "5mg",
    form: "Tablet",
    foodTiming: "After Food",
    times: ["09:00", "20:00"],
    trackStock: true,
    stock: 3,
    minStock: 8,
    startDate: todayStr(),
    endDate: "",
    repeatDaily: true,
    photo: ""
  }];
  const days = nextDaysArr(7);
  const history = [];
  days.slice(0, 6).forEach((d, di) => {
    medicines.forEach(m => {
      m.times.forEach(t => {
        const roll = Math.random();
        const status = roll > 0.82 ? "Skipped" : roll > 0.7 ? "Snoozed" : "Taken";
        history.push({
          id: uid(),
          medicineId: m.id,
          patientId: m.patientId,
          date: d,
          time: t,
          status,
          timestamp: `${d}T${t}:00`,
          reason: status === "Skipped" ? "Forgot" : null
        });
      });
    });
  });

  // Seed one already-missed dose for today so Alerts & the dashboard have
  // real content to show immediately, without waiting on real wall-clock time.
  history.push({
    id: uid(),
    medicineId: medRamesh,
    patientId: patient2,
    date: todayStr(),
    time: "09:00",
    status: "Missed",
    timestamp: `${todayStr()}T09:00:00`,
    reason: null
  });
  const appointments = [{
    id: uid(),
    patientId,
    doctor: "Dr. Nalini Rao",
    hospital: "Sunrise Multispecialty Hospital",
    date: nextDaysArr(1)[0],
    time: "11:30",
    notes: "Routine BP & sugar check-up."
  }, {
    id: uid(),
    patientId: patient2,
    doctor: "Dr. Kapil Shah",
    hospital: "MindCare Neurology Clinic",
    date: nextDaysArr(1)[0],
    time: "16:00",
    notes: "Quarterly memory assessment."
  }];
  return {
    patients,
    medicines,
    history,
    appointments,
    accounts
  };
}

/* =========================================================================
   SIGNATURE ELEMENT — PulseRing: circular adherence progress with an
   animated heartbeat trace running along the ring. Reused at every scale:
   splash loader, patient hero, caregiver summary cards.
   ========================================================================= */
function PulseRing({
  size = 220,
  stroke = 16,
  pct = 0,
  color = "#2563EB",
  track = "#E2E8F0",
  label,
  sub,
  dark
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * clamp(pct, 0, 100) / 100;
  return /*#__PURE__*/React.createElement("div", {
    className: "relative inline-flex items-center justify-center",
    style: {
      width: size,
      height: size
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    className: "-rotate-90"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: dark ? "#1E293B" : track,
    strokeWidth: stroke,
    fill: "none"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: color,
    strokeWidth: stroke,
    fill: "none",
    strokeLinecap: "round",
    strokeDasharray: `${dash} ${c - dash}`,
    style: {
      transition: "stroke-dasharray 1s cubic-bezier(.16,1,.3,1)"
    }
  }), /*#__PURE__*/React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r: r,
    stroke: color,
    strokeWidth: 2,
    fill: "none",
    strokeLinecap: "round",
    strokeDasharray: `${dash} ${c - dash}`,
    opacity: "0.55",
    className: "heartbeat-trace"
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 flex flex-col items-center justify-center text-center px-4"
  }, label, sub));
}
function HeartbeatDivider({
  className = ""
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 200 24",
    className: className,
    preserveAspectRatio: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M0 12 H70 L78 3 L86 21 L94 12 L100 12 L108 3 L116 21 L124 12 H200",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
}

/* =========================================================================
   PRIMITIVES
   ========================================================================= */
function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  icon,
  iconRight,
  full,
  ...props
}) {
  const sizes = {
    sm: "h-10 px-4 text-sm gap-1.5",
    md: "h-13 px-6 text-[15px] gap-2",
    lg: "h-16 px-8 text-lg gap-2.5"
  };
  const sz = {
    sm: "h-10 px-4 text-sm gap-1.5",
    md: "h-[52px] px-6 text-[15px] gap-2",
    lg: "h-16 px-8 text-lg gap-2.5"
  }[size];
  const variants = {
    primary: "bg-gradient-to-b from-primary-500 to-primary-700 hover:from-primary-500 hover:to-primary-800 active:to-primary-900 text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_24px_-10px_rgba(37,99,235,0.55)] hover:shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_14px_28px_-10px_rgba(37,99,235,0.65)]",
    secondary: "bg-gradient-to-b from-secondary-400 to-secondary-600 hover:to-secondary-700 text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_24px_-10px_rgba(5,150,105,0.5)]",
    danger: "bg-gradient-to-b from-danger-500 to-danger-600 hover:to-danger-700 text-white shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_10px_24px_-10px_rgba(220,38,38,0.5)]",
    outline: "bg-white dark:bg-dcard border border-line dark:border-dline text-ink dark:text-slate-100 hover:border-primary-400 hover:text-primary-700 dark:hover:text-primary-300 shadow-softer",
    ghost: "bg-transparent text-ink dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5",
    subtlePrimary: "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100",
    subtleDanger: "bg-danger-50 dark:bg-danger-900/20 text-danger-600 hover:bg-danger-100"
  };
  return /*#__PURE__*/React.createElement("button", {
    className: `tsz inline-flex items-center justify-center rounded-2xl font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none ${sz} ${variants[variant]} ${full ? "w-full" : ""} ${className}`,
    ...props
  }, icon && /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: size === "lg" ? 22 : 19
  }), children, iconRight && /*#__PURE__*/React.createElement(Icon, {
    name: iconRight,
    size: 19
  }));
}
function IconButton({
  name,
  onClick,
  className = "",
  size = 20,
  label,
  variant = "ghost",
  active = false,
  type = "button",
  disabled = false
}) {
  const variants = {
    ghost: "hover:bg-slate-100 dark:hover:bg-white/10 text-muted",
    subtle: "bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-ink dark:text-slate-200",
    danger: "hover:bg-danger-50 dark:hover:bg-danger-900/20 text-danger-500"
  };
  // IMPORTANT: `type` defaults to "button" and is always forwarded explicitly.
  // Without this, a plain <button> with no type attribute defaults to
  // type="submit" — inside a <form> (like the login form's QR-scan camera
  // button) that turns an icon button into an accidental implicit submit
  // control, which is what was hijacking Enter-key login and popping the
  // scan screen instead of checking the password.
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    "aria-label": label,
    onClick: onClick,
    disabled: disabled,
    className: `w-11 h-11 inline-flex items-center justify-center rounded-xl transition-colors active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${active ? "bg-primary-50 text-primary-700" : variants[variant]} ${className}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: name,
    size: size
  }));
}
function Card({
  children,
  className = "",
  padded = true,
  onClick
}) {
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    className: `bg-white dark:bg-dcard border border-line/60 dark:border-dline rounded-2xl shadow-softer ${padded ? "p-5" : ""} ${onClick ? "cursor-pointer hover:shadow-soft hover:-translate-y-0.5 hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200" : ""} ${className}`
  }, children);
}
function Badge({
  children,
  tone = "slate"
}) {
  const tones = {
    slate: "bg-slate-100 dark:bg-white/10 text-muted",
    primary: "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300",
    secondary: "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-700 dark:text-secondary-300",
    warn: "bg-warn-50 dark:bg-warn-500/10 text-warn-600 dark:text-warn-400",
    danger: "bg-danger-50 dark:bg-danger-500/10 text-danger-600 dark:text-danger-400"
  };
  return /*#__PURE__*/React.createElement("span", {
    className: `tsz inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${tones[tone]}`
  }, children);
}
function EmptyState({
  icon = "package",
  title,
  sub,
  action
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col items-center justify-center text-center py-14 px-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-muted mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 28
  })), /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold text-ink dark:text-white mb-1"
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted max-w-xs mb-5"
  }, sub), action);
}
function Modal({
  open,
  onClose,
  title,
  children,
  maxW = "max-w-lg",
  footer
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 bg-slate-900/50 glass animate-scaleIn",
    onClick: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: `relative w-full ${maxW} bg-white dark:bg-dcard rounded-t-3xl sm:rounded-3xl shadow-lift max-h-[90vh] flex flex-col animate-slideUp sm:animate-scaleIn`
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-6 pt-6 pb-4 border-b border-line dark:border-dline shrink-0"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "tsz text-lg font-extrabold"
  }, title), /*#__PURE__*/React.createElement(IconButton, {
    name: "x",
    onClick: onClose,
    label: "Close"
  })), /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-5 overflow-y-auto"
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    className: "px-6 py-4 border-t border-line dark:border-dline flex gap-3 justify-end shrink-0"
  }, footer)));
}
function Field({
  label,
  children,
  hint,
  required
}) {
  return /*#__PURE__*/React.createElement("label", {
    className: "block mb-4"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tsz text-sm font-bold text-ink dark:text-slate-200 mb-1.5 block"
  }, label, required && /*#__PURE__*/React.createElement("span", {
    className: "text-danger-500"
  }, " *")), children, hint && /*#__PURE__*/React.createElement("span", {
    className: "tsz text-xs text-muted mt-1 block"
  }, hint));
}
const inputCls = "tsz w-full h-12 px-4 rounded-xl border-2 border-line dark:border-dline bg-white dark:bg-white/5 text-ink dark:text-white placeholder:text-slate-400 focus:border-primary-500 outline-none transition-colors";
function TextInput(props) {
  return /*#__PURE__*/React.createElement("input", {
    ...props,
    className: `${inputCls} ${props.className || ""}`
  });
}
function Select({
  children,
  className = "",
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `relative ${className.includes("!w-") ? className : "w-full"}`
  }, /*#__PURE__*/React.createElement("select", {
    ...props,
    className: `${inputCls} appearance-none pr-10 ${className}`
  }, children), /*#__PURE__*/React.createElement(Icon, {
    name: "chevronDown",
    size: 16,
    className: "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-muted"
  }));
}
function Textarea(props) {
  return /*#__PURE__*/React.createElement("textarea", {
    ...props,
    rows: props.rows || 3,
    className: `${inputCls} h-auto py-3 resize-none ${props.className || ""}`
  });
}
function Segmented({
  options,
  value,
  onChange,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `inline-flex p-1 bg-slate-100 dark:bg-white/5 rounded-xl ${className}`
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    onClick: () => onChange(o.value),
    className: `tsz px-4 h-10 rounded-lg text-sm font-bold transition-all ${value === o.value ? "bg-white dark:bg-dcard shadow-softer text-primary-700 dark:text-primary-300" : "text-muted hover:text-ink dark:hover:text-white"}`
  }, o.label)));
}
function Toggle({
  checked,
  onChange,
  label
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => onChange(!checked),
    "aria-pressed": checked,
    className: `relative w-14 h-8 rounded-full transition-colors shrink-0 ${checked ? "bg-primary-600" : "bg-slate-300 dark:bg-white/15"}`,
    "aria-label": label
  }, /*#__PURE__*/React.createElement("span", {
    className: `absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-6" : ""}`
  }));
}
function ToastHost({
  toasts
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center w-full px-4 pointer-events-none"
  }, toasts.map(t => /*#__PURE__*/React.createElement("div", {
    key: t.id,
    className: `animate-fadeUp pointer-events-auto max-w-sm w-full sm:w-auto flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-lift text-sm font-semibold text-white ${t.type === "error" ? "bg-danger-600" : t.type === "warn" ? "bg-warn-500" : "bg-ink"}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.type === "error" ? "alert" : "check",
    size: 17
  }), t.msg)));
}

/* =========================================================================
   SPLASH
   ========================================================================= */
function Splash({
  onDone
}) {
  const doneRef = useRef(false);
  const [leaving, setLeaving] = useState(false);
  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    setTimeout(onDone, 320); // let the fade-out play before switching screens
  };
  useEffect(() => {
    // Safety net: if the video fails to load/play for any reason, don't strand the user on the splash screen.
    const fallback = setTimeout(finish, 7000);
    return () => clearTimeout(fallback);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: `fixed inset-0 flex items-center justify-center overflow-hidden z-50 transition-opacity duration-300 ${leaving ? "opacity-0" : "opacity-100"}`,
    style: {
      background: "radial-gradient(circle at 50% 42%, #0d3268 0%, #082754 55%, #05162f 100%)"
    }
  }, /*#__PURE__*/React.createElement("video", {
    className: "absolute inset-0 w-full h-full object-cover pointer-events-none animate-fadeUp",
    style: {
      animationDuration: "500ms"
    },
    src: "assets/splash-intro.mp4",
    autoPlay: true,
    muted: true,
    playsInline: true,
    preload: "auto",
    disablePictureInPicture: true,
    disableRemotePlayback: true,
    controlsList: "nodownload nofullscreen noremoteplayback noplaybackrate",
    onEnded: finish,
    onError: finish
  }));
}

/* =========================================================================
   ONBOARDING
   ========================================================================= */
const ONBOARD_SLIDES = [{
  icon: "bell",
  title: "Never miss medicines again.",
  sub: "Large, unmistakable reminders for every dose — right on time, every time."
}, {
  icon: "users",
  title: "Stay connected with your loved ones.",
  sub: "Caregivers see what's happening in real time, wherever they are."
}, {
  icon: "heart",
  title: "Simple reminders. Peace of mind.",
  sub: "Built to be effortless for whoever needs it — parent, partner, or friend."
}];
function Onboarding({
  onDone
}) {
  const [i, setI] = useState(0);
  const slide = ONBOARD_SLIDES[i];
  const isLast = i === ONBOARD_SLIDES.length - 1;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 bg-canvas dark:bg-dcanvas flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-end p-5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onDone,
    className: "tsz text-sm font-bold text-muted hover:text-ink dark:hover:text-white px-3 py-2"
  }, "Skip")), /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex-1 flex flex-col items-center justify-center px-8 text-center animate-fadeUp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-28 h-28 rounded-3xl bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-300 mb-8"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: slide.icon,
    size: 54
  })), /*#__PURE__*/React.createElement("h2", {
    className: "tsz text-2xl sm:text-3xl font-extrabold max-w-sm leading-snug"
  }, slide.title), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-muted mt-3 max-w-xs"
  }, slide.sub)), /*#__PURE__*/React.createElement("div", {
    className: "p-8 pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mb-7"
  }, ONBOARD_SLIDES.map((_, idx) => /*#__PURE__*/React.createElement("span", {
    key: idx,
    className: `h-2 rounded-full transition-all ${idx === i ? "w-7 bg-primary-600" : "w-2 bg-line dark:bg-dline"}`
  }))), /*#__PURE__*/React.createElement(Button, {
    full: true,
    size: "lg",
    iconRight: "arrowLeft",
    className: "[&>svg]:rotate-180",
    onClick: () => isLast ? onDone() : setI(i + 1)
  }, isLast ? "Get Started" : "Continue")));
}

/* =========================================================================
   AUTH
   ========================================================================= */
function RememberMeCheckbox({
  checked,
  onChange
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => onChange(!checked),
    "aria-pressed": checked,
    className: "tsz flex items-center gap-2 text-sm font-semibold text-muted select-none"
  }, /*#__PURE__*/React.createElement("span", {
    className: `w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${checked ? "bg-primary-600 border-primary-600 text-white" : "border-line dark:border-dline"}`
  }, checked && /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 13,
    strokeWidth: 3
  })), "Remember me");
}
function Auth({
  accounts,
  onAuthed,
  onDemo,
  onResetPassword,
  onRequestOtp,
  onVerifyOtp,
  onResendOtp,
  onCancelOtp
}) {
  const [role, setRole] = useState("caregiver"); // caregiver | patient | self
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loginId, setLoginId] = useState("");
  const [careCode, setCareCode] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [forgot, setForgot] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // email | newpw
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotPw, setForgotPw] = useState("");
  const [forgotAccountId, setForgotAccountId] = useState(null);
  const [err, setErr] = useState("");
  const [scanning, setScanning] = useState(false);

  // Patient signup now requires a caregiver's care code, verified with an
  // OTP that lands in the caregiver's own account rather than connecting
  // instantly — see onRequestOtp/onVerifyOtp (wired up in App).
  const [otpRequestId, setOtpRequestId] = useState(null);
  const [otpCaregiverName, setOtpCaregiverName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [otpBusy, setOtpBusy] = useState(false);
  const resetOtpFlow = () => {
    if (otpRequestId && onCancelOtp) onCancelOtp(otpRequestId);
    setOtpRequestId(null);
    setOtpCaregiverName("");
    setOtpCode("");
    setOtpErr("");
  };

  // "Save login details" — remembers the last successful login per role
  // (locally, on this device only) and pre-fills the form next time.
  const [remembered, setRemembered] = useLocalState("cm_remember", {});
  const [rememberMe, setRememberMe] = useState(false);
  const prefilledRoleRef = useRef(null);
  useEffect(() => {
    if (mode !== "login") return;
    if (prefilledRoleRef.current === role) return; // don't stomp on what the person is actively typing
    prefilledRoleRef.current = role;
    const r = remembered[role];
    if (r) {
      if (role === "patient") setLoginId(r.loginId || "");else setEmail(r.email || "");
      setPw(r.password || "");
      setRememberMe(true);
    } else {
      setRememberMe(false);
    }
  }, [role, mode]);

  // Leaving patient-signup mid-OTP (switching role/mode) cancels the pending request.
  useEffect(() => {
    if (otpRequestId) resetOtpFlow();
  }, [role, mode]);
  const rememberLogin = acct => {
    // Written directly & synchronously (not via the useLocalState/useEffect
    // pair) because onAuthed() below navigates away from this screen in the
    // very same click, unmounting Auth before a state-driven effect would
    // ever get a chance to flush to localStorage.
    try {
      const raw = localStorage.getItem("cm_remember");
      const prev = raw ? JSON.parse(raw) : {};
      const next = {
        ...prev
      };
      if (rememberMe) {
        next[role] = role === "patient" ? {
          loginId: acct.loginId,
          password: acct.password
        } : {
          email: acct.email,
          password: acct.password
        };
      } else {
        delete next[role];
      }
      localStorage.setItem("cm_remember", JSON.stringify(next));
    } catch (e) {}
  };
  useEffect(() => {
    let scanner = null;
    if (scanning) {
      scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: {
          width: 250,
          height: 250
        }
      }, false);
      scanner.render(text => {
        setLoginId(text);
        setScanning(false);
        scanner.clear();
      }, err => {});
    }
    return () => {
      if (scanner) {
        try {
          scanner.clear();
        } catch (e) {}
      }
    };
  }, [scanning]);
  const submit = e => {
    e.preventDefault();
    setErr("");
    if (role === "patient") {
      if (mode === "login") {
        if (!loginId.trim() || !pw) {
          setErr("Enter Patient ID and password to continue.");
          return;
        }
        const acct = accounts.find(a => a.role === "patient" && !a.selfCare && a.loginId === loginId.trim().toUpperCase());
        if (!acct) {
          setErr("Patient ID not found.");
          return;
        }
        if ((acct.password || "").trim() !== pw.trim()) {
          setErr("Incorrect password.");
          return;
        }
        if (acct.isActive === false) {
          setErr("Login has been disabled by your caregiver.");
          return;
        }
        rememberLogin(acct);
        onAuthed(acct);
        return;
      }

      // patient signup — requires a caregiver's care code, verified by OTP
      if (!name.trim()) {
        setErr("Tell us your name to create your account.");
        return;
      }
      if (!pw) {
        setErr("Choose a password to protect your account.");
        return;
      }
      if (!careCode.trim()) {
        setErr("A caregiver's care code is required to create a patient account.");
        return;
      }
      setOtpBusy(true);
      const res = onRequestOtp(careCode, {
        signupName: name.trim()
      });
      setOtpBusy(false);
      if (!res.ok) {
        setErr(res.error);
        return;
      }
      setOtpRequestId(res.requestId);
      setOtpCaregiverName(res.caregiverName);
      setOtpCode("");
      setOtpErr("");
      return;
    }
    if (role === "self") {
      if (mode === "login") {
        if (!email.trim() || !pw) {
          setErr("Enter an email and password to continue.");
          return;
        }
        const acct = accounts.find(a => a.role === "patient" && a.selfCare && a.email && a.email.toLowerCase() === email.trim().toLowerCase());
        if (!acct) {
          setErr("No self-care account found with that email. Try signing up instead.");
          return;
        }
        if ((acct.password || "").trim() !== pw.trim()) {
          setErr("That password doesn't match this account.");
          return;
        }
        if (acct.isActive === false) {
          setErr("Login has been disabled.");
          return;
        }
        rememberLogin(acct);
        onAuthed(acct);
        return;
      }

      // self-care signup — one account that's both the caregiver and the patient
      if (!name.trim()) {
        setErr("Tell us your name to create your account.");
        return;
      }
      if (!email.trim() || !pw) {
        setErr("Enter an email and password to continue.");
        return;
      }
      if (accounts.find(a => a.email && a.email.toLowerCase() === email.trim().toLowerCase())) {
        setErr("An account already exists with that email.");
        return;
      }
      const newLoginId = "P-" + Math.random().toString(36).slice(2, 8).toUpperCase();
      onAuthed(null, {
        name: name.trim(),
        email: email.trim(),
        password: pw.trim(),
        role: "patient",
        loginId: newLoginId,
        selfCare: true,
        matchedCaregiverId: null
      });
      return;
    }
    if (!email.trim() || !pw) {
      setErr("Enter an email and password to continue.");
      return;
    }
    if (mode === "login") {
      const acct = accounts.find(a => a.role === "caregiver" && a.email && a.email.toLowerCase() === email.trim().toLowerCase());
      if (!acct) {
        setErr("No account found with that email. Try signing up instead.");
        return;
      }
      if ((acct.password || "").trim() !== pw.trim()) {
        setErr("That password doesn't match this account.");
        return;
      }
      rememberLogin(acct);
      onAuthed(acct);
      return;
    }
    if (!name.trim()) {
      setErr("Tell us your name to create your account.");
      return;
    }
    if (accounts.find(a => a.email && a.email.toLowerCase() === email.trim().toLowerCase())) {
      setErr("An account already exists with that email.");
      return;
    }
    onAuthed(null, {
      name: name.trim(),
      email: email.trim(),
      password: pw.trim(),
      role: "caregiver",
      careCode: genCareCode()
    });
  };
  const verifyOtpAndCreateAccount = () => {
    if (!otpCode.trim()) {
      setOtpErr("Enter the code.");
      return;
    }
    setOtpBusy(true);
    const res = onVerifyOtp(otpRequestId, otpCode);
    setOtpBusy(false);
    if (!res.ok) {
      setOtpErr(res.error);
      return;
    }
    const newLoginId = "P-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    onAuthed(null, {
      name: name.trim(),
      password: pw.trim(),
      role: "patient",
      loginId: newLoginId,
      matchedCaregiverId: res.caregiverId
    });
  };
  const resendOtp = () => {
    const newOtp = onResendOtp(otpRequestId);
    if (newOtp) {
      setOtpErr("");
      setOtpCode("");
    }
  };
  if (scanning) {
    return /*#__PURE__*/React.createElement("div", {
      className: "min-h-screen bg-canvas dark:bg-dcanvas flex flex-col p-6 items-center justify-center"
    }, /*#__PURE__*/React.createElement("h2", {
      className: "tsz text-2xl font-extrabold mb-4"
    }, "Scan QR Code"), /*#__PURE__*/React.createElement("div", {
      id: "reader",
      className: "w-full max-w-sm mb-6 bg-white rounded-xl overflow-hidden"
    }), /*#__PURE__*/React.createElement(Button, {
      onClick: () => setScanning(false),
      variant: "outline"
    }, "Cancel Scan"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen bg-canvas dark:bg-dcanvas flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-md w-full mx-auto px-6 pt-12 pb-8 flex-1 flex flex-col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 mb-2"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png",
    alt: "CareMate",
    className: "w-11 h-11 object-contain"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tsz text-xl font-extrabold"
  }, "CareMate")), /*#__PURE__*/React.createElement("h1", {
    className: "tsz text-2xl font-extrabold mb-1"
  }, "Welcome to CareMate"), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-muted mb-7"
  }, "Select your role to continue."), /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: role,
    onChange: v => {
      setRole(v);
      setErr("");
    },
    className: "w-full [&>button]:flex-1 [&>button]:px-2",
    options: [{
      value: "caregiver",
      label: "Caregiver"
    }, {
      value: "patient",
      label: "Patient"
    }, {
      value: "self",
      label: "I Care for Myself"
    }]
  }), role === "self" && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted mt-2.5 leading-relaxed"
  }, "One account that's both — manage your own medicines and get reminders, just like a patient, while having full caregiver-style control to add, edit, and track them yourself.")), forgot ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-5 mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setForgot(false);
      setForgotStep("email");
      setErr("");
    },
    className: "w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-muted"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowLeft",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, "Reset password")), role === "patient" ? /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-bold mb-1.5"
  }, "Ask your caregiver"), /*#__PURE__*/React.createElement("p", {
    className: "text-muted"
  }, "Your caregiver can view or reset your password any time from your profile in their app — just ask them for it. If you manage your own medicines without a caregiver connected, there's no independent recovery yet — you'll need to create a new account.")) : forgotStep === "email" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "Your account email",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "email",
    value: forgotEmail,
    onChange: e => setForgotEmail(e.target.value),
    placeholder: "you@example.com"
  })), err && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-danger-600 font-semibold mb-4 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 16
  }), err), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    full: true,
    onClick: () => {
      const acct = role === "self" ? accounts.find(a => a.role === "patient" && a.selfCare && a.email && a.email.toLowerCase() === forgotEmail.trim().toLowerCase()) : accounts.find(a => a.role === "caregiver" && a.email && a.email.toLowerCase() === forgotEmail.trim().toLowerCase());
      if (!acct) {
        setErr(role === "self" ? "No self-care account found with that email." : "No caregiver account found with that email.");
        return;
      }
      setErr("");
      setForgotAccountId(acct.id);
      setForgotStep("newpw");
    }
  }, "Continue")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted mb-4"
  }, "This is a self-hosted demo build with no email delivery, so instead of emailing a reset link, you can set a new password directly below."), /*#__PURE__*/React.createElement(Field, {
    label: "New password",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "password",
    value: forgotPw,
    onChange: e => setForgotPw(e.target.value),
    placeholder: "At least 4 characters"
  })), err && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-danger-600 font-semibold mb-4 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 16
  }), err), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    full: true,
    onClick: () => {
      if (forgotPw.trim().length < 4) {
        setErr("Password must be at least 4 characters.");
        return;
      }
      onResetPassword(forgotAccountId, forgotPw.trim());
      setEmail(forgotEmail);
      setPw("");
      setForgot(false);
      setForgotStep("email");
      setForgotPw("");
      setErr("");
    }
  }, "Set new password"))) : /*#__PURE__*/React.createElement("form", {
    onSubmit: submit
  }, role === "patient" && otpRequestId ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 mb-4 mt-2"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: resetOtpFlow,
    className: "w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-muted"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowLeft",
    size: 18
  })), /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, "Verify with ", otpCaregiverName)), /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-sm mb-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-muted"
  }, "A one-time code was generated in ", /*#__PURE__*/React.createElement("b", {
    className: "text-ink dark:text-white font-bold"
  }, otpCaregiverName, "'s"), " CareMate account (Settings → Care circle → Pending requests). Ask them for it and enter it below to finish creating your account.")), /*#__PURE__*/React.createElement(Field, {
    label: "6-digit code",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: otpCode,
    onChange: e => {
      setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6));
      setOtpErr("");
    },
    placeholder: "e.g. 482913",
    inputMode: "numeric",
    maxLength: 6,
    className: "text-lg font-bold tracking-[0.3em] text-center"
  })), otpErr && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-danger-600 font-semibold mb-4 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 16
  }), otpErr), /*#__PURE__*/React.createElement(Button, {
    type: "button",
    full: true,
    size: "lg",
    disabled: otpBusy,
    onClick: verifyOtpAndCreateAccount
  }, "Verify & Create Account"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: resendOtp,
    className: "tsz w-full text-center text-sm font-bold text-primary-600 dark:text-primary-400 mt-3"
  }, "Resend code")) : /*#__PURE__*/React.createElement(React.Fragment, null, role === "patient" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, "Patient ", mode === "login" ? "Login" : "Sign Up"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setMode(mode === "login" ? "signup" : "login");
      setErr("");
    },
    className: "text-primary-600 font-bold text-sm"
  }, mode === "login" ? "Create Account" : "Log In instead")), mode === "login" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "Patient ID",
    required: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: loginId,
    onChange: e => setLoginId(e.target.value),
    placeholder: "e.g. P-123456",
    className: "text-lg font-bold flex-1"
  }), /*#__PURE__*/React.createElement(IconButton, {
    type: "button",
    name: "camera",
    onClick: e => {
      e.preventDefault();
      setScanning(true);
    },
    className: "bg-primary-100 text-primary-700 shrink-0 h-12 w-12"
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "password",
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "Enter password"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4 -mt-2"
  }, /*#__PURE__*/React.createElement(RememberMeCheckbox, {
    checked: rememberMe,
    onChange: setRememberMe
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setForgot(true);
      setErr("");
    },
    className: "tsz text-primary-600 dark:text-primary-400 font-bold text-sm"
  }, "Forgot password?"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g. Asha Verma"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "password",
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "Create a password"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Caregiver's care code",
    required: true,
    hint: "Ask your caregiver for their care code — you'll need it to create a patient account."
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: careCode,
    onChange: e => setCareCode(e.target.value.toUpperCase()),
    placeholder: "e.g. 7QJ2KX",
    maxLength: 6
  })))) : role === "self" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, "I Care for Myself — ", mode === "login" ? "Login" : "Sign Up"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setMode(mode === "login" ? "signup" : "login");
      setErr("");
    },
    className: "text-primary-600 font-bold text-sm"
  }, mode === "login" ? "Create Account" : "Log In instead")), mode === "signup" && /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g. Priya Shah"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@example.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "password",
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "Enter password"
  })), mode === "login" && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4 -mt-2"
  }, /*#__PURE__*/React.createElement(RememberMeCheckbox, {
    checked: rememberMe,
    onChange: setRememberMe
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setForgot(true);
      setForgotEmail(email);
      setErr("");
    },
    className: "tsz text-primary-600 dark:text-primary-400 font-bold text-sm"
  }, "Forgot password?"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-between mb-4 mt-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-bold"
  }, "Caregiver ", mode === "login" ? "Login" : "Sign Up"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setMode(mode === "login" ? "signup" : "login"),
    className: "text-primary-600 font-bold text-sm"
  }, mode === "login" ? "Create Account" : "Log In instead")), mode === "signup" && /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "e.g. Rohan Verma"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Email",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "you@example.com"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Password",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "password",
    value: pw,
    onChange: e => setPw(e.target.value),
    placeholder: "Enter password"
  })), mode === "login" && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-4 -mt-2"
  }, /*#__PURE__*/React.createElement(RememberMeCheckbox, {
    checked: rememberMe,
    onChange: setRememberMe
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setForgot(true);
      setForgotEmail(email);
      setErr("");
    },
    className: "tsz text-primary-600 dark:text-primary-400 font-bold text-sm"
  }, "Forgot password?"))), err && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-danger-600 font-semibold mb-4 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 16
  }), err), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    full: true,
    size: "lg",
    disabled: otpBusy
  }, mode === "login" ? role === "patient" ? "Log In" : "Sign In" : role === "patient" ? "Send Code to Caregiver" : "Create Account"))), /*#__PURE__*/React.createElement("div", {
    className: "mt-10 pt-6 border-t border-line dark:border-dline text-center"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs font-bold text-muted uppercase tracking-wide mb-3"
  }, "Just exploring?"), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2.5 justify-center"
  }, /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "subtlePrimary",
    onClick: () => onDemo("caregiver")
  }, "Demo Caregiver"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "subtlePrimary",
    onClick: () => onDemo("patient")
  }, "Demo Patient")))));
}

/* =========================================================================
   APP SHELL — sidebar (desktop) + bottom tabs (mobile), theme-aware
   ========================================================================= */
const NAV_CAREGIVER = [{
  key: "dashboard",
  label: "Dashboard",
  icon: "home"
}, {
  key: "patients",
  label: "Patients",
  icon: "users"
}, {
  key: "history",
  label: "History",
  icon: "history"
}, {
  key: "alerts",
  label: "Alerts",
  icon: "bell"
}, {
  key: "appointments",
  label: "Visits",
  icon: "calendar"
}, {
  key: "health",
  label: "Health",
  icon: "activity"
}, {
  key: "settings",
  label: "Settings",
  icon: "settings"
}];
const NAV_PATIENT = [{
  key: "dashboard",
  label: "Home",
  icon: "home"
}, {
  key: "medicines",
  label: "Medicines",
  icon: "pill"
}, {
  key: "history",
  label: "History",
  icon: "history"
}, {
  key: "appointments",
  label: "Visits",
  icon: "calendar"
}, {
  key: "health",
  label: "Health",
  icon: "activity"
}, {
  key: "settings",
  label: "Settings",
  icon: "settings"
}];
function Topbar({
  user,
  onLogout,
  alertCount,
  onOpenAlerts,
  dark,
  setDark
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-30 bg-white/85 dark:bg-dcanvas/85 glass border-b border-line dark:border-dline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-16 px-4 sm:px-6 flex items-center justify-between max-w-7xl mx-auto"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 lg:hidden"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png",
    alt: "CareMate",
    className: "w-9 h-9 object-contain"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tsz font-extrabold"
  }, "CareMate")), /*#__PURE__*/React.createElement("div", {
    className: "hidden lg:block"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, onOpenAlerts && /*#__PURE__*/React.createElement("button", {
    onClick: onOpenAlerts,
    "aria-label": "Alerts",
    className: "relative w-9 h-9 rounded-xl hover:bg-slate-100 dark:hover:bg-white/10 flex items-center justify-center text-muted"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "bell",
    size: 19
  }), alertCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-danger-500 text-white text-[10px] font-extrabold flex items-center justify-center"
  }, alertCount > 9 ? "9+" : alertCount)), /*#__PURE__*/React.createElement(IconButton, {
    name: dark ? "sun" : "moon",
    onClick: () => setDark(!dark),
    label: "Toggle dark mode",
    variant: "subtle"
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-px h-6 bg-line dark:bg-dline mx-1"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 pl-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-9 h-9 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-white ring-2 ring-white dark:ring-dcanvas flex items-center justify-center font-extrabold text-sm shadow-sm"
  }, user.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:block leading-tight"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tsz text-sm font-bold"
  }, user.name), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-muted font-semibold capitalize"
  }, user.selfCare ? "Self-Care" : user.role))))));
}
function Sidebar({
  items,
  active,
  setActive,
  user,
  onLogout
}) {
  return /*#__PURE__*/React.createElement("aside", {
    className: "hidden lg:flex flex-col w-64 shrink-0 border-r border-line dark:border-dline h-screen sticky top-0 bg-white dark:bg-dcanvas"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-16 flex items-center gap-2.5 px-6 border-b border-line dark:border-dline"
  }, /*#__PURE__*/React.createElement("img", {
    src: "assets/logo.png",
    alt: "CareMate",
    className: "w-9 h-9 object-contain"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tsz font-extrabold text-lg"
  }, "CareMate")), /*#__PURE__*/React.createElement("nav", {
    className: "flex-1 px-3 py-5 space-y-1"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.key,
    onClick: () => setActive(it.key),
    className: `tsz w-full flex items-center gap-3 px-3.5 h-12 rounded-xl font-bold text-[15px] transition-colors ${active === it.key ? "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300" : "text-muted hover:bg-slate-50 dark:hover:bg-white/5 hover:text-ink dark:hover:text-white"}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 20
  }), it.label))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-t border-line dark:border-dline"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onLogout,
    className: "tsz w-full flex items-center gap-3 px-3.5 h-12 rounded-xl font-bold text-[15px] text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20 transition-colors"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "logout",
    size: 20
  }), "Log Out")));
}
function BottomTabs({
  items,
  active,
  setActive
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "absolute bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-dcanvas/95 glass border-t border-line dark:border-dline pb-[env(safe-area-inset-bottom)]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, items.map(it => /*#__PURE__*/React.createElement("button", {
    key: it.key,
    onClick: () => setActive(it.key),
    className: "flex-1 flex flex-col items-center gap-1 py-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.icon,
    size: 22,
    className: active === it.key ? "text-primary-600" : "text-slate-400"
  }), /*#__PURE__*/React.createElement("span", {
    className: `text-[11px] font-bold ${active === it.key ? "text-primary-600" : "text-slate-400"}`
  }, it.label)))));
}
function PageHeader({
  title,
  sub,
  right
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between gap-4 mb-6 flex-wrap"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "tsz text-2xl sm:text-[28px] font-extrabold tracking-tight"
  }, title), sub && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-muted mt-1"
  }, sub)), right && /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, right));
}

/* =========================================================================
   ADHERENCE HELPERS
   ========================================================================= */
function computeAdherence(history, patientId, date) {
  const rows = history.filter(h => (!patientId || h.patientId === patientId) && (!date || h.date === date));
  if (rows.length === 0) return {
    pct: 100,
    taken: 0,
    total: 0
  };
  const taken = rows.filter(h => h.status === "Taken").length;
  return {
    pct: Math.round(taken / rows.length * 100),
    taken,
    total: rows.length
  };
}
function isMedicineActiveOn(m, dateStr) {
  if (m.startDate && dateStr < m.startDate) return false;
  if (m.endDate && dateStr > m.endDate) return false;
  if (m.repeatDaily === false) return dateStr === (m.startDate || dateStr);
  return true;
}
function todaysScheduleFor(medicines, patientId, date, history) {
  const meds = medicines.filter(m => m.patientId === patientId && isMedicineActiveOn(m, date));
  const items = [];
  meds.forEach(m => m.times.forEach(t => {
    const rec = history.find(h => h.medicineId === m.id && h.date === date && h.time === t);
    items.push({
      med: m,
      time: t,
      status: rec ? rec.status : "Pending"
    });
  }));
  return items.sort((a, b) => toMin(a.time) - toMin(b.time));
}

/* =========================================================================
   CAREGIVER DASHBOARD
   ========================================================================= */
function CaregiverDashboard({
  data,
  go,
  openReminder,
  patientFilter,
  setPatientFilter
}) {
  const {
    patients,
    medicines,
    history
  } = data;
  const date = todayStr();
  // Scope stats to this caregiver's own patients only — `medicines`/`history` aren't
  // pre-filtered like `patients` is, so without this a caregiver would see counts
  // that include other caregivers' patients too.
  const myIds = new Set(patients.map(p => p.id));
  const scopedHistory = history.filter(h => myIds.has(h.patientId));
  const overall = computeAdherence(scopedHistory, null, date);
  const lowStock = medicines.filter(m => myIds.has(m.patientId) && m.trackStock && m.stock <= m.minStock);
  const missed = scopedHistory.filter(h => h.date === date && h.status === "Missed");
  const upcoming = useMemo(() => {
    const all = [];
    patients.forEach(p => todaysScheduleFor(medicines, p.id, date, history).forEach(it => {
      if (it.status === "Pending" || it.status === "Missed") all.push({
        ...it,
        patient: p
      });
    }));
    return all.sort((a, b) => toMin(a.time) - toMin(b.time)).slice(0, 6);
  }, [patients, medicines, history]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    title: `Good ${greeting()}, keep it up.`,
    sub: fmtDateLong(date),
    right: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      icon: "users",
      onClick: () => go("patients", {
        openAdd: true
      })
    }, "Add Patient"), patients.length > 0 && /*#__PURE__*/React.createElement(Button, {
      icon: "plus",
      onClick: () => go("patients", {
        openAddMed: true
      })
    }, "Add Medicine"))
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "xl:col-span-1 flex flex-col items-center text-center !p-6"
  }, /*#__PURE__*/React.createElement(PulseRing, {
    size: 126,
    stroke: 11,
    pct: overall.pct,
    color: "#2563EB",
    label: /*#__PURE__*/React.createElement("span", {
      className: "tsz font-mono-tab font-extrabold text-2xl -mt-1"
    }, overall.pct, "%"),
    sub: /*#__PURE__*/React.createElement("span", {
      className: "tsz text-[11px] font-bold text-muted mt-0.5"
    }, "TODAY")
  }), /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold mt-3"
  }, "Overall adherence"), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, overall.taken, " of ", overall.total, " doses logged")), /*#__PURE__*/React.createElement(StatCard, {
    icon: "users",
    tone: "primary",
    value: patients.length,
    label: "Patients",
    onClick: () => go("patients")
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "package",
    tone: "warn",
    value: lowStock.length,
    label: "Low stock alerts",
    onClick: () => go("history", {
      tab: "stock"
    })
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "bell",
    tone: "danger",
    value: missed.length,
    label: "Missed doses today",
    onClick: () => go("alerts")
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 xl:grid-cols-5 gap-4"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "xl:col-span-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "tsz font-extrabold text-lg"
  }, "Upcoming reminders"), /*#__PURE__*/React.createElement(Badge, {
    tone: "primary"
  }, upcoming.length, " pending")), /*#__PURE__*/React.createElement(HeartbeatDivider, {
    className: "w-16 h-4 text-primary-200 dark:text-primary-900 mb-3"
  }), upcoming.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "check",
    title: "All caught up",
    sub: "No pending reminders right now."
  }) : /*#__PURE__*/React.createElement("div", {
    className: "divide-y divide-line dark:divide-dline"
  }, upcoming.map((it, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    className: "py-3.5 flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-11 h-11 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 flex items-center justify-center shrink-0"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pill",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold truncate"
  }, it.med.name, " · ", it.med.strength), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, it.patient.name, " · ", fmtTime12(it.time))), it.status === "Missed" ? /*#__PURE__*/React.createElement(Badge, {
    tone: "danger"
  }, "Missed") : /*#__PURE__*/React.createElement(Badge, {
    tone: "slate"
  }, "Pending"))))), /*#__PURE__*/React.createElement(Card, {
    className: "xl:col-span-2"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "tsz font-extrabold text-lg mb-1"
  }, "Your patients"), /*#__PURE__*/React.createElement(HeartbeatDivider, {
    className: "w-16 h-4 text-primary-200 dark:text-primary-900 mb-3"
  }), /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, patients.map(p => {
    const adh = computeAdherence(history, p.id, date);
    return /*#__PURE__*/React.createElement("button", {
      key: p.id,
      onClick: () => go("patients", {
        view: p.id
      }),
      className: "w-full flex items-center gap-3.5 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors text-left"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-11 h-11 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-white flex items-center justify-center font-extrabold shrink-0 shadow-sm"
    }, p.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz font-bold truncate"
    }, p.name), /*#__PURE__*/React.createElement("p", {
      className: "tsz text-xs text-muted"
    }, p.age, " yrs · ", medicines.filter(m => m.patientId === p.id).length, " medicines")), /*#__PURE__*/React.createElement("span", {
      className: `tsz text-sm font-mono-tab font-extrabold ${adh.pct >= 80 ? "text-secondary-600" : adh.pct >= 50 ? "text-warn-600" : "text-danger-500"}`
    }, adh.pct, "%"));
  })))));
}
function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
}
function StatCard({
  icon,
  tone,
  value,
  label,
  onClick
}) {
  const tones = {
    primary: "bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-[0_10px_20px_-10px_rgba(37,99,235,0.55)]",
    warn: "bg-gradient-to-br from-warn-400 to-warn-600 text-white shadow-[0_10px_20px_-10px_rgba(217,119,6,0.5)]",
    danger: "bg-gradient-to-br from-danger-400 to-danger-600 text-white shadow-[0_10px_20px_-10px_rgba(220,38,38,0.5)]",
    secondary: "bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-[0_10px_20px_-10px_rgba(5,150,105,0.5)]"
  };
  return /*#__PURE__*/React.createElement(Card, {
    onClick: onClick,
    className: "flex flex-col justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${tones[tone]}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 21
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-mono-tab text-3xl font-extrabold leading-none"
  }, value), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted mt-1.5 font-medium"
  }, label)));
}

/* =========================================================================
   ADD / EDIT PATIENT MODAL
   ========================================================================= */
function PatientModal({
  open,
  onClose,
  onSave,
  initial
}) {
  const [f, setF] = useState(initial || {
    name: "",
    age: "",
    gender: "Female",
    medicalNotes: "",
    loginPassword: ""
  });
  useEffect(() => {
    setF(initial || {
      name: "",
      age: "",
      gender: "Female",
      medicalNotes: "",
      loginPassword: ""
    });
  }, [initial, open]);
  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });
  const [pwErr, setPwErr] = useState("");
  const submit = () => {
    if (!f.name || !f.age) return;
    if (!initial && f.loginPassword && f.loginPassword.length < 4) {
      setPwErr("Password must be at least 4 characters — or leave it blank for a random one.");
      return;
    }
    setPwErr("");
    onSave({
      ...f,
      age: Number(f.age)
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: initial ? "Edit patient" : "Add patient",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: submit
    }, initial ? "Save changes" : "Add patient"))
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Full name",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: f.name,
    onChange: set("name"),
    placeholder: "e.g. Asha Verma"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Age",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "number",
    value: f.age,
    onChange: set("age"),
    placeholder: "68"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Gender"
  }, /*#__PURE__*/React.createElement(Select, {
    value: f.gender,
    onChange: set("gender")
  }, /*#__PURE__*/React.createElement("option", null, "Female"), /*#__PURE__*/React.createElement("option", null, "Male"), /*#__PURE__*/React.createElement("option", null, "Other")))), /*#__PURE__*/React.createElement(Field, {
    label: "Medical notes",
    hint: "Conditions, allergies, or anything a caregiver should know."
  }, /*#__PURE__*/React.createElement(Textarea, {
    value: f.medicalNotes,
    onChange: set("medicalNotes"),
    placeholder: "e.g. Hypertension, no known allergies"
  })), !initial && /*#__PURE__*/React.createElement(Field, {
    label: "Login password",
    hint: "Optional — leave blank and we'll generate a random one you can view anytime from their profile."
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "text",
    value: f.loginPassword,
    onChange: set("loginPassword"),
    placeholder: "e.g. their choice of password"
  }), pwErr && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-danger-600 font-semibold mt-1.5"
  }, pwErr)));
}

/* =========================================================================
   COMPLETE PROFILE — shown once, right after a patient signs up, so the
   account isn't left with a blank/placeholder profile.
   ========================================================================= */
function CompleteProfileModal({
  open,
  patient,
  onSave
}) {
  const [f, setF] = useState({
    age: "",
    gender: "Female",
    medicalNotes: ""
  });
  useEffect(() => {
    if (open) setF({
      age: "",
      gender: "Female",
      medicalNotes: ""
    });
  }, [open]);
  if (!open || !patient) return null;
  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });
  const submit = () => {
    if (!f.age) return;
    onSave({
      name: patient.name,
      age: Number(f.age),
      gender: f.gender,
      medicalNotes: f.medicalNotes
    });
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: () => {},
    title: "Welcome — let's finish your profile",
    footer: /*#__PURE__*/React.createElement(Button, {
      full: true,
      onClick: submit,
      disabled: !f.age
    }, "Save and continue")
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-muted mb-5"
  }, "Just a couple of details so your reminders and records are accurate, ", patient.name.split(" ")[0], "."), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Age",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "number",
    value: f.age,
    onChange: set("age"),
    placeholder: "e.g. 68"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Gender"
  }, /*#__PURE__*/React.createElement(Select, {
    value: f.gender,
    onChange: set("gender")
  }, /*#__PURE__*/React.createElement("option", null, "Female"), /*#__PURE__*/React.createElement("option", null, "Male"), /*#__PURE__*/React.createElement("option", null, "Other")))), /*#__PURE__*/React.createElement(Field, {
    label: "Medical notes",
    hint: "Optional — conditions or allergies worth having on record."
  }, /*#__PURE__*/React.createElement(Textarea, {
    value: f.medicalNotes,
    onChange: set("medicalNotes"),
    placeholder: "e.g. Hypertension, no known allergies"
  })));
}

/* =========================================================================
   ADD / EDIT MEDICINE MODAL
   ========================================================================= */
const emptyMed = {
  name: "",
  strength: "",
  form: "Tablet",
  foodTiming: "After Food",
  times: ["08:00"],
  trackStock: true,
  stock: "",
  minStock: "5",
  startDate: todayStr(),
  endDate: "",
  repeatDaily: true
};
function parsePrescriptionText(text) {
  const lines = text.split("\n").map(l => l.replace(/[^\w.%\-\s]/g, " ").replace(/\s+/g, " ").trim()).filter(Boolean);
  const strengthRe = /(\d+(?:\.\d+)?)\s?(mg|mcg|ml|g|iu|%)\b/i;
  let name = "",
    strength = "";
  for (const line of lines) {
    const m = line.match(strengthRe);
    if (m) {
      strength = `${m[1]}${m[2].toLowerCase()}`;
      const before = line.slice(0, m.index).trim();
      if (before.length >= 2) {
        name = before;
        break;
      }
    }
  }
  if (!name) {
    // Fall back to the first reasonably word-like line as a name guess.
    const candidate = lines.find(l => /[a-zA-Z]{3,}/.test(l) && l.length <= 40);
    if (candidate) name = candidate.replace(strengthRe, "").trim();
  }
  // Title-case the guess so it doesn't look like shouted OCR output.
  name = name.replace(/\b\w+/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()).trim();
  return {
    name,
    strength
  };
}
function MedicineModal({
  open,
  onClose,
  onSave,
  initial,
  patientName,
  availablePatients = []
}) {
  const [f, setF] = useState(initial || emptyMed);
  const [scanning, setScanning] = useState(false);
  const [scanText, setScanText] = useState("");
  const [scanApplied, setScanApplied] = useState(false);
  const fileInputRef = useRef(null);
  useEffect(() => {
    let startState = initial || emptyMed;
    // Back-compat: medicines saved before stock-tracking became optional don't have this
    // flag set — infer "on" for them if they already carry a stock number, so existing
    // tracked stock doesn't silently disappear.
    if (startState.trackStock === undefined) {
      startState = {
        ...startState,
        trackStock: startState.stock !== undefined && startState.stock !== null && startState.stock !== ""
      };
    }
    if (!initial && availablePatients.length === 1 && !startState.patientId) {
      startState = {
        ...startState,
        patientId: availablePatients[0].id
      };
    }
    setF(startState);
    setScanText("");
    setScanApplied(false);
    setScanning(false);
  }, [initial, open, availablePatients]);
  const handleScanFile = async e => {
    const file = e.target.files && e.target.files[0];
    e.target.value = ""; // allow re-selecting the same file later
    if (!file) return;
    if (!window.Tesseract) {
      alert("The prescription scanner hasn't finished loading yet — please try again in a moment.");
      return;
    }
    setScanning(true);
    setScanApplied(false);
    try {
      const {
        data
      } = await window.Tesseract.recognize(file, "eng");
      const text = (data && data.text || "").trim();
      setScanText(text);
      const {
        name,
        strength
      } = parsePrescriptionText(text);
      if (name || strength) {
        setF(prev => ({
          ...prev,
          name: name || prev.name,
          strength: strength || prev.strength
        }));
        setScanApplied(true);
      }
    } catch (err) {
      setScanText("Couldn't read that photo — try a clearer, well-lit shot of the label.");
    } finally {
      setScanning(false);
    }
  };
  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });
  const setTime = (i, val) => {
    const times = [...f.times];
    times[i] = val;
    setF({
      ...f,
      times
    });
  };
  const addTime = () => setF({
    ...f,
    times: [...f.times, "12:00"]
  });
  const removeTime = i => setF({
    ...f,
    times: f.times.filter((_, idx) => idx !== i)
  });
  const submit = () => {
    if (!f.name || f.trackStock && !f.stock || !patientName && availablePatients.length > 0 && !f.patientId) return;
    onSave({
      ...f,
      strength: (f.strength || "").trim() || "N/A",
      trackStock: !!f.trackStock,
      stock: f.trackStock ? Number(f.stock) : null,
      minStock: f.trackStock ? Number(f.minStock || 5) : null
    });
  };
  const unitStr = f.form === "Syrup" ? "mL" : f.form === "Injection" ? "units" : f.form === "Drop" ? "drops" : "tablets/caps";
  const canSubmit = !!f.name && (!f.trackStock || !!f.stock) && !(!patientName && availablePatients.length > 0 && !f.patientId);
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: initial ? "Edit medicine" : `Add medicine${patientName ? ` for ${patientName}` : ""}`,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      disabled: !canSubmit,
      onClick: submit
    }, initial ? "Save changes" : "Add medicine"))
  }, !patientName && availablePatients.length > 0 && /*#__PURE__*/React.createElement(Field, {
    label: "Select Patient",
    required: true
  }, /*#__PURE__*/React.createElement(Select, {
    value: f.patientId || "",
    onChange: set("patientId")
  }, /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, "-- Choose a patient --"), availablePatients.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.name)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mb-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-500 flex items-center justify-center shrink-0 relative overflow-hidden"
  }, scanning ? /*#__PURE__*/React.createElement("span", {
    className: "w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"
  }) : /*#__PURE__*/React.createElement(Icon, {
    name: "camera",
    size: 26
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold text-sm"
  }, "Scan a prescription label"), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, "Optional — snap a photo and we'll try to read the name & strength for you.")), /*#__PURE__*/React.createElement("input", {
    ref: fileInputRef,
    type: "file",
    accept: "image/*",
    capture: "environment",
    className: "hidden",
    onChange: handleScanFile
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    icon: "scan",
    onClick: () => fileInputRef.current && fileInputRef.current.click(),
    disabled: scanning
  }, scanning ? "Reading…" : "Scan")), scanText && /*#__PURE__*/React.createElement("div", {
    className: `mb-5 p-3 rounded-xl text-xs ${scanApplied ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-800 dark:text-secondary-300" : "bg-slate-50 dark:bg-white/5 text-muted"}`
  }, scanApplied ? /*#__PURE__*/React.createElement("span", {
    className: "font-semibold flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 14
  }), "Pre-filled name & strength below from the photo — please double-check them.") : /*#__PURE__*/React.createElement("span", null, scanText.length > 140 ? scanText.slice(0, 140) + "…" : scanText || "Couldn't confidently read a name or strength from that photo — please fill them in manually.")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Medicine name",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: f.name,
    onChange: set("name"),
    placeholder: "e.g. Metformin"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Strength",
    hint: "Optional — leave blank for N/A"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: f.strength,
    onChange: set("strength"),
    placeholder: "e.g. 500mg"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Dosage form"
  }, /*#__PURE__*/React.createElement(Select, {
    value: f.form,
    onChange: set("form")
  }, /*#__PURE__*/React.createElement("option", null, "Tablet"), /*#__PURE__*/React.createElement("option", null, "Capsule"), /*#__PURE__*/React.createElement("option", null, "Injection"), /*#__PURE__*/React.createElement("option", null, "Syrup"), /*#__PURE__*/React.createElement("option", null, "Drop"), /*#__PURE__*/React.createElement("option", null, "Inhaler"))), /*#__PURE__*/React.createElement(Field, {
    label: "Instructions"
  }, /*#__PURE__*/React.createElement(Select, {
    value: f.foodTiming,
    onChange: set("foodTiming")
  }, /*#__PURE__*/React.createElement("option", null, "Before Food"), /*#__PURE__*/React.createElement("option", null, "After Food"), /*#__PURE__*/React.createElement("option", null, "With Food"), /*#__PURE__*/React.createElement("option", null, "Anytime")))), /*#__PURE__*/React.createElement(Field, {
    label: "Reminder times",
    required: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "space-y-2"
  }, f.times.map((t, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "time",
    value: t,
    onChange: e => setTime(i, e.target.value)
  }), f.times.length > 1 && /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    variant: "danger",
    onClick: () => removeTime(i),
    label: "Remove time"
  })))), /*#__PURE__*/React.createElement("button", {
    onClick: addTime,
    className: "tsz text-sm font-bold text-primary-600 mt-2 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "plus",
    size: 15
  }), "Add another time")), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Start date"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "date",
    value: f.startDate,
    onChange: set("startDate")
  })), /*#__PURE__*/React.createElement(Field, {
    label: "End date",
    hint: "Leave blank for ongoing"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "date",
    value: f.endDate,
    onChange: set("endDate")
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3 mt-1 mb-4 p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border-2 border-line dark:border-dline"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm font-bold"
  }, "Track stock for this medicine"), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted mt-0.5"
  }, "Optional — turn off if you don't want to log quantity or get low-stock alerts.")), /*#__PURE__*/React.createElement(Toggle, {
    checked: !!f.trackStock,
    onChange: v => setF({
      ...f,
      trackStock: v
    }),
    label: "Track stock"
  })), f.trackStock && /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: `Current stock (${unitStr})`,
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "number",
    value: f.stock,
    onChange: set("stock"),
    placeholder: "30"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Low-stock alert at"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "number",
    value: f.minStock,
    onChange: set("minStock"),
    placeholder: "5"
  }))), /*#__PURE__*/React.createElement("label", {
    className: "flex items-center gap-3 mt-1 cursor-pointer"
  }, /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    checked: f.repeatDaily,
    onChange: e => setF({
      ...f,
      repeatDaily: e.target.checked
    }),
    className: "w-5 h-5 rounded accent-primary-600"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tsz text-sm font-semibold"
  }, "Repeat daily")));
}

/* =========================================================================
   EMERGENCY CONTACTS — lives on the patient's own profile card so it's
   always unambiguous which patient it belongs to.
   ========================================================================= */
function EmergencyContactsCard({
  patient,
  canEdit,
  onSave
}) {
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({
    name: "",
    phone: "",
    relation: "Family"
  });
  const contacts = patient.emergencyContacts || [];
  const addContact = () => {
    if (!f.name || !f.phone) return;
    onSave([...contacts, {
      id: uid(),
      ...f
    }]);
    setF({
      name: "",
      phone: "",
      relation: "Family"
    });
    setAdding(false);
  };
  const removeContact = id => onSave(contacts.filter(c => c.id !== id));
  return /*#__PURE__*/React.createElement(Card, {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between mb-1"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "tsz font-extrabold text-lg"
  }, "Emergency contacts"), canEdit && !adding && /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    icon: "plus",
    onClick: () => setAdding(true)
  }, "Add")), contacts.length === 0 && !adding && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted py-2"
  }, canEdit ? "No emergency contacts yet — add someone to call in a hurry." : "No emergency contacts on file yet."), /*#__PURE__*/React.createElement("div", {
    className: "divide-y divide-line dark:divide-dline"
  }, contacts.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.id,
    className: "flex items-center justify-between py-3 first:pt-3"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold text-sm"
  }, c.name), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, c.relation, " · ", c.phone)), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement("a", {
    href: `tel:${c.phone.replace(/\s/g, "")}`
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "phone",
    variant: "subtle",
    label: "Call"
  })), /*#__PURE__*/React.createElement("a", {
    href: `sms:${c.phone.replace(/\s/g, "")}`
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "message",
    variant: "subtle",
    label: "Message"
  })), canEdit && /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    variant: "danger",
    onClick: () => removeContact(c.id),
    label: "Remove"
  }))))), adding && /*#__PURE__*/React.createElement("div", {
    className: "pt-4 mt-2 border-t border-line dark:border-dline space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: f.name,
    onChange: e => setF({
      ...f,
      name: e.target.value
    }),
    placeholder: "Name"
  }), /*#__PURE__*/React.createElement(Select, {
    value: f.relation,
    onChange: e => setF({
      ...f,
      relation: e.target.value
    })
  }, /*#__PURE__*/React.createElement("option", null, "Family"), /*#__PURE__*/React.createElement("option", null, "Doctor"), /*#__PURE__*/React.createElement("option", null, "Friend"), /*#__PURE__*/React.createElement("option", null, "Neighbour"))), /*#__PURE__*/React.createElement(TextInput, {
    value: f.phone,
    onChange: e => setF({
      ...f,
      phone: e.target.value
    }),
    placeholder: "Phone number"
  }), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 justify-end"
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "ghost",
    size: "sm",
    onClick: () => setAdding(false)
  }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: addContact,
    disabled: !f.name || !f.phone
  }, "Save contact"))));
}
function QRCodeDialog({
  patient,
  accounts,
  actions
}) {
  const account = accounts.find(a => a.patientId === patient.id);
  const [open, setOpen] = useState(false);
  const [qrState, setQrState] = useState("loading"); // loading | success | error
  const [customPw, setCustomPw] = useState("");
  const canvasRef = useRef(null);
  const generateQR = useCallback(() => {
    if (!account) return;
    setQrState("loading");
    setTimeout(() => {
      try {
        if (canvasRef.current) {
          QRCode.toCanvas(canvasRef.current, account.loginId, {
            width: 200
          }, function (error) {
            if (error) {
              setQrState("error");
              console.error(error);
            } else setQrState("success");
          });
        } else {
          setQrState("error");
        }
      } catch (e) {
        setQrState("error");
      }
    }, 150); // increased timeout to allow Modal animation to finish mounting DOM
  }, [account]);
  useEffect(() => {
    if (open) {
      generateQR();
      setCustomPw("");
    }
  }, [open, generateQR]);
  if (!account) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
    variant: "subtlePrimary",
    icon: "camera",
    onClick: () => setOpen(true)
  }, "Login QR"), /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: () => setOpen(false),
    title: "Patient Login"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mb-4 min-h-[200px] items-center bg-slate-50 dark:bg-slate-900/50 rounded-xl relative"
  }, qrState === "loading" && /*#__PURE__*/React.createElement("div", {
    className: "absolute animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"
  }), qrState === "error" && /*#__PURE__*/React.createElement("div", {
    className: "absolute flex flex-col items-center"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 24,
    className: "text-danger-500 mb-2"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-sm text-muted mb-2"
  }, "QR generation failed"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: generateQR
  }, "Retry")), /*#__PURE__*/React.createElement("canvas", {
    ref: canvasRef,
    className: qrState === "success" ? "opacity-100 transition-opacity" : "opacity-0"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mb-2"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-center font-mono font-bold text-lg"
  }, "ID: ", account.loginId), /*#__PURE__*/React.createElement(IconButton, {
    name: "layers",
    size: 16,
    onClick: () => navigator.clipboard.writeText(account.loginId),
    label: "Copy ID"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-2 mb-4"
  }, /*#__PURE__*/React.createElement("p", {
    className: "text-center text-sm text-muted"
  }, "Password: ", account.password), /*#__PURE__*/React.createElement(IconButton, {
    name: "layers",
    size: 16,
    onClick: () => navigator.clipboard.writeText(account.password),
    label: "Copy Password"
  })), /*#__PURE__*/React.createElement("div", {
    className: "mt-6 flex flex-col gap-3"
  }, /*#__PURE__*/React.createElement(Button, {
    full: true,
    variant: account.isActive === false ? 'primary' : 'outline',
    onClick: () => {
      actions.togglePatientAccess(account.id);
    }
  }, account.isActive === false ? 'Enable Login' : 'Disable Login'), /*#__PURE__*/React.createElement("div", {
    className: "pt-3 border-t border-line dark:border-dline"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Set a new password",
    hint: "Type your own, or leave blank and press Generate for a random one."
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: customPw,
    onChange: e => setCustomPw(e.target.value),
    placeholder: "New password"
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    onClick: () => {
      actions.resetPatientPassword(account.id, customPw.trim() || null);
      setCustomPw("");
    }
  }, customPw.trim() ? "Set" : "Generate")))))));
}
function PatientsView({
  data,
  accounts,
  actions,
  role,
  activeId,
  setActiveId,
  autoOpenAdd,
  autoOpenAddMed,
  clearAuto,
  go
}) {
  const {
    patients,
    medicines,
    history,
    appointments
  } = data;
  const [patientModal, setPatientModal] = useState(null); // null closed, {} add, {...} edit
  const [medModal, setMedModal] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [showPw, setShowPw] = useState(false);
  useEffect(() => {
    if (autoOpenAdd) {
      setPatientModal({});
      clearAuto();
    }
  }, [autoOpenAdd]);
  useEffect(() => {
    if (autoOpenAddMed) {
      setMedModal({});
      clearAuto();
    }
  }, [autoOpenAddMed]);
  useEffect(() => {
    setShowPw(false);
  }, [activeId]);
  const patient = patients.find(p => p.id === activeId);
  if (role === "caregiver" && !patient) {
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
      title: "Patients",
      sub: `${patients.length} people in your care`,
      right: /*#__PURE__*/React.createElement(React.Fragment, null, patients.length > 0 && /*#__PURE__*/React.createElement(Button, {
        variant: "outline",
        icon: "plus",
        onClick: () => setMedModal({})
      }, "Add Medicine"), /*#__PURE__*/React.createElement(Button, {
        icon: "plus",
        onClick: () => setPatientModal({})
      }, "Add Patient"))
    }), patients.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
      icon: "users",
      title: "No patients yet",
      sub: "Add the first person you're caring for to start tracking their medicines.",
      action: /*#__PURE__*/React.createElement(Button, {
        icon: "plus",
        onClick: () => setPatientModal({})
      }, "Add Patient")
    }) : /*#__PURE__*/React.createElement("div", {
      className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
    }, patients.map(p => {
      const adh = computeAdherence(history, p.id, todayStr());
      const meds = medicines.filter(m => m.patientId === p.id);
      const low = meds.filter(m => m.trackStock && m.stock <= m.minStock).length;
      return /*#__PURE__*/React.createElement(Card, {
        key: p.id,
        onClick: () => setActiveId(p.id)
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-start justify-between"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "w-12 h-12 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-sm flex items-center justify-center font-extrabold"
      }, p.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
        className: "tsz font-extrabold"
      }, p.name), /*#__PURE__*/React.createElement("p", {
        className: "tsz text-xs text-muted"
      }, p.age, " yrs · ", p.gender))), /*#__PURE__*/React.createElement("span", {
        className: `tsz text-sm font-mono-tab font-extrabold ${adh.pct >= 80 ? "text-secondary-600" : adh.pct >= 50 ? "text-warn-600" : "text-danger-500"}`
      }, adh.pct, "%")), /*#__PURE__*/React.createElement("div", {
        className: "flex items-center gap-2 mt-4"
      }, /*#__PURE__*/React.createElement(Badge, {
        tone: "primary"
      }, meds.length, " medicines"), low > 0 && /*#__PURE__*/React.createElement(Badge, {
        tone: "warn"
      }, low, " low stock")));
    })), /*#__PURE__*/React.createElement(PatientModal, {
      open: !!patientModal,
      onClose: () => setPatientModal(null),
      initial: patientModal && patientModal.id ? patientModal : null,
      onSave: f => {
        actions.savePatient(f);
        setPatientModal(null);
      }
    }), /*#__PURE__*/React.createElement(MedicineModal, {
      open: !!medModal,
      onClose: () => setMedModal(null),
      availablePatients: patients,
      initial: medModal && medModal.id ? medModal : null,
      onSave: f => {
        actions.saveMedicine(f);
        setMedModal(null);
      }
    }));
  }

  // Detail (patient's own medicines) — used by both roles
  const meds = medicines.filter(m => m.patientId === (patient ? patient.id : activeId));
  const canEditMeds = role === "caregiver" || role === "patient" && patient && !(patient.caregiverIds && patient.caregiverIds.length);
  const patientAccount = role === "caregiver" && patient ? accounts.find(a => a.patientId === patient.id) : null;
  return /*#__PURE__*/React.createElement("div", null, role === "caregiver" && /*#__PURE__*/React.createElement("button", {
    onClick: () => setActiveId(null),
    className: "tsz flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink dark:hover:text-white mb-4"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrowLeft",
    size: 16
  }), "All patients"), patient && /*#__PURE__*/React.createElement(Card, {
    className: "mb-6 !p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-sm flex items-center justify-center font-extrabold text-xl"
  }, patient.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    className: "tsz text-xl font-extrabold"
  }, patient.name), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted"
  }, patient.age, " yrs · ", patient.gender), role === "caregiver" && patientAccount && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap items-center gap-2 mt-1.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard.writeText(patientAccount.loginId);
    },
    className: "tsz inline-flex items-center gap-1.5 text-xs font-mono-tab font-bold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "layers",
    size: 12
  }), "Patient ID: ", patientAccount.loginId), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      navigator.clipboard.writeText(patientAccount.password);
    },
    className: "tsz inline-flex items-center gap-1.5 text-xs font-mono-tab font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-white/10 px-2.5 py-1 rounded-full hover:bg-slate-200 dark:hover:bg-white/15 transition-colors"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lock",
    size: 12
  }), "Password: ", showPw ? patientAccount.password : "•".repeat(Math.max(patientAccount.password.length, 6))), /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      setShowPw(s => !s);
    },
    "aria-label": showPw ? "Hide password" : "Show password",
    className: "w-6 h-6 rounded-full flex items-center justify-center text-muted hover:text-ink dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: showPw ? "eyeOff" : "eye",
    size: 13
  }))))), (role === "caregiver" || canEditMeds) && /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2"
  }, role === "caregiver" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(QRCodeDialog, {
    patient: patient,
    accounts: accounts,
    actions: actions
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    icon: "edit",
    onClick: () => setPatientModal(patient)
  }, "Edit")), canEditMeds && /*#__PURE__*/React.createElement(Button, {
    icon: "plus",
    onClick: () => setMedModal({})
  }, "Add Medicine"))), role === "patient" && !(patient.caregiverIds && patient.caregiverIds.length) && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-4 border-t border-line dark:border-dline flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 17,
    className: "text-primary-500 mt-0.5 shrink-0"
  }), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted"
  }, "You're managing your own medicines solo. ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    onClick: e => {
      e.preventDefault();
      go && go("settings");
    },
    className: "text-primary-600 dark:text-primary-400 font-bold"
  }, "Connect a caregiver"), " from Settings any time so someone can keep an eye on your progress.")), patient.medicalNotes && /*#__PURE__*/React.createElement("div", {
    className: "mt-4 pt-4 border-t border-line dark:border-dline flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "stethoscope",
    size: 17,
    className: "text-muted mt-0.5 shrink-0"
  }), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted"
  }, patient.medicalNotes))), patient && /*#__PURE__*/React.createElement(EmergencyContactsCard, {
    patient: patient,
    canEdit: canEditMeds,
    onSave: contacts => actions.savePatient({
      id: patient.id,
      emergencyContacts: contacts
    })
  }), /*#__PURE__*/React.createElement("h3", {
    className: "tsz font-extrabold text-lg mb-3"
  }, "Medicines"), meds.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "pill",
    title: "No medicines added",
    sub: canEditMeds ? "Add the first medicine to start reminders." : "Your caregiver hasn't added any medicines yet.",
    action: canEditMeds && /*#__PURE__*/React.createElement(Button, {
      icon: "plus",
      onClick: () => setMedModal({})
    }, "Add Medicine")
  }) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, meds.map(m => /*#__PURE__*/React.createElement(Card, {
    key: m.id
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 flex items-center justify-center shrink-0"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pill",
    size: 22
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-extrabold"
  }, m.name), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, m.strength, " · ", m.form, " · ", m.foodTiming))), canEditMeds && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-1"
  }, /*#__PURE__*/React.createElement(IconButton, {
    name: "edit",
    size: 17,
    onClick: () => setMedModal(m),
    label: "Edit"
  }), /*#__PURE__*/React.createElement(IconButton, {
    name: "trash",
    size: 17,
    variant: "danger",
    onClick: () => setConfirmDel(m),
    label: "Delete"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5 mt-3.5"
  }, m.times.map(t => /*#__PURE__*/React.createElement(Badge, {
    key: t,
    tone: "primary"
  }, fmtTime12(t)))), m.trackStock ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "mt-3.5 flex items-center justify-between text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tsz text-muted font-semibold"
  }, "Stock remaining"), /*#__PURE__*/React.createElement("span", {
    className: `tsz font-mono-tab font-extrabold ${m.stock <= m.minStock ? "text-danger-500" : "text-ink dark:text-white"}`
  }, m.stock, " tabs")), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-2 bg-slate-100 dark:bg-white/10 rounded-full mt-1.5 overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: `h-full rounded-full ${m.stock <= m.minStock ? "bg-danger-500" : "bg-secondary-500"}`,
    style: {
      width: `${clamp(m.stock / Math.max(m.minStock * 3, 1) * 100, 4, 100)}%`
    }
  }))) : /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted mt-3.5 font-semibold"
  }, "Stock not tracked for this medicine")))), /*#__PURE__*/React.createElement(MedicineModal, {
    open: !!medModal,
    onClose: () => setMedModal(null),
    availablePatients: patients,
    patientName: patient && patient.name,
    initial: medModal && medModal.id ? medModal : null,
    onSave: f => {
      actions.saveMedicine({
        ...f,
        patientId: f.patientId || (patient ? patient.id : activeId)
      });
      setMedModal(null);
    }
  }), /*#__PURE__*/React.createElement(PatientModal, {
    open: !!patientModal,
    onClose: () => setPatientModal(null),
    initial: patientModal && patientModal.id ? patientModal : null,
    onSave: f => {
      actions.savePatient(f);
      setPatientModal(null);
    }
  }), patient && (() => {
    const recent = history.filter(h => h.patientId === patient.id).sort((a, b) => a.date + a.time < b.date + b.time ? 1 : -1).slice(0, 8);
    return /*#__PURE__*/React.createElement("div", {
      className: "mt-8"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-3"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "tsz font-extrabold text-lg"
    }, "Recent activity"), role === "caregiver" && /*#__PURE__*/React.createElement("button", {
      onClick: () => go && go("history", {
        view: patient.id
      }),
      className: "tsz text-sm font-bold text-primary-600 dark:text-primary-400"
    }, "View full history →")), recent.length === 0 ? /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("p", {
      className: "tsz text-sm text-muted text-center py-2"
    }, "No dose activity recorded for ", patient.name, " yet.")) : /*#__PURE__*/React.createElement(Card, {
      padded: false,
      className: "divide-y divide-line dark:divide-dline overflow-hidden"
    }, recent.map(r => {
      const med = medicines.find(m => m.id === r.medicineId);
      const tone = r.status === "Taken" ? "secondary" : r.status === "Snoozed" ? "warn" : "danger";
      return /*#__PURE__*/React.createElement("div", {
        key: r.id,
        className: "px-5 py-3.5"
      }, /*#__PURE__*/React.createElement("div", {
        className: "flex items-center justify-between gap-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0"
      }, /*#__PURE__*/React.createElement("p", {
        className: "tsz font-bold text-sm truncate"
      }, med ? med.name : "Medicine"), /*#__PURE__*/React.createElement("p", {
        className: "tsz text-xs text-muted"
      }, fmtDateShort(r.date), " · ", fmtTime12(r.time), r.reason ? ` · ${r.reason}` : "")), /*#__PURE__*/React.createElement(Badge, {
        tone: tone
      }, r.status)), r.voiceNote && /*#__PURE__*/React.createElement(VoiceNoteBadge, {
        url: r.voiceNote,
        className: "mt-2.5"
      }));
    })));
  })(), /*#__PURE__*/React.createElement(Modal, {
    open: !!confirmDel,
    onClose: () => setConfirmDel(null),
    title: "Delete medicine?",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: () => setConfirmDel(null)
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      variant: "danger",
      onClick: () => {
        actions.deleteMedicine(confirmDel.id);
        setConfirmDel(null);
      }
    }, "Delete"))
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-muted"
  }, "This removes ", /*#__PURE__*/React.createElement("b", {
    className: "text-ink dark:text-white"
  }, confirmDel && confirmDel.name), " and its reminders. This can't be undone.")));
}

/* =========================================================================
   REMINDER OVERLAY — the most important screen
   ========================================================================= */
const SNOOZE_OPTIONS = [10, 30];
const SKIP_REASONS = ["Forgot", "Travelling", "Medicine Finished", "Feeling Sick", "Other"];
const SNOOZE_REASONS = ["Busy right now", "Not ready yet", "Waiting to eat first", "Other"];
const DEMO_ESCALATE_SECONDS = 25; // stands in for the real 30-minute auto-escalation window

function speak(text) {
  try {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  } catch (e) {}
}

// Records a short voice note from the mic (MediaRecorder), lets the patient
// preview/re-record it, then hands the finished clip back as a base64 data
// URL — small enough to live alongside the dose record in localStorage so
// the caregiver can play it back later from History.
function VoiceNoteRecorder({
  label = "Record a voice note instead",
  onCapture,
  capturedUrl,
  onDiscard
}) {
  const [recording, setRecording] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [err, setErr] = useState("");
  const recRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  useEffect(() => () => {
    if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
  }, []);
  const start = async () => {
    setErr("");
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErr("Voice recording isn't supported on this device/browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      streamRef.current = stream;
      const rec = new MediaRecorder(stream);
      chunksRef.current = [];
      rec.ondataavailable = e => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm"
        });
        const reader = new FileReader();
        reader.onloadend = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      recRef.current = rec;
      rec.start();
      setRecording(true);
    } catch (e) {
      setErr("Couldn't access the microphone — check permissions and try again.");
    }
  };
  const stop = () => {
    if (recRef.current && recording) {
      recRef.current.stop();
      setRecording(false);
    }
  };
  if (capturedUrl) {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "mic",
      size: 16,
      className: "text-white/80 shrink-0"
    }), /*#__PURE__*/React.createElement("audio", {
      src: capturedUrl,
      controls: true,
      className: "h-8 flex-1 min-w-0"
    }), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: onDiscard,
      className: "tsz text-xs font-bold text-white/70 hover:text-white shrink-0"
    }, "Remove"));
  }
  if (previewUrl) {
    return /*#__PURE__*/React.createElement("div", {
      className: "bg-white/10 border border-white/20 rounded-xl p-3.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5 mb-2.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "mic",
      size: 16,
      className: "text-white/80 shrink-0"
    }), /*#__PURE__*/React.createElement("audio", {
      src: previewUrl,
      controls: true,
      className: "h-8 flex-1 min-w-0"
    })), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2"
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => setPreviewUrl(null),
      className: "tsz flex-1 h-10 rounded-lg bg-white/10 hover:bg-white/20 font-bold text-xs"
    }, "Re-record"), /*#__PURE__*/React.createElement("button", {
      type: "button",
      onClick: () => {
        onCapture(previewUrl);
        setPreviewUrl(null);
      },
      className: "tsz flex-1 h-10 rounded-lg bg-white text-primary-900 font-extrabold text-xs"
    }, "Use this recording")));
  }
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: recording ? stop : start,
    className: `tsz w-full h-12 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-colors ${recording ? "bg-danger-500 border-danger-400 animate-pulse" : "bg-white/10 border-white/25 hover:bg-white/20"}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: recording ? "stop" : "mic",
    size: 16
  }), recording ? "Recording… tap to stop" : label), err && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-danger-200 mt-1.5"
  }, err));
}
function ReminderOverlay({
  item,
  onRespond,
  onClose,
  onEscalate,
  voiceAssist,
  reminderTone
}) {
  const [stage, setStage] = useState("main"); // main | snooze | skip
  const [secondsLeft, setSecondsLeft] = useState(DEMO_ESCALATE_SECONDS);
  const [escalated, setEscalated] = useState(false);
  const [muted, setMuted] = useState(!voiceAssist);
  const toneAudioRef = useRef(null);
  const [skipOtherOpen, setSkipOtherOpen] = useState(false);
  const [skipOtherText, setSkipOtherText] = useState("");
  const [snoozeReason, setSnoozeReason] = useState(null);
  const [snoozeOtherText, setSnoozeOtherText] = useState("");
  const [snoozeVoiceNote, setSnoozeVoiceNote] = useState(null);
  const usingCustomTone = reminderTone && reminderTone.mode === "tone" && reminderTone.customUrl;
  useEffect(() => {
    setSecondsLeft(DEMO_ESCALATE_SECONDS);
    setEscalated(false);
    setStage("main");
    setSkipOtherOpen(false);
    setSkipOtherText("");
    setSnoozeReason(null);
    setSnoozeOtherText("");
    setSnoozeVoiceNote(null);
    const iv = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          clearInterval(iv);
          setEscalated(true);
          if (onEscalate) onEscalate();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [item && item.med.id, item && item.time]);

  // The reminder "sound" — either the built-in spoken voice, or a custom
  // tone/soundtrack the caregiver uploaded in Settings, per their choice.
  useEffect(() => {
    if (muted || !item) return;
    const {
      med
    } = item;
    if (usingCustomTone) {
      try {
        const audio = new Audio(reminderTone.customUrl);
        toneAudioRef.current = audio;
        audio.play().catch(() => {});
      } catch (e) {}
      return () => {
        if (toneAudioRef.current) {
          try {
            toneAudioRef.current.pause();
          } catch (e) {}
        }
      };
    }
    const strengthPart = med.strength && med.strength !== "N/A" ? `, ${med.strength}` : "";
    speak(`Time to take ${med.name}${strengthPart}. ${med.foodTiming}.`);
    return () => {
      try {
        window.speechSynthesis && window.speechSynthesis.cancel();
      } catch (e) {}
    };
  }, [item && item.med.id, item && item.time, muted, usingCustomTone, reminderTone && reminderTone.customUrl]);
  const respond = payload => {
    if (!muted) {
      if (usingCustomTone) {
        try {
          if (toneAudioRef.current) toneAudioRef.current.pause();
        } catch (e) {}
      } else {
        const msg = payload.status === "Taken" ? "Marked as taken. Well done." : payload.status === "Snoozed" ? `Okay, reminding you again in ${payload.snoozeMin} minutes.` : "Dose skipped.";
        speak(msg);
      }
    }
    onRespond(payload);
  };
  if (!item) return null;
  const {
    med,
    time
  } = item;
  const pct = secondsLeft / DEMO_ESCALATE_SECONDS * 100;
  const composedSnoozeReason = () => {
    if (!snoozeReason) return null;
    if (snoozeReason === "Other") return snoozeOtherText.trim() ? `Other: ${snoozeOtherText.trim()}` : null;
    return snoozeReason;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[60] bg-gradient-to-b from-primary-700 to-primary-900 text-white flex flex-col animate-fadeUp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between px-6 pt-6"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tsz text-sm font-bold text-white/70 flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 15
  }), fmtTime12(time), " · Today"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setMuted(m => {
      if (!m) {
        try {
          window.speechSynthesis && window.speechSynthesis.cancel();
        } catch (e) {}
        try {
          if (toneAudioRef.current) toneAudioRef.current.pause();
        } catch (e) {}
      }
      return !m;
    }),
    "aria-label": muted ? "Unmute sound" : "Mute sound",
    className: "w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: muted ? "volumeOff" : "volume",
    size: 17
  })), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-9 h-9 rounded-full bg-white/10 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 17
  })))), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 flex flex-col items-center justify-center px-8 text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-32 h-32 rounded-3xl bg-white/12 border border-white/20 flex items-center justify-center mb-6 shadow-lift"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "pill",
    size: 58
  })), /*#__PURE__*/React.createElement("h1", {
    className: "tsz text-3xl sm:text-4xl font-extrabold"
  }, med.name, " · ", med.strength), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-lg text-white/85 mt-2 font-medium"
  }, "Take 1 ", med.form.toLowerCase(), " · ", med.foodTiming), escalated ? /*#__PURE__*/React.createElement("div", {
    className: "mt-6 flex items-center gap-2 bg-danger-500/90 px-4 py-2 rounded-full"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 17
  }), /*#__PURE__*/React.createElement("span", {
    className: "tsz text-sm font-bold"
  }, "Caregiver notified — no response yet")) : /*#__PURE__*/React.createElement("div", {
    className: "mt-8 w-full max-w-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-2 bg-white/15 rounded-full overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-white rounded-full transition-all duration-1000 linear",
    style: {
      width: `${pct}%`
    }
  })), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-white/60 mt-2 font-semibold"
  }, "Auto-alerts your caregiver in ", secondsLeft, "s if no response ", /*#__PURE__*/React.createElement("span", {
    className: "opacity-70"
  }, "(30 min in production)")))), stage === "main" && /*#__PURE__*/React.createElement("div", {
    className: "p-6 pb-8 space-y-3 max-w-md w-full mx-auto"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => respond({
      status: "Taken"
    }),
    className: "tsz w-full h-16 rounded-2xl bg-secondary-500 hover:bg-secondary-600 active:scale-[0.98] transition-all font-extrabold text-lg flex items-center justify-center gap-2 shadow-lift"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 24
  }), "TAKEN"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStage("snooze"),
    className: "tsz w-full h-16 rounded-2xl bg-white/12 hover:bg-white/20 active:scale-[0.98] transition-all font-extrabold text-lg flex items-center justify-center gap-2 border border-white/20"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "clock",
    size: 22
  }), "SNOOZE"), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStage("skip"),
    className: "tsz w-full h-16 rounded-2xl bg-danger-500/90 hover:bg-danger-500 active:scale-[0.98] transition-all font-extrabold text-lg flex items-center justify-center gap-2"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 22
  }), "SKIP")), stage === "snooze" && /*#__PURE__*/React.createElement("div", {
    className: "p-6 pb-8 max-w-md w-full mx-auto animate-slideUp overflow-y-auto"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-center font-bold mb-4 text-white/90"
  }, "Remind me again in…"), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3 mb-3"
  }, SNOOZE_OPTIONS.map(m => /*#__PURE__*/React.createElement("button", {
    key: m,
    onClick: () => respond({
      status: "Snoozed",
      snoozeMin: m,
      reason: composedSnoozeReason(),
      voiceNote: snoozeVoiceNote
    }),
    className: "tsz h-16 rounded-2xl bg-white/12 hover:bg-white/20 font-extrabold text-lg border border-white/20"
  }, m, " min"))), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      const v = prompt("Custom snooze minutes:", "15");
      if (v && !isNaN(v)) respond({
        status: "Snoozed",
        snoozeMin: Number(v),
        reason: composedSnoozeReason(),
        voiceNote: snoozeVoiceNote
      });
    },
    className: "tsz w-full h-14 rounded-2xl bg-white/12 hover:bg-white/20 font-bold border border-white/20 mb-4"
  }, "Custom time…"), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-white/15"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs font-bold text-white/60 uppercase tracking-wide mb-2.5"
  }, "Optional — why snooze?"), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-2 mb-2.5"
  }, SNOOZE_REASONS.map(r => /*#__PURE__*/React.createElement("button", {
    key: r,
    type: "button",
    onClick: () => setSnoozeReason(snoozeReason === r ? null : r),
    className: `tsz px-3.5 h-9 rounded-full text-xs font-bold border transition-colors ${snoozeReason === r ? "bg-white text-primary-900 border-white" : "bg-white/10 border-white/25 text-white/85 hover:bg-white/20"}`
  }, r))), snoozeReason === "Other" && /*#__PURE__*/React.createElement("textarea", {
    value: snoozeOtherText,
    onChange: e => setSnoozeOtherText(e.target.value),
    placeholder: "Type the reason (optional)…",
    rows: 2,
    className: "tsz w-full rounded-xl bg-white/10 border border-white/25 text-white placeholder:text-white/50 px-3.5 py-2.5 text-sm outline-none focus:border-white/50 resize-none mb-3"
  }), /*#__PURE__*/React.createElement(VoiceNoteRecorder, {
    label: "Or record a voice note instead",
    capturedUrl: snoozeVoiceNote,
    onCapture: setSnoozeVoiceNote,
    onDiscard: () => setSnoozeVoiceNote(null)
  }), snoozeVoiceNote && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-white/60 mt-2"
  }, "Attached — tap a time above to send it with this note.")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStage("main"),
    className: "tsz w-full h-12 text-white/70 font-bold mt-3"
  }, "Back")), stage === "skip" && /*#__PURE__*/React.createElement("div", {
    className: "p-6 pb-8 max-w-md w-full mx-auto animate-slideUp overflow-y-auto"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-center font-bold mb-4 text-white/90"
  }, "Why are you skipping this dose?"), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5 mb-4"
  }, SKIP_REASONS.map(r => r === "Other" ? /*#__PURE__*/React.createElement("div", {
    key: r,
    className: "rounded-2xl bg-white/12 border border-white/20 overflow-hidden"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setSkipOtherOpen(o => !o),
    className: "tsz w-full h-14 hover:bg-white/10 font-bold text-left px-5 flex items-center justify-between"
  }, "Other", /*#__PURE__*/React.createElement(Icon, {
    name: skipOtherOpen ? "chevronDown" : "chevronRight",
    size: 18
  })), skipOtherOpen && /*#__PURE__*/React.createElement("div", {
    className: "px-4 pb-4"
  }, /*#__PURE__*/React.createElement("textarea", {
    value: skipOtherText,
    onChange: e => setSkipOtherText(e.target.value),
    placeholder: "Type the reason (optional)…",
    rows: 2,
    className: "tsz w-full rounded-xl bg-white/10 border border-white/25 text-white placeholder:text-white/50 px-3.5 py-2.5 text-sm outline-none focus:border-white/50 resize-none mb-2.5"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => respond({
      status: "Skipped",
      reason: skipOtherText.trim() ? `Other: ${skipOtherText.trim()}` : "Other"
    }),
    className: "tsz w-full h-11 rounded-xl bg-white text-primary-900 font-extrabold text-sm"
  }, "Confirm Skip"))) : /*#__PURE__*/React.createElement("button", {
    key: r,
    onClick: () => respond({
      status: "Skipped",
      reason: r
    }),
    className: "tsz w-full h-14 rounded-2xl bg-white/12 hover:bg-white/20 font-bold text-left px-5 border border-white/20 flex items-center justify-between"
  }, r, /*#__PURE__*/React.createElement(Icon, {
    name: "chevronRight",
    size: 18
  })))), /*#__PURE__*/React.createElement("div", {
    className: "pt-1 pb-2"
  }, /*#__PURE__*/React.createElement(VoiceNoteRecorder, {
    label: "Or record a voice note instead",
    onCapture: url => respond({
      status: "Skipped",
      reason: null,
      voiceNote: url
    })
  })), /*#__PURE__*/React.createElement("button", {
    onClick: () => setStage("main"),
    className: "tsz w-full h-12 text-white/70 font-bold"
  }, "Back")));
}

/* =========================================================================
   PATIENT DASHBOARD
   ========================================================================= */
function PatientDashboard({
  data,
  activePatientId,
  openReminder,
  go
}) {
  const {
    patients,
    medicines,
    history
  } = data;
  const patient = patients.find(p => p.id === activePatientId) || patients[0];
  const date = todayStr();
  const schedule = todaysScheduleFor(medicines, patient.id, date, history);
  const adh = computeAdherence(history, patient.id, date);
  const next = schedule.find(s => s.status === "Pending" || s.status === "Missed");
  const emergency = patient.emergencyContacts[0];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    title: `Hello, ${patient.name.split(" ")[0]}`,
    sub: fmtDateLong(date)
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-5 gap-5"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "lg:col-span-2 flex flex-col items-center text-center !p-7"
  }, /*#__PURE__*/React.createElement(PulseRing, {
    size: 190,
    stroke: 15,
    pct: adh.pct,
    color: "#10B981",
    label: /*#__PURE__*/React.createElement("span", {
      className: "tsz font-mono-tab font-extrabold text-4xl"
    }, adh.taken, /*#__PURE__*/React.createElement("span", {
      className: "text-xl text-muted"
    }, "/", adh.total || schedule.length)),
    sub: /*#__PURE__*/React.createElement("span", {
      className: "tsz text-xs font-bold text-muted mt-1 tracking-wide"
    }, "DOSES TAKEN TODAY")
  }), next ? /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    full: true,
    className: "mt-7",
    icon: "bell",
    onClick: () => openReminder({
      med: next.med,
      time: next.time
    })
  }, next.status === "Missed" ? "Respond Now" : `Take ${next.med.name} — ${fmtTime12(next.time)}`) : /*#__PURE__*/React.createElement("div", {
    className: "mt-7 flex items-center gap-2 text-secondary-600 font-bold"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 20
  }), "All doses done for today")), /*#__PURE__*/React.createElement(Card, {
    className: "lg:col-span-3"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "tsz font-extrabold text-lg mb-1"
  }, "Today's schedule"), /*#__PURE__*/React.createElement(HeartbeatDivider, {
    className: "w-16 h-4 text-secondary-200 dark:text-secondary-900 mb-3"
  }), /*#__PURE__*/React.createElement("div", {
    className: "divide-y divide-line dark:divide-dline"
  }, schedule.map((it, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => (it.status === "Pending" || it.status === "Missed") && openReminder({
      med: it.med,
      time: it.time
    }),
    className: "w-full py-3.5 flex items-center gap-3.5 text-left group"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${it.status === "Taken" ? "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600" : it.status === "Missed" ? "bg-danger-50 dark:bg-danger-900/20 text-danger-500" : "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300"}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: it.status === "Taken" ? "check" : it.status === "Missed" ? "alert" : "pill",
    size: 19
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold truncate"
  }, it.med.name, " · ", it.med.strength), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, fmtTime12(it.time), " · ", it.med.foodTiming)), /*#__PURE__*/React.createElement(StatusBadge, {
    status: it.status
  })))))), emergency && /*#__PURE__*/React.createElement(Card, {
    className: "mt-5 flex items-center justify-between flex-wrap gap-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-11 h-11 rounded-xl bg-danger-50 dark:bg-danger-900/20 text-danger-500 flex items-center justify-center"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "phone",
    size: 20
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold"
  }, emergency.name), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, "Emergency contact · ", emergency.relation))), /*#__PURE__*/React.createElement("a", {
    href: `tel:${emergency.phone.replace(/\s/g, "")}`
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    icon: "phone"
  }, "Call Now"))));
}
function StatusBadge({
  status
}) {
  if (status === "Taken") return /*#__PURE__*/React.createElement(Badge, {
    tone: "secondary"
  }, "Taken");
  if (status === "Skipped") return /*#__PURE__*/React.createElement(Badge, {
    tone: "danger"
  }, "Skipped");
  if (status === "Snoozed") return /*#__PURE__*/React.createElement(Badge, {
    tone: "warn"
  }, "Snoozed");
  if (status === "Missed") return /*#__PURE__*/React.createElement(Badge, {
    tone: "danger"
  }, "Missed");
  return /*#__PURE__*/React.createElement(Badge, {
    tone: "slate"
  }, "Pending");
}

// Playable voice note a patient recorded instead of (or alongside) picking a
// skip/snooze reason — shared with, and kept for, the caregiver.
function VoiceNoteBadge({
  url,
  className = ""
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: `flex items-center gap-2 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/40 rounded-lg px-2.5 py-2 ${className}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "mic",
    size: 14,
    className: "text-primary-600 dark:text-primary-300 shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tsz text-[11px] font-bold text-primary-700 dark:text-primary-300 shrink-0"
  }, "Voice note"), /*#__PURE__*/React.createElement("audio", {
    src: url,
    controls: true,
    className: "h-7 flex-1 min-w-0"
  }));
}

/* =========================================================================
   HISTORY VIEW
   ========================================================================= */
function HistoryView({
  data,
  role,
  activePatientId,
  initialTab
}) {
  const {
    patients,
    medicines,
    history
  } = data;
  const myIds = new Set(patients.map(p => p.id));
  const [range, setRange] = useState("weekly");
  const [pid, setPid] = useState(role === "patient" ? activePatientId : "all");
  const [tab, setTab] = useState(initialTab === "stock" ? "stock" : "history");
  const days = range === "weekly" ? nextDaysArr(7) : nextDaysArr(30);
  const rows = history.filter(h => days.includes(h.date) && myIds.has(h.patientId) && (pid === "all" || h.patientId === pid));
  const taken = rows.filter(r => r.status === "Taken").length;
  const skipped = rows.filter(r => r.status === "Skipped").length;
  const snoozed = rows.filter(r => r.status === "Snoozed").length;
  const pct = rows.length ? Math.round(taken / rows.length * 100) : 100;
  const byDay = nextDaysArr(7).map(d => {
    const dr = history.filter(h => h.date === d && myIds.has(h.patientId) && (pid === "all" || h.patientId === pid));
    return {
      d,
      taken: dr.filter(r => r.status === "Taken").length,
      other: dr.filter(r => r.status !== "Taken").length
    };
  });
  const maxV = Math.max(1, ...byDay.map(b => b.taken + b.other));
  const lowStockMeds = medicines.filter(m => myIds.has(m.patientId) && (pid === "all" || m.patientId === pid) && m.trackStock && m.stock <= m.minStock * 1.4);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    title: "History",
    sub: "Track adherence over time",
    right: role === "caregiver" && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Select, {
      value: pid,
      onChange: e => setPid(e.target.value),
      className: "!w-auto"
    }, /*#__PURE__*/React.createElement("option", {
      value: "all"
    }, "All patients"), patients.map(p => /*#__PURE__*/React.createElement("option", {
      key: p.id,
      value: p.id
    }, p.name))), tab === "history" && /*#__PURE__*/React.createElement(Button, {
      variant: "outline",
      icon: "fileText",
      onClick: () => exportAdherencePDF({
        patientLabel: pid === "all" ? "All patients" : (patients.find(p => p.id === pid) || {}).name || "Patient",
        rangeLabel: range === "weekly" ? "Last 7 days" : "Last 30 days",
        pct,
        taken,
        skipped,
        snoozed,
        rows,
        medicines,
        patients
      })
    }, "Export PDF"))
  }), role === "caregiver" && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2 mb-5 border-b border-line dark:border-dline"
  }, [["history", "Adherence"], ["stock", "Medicine Stock"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    onClick: () => setTab(k),
    className: `tsz px-4 pb-3 font-bold text-sm border-b-2 -mb-px transition-colors ${tab === k ? "border-primary-600 text-primary-700 dark:text-primary-300" : "border-transparent text-muted"}`
  }, l))), tab === "history" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Segmented, {
    value: range,
    onChange: setRange,
    className: "mb-5",
    options: [{
      value: "weekly",
      label: "Weekly"
    }, {
      value: "monthly",
      label: "Monthly"
    }]
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5"
  }, /*#__PURE__*/React.createElement(Card, {
    className: "flex items-center gap-4"
  }, /*#__PURE__*/React.createElement(PulseRing, {
    size: 78,
    stroke: 8,
    pct: pct,
    color: "#2563EB",
    label: /*#__PURE__*/React.createElement("span", {
      className: "tsz font-mono-tab font-extrabold text-lg"
    }, pct, "%")
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-extrabold text-lg"
  }, pct, "%"), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted font-semibold"
  }, "Adherence rate"))), /*#__PURE__*/React.createElement(StatMini, {
    icon: "check",
    tone: "secondary",
    value: taken,
    label: "Taken"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(StatMini, {
    icon: "clock",
    tone: "warn",
    value: snoozed,
    label: "Snoozed"
  }), /*#__PURE__*/React.createElement(StatMini, {
    icon: "x",
    tone: "danger",
    value: skipped,
    label: "Skipped"
  }))), /*#__PURE__*/React.createElement(Card, null, /*#__PURE__*/React.createElement("h3", {
    className: "tsz font-extrabold text-lg mb-5"
  }, "Last 7 days"), /*#__PURE__*/React.createElement("div", {
    className: "flex items-end justify-between gap-2 h-40"
  }, byDay.map(b => /*#__PURE__*/React.createElement("div", {
    key: b.d,
    className: "flex-1 flex flex-col items-center gap-2 h-full justify-end"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full flex flex-col justify-end gap-0.5 h-32"
  }, b.other > 0 && /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-danger-400 dark:bg-danger-600 rounded-t",
    style: {
      height: `${b.other / maxV * 100}%`,
      minHeight: b.other ? 4 : 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "w-full bg-secondary-500 rounded-t",
    style: {
      height: `${b.taken / maxV * 100}%`,
      minHeight: b.taken ? 4 : 0,
      borderRadius: b.other ? "0 0 4px 4px" : "4px"
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "tsz text-[10px] font-bold text-muted"
  }, fmtWeekday(b.d))))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-4 mt-4 justify-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tsz text-xs font-semibold text-muted flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full bg-secondary-500"
  }), "Taken"), /*#__PURE__*/React.createElement("span", {
    className: "tsz text-xs font-semibold text-muted flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-2.5 h-2.5 rounded-full bg-danger-400"
  }), "Skipped / Snoozed"))), /*#__PURE__*/React.createElement("h3", {
    className: "tsz font-extrabold text-lg mt-6 mb-3"
  }, "Recent activity"), /*#__PURE__*/React.createElement(Card, {
    padded: false
  }, rows.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "history",
    title: "No activity yet"
  }) : /*#__PURE__*/React.createElement("div", {
    className: "divide-y divide-line dark:divide-dline max-h-96 overflow-y-auto"
  }, [...rows].reverse().slice(0, 40).map(r => {
    const med = medicines.find(m => m.id === r.medicineId);
    const pat = patients.find(p => p.id === r.patientId);
    return /*#__PURE__*/React.createElement("div", {
      key: r.id,
      className: "px-5 py-3"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-3.5"
    }, /*#__PURE__*/React.createElement(StatusBadge, {
      status: r.status
    }), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz text-sm font-bold truncate"
    }, med ? med.name : "Medicine", " ", role === "caregiver" && pat ? `· ${pat.name}` : ""), /*#__PURE__*/React.createElement("p", {
      className: "tsz text-xs text-muted"
    }, fmtDateShort(r.date), " · ", fmtTime12(r.time), r.reason ? ` · ${r.reason}` : ""))), r.voiceNote && /*#__PURE__*/React.createElement(VoiceNoteBadge, {
      url: r.voiceNote,
      className: "mt-2.5 ml-0 sm:ml-[52px]"
    }));
  })))) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-4"
  }, lowStockMeds.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "package",
    title: "Stock levels look healthy"
  }) : lowStockMeds.map(m => {
    const pat = patients.find(p => p.id === m.patientId);
    const low = m.stock <= m.minStock;
    const daysLeft = Math.max(1, Math.round(m.stock / m.times.length));
    return /*#__PURE__*/React.createElement(Card, {
      key: m.id
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between mb-1"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz font-extrabold"
    }, m.name, " · ", m.strength), low && /*#__PURE__*/React.createElement(Badge, {
      tone: "danger"
    }, "Refill soon")), /*#__PURE__*/React.createElement("p", {
      className: "tsz text-xs text-muted mb-3"
    }, pat && pat.name, " · ~", daysLeft, " days remaining"), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between text-xs mb-1.5"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tsz text-muted font-semibold"
    }, m.stock, " of ", m.minStock * 3, " tablets"), /*#__PURE__*/React.createElement("span", {
      className: "tsz font-mono-tab font-bold"
    }, Math.round(m.stock / (m.minStock * 3) * 100), "%")), /*#__PURE__*/React.createElement("div", {
      className: "w-full h-2.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden"
    }, /*#__PURE__*/React.createElement("div", {
      className: `h-full rounded-full ${low ? "bg-danger-500" : "bg-secondary-500"}`,
      style: {
        width: `${clamp(m.stock / (m.minStock * 3) * 100, 4, 100)}%`
      }
    })));
  })));
}
function StatMini({
  icon,
  tone,
  value,
  label
}) {
  const tones = {
    secondary: "bg-secondary-50 dark:bg-secondary-900/20 text-secondary-600",
    warn: "bg-warn-50 dark:bg-warn-500/10 text-warn-600",
    danger: "bg-danger-50 dark:bg-danger-500/10 text-danger-500"
  };
  return /*#__PURE__*/React.createElement(Card, {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tones[tone]}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 19
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-mono-tab font-extrabold text-xl leading-none"
  }, value), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted font-semibold mt-1"
  }, label)));
}

/* =========================================================================
   ALERTS VIEW (caregiver)
   ========================================================================= */
function AlertsView({
  data,
  actions,
  toastFn
}) {
  const {
    patients,
    medicines,
    history
  } = data;
  const myIds = new Set(patients.map(p => p.id));
  const missed = history.filter(h => h.status === "Missed" && myIds.has(h.patientId)).sort((a, b) => a.date + a.time < b.date + b.time ? 1 : -1);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Alerts",
    sub: `${missed.length} missed dose${missed.length === 1 ? "" : "s"} need attention`
  }), missed.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "bell",
    title: "No alerts",
    sub: "You'll see missed doses here the moment they happen."
  }) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, missed.map(h => {
    const med = medicines.find(m => m.id === h.medicineId);
    const pat = patients.find(p => p.id === h.patientId);
    if (!med || !pat) return null;
    return /*#__PURE__*/React.createElement(Card, {
      key: h.id,
      className: "flex items-center gap-4 flex-wrap sm:flex-nowrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-12 h-12 rounded-xl bg-danger-50 dark:bg-danger-900/20 text-danger-500 flex items-center justify-center shrink-0"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "alert",
      size: 21
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz font-extrabold"
    }, pat.name), /*#__PURE__*/React.createElement("p", {
      className: "tsz text-sm text-muted"
    }, "Missed ", med.name, " · ", med.strength, " at ", fmtTime12(h.time), " on ", fmtDateShort(h.date))), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-2 w-full sm:w-auto"
    }, pat.emergencyContacts[0] && pat.emergencyContacts[0].phone && /*#__PURE__*/React.createElement("a", {
      href: `tel:${pat.emergencyContacts[0].phone.replace(/\s/g, "")}`,
      className: "flex-1 sm:flex-none"
    }, /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "subtlePrimary",
      icon: "phone",
      full: true
    }, "Call")), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "secondary",
      icon: "bell",
      onClick: () => toastFn(`Reminder sent to ${pat.name} for ${med.name}.`)
    }, "Remind"), /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      onClick: () => actions.dismissAlert(h.id)
    }, "Dismiss")));
  })));
}

/* =========================================================================
   APPOINTMENTS VIEW
   ========================================================================= */
function AppointmentModal({
  open,
  onClose,
  onSave,
  patients,
  defaultPatientId,
  initial
}) {
  const empty = {
    patientId: defaultPatientId || patients[0] && patients[0].id || "",
    doctor: "",
    hospital: "",
    date: todayStr(),
    time: "10:00",
    notes: "",
    prescriptionUrl: null,
    prescriptionName: null
  };
  const [f, setF] = useState(initial || empty);
  const [fileErr, setFileErr] = useState("");
  useEffect(() => {
    setF(initial || empty);
    setFileErr("");
  }, [open, initial]);
  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });
  const onFile = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/^image\/|^application\/pdf$/.test(file.type)) {
      setFileErr("Please upload an image or PDF.");
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setFileErr("Keep the file under 6MB.");
      return;
    }
    setFileErr("");
    const reader = new FileReader();
    reader.onloadend = () => setF(cur => ({
      ...cur,
      prescriptionUrl: reader.result,
      prescriptionName: file.name
    }));
    reader.onerror = () => setFileErr("Couldn't read that file — try another.");
    reader.readAsDataURL(file);
  };
  const canSave = f.patientId && f.doctor.trim() && f.date;
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: initial ? "Edit appointment" : "Add appointment",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: () => canSave && onSave(f),
      disabled: !canSave
    }, "Save appointment"))
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Patient",
    required: true,
    hint: patients.length === 0 ? "Add a patient first before scheduling a visit." : undefined
  }, /*#__PURE__*/React.createElement(Select, {
    value: f.patientId,
    onChange: set("patientId"),
    disabled: patients.length === 0
  }, patients.length === 0 && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "No patients yet"), patients.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Doctor",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: f.doctor,
    onChange: set("doctor"),
    placeholder: "e.g. Dr. Nalini Rao"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Hospital / Clinic"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: f.hospital,
    onChange: set("hospital"),
    placeholder: "e.g. Sunrise Multispecialty Hospital"
  })), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Date",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "date",
    value: f.date,
    onChange: set("date")
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Time"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "time",
    value: f.time,
    onChange: set("time")
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Notes"
  }, /*#__PURE__*/React.createElement(Textarea, {
    value: f.notes,
    onChange: set("notes"),
    placeholder: "What's this visit for? Add a summary once it's done."
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Prescription (optional)",
    hint: "Upload a photo or PDF of the prescription from this visit — image or PDF, up to 6MB."
  }, f.prescriptionUrl ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 bg-slate-50 dark:bg-white/5 border border-line dark:border-dline rounded-xl px-3.5 py-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "fileText",
    size: 16,
    className: "text-primary-600 dark:text-primary-300 shrink-0"
  }), /*#__PURE__*/React.createElement("span", {
    className: "tsz text-xs font-bold truncate flex-1"
  }, f.prescriptionName || "Prescription"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setF({
      ...f,
      prescriptionUrl: null,
      prescriptionName: null
    }),
    className: "tsz text-xs font-bold text-danger-600 hover:text-danger-700 shrink-0"
  }, "Remove")) : /*#__PURE__*/React.createElement("label", {
    className: "tsz inline-flex items-center gap-2 h-11 px-4 rounded-xl border-2 border-dashed border-line dark:border-dline hover:border-primary-400 cursor-pointer text-sm font-bold text-muted hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 16
  }), "Upload prescription", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "image/*,application/pdf",
    className: "hidden",
    onChange: onFile
  })), fileErr && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-danger-600 font-semibold mt-1.5"
  }, fileErr)));
}
function isAppointmentPast(a) {
  const dt = new Date(`${a.date}T${a.time || "00:00"}:00`);
  return dt.getTime() < Date.now();
}
function AppointmentsView({
  data,
  actions,
  role,
  activePatientId,
  canManage
}) {
  const {
    patients,
    appointments
  } = data;
  const myIds = new Set(patients.map(p => p.id));
  const [open, setOpen] = useState(null); // null closed, {} add, {...} edit
  const [tab, setTab] = useState("upcoming"); // upcoming | past

  const scoped = role === "patient" ? appointments.filter(a => a.patientId === activePatientId) : appointments.filter(a => myIds.has(a.patientId));
  const upcoming = scoped.filter(a => !isAppointmentPast(a)).sort((a, b) => a.date + a.time > b.date + b.time ? 1 : -1);
  const past = scoped.filter(a => isAppointmentPast(a)).sort((a, b) => a.date + a.time < b.date + b.time ? 1 : -1);
  const list = tab === "upcoming" ? upcoming : past;
  const availablePatients = role === "patient" ? patients.filter(p => p.id === activePatientId) : patients;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Appointments",
    sub: "Doctor visits & check-ups",
    right: canManage && /*#__PURE__*/React.createElement(Button, {
      icon: "plus",
      onClick: () => setOpen({}),
      disabled: availablePatients.length === 0
    }, "Add Appointment")
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-3 mb-5"
  }, /*#__PURE__*/React.createElement(StatCard, {
    icon: "calendar",
    tone: "primary",
    value: upcoming.length,
    label: "Upcoming",
    onClick: () => setTab("upcoming")
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "check",
    tone: "secondary",
    value: past.length,
    label: "Past visits",
    onClick: () => setTab("past")
  }), /*#__PURE__*/React.createElement(StatCard, {
    icon: "fileText",
    tone: "warn",
    value: scoped.filter(a => a.prescriptionUrl).length,
    label: "Prescriptions on file"
  })), /*#__PURE__*/React.createElement(Segmented, {
    className: "mb-4 max-w-xs",
    value: tab,
    onChange: setTab,
    options: [{
      value: "upcoming",
      label: `Upcoming (${upcoming.length})`
    }, {
      value: "past",
      label: `Past (${past.length})`
    }]
  }), list.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "calendar",
    title: tab === "upcoming" ? "No upcoming appointments" : "No past visits recorded",
    action: canManage && tab === "upcoming" && /*#__PURE__*/React.createElement(Button, {
      icon: "plus",
      onClick: () => setOpen({}),
      disabled: availablePatients.length === 0
    }, "Add Appointment")
  }) : /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, list.map(a => {
    const pat = patients.find(p => p.id === a.patientId);
    return /*#__PURE__*/React.createElement(Card, {
      key: a.id,
      className: "flex items-start gap-4 flex-wrap"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 flex flex-col items-center justify-center shrink-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: "tsz text-[10px] font-bold uppercase"
    }, new Date(a.date + "T00:00:00").toLocaleDateString("en-IN", {
      month: "short"
    })), /*#__PURE__*/React.createElement("span", {
      className: "tsz text-lg font-extrabold leading-none"
    }, new Date(a.date + "T00:00:00").getDate())), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2 flex-wrap"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz font-extrabold"
    }, a.doctor, role === "caregiver" && pat ? ` · ${pat.name}` : ""), /*#__PURE__*/React.createElement(Badge, {
      tone: tab === "past" ? "slate" : "primary"
    }, tab === "past" ? "Completed" : "Upcoming")), /*#__PURE__*/React.createElement("p", {
      className: "tsz text-sm text-muted"
    }, a.hospital, " · ", fmtTime12(a.time)), a.notes && /*#__PURE__*/React.createElement("p", {
      className: "tsz text-xs text-muted mt-1"
    }, a.notes), a.prescriptionUrl && /*#__PURE__*/React.createElement("a", {
      href: a.prescriptionUrl,
      download: a.prescriptionName || "prescription",
      className: "tsz mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "fileText",
      size: 12
    }), a.prescriptionName || "View prescription")), canManage && /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1.5 shrink-0"
    }, /*#__PURE__*/React.createElement(IconButton, {
      name: "edit",
      onClick: () => setOpen(a),
      label: "Edit"
    }), /*#__PURE__*/React.createElement(IconButton, {
      name: "trash",
      variant: "danger",
      onClick: () => actions.deleteAppointment(a.id),
      label: "Delete"
    })));
  })), canManage && /*#__PURE__*/React.createElement(AppointmentModal, {
    open: !!open,
    onClose: () => setOpen(null),
    patients: availablePatients,
    defaultPatientId: activePatientId,
    initial: open && open.id ? open : null,
    onSave: f => {
      actions.saveAppointment(f);
      setOpen(null);
    }
  }));
}

/* =========================================================================
   HEALTH PARAMETERS — BP, sugar, temperature, heart rate, weight, + custom
   ========================================================================= */
const HEALTH_TYPES = [{
  key: "bp",
  label: "Blood Pressure",
  icon: "activity",
  unit: "mmHg",
  composite: true,
  color: "danger"
}, {
  key: "sugar",
  label: "Blood Sugar",
  icon: "droplet",
  unit: "mg/dL",
  color: "primary"
}, {
  key: "temperature",
  label: "Temperature",
  icon: "thermometer",
  unit: "°F",
  color: "warn"
}, {
  key: "heartRate",
  label: "Heart Rate",
  icon: "heart",
  unit: "bpm",
  color: "danger"
}, {
  key: "weight",
  label: "Weight",
  icon: "scale",
  unit: "kg",
  color: "secondary"
}, {
  key: "other",
  label: "Other",
  icon: "plus",
  unit: "",
  color: "slate"
}];
const healthTypeInfo = key => HEALTH_TYPES.find(t => t.key === key) || HEALTH_TYPES[HEALTH_TYPES.length - 1];
function HealthLogModal({
  open,
  onClose,
  onSave,
  patients,
  defaultPatientId,
  initial
}) {
  const empty = {
    patientId: defaultPatientId || patients[0] && patients[0].id || "",
    type: "bp",
    customLabel: "",
    value: "",
    systolic: "",
    diastolic: "",
    unit: healthTypeInfo("bp").unit,
    date: todayStr(),
    time: new Date().toTimeString().slice(0, 5),
    note: ""
  };
  const [f, setF] = useState(initial ? {
    ...empty,
    ...initial
  } : empty);
  useEffect(() => {
    setF(initial ? {
      ...empty,
      ...initial
    } : empty);
  }, [open, initial]);
  const set = k => e => setF({
    ...f,
    [k]: e.target.value
  });
  const info = healthTypeInfo(f.type);
  const setType = key => setF({
    ...f,
    type: key,
    unit: healthTypeInfo(key).unit,
    value: "",
    systolic: "",
    diastolic: ""
  });
  const canSave = f.patientId && f.date && (info.composite ? f.systolic && f.diastolic : f.value.trim()) && (f.type !== "other" || f.customLabel.trim());
  const finalize = () => {
    if (!canSave) return;
    const payload = {
      ...f
    };
    if (info.composite) payload.value = `${f.systolic}/${f.diastolic}`;
    onSave(payload);
  };
  return /*#__PURE__*/React.createElement(Modal, {
    open: open,
    onClose: onClose,
    title: initial ? "Edit reading" : "Log a reading",
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Cancel"), /*#__PURE__*/React.createElement(Button, {
      onClick: finalize,
      disabled: !canSave
    }, "Save reading"))
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Patient",
    required: true,
    hint: patients.length === 0 ? "Add a patient first." : undefined
  }, /*#__PURE__*/React.createElement(Select, {
    value: f.patientId,
    onChange: set("patientId"),
    disabled: patients.length === 0
  }, patients.length === 0 && /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "No patients yet"), patients.map(p => /*#__PURE__*/React.createElement("option", {
    key: p.id,
    value: p.id
  }, p.name)))), /*#__PURE__*/React.createElement(Field, {
    label: "Parameter",
    required: true
  }, /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-2"
  }, HEALTH_TYPES.map(t => /*#__PURE__*/React.createElement("button", {
    key: t.key,
    type: "button",
    onClick: () => setType(t.key),
    className: `tsz flex flex-col items-center justify-center gap-1 h-16 rounded-xl border-2 font-bold text-xs transition-colors ${f.type === t.key ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300" : "border-line dark:border-dline hover:border-primary-300 text-muted"}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 17
  }), t.label)))), f.type === "other" && /*#__PURE__*/React.createElement(Field, {
    label: "Custom parameter name",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: f.customLabel,
    onChange: set("customLabel"),
    placeholder: "e.g. Oxygen (SpO2)"
  })), info.composite ? /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Systolic",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "number",
    inputMode: "numeric",
    value: f.systolic,
    onChange: set("systolic"),
    placeholder: "120"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Diastolic",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "number",
    inputMode: "numeric",
    value: f.diastolic,
    onChange: set("diastolic"),
    placeholder: "80"
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Value",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: f.type === "other" ? "text" : "number",
    inputMode: "decimal",
    value: f.value,
    onChange: set("value"),
    placeholder: "e.g. 98.6"
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Unit"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: f.unit,
    onChange: set("unit"),
    placeholder: "e.g. mg/dL"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-4"
  }, /*#__PURE__*/React.createElement(Field, {
    label: "Date",
    required: true
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "date",
    value: f.date,
    onChange: set("date")
  })), /*#__PURE__*/React.createElement(Field, {
    label: "Time"
  }, /*#__PURE__*/React.createElement(TextInput, {
    type: "time",
    value: f.time,
    onChange: set("time")
  }))), /*#__PURE__*/React.createElement(Field, {
    label: "Notes"
  }, /*#__PURE__*/React.createElement(Textarea, {
    value: f.note,
    onChange: set("note"),
    placeholder: "Anything worth remembering — how they were feeling, when it was taken, etc."
  })));
}
function HealthView({
  data,
  actions,
  role,
  activePatientId
}) {
  const {
    patients,
    healthRecords
  } = data;
  const myIds = new Set(patients.map(p => p.id));
  const [open, setOpen] = useState(null); // null closed, {} add, {...} edit
  const [pid, setPid] = useState(role === "patient" ? activePatientId : "all");
  const [typeFilter, setTypeFilter] = useState("all");
  useEffect(() => {
    if (role === "patient") setPid(activePatientId);
  }, [activePatientId, role]);
  const scoped = healthRecords.filter(h => role === "patient" ? h.patientId === activePatientId : myIds.has(h.patientId));
  const patientScoped = pid === "all" ? scoped : scoped.filter(h => h.patientId === pid);
  const filtered = (typeFilter === "all" ? patientScoped : patientScoped.filter(h => h.type === typeFilter)).sort((a, b) => a.date + (a.time || "") < b.date + (b.time || "") ? 1 : -1);
  const latestByType = HEALTH_TYPES.filter(t => t.key !== "other").map(t => ({
    ...t,
    latest: patientScoped.filter(h => h.type === t.key).sort((a, b) => a.date + (a.time || "") < b.date + (b.time || "") ? 1 : -1)[0]
  }));
  const availablePatients = role === "patient" ? patients.filter(p => p.id === activePatientId) : patients;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Health Parameters",
    sub: "BP, sugar, temperature, heart rate, weight & more",
    right: /*#__PURE__*/React.createElement(React.Fragment, null, role === "caregiver" && patients.length > 1 && /*#__PURE__*/React.createElement(Select, {
      value: pid,
      onChange: e => setPid(e.target.value),
      className: "!w-40"
    }, /*#__PURE__*/React.createElement("option", {
      value: "all"
    }, "All patients"), patients.map(p => /*#__PURE__*/React.createElement("option", {
      key: p.id,
      value: p.id
    }, p.name))), /*#__PURE__*/React.createElement(Button, {
      icon: "plus",
      onClick: () => setOpen({}),
      disabled: availablePatients.length === 0
    }, "Log Reading"))
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3 mb-5"
  }, latestByType.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.key,
    className: "!p-4 flex flex-col items-center text-center",
    onClick: () => setTypeFilter(typeFilter === t.key ? "all" : t.key)
  }, /*#__PURE__*/React.createElement("div", {
    className: `w-9 h-9 rounded-lg flex items-center justify-center mb-2 ${t.latest ? "bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300" : "bg-slate-100 dark:bg-white/10 text-muted"}`
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 17
  })), /*#__PURE__*/React.createElement("p", {
    className: "tsz font-mono-tab font-extrabold text-lg leading-none"
  }, t.latest ? t.latest.value : "—"), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-[10px] text-muted font-bold mt-1"
  }, t.latest ? t.latest.unit : "no data"), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-[11px] font-bold text-muted mt-1.5"
  }, t.label)))), filtered.length === 0 ? /*#__PURE__*/React.createElement(EmptyState, {
    icon: "activity",
    title: "No readings logged yet",
    sub: "Log blood pressure, sugar, temperature, heart rate, weight — or add your own custom parameter.",
    action: /*#__PURE__*/React.createElement(Button, {
      icon: "plus",
      onClick: () => setOpen({}),
      disabled: availablePatients.length === 0
    }, "Log Reading")
  }) : /*#__PURE__*/React.createElement(Card, {
    padded: false,
    className: "divide-y divide-line dark:divide-dline overflow-hidden"
  }, filtered.map(h => {
    const info = healthTypeInfo(h.type);
    const pat = patients.find(p => p.id === h.patientId);
    return /*#__PURE__*/React.createElement("div", {
      key: h.id,
      className: "px-5 py-3.5 flex items-center gap-3.5"
    }, /*#__PURE__*/React.createElement("div", {
      className: "w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 flex items-center justify-center shrink-0"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: info.icon,
      size: 18
    })), /*#__PURE__*/React.createElement("div", {
      className: "min-w-0 flex-1"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz font-bold text-sm"
    }, h.type === "other" ? h.customLabel : info.label, ": ", /*#__PURE__*/React.createElement("span", {
      className: "font-mono-tab"
    }, h.value), " ", /*#__PURE__*/React.createElement("span", {
      className: "text-muted font-semibold"
    }, h.unit), role === "caregiver" && pat ? /*#__PURE__*/React.createElement("span", {
      className: "text-muted font-semibold"
    }, " · ", pat.name) : null), /*#__PURE__*/React.createElement("p", {
      className: "tsz text-xs text-muted"
    }, fmtDateShort(h.date), h.time ? ` · ${fmtTime12(h.time)}` : "", h.note ? ` · ${h.note}` : "")), /*#__PURE__*/React.createElement("div", {
      className: "flex gap-1 shrink-0"
    }, /*#__PURE__*/React.createElement(IconButton, {
      name: "edit",
      onClick: () => setOpen(h),
      label: "Edit"
    }), /*#__PURE__*/React.createElement(IconButton, {
      name: "trash",
      variant: "danger",
      onClick: () => actions.deleteHealthRecord(h.id),
      label: "Delete"
    })));
  })), /*#__PURE__*/React.createElement(HealthLogModal, {
    open: !!open,
    onClose: () => setOpen(null),
    patients: availablePatients,
    defaultPatientId: activePatientId,
    initial: open && open.id ? open : null,
    onSave: f => {
      actions.saveHealthRecord(f);
      setOpen(null);
    }
  }));
}

/* =========================================================================
   SETTINGS VIEW
   ========================================================================= */
function CopyField({
  value,
  label
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (e) {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tsz font-mono-tab font-extrabold text-lg tracking-[0.2em] bg-slate-100 dark:bg-white/10 rounded-xl px-4 h-12 flex items-center"
  }, value), /*#__PURE__*/React.createElement(Button, {
    variant: "outline",
    size: "sm",
    icon: copied ? "check" : "download",
    onClick: copy
  }, copied ? "Copied" : "Copy"));
}
function CareCircleSettings({
  account,
  data,
  actions,
  accounts
}) {
  // Hooks must run unconditionally (even though only the patient branch below
  // uses them) — the caregiver branch renders and returns before them.
  const [code, setCode] = useState("");
  const [otpInput, setOtpInput] = useState("");
  if (account.role === "caregiver") {
    const linked = data.patients.filter(p => accounts.some(a => a.patientId === p.id));
    const pending = (data.connectionRequests || []).filter(r => r.caregiverId === account.id);
    return /*#__PURE__*/React.createElement(SettingsGroup, {
      title: "Care circle"
    }, /*#__PURE__*/React.createElement("div", {
      className: "py-1"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz font-bold text-sm mb-1"
    }, "Your care code"), /*#__PURE__*/React.createElement("p", {
      className: "tsz text-xs text-muted mb-3"
    }, "Share this with a patient so they can connect their own CareMate account to yours — they'll see reminders, and you'll see their progress. When they enter it, a one-time verification code appears below for you to pass along to them."), /*#__PURE__*/React.createElement(CopyField, {
      value: account.careCode
    })), pending.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "pt-4 mt-4 border-t border-line dark:border-dline"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz font-bold text-sm mb-1 flex items-center gap-1.5"
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "lock",
      size: 14,
      className: "text-primary-600 dark:text-primary-300"
    }), "Pending connection requests"), /*#__PURE__*/React.createElement("p", {
      className: "tsz text-xs text-muted mb-3"
    }, "Give the code below to the person who requested it — entering it on their end completes the connection. Only approve requests you recognize."), /*#__PURE__*/React.createElement("div", {
      className: "space-y-2.5"
    }, pending.map(r => {
      const patName = r.patientId ? (data.patients.find(p => p.id === r.patientId) || {}).name : r.signupName;
      const mins = Math.max(0, Math.round((r.expiresAt - Date.now()) / 60000));
      return /*#__PURE__*/React.createElement("div", {
        key: r.id,
        className: "flex items-center gap-3 bg-slate-50 dark:bg-white/5 rounded-xl px-3.5 py-3"
      }, /*#__PURE__*/React.createElement("div", {
        className: "min-w-0 flex-1"
      }, /*#__PURE__*/React.createElement("p", {
        className: "tsz font-bold text-sm truncate"
      }, patName || "Someone", " ", r.signupName ? /*#__PURE__*/React.createElement("span", {
        className: "tsz text-xs font-semibold text-muted"
      }, "· new signup") : /*#__PURE__*/React.createElement("span", {
        className: "tsz text-xs font-semibold text-muted"
      }, "· add caregiver")), /*#__PURE__*/React.createElement("p", {
        className: "tsz text-xs text-muted"
      }, "Expires in ~", mins, " min")), /*#__PURE__*/React.createElement("div", {
        className: "tsz font-mono-tab font-extrabold text-lg tracking-[0.2em] bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg px-3 py-1.5 shrink-0"
      }, r.otp), /*#__PURE__*/React.createElement(IconButton, {
        name: "x",
        label: "Reject request",
        variant: "danger",
        onClick: () => actions.rejectConnectRequest(r.id)
      }));
    }))), /*#__PURE__*/React.createElement("div", {
      className: "pt-4 mt-4 border-t border-line dark:border-dline"
    }, /*#__PURE__*/React.createElement("p", {
      className: "tsz text-sm text-muted"
    }, /*#__PURE__*/React.createElement("b", {
      className: "text-ink dark:text-white font-bold"
    }, linked.length), " of ", /*#__PURE__*/React.createElement("b", {
      className: "text-ink dark:text-white font-bold"
    }, data.patients.length), " patient", data.patients.length === 1 ? "" : "s", " ", linked.length === 1 ? "has" : "have", " their own linked account.")));
  }
  const patient = data.patients.find(p => p.id === account.patientId);
  const linkedCaregivers = patient ? (patient.caregiverIds || []).map(id => accounts.find(a => a.id === id)).filter(Boolean) : [];
  const myPendingRequests = (data.connectionRequests || []).filter(r => r.patientId === account.patientId);
  const atMinimum = !account.selfCare && linkedCaregivers.length <= 1;
  const startConnect = () => {
    const requestId = actions.connectCaregiver(code);
    if (requestId) {
      setCode("");
    }
  };
  return /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Care circle"
  }, linkedCaregivers.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 py-1"
  }, linkedCaregivers.map(cg => /*#__PURE__*/React.createElement("div", {
    key: cg.id,
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-11 h-11 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-sm flex items-center justify-center font-extrabold shrink-0"
  }, cg.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold text-sm flex items-center gap-1.5"
  }, "Connected to ", cg.name, " ", /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 15,
    className: "text-secondary-600"
  })), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, "They can see your medicines, reminders, and progress.")), /*#__PURE__*/React.createElement(IconButton, {
    name: "x",
    label: `Disconnect ${cg.name}`,
    variant: "danger",
    disabled: atMinimum,
    onClick: () => actions.disconnectCaregiver(cg.id)
  }))), atMinimum && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted flex items-center gap-1.5 pt-1"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "info",
    size: 13
  }), "You need at least one connected caregiver — connect another before disconnecting this one.")), myPendingRequests.length > 0 && myPendingRequests.map(r => /*#__PURE__*/React.createElement("div", {
    key: r.id,
    className: linkedCaregivers.length > 0 ? "pt-4 mt-4 border-t border-line dark:border-dline" : "py-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold text-sm mb-1"
  }, "Verify with ", r.caregiverName), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted mb-3"
  }, "A one-time code was generated in ", r.caregiverName, "'s account (Settings → Care circle → Pending requests). Ask them for it and enter it below."), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: otpInput,
    onChange: e => setOtpInput(e.target.value.replace(/\D/g, "").slice(0, 6)),
    placeholder: "6-digit code",
    inputMode: "numeric",
    maxLength: 6,
    className: "!w-36 text-center font-bold tracking-[0.2em]"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => {
      if (actions.verifyConnectOtp(r.id, otpInput)) setOtpInput("");
    },
    disabled: otpInput.trim().length < 4
  }, "Verify"), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "ghost",
    onClick: () => {
      actions.cancelConnectRequest(r.id);
      setOtpInput("");
    }
  }, "Cancel"))))), myPendingRequests.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: linkedCaregivers.length > 0 ? "pt-4 mt-4 border-t border-line dark:border-dline" : "py-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold text-sm mb-1"
  }, linkedCaregivers.length > 0 ? "Connect another caregiver" : "No caregiver connected yet"), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted mb-3"
  }, linkedCaregivers.length > 0 ? "A patient can be looked after by more than one caregiver — a family member and a home nurse, for example." : account.selfCare ? "Optionally connect a caregiver — a family member, for example — so someone else can keep an eye on your progress too." : "Ask your caregiver for their care code to connect. They'll get a one-time verification code to share with you to complete it."), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-2"
  }, /*#__PURE__*/React.createElement(TextInput, {
    value: code,
    onChange: e => setCode(e.target.value.toUpperCase()),
    placeholder: "e.g. 7QJ2KX",
    maxLength: 6,
    className: "!w-40"
  }), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: startConnect,
    disabled: code.trim().length < 4
  }, "Send code"))));
}
function ReminderSoundSettings({
  account,
  settings,
  setSettings
}) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const tone = settings.reminderTone || DEFAULT_SETTINGS.reminderTone;
  // Only a caregiver — or a self-care account acting as their own caregiver —
  // can choose how the patient is reminded. A plain connected patient sees
  // a read-only summary instead.
  const canEdit = account.role === "caregiver" || account.selfCare;
  const setTone = patch => setSettings({
    ...settings,
    reminderTone: {
      ...tone,
      ...patch
    }
  });
  const onFile = e => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("audio/")) {
      setErr("Please choose an audio file.");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setErr("Keep the sound file under 4MB.");
      return;
    }
    setErr("");
    setBusy(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTone({
        mode: "tone",
        customUrl: reader.result,
        customName: file.name
      });
      setBusy(false);
    };
    reader.onerror = () => {
      setErr("Couldn't read that file — try another.");
      setBusy(false);
    };
    reader.readAsDataURL(file);
  };
  return /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Reminder sound"
  }, !canEdit ? /*#__PURE__*/React.createElement("div", {
    className: "py-1 flex items-start gap-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "music",
    size: 17,
    className: "text-muted mt-0.5 shrink-0"
  }), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted"
  }, tone.mode === "tone" && tone.customName ? /*#__PURE__*/React.createElement(React.Fragment, null, "Your caregiver has set a custom sound (", /*#__PURE__*/React.createElement("b", {
    className: "text-ink dark:text-white font-bold"
  }, tone.customName), ") to play for your reminders.") : "Your caregiver has reminders set to the default spoken voice.")) : /*#__PURE__*/React.createElement("div", {
    className: "py-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-sm text-muted mb-3"
  }, "Choose how the patient is reminded when it's time for a dose — the built-in spoken voice, or a custom sound/soundtrack you upload."), /*#__PURE__*/React.createElement(Segmented, {
    value: tone.mode,
    onChange: v => setTone({
      mode: v
    }),
    className: "mb-4",
    options: [{
      value: "voice",
      label: "Spoken voice"
    }, {
      value: "tone",
      label: "Custom sound"
    }]
  }), tone.mode === "tone" && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3"
  }, tone.customUrl ? /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 bg-slate-50 dark:bg-white/5 border border-line dark:border-dline rounded-xl px-3.5 py-2.5"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "music",
    size: 16,
    className: "text-primary-600 dark:text-primary-300 shrink-0"
  }), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0 flex-1"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs font-bold truncate"
  }, tone.customName || "Custom sound"), /*#__PURE__*/React.createElement("audio", {
    src: tone.customUrl,
    controls: true,
    className: "h-8 w-full mt-1"
  })), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setTone({
      customUrl: null,
      customName: null
    }),
    className: "tsz text-xs font-bold text-danger-600 hover:text-danger-700 shrink-0"
  }, "Remove")) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 bg-warn-50 dark:bg-warn-500/10 text-warn-700 dark:text-warn-400 rounded-xl px-3.5 py-2.5 text-xs font-semibold"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "alert",
    size: 15,
    className: "shrink-0"
  }), "No sound uploaded yet — the spoken voice will be used until you add one."), /*#__PURE__*/React.createElement("label", {
    className: "tsz inline-flex items-center gap-2 h-11 px-4 rounded-xl border-2 border-dashed border-line dark:border-dline hover:border-primary-400 cursor-pointer text-sm font-bold text-muted hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "upload",
    size: 16
  }), busy ? "Uploading…" : tone.customUrl ? "Replace sound file" : "Upload a sound file", /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: "audio/*",
    className: "hidden",
    onChange: onFile,
    disabled: busy
  })), err && /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-danger-600 font-semibold"
  }, err))));
}
function SettingsView({
  account,
  settings,
  setSettings,
  onLogout,
  data,
  activePatientId,
  actions,
  accounts
}) {
  const [, setNotifPermTick] = useState(0); // Notification.permission isn't reactive state — force a re-render after the browser prompt resolves
  return /*#__PURE__*/React.createElement("div", {
    className: "max-w-2xl"
  }, /*#__PURE__*/React.createElement(PageHeader, {
    title: "Settings",
    sub: "Make CareMate feel just right"
  }), /*#__PURE__*/React.createElement(CareCircleSettings, {
    account: account,
    data: data,
    actions: actions,
    accounts: accounts
  }), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Appearance"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: settings.dark ? "moon" : "sun",
    label: "Dark mode",
    desc: "Easier on the eyes at night"
  }, /*#__PURE__*/React.createElement(Toggle, {
    checked: settings.dark,
    onChange: v => setSettings({
      ...settings,
      dark: v
    })
  })), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "type",
    label: "Text size",
    desc: "Make everything bigger or smaller"
  }, /*#__PURE__*/React.createElement(Segmented, {
    value: settings.textSize,
    onChange: v => setSettings({
      ...settings,
      textSize: v
    }),
    options: [{
      value: "normal",
      label: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 13
        }
      }, "A")
    }, {
      value: "large",
      label: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 16
        }
      }, "A")
    }, {
      value: "xlarge",
      label: /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 19
        }
      }, "A")
    }]
  }))), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Accessibility"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "eye",
    label: "High contrast",
    desc: "Deepens borders and secondary text for easier reading"
  }, /*#__PURE__*/React.createElement(Toggle, {
    checked: settings.highContrast,
    onChange: v => setSettings({
      ...settings,
      highContrast: v
    })
  })), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "volume",
    label: "Voice confirmation",
    desc: "Reads reminders aloud and confirms Taken / Snooze / Skip out loud"
  }, /*#__PURE__*/React.createElement(Toggle, {
    checked: settings.voiceAssist,
    onChange: v => setSettings({
      ...settings,
      voiceAssist: v
    })
  })), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "globe",
    label: "Language",
    desc: "Reminder voice & app language"
  }, /*#__PURE__*/React.createElement(Select, {
    value: settings.language,
    onChange: e => setSettings({
      ...settings,
      language: e.target.value
    }),
    className: "!w-40"
  }, /*#__PURE__*/React.createElement("option", null, "English"), /*#__PURE__*/React.createElement("option", null, "हिन्दी"), /*#__PURE__*/React.createElement("option", null, "தமிழ்"), /*#__PURE__*/React.createElement("option", null, "తెలుగు"), /*#__PURE__*/React.createElement("option", null, "मराठी")))), /*#__PURE__*/React.createElement(ReminderSoundSettings, {
    account: account,
    settings: settings,
    setSettings: setSettings
  }), /*#__PURE__*/React.createElement(SettingsGroup, {
    title: "Notifications"
  }, /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "bell",
    label: "Medicine reminders",
    desc: "Get notified at every scheduled time"
  }, /*#__PURE__*/React.createElement(Toggle, {
    checked: settings.notifMed,
    onChange: v => setSettings({
      ...settings,
      notifMed: v
    })
  })), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "alert",
    label: "Missed dose alerts",
    desc: "Alert caregivers if a dose isn't logged"
  }, /*#__PURE__*/React.createElement(Toggle, {
    checked: settings.notifMissed,
    onChange: v => setSettings({
      ...settings,
      notifMissed: v
    })
  })), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "package",
    label: "Low stock reminders",
    desc: "Know before medicine runs out"
  }, /*#__PURE__*/React.createElement(Toggle, {
    checked: settings.notifStock,
    onChange: v => setSettings({
      ...settings,
      notifStock: v
    })
  })), /*#__PURE__*/React.createElement(SettingsRow, {
    icon: "bell",
    label: "Browser notifications",
    desc: typeof Notification !== "undefined" && Notification.permission === "granted" ? "Enabled — you'll get alerts even when this tab isn't focused" : typeof Notification !== "undefined" && Notification.permission === "denied" ? "Blocked in your browser's site settings" : "Turn on so reminders and alerts reach you outside the tab"
  }, typeof Notification !== "undefined" && Notification.permission === "granted" ? /*#__PURE__*/React.createElement(Badge, {
    tone: "secondary"
  }, "On") : typeof Notification !== "undefined" && Notification.permission === "denied" ? /*#__PURE__*/React.createElement(Badge, {
    tone: "danger"
  }, "Blocked") : /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    variant: "outline",
    onClick: () => {
      if (typeof Notification !== "undefined") Notification.requestPermission().then(() => setNotifPermTick(n => n + 1));
    }
  }, "Enable"))), /*#__PURE__*/React.createElement(Card, {
    className: "mt-6 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-11 h-11 rounded-full bg-gradient-to-br from-secondary-400 to-secondary-600 text-white shadow-sm flex items-center justify-center font-extrabold"
  }, account.name.split(" ").map(w => w[0]).slice(0, 2).join("")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold"
  }, account.name), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, account.selfCare ? account.email : account.role === "patient" ? `Patient ID: ${account.loginId}` : account.email))), /*#__PURE__*/React.createElement(Button, {
    variant: "subtleDanger",
    icon: "logout",
    onClick: onLogout
  }, "Log Out")));
}
function SettingsGroup({
  title,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "mb-6"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "tsz text-sm font-extrabold text-muted uppercase tracking-wide mb-2.5 px-1"
  }, title), /*#__PURE__*/React.createElement(Card, {
    className: "!p-5 divide-y divide-line dark:divide-dline"
  }, children));
}
function SettingsRow({
  icon,
  label,
  desc,
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3.5 min-w-0"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-muted flex items-center justify-center shrink-0"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "min-w-0"
  }, /*#__PURE__*/React.createElement("p", {
    className: "tsz font-bold text-sm"
  }, label), /*#__PURE__*/React.createElement("p", {
    className: "tsz text-xs text-muted"
  }, desc))), children);
}

/* =========================================================================
   ROOT APP
   ========================================================================= */
const DEFAULT_SETTINGS = {
  dark: false,
  textSize: "normal",
  highContrast: false,
  voiceAssist: false,
  notifMed: true,
  notifMissed: true,
  notifStock: true,
  language: "English",
  reminderTone: {
    mode: "voice",
    customUrl: null,
    customName: null
  }
};
function App() {
  const [phase, setPhase] = useState("splash"); // splash | onboarding | auth | app
  const [onboarded, setOnboarded] = useLocalState("cm_onboarded", false);
  const [accounts, setAccounts] = useLocalState("cm_accounts", []);
  const [sessionId, setSessionId] = useLocalState("cm_session", null);
  const [settings, setSettings] = useLocalState("cm_settings", DEFAULT_SETTINGS);
  const [patients, setPatients] = useLocalState("cm_patients", []);
  const [medicines, setMedicines] = useLocalState("cm_medicines", []);
  const [history, setHistory] = useLocalState("cm_history", []);
  const [appointments, setAppointments] = useLocalState("cm_appointments", []);
  const [connectionRequests, setConnectionRequests] = useLocalState("cm_connreq", []);
  const [healthRecords, setHealthRecords] = useLocalState("cm_health", []);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [activePatientId, setActivePatientId] = useState(null);
  const [autoOpenAdd, setAutoOpenAdd] = useState(false);
  const [autoOpenAddMed, setAutoOpenAddMed] = useState(false);
  const [completeProfileFor, setCompleteProfileFor] = useState(null); // patient id needing first-run profile completion
  const [historyTab, setHistoryTab] = useState(null);
  const [reminderItem, setReminderItem] = useState(null);
  const [toasts, setToasts] = useState([]);
  const t = (msg, type) => toast(setToasts, msg, type);
  const firedRemindersRef = useRef(new Set()); // "medId|date|time" already auto-popped this session — avoids re-popping on every poll

  const account = accounts.find(a => a.id === sessionId) || null;

  // Browser (OS-level) notification — best-effort, respects the Settings toggles,
  // and simply no-ops if the browser doesn't support it or permission isn't granted.
  const notifyBrowser = (title, body) => {
    try {
      if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
      new Notification(title, {
        body,
        icon: "assets/logo.png"
      });
    } catch (e) {}
  };

  // theme + text size + high contrast to <html>
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", !!settings.dark);
    root.className = root.className.replace(/text-size-\S+/g, "").trim();
    root.classList.add(`text-size-${settings.textSize}`);
    root.classList.toggle("hc", !!settings.highContrast);
    if (settings.dark) root.classList.add("dark");
  }, [settings.dark, settings.textSize, settings.highContrast]);

  // for patient role, lock active patient to their own linked record
  useEffect(() => {
    if (account && account.role === "patient" && account.patientId) setActivePatientId(account.patientId);
  }, [account]);

  // Automatically pop the full-screen reminder the moment a dose's scheduled time
  // arrives — this is what makes it a real reminder rather than something the
  // patient has to remember to open themselves.
  useEffect(() => {
    if (!account || account.role !== "patient" || !account.patientId) return;
    const check = () => {
      if (reminderItem) return; // don't interrupt one already on screen
      const date = todayStr();
      const now = minutesNow();
      const myMeds = medicines.filter(m => m.patientId === account.patientId && isMedicineActiveOn(m, date));
      for (const m of myMeds) {
        for (const time of m.times) {
          const key = `${m.id}|${date}|${time}`;
          if (firedRemindersRef.current.has(key)) continue;
          const already = history.find(h => h.medicineId === m.id && h.date === date && h.time === time);
          if (already) {
            firedRemindersRef.current.add(key);
            continue;
          }
          if (now >= toMin(time)) {
            firedRemindersRef.current.add(key);
            setReminderItem({
              med: m,
              time
            });
            if (settings.notifMed) notifyBrowser(`Time for ${m.name}`, `${m.strength && m.strength !== "N/A" ? m.strength + " · " : ""}${m.foodTiming}`);
            return; // one at a time — the next check picks up the following one
          }
        }
      }
    };
    check();
    const iv = setInterval(check, 15000);
    return () => clearInterval(iv);
  }, [account, medicines, history, reminderItem, settings.notifMed]);

  // passive real-clock missed-dose detector — tags overdue records AND, if a
  // caregiver who manages that patient is the one currently signed in, surfaces
  // it immediately via toast + browser notification rather than staying silent
  // until they happen to check the Alerts tab.
  useEffect(() => {
    if (!patients.length || !medicines.length) return;
    const iv = setInterval(() => {
      const date = todayStr();
      const now = minutesNow();
      const newlyMissed = [];
      setHistory(h => {
        let changed = false;
        const next = [...h];
        medicines.filter(m => isMedicineActiveOn(m, date)).forEach(m => m.times.forEach(time => {
          const exists = next.find(r => r.medicineId === m.id && r.date === date && r.time === time);
          if (!exists && now - toMin(time) >= 30) {
            next.push({
              id: uid(),
              medicineId: m.id,
              patientId: m.patientId,
              date,
              time,
              status: "Missed",
              timestamp: new Date().toISOString(),
              reason: null
            });
            changed = true;
            newlyMissed.push(m);
          }
        }));
        return changed ? next : h;
      });
      if (newlyMissed.length && account && account.role === "caregiver" && settings.notifMissed) {
        newlyMissed.forEach(m => {
          const pat = patients.find(p => p.id === m.patientId);
          if (!pat || !(pat.caregiverIds || []).includes(account.id)) return;
          t(`${pat.name} missed ${m.name} — check in with them.`, "error");
          notifyBrowser(`Missed dose: ${pat.name}`, `${m.name} wasn't taken and no response was logged.`);
        });
      }
    }, 30000);
    return () => clearInterval(iv);
  }, [patients, medicines, account, settings.notifMissed]);

  // Visible patients: caregivers only ever see patients they actually manage.
  // Patient accounts pass through untouched (they look themselves up by id).
  const visiblePatients = account && account.role === "caregiver" ? patients.filter(p => (p.caregiverIds || []).includes(account.id)) : patients;
  const data = {
    patients: visiblePatients,
    medicines,
    history,
    appointments,
    healthRecords,
    connectionRequests
  };
  // Appointment/medicine management: caregivers always can; a patient can too
  // only if they're self-managed (no caregiver — including self-care accounts).
  const myPatientRecord = account && account.role === "patient" ? patients.find(p => p.id === account.patientId) : null;
  const canManageOwnCare = account && account.role === "caregiver" ? true : !!(myPatientRecord && !(myPatientRecord.caregiverIds && myPatientRecord.caregiverIds.length));
  const visiblePatientIds = new Set(visiblePatients.map(p => p.id));
  const alertCount = account && account.role === "caregiver" ? history.filter(h => h.status === "Missed" && visiblePatientIds.has(h.patientId)).length : 0;
  const go = (tab, opts = {}) => {
    setActiveTab(tab);
    setHistoryTab(opts.tab || null);
    if (opts.view) setActivePatientId(opts.view);
    if (opts.openAdd) setAutoOpenAdd(true);
    if (opts.openAddMed) {
      if (!opts.view) setActivePatientId(null);
      setAutoOpenAddMed(true);
    }
  };

  // --- OTP-gated caregiver connection ---------------------------------------
  // A patient (during signup, or later from Settings) enters a caregiver's
  // care code; that generates a one-time code that lands in the *caregiver's*
  // account (visible under Settings → Care circle → Pending requests when
  // they're signed in) rather than connecting instantly. The patient asks the
  // caregiver for the code and enters it to finish linking — this is what
  // stands in, in a backend-less local-storage prototype, for actually
  // emailing/texting the OTP to the caregiver.
  useEffect(() => {
    const iv = setInterval(() => setConnectionRequests(rs => rs.filter(r => Date.now() <= r.expiresAt)), 60000);
    return () => clearInterval(iv);
  }, []);
  const requestConnect = (code, meta) => {
    const cg = accounts.find(a => a.role === "caregiver" && a.careCode === code.trim().toUpperCase());
    if (!cg) return {
      ok: false,
      error: "No caregiver found with that code — double-check and try again."
    };
    if (meta.patientId) {
      const pat = patients.find(p => p.id === meta.patientId);
      if (pat && (pat.caregiverIds || []).includes(cg.id)) return {
        ok: false,
        error: `You're already connected to ${cg.name}.`
      };
    }
    const id = uid();
    const req = {
      id,
      otp: genOtp(),
      caregiverId: cg.id,
      caregiverName: cg.name,
      status: "pending",
      createdAt: Date.now(),
      expiresAt: Date.now() + OTP_TTL_MS,
      ...meta
    };
    setConnectionRequests(rs => [...rs, req]);
    return {
      ok: true,
      requestId: id,
      caregiverName: cg.name
    };
  };
  const resendConnectOtp = requestId => {
    let newOtp = null;
    setConnectionRequests(rs => rs.map(r => {
      if (r.id !== requestId) return r;
      newOtp = genOtp();
      return {
        ...r,
        otp: newOtp,
        createdAt: Date.now(),
        expiresAt: Date.now() + OTP_TTL_MS
      };
    }));
    return newOtp;
  };
  const cancelConnectRequest = requestId => setConnectionRequests(rs => rs.filter(r => r.id !== requestId));
  const verifyConnect = (requestId, otp) => {
    const req = connectionRequests.find(r => r.id === requestId);
    if (!req || req.status !== "pending") return {
      ok: false,
      error: "This request is no longer valid — ask for a new code."
    };
    if (Date.now() > req.expiresAt) {
      setConnectionRequests(rs => rs.filter(r => r.id !== requestId));
      return {
        ok: false,
        error: "That code expired — request a new one."
      };
    }
    if (req.otp !== String(otp).trim()) return {
      ok: false,
      error: "Incorrect code — check with your caregiver and try again."
    };
    if (req.patientId) {
      setPatients(ps => ps.map(p => {
        if (p.id !== req.patientId) return p;
        const existing = p.caregiverIds || [];
        return existing.includes(req.caregiverId) ? p : {
          ...p,
          caregiverIds: [...existing, req.caregiverId]
        };
      }));
    }
    setConnectionRequests(rs => rs.filter(r => r.id !== requestId));
    return {
      ok: true,
      caregiverId: req.caregiverId,
      caregiverName: req.caregiverName
    };
  };
  const actions = {
    togglePatientAccess: accountId => {
      setAccounts(accs => accs.map(a => a.id === accountId ? {
        ...a,
        isActive: !a.isActive
      } : a));
      t("Patient access updated.");
    },
    resetPatientPassword: (accountId, customPw) => {
      if (customPw && customPw.length < 4) {
        t("Password must be at least 4 characters.", "error");
        return;
      }
      const newPw = customPw ? customPw : Math.random().toString(36).slice(2, 10);
      setAccounts(accs => accs.map(a => a.id === accountId ? {
        ...a,
        password: newPw
      } : a));
      t(customPw ? "Password updated." : "Password reset to: " + newPw);
    },
    savePatient: f => {
      if (f.id) {
        setPatients(ps => ps.map(p => p.id === f.id ? {
          ...p,
          ...f
        } : p));
        t("Patient details updated.");
      } else {
        const {
          loginPassword,
          ...patientFields
        } = f;
        const np = {
          ...patientFields,
          id: uid(),
          emergencyContacts: [],
          caregiverIds: [account.id]
        };
        const loginId = "P-" + Math.random().toString(36).slice(2, 8).toUpperCase();
        const loginPw = loginPassword && loginPassword.trim() ? loginPassword.trim() : Math.random().toString(36).slice(2, 10);
        const newAcct = {
          id: uid(),
          name: np.name,
          role: "patient",
          patientId: np.id,
          loginId,
          password: loginPw,
          isActive: true
        };
        setAccounts(accs => [...accs, newAcct]);
        setPatients(ps => [...ps, np]);
        setActivePatientId(np.id);
        t("Patient added with ID: " + loginId);
      }
    },
    saveMedicine: f => {
      if (f.id) {
        setMedicines(ms => ms.map(m => m.id === f.id ? {
          ...m,
          ...f
        } : m));
        t("Medicine updated.");
      } else {
        setMedicines(ms => [...ms, {
          ...f,
          id: uid()
        }]);
        t("Medicine added — reminders are now active.");
      }
    },
    deleteMedicine: id => {
      setMedicines(ms => ms.filter(m => m.id !== id));
      setHistory(h => h.filter(r => r.medicineId !== id));
      t("Medicine removed.", "warn");
    },
    saveAppointment: f => {
      if (f.id) {
        setAppointments(a => a.map(x => x.id === f.id ? {
          ...x,
          ...f
        } : x));
        t("Appointment updated.");
      } else {
        setAppointments(a => [...a, {
          ...f,
          id: uid()
        }]);
        t("Appointment scheduled.");
      }
    },
    deleteAppointment: id => {
      setAppointments(a => a.filter(x => x.id !== id));
      t("Appointment removed.", "warn");
    },
    dismissAlert: id => {
      setHistory(h => h.map(r => r.id === id ? {
        ...r,
        status: "Skipped",
        reason: "Dismissed by caregiver"
      } : r));
      t("Alert dismissed.");
    },
    connectCaregiver: code => {
      const res = requestConnect(code, {
        patientId: account.patientId
      });
      if (!res.ok) {
        t(res.error, "error");
        return null;
      }
      t(`Code sent to ${res.caregiverName}'s account. Ask them for the OTP to finish connecting.`);
      return res.requestId;
    },
    verifyConnectOtp: (requestId, otp) => {
      const res = verifyConnect(requestId, otp);
      if (!res.ok) {
        t(res.error, "error");
        return false;
      }
      t(`Connected to ${res.caregiverName}. They can now see your medicines and progress.`);
      return true;
    },
    resendConnectOtp,
    cancelConnectRequest,
    disconnectCaregiver: caregiverId => {
      const pat = patients.find(p => p.id === account.patientId);
      const cg = accounts.find(a => a.id === caregiverId);
      if (!account.selfCare && pat && (pat.caregiverIds || []).length <= 1) {
        t("You need at least one connected caregiver — connect another before disconnecting this one.", "error");
        return;
      }
      setPatients(ps => ps.map(p => p.id === account.patientId ? {
        ...p,
        caregiverIds: (p.caregiverIds || []).filter(id => id !== caregiverId)
      } : p));
      t(`Disconnected from ${cg ? cg.name : "caregiver"}.`, "warn");
    },
    rejectConnectRequest: requestId => {
      cancelConnectRequest(requestId);
      t("Request dismissed.");
    },
    saveHealthRecord: f => {
      if (f.id) {
        setHealthRecords(hs => hs.map(h => h.id === f.id ? {
          ...h,
          ...f
        } : h));
        t("Reading updated.");
      } else {
        setHealthRecords(hs => [...hs, {
          ...f,
          id: uid(),
          createdAt: new Date().toISOString()
        }]);
        t("Reading logged.");
      }
    },
    deleteHealthRecord: id => {
      setHealthRecords(hs => hs.filter(h => h.id !== id));
      t("Reading removed.", "warn");
    }
  };
  const respondReminder = ({
    status,
    snoozeMin,
    reason,
    voiceNote
  }) => {
    if (!reminderItem) return;
    const {
      med,
      time
    } = reminderItem;
    const date = todayStr();
    setHistory(h => {
      const idx = h.findIndex(r => r.medicineId === med.id && r.date === date && r.time === time);
      const rec = {
        id: idx >= 0 ? h[idx].id : uid(),
        medicineId: med.id,
        patientId: med.patientId,
        date,
        time,
        status,
        timestamp: new Date().toISOString(),
        reason: reason || null,
        voiceNote: voiceNote || null
      };
      if (idx >= 0) {
        const next = [...h];
        next[idx] = rec;
        return next;
      }
      return [...h, rec];
    });
    const noteTag = voiceNote ? " (voice note attached for your caregiver)" : "";
    if (status === "Taken") {
      setMedicines(ms => ms.map(m => {
        if (m.id !== med.id) return m;
        if (!m.trackStock) return m;
        const stock = Math.max(0, m.stock - 1);
        if (stock <= m.minStock) t(`${m.name} is running low — ${stock} tablets left.`, "warn");
        return {
          ...m,
          stock
        };
      }));
      t(`${med.name} marked as taken.`);
    } else if (status === "Skipped") {
      t(`${med.name} marked as skipped.${noteTag}`, "warn");
    } else if (status === "Snoozed") {
      t(`Snoozing ${med.name} for ${snoozeMin} min.${noteTag}`);
      setTimeout(() => setReminderItem({
        med,
        time
      }), Math.min(snoozeMin, 60) * 1000);
    }
    setReminderItem(null);
  };
  const onEscalate = () => {
    if (!reminderItem) return;
    const {
      med,
      time
    } = reminderItem;
    const date = todayStr();
    setHistory(h => {
      const exists = h.find(r => r.medicineId === med.id && r.date === date && r.time === time);
      if (exists) return h;
      return [...h, {
        id: uid(),
        medicineId: med.id,
        patientId: med.patientId,
        date,
        time,
        status: "Missed",
        timestamp: new Date().toISOString(),
        reason: null
      }];
    });
    t(`No response for ${med.name} — caregiver has been notified.`, "error");
  };
  const openReminder = item => setReminderItem(item);

  // ---- Auth handlers ----
  const onAuthed = (existingAccount, signupFields) => {
    if (existingAccount) {
      setSessionId(existingAccount.id);
      setPhase("app");
      t(`Welcome back, ${existingAccount.name.split(" ")[0]}.`);
      return;
    }
    // signup
    const newAccount = {
      id: uid(),
      name: signupFields.name,
      email: signupFields.email || null,
      password: signupFields.password,
      role: signupFields.role,
      careCode: signupFields.role === "caregiver" ? genCareCode() : null,
      loginId: signupFields.role === "patient" ? signupFields.loginId : null,
      selfCare: !!signupFields.selfCare,
      isActive: true,
      patientId: null
    };
    if (signupFields.role === "patient") {
      const newPatient = {
        id: uid(),
        name: signupFields.name,
        age: "",
        gender: "",
        medicalNotes: "",
        emergencyContacts: [],
        caregiverIds: signupFields.matchedCaregiverId ? [signupFields.matchedCaregiverId] : []
      };
      newAccount.patientId = newPatient.id;
      setPatients(ps => [...ps, newPatient]);
      setCompleteProfileFor(newPatient.id);
    }
    setAccounts(as => [...as, newAccount]);
    setSessionId(newAccount.id);
    setPhase("app");
    if (signupFields.role === "caregiver") {
      setActiveTab("patients");
      setAutoOpenAdd(true);
    }
    t(signupFields.role === "caregiver" ? `Account created! Your care code is ${newAccount.careCode} — share it with your patient.` : signupFields.selfCare ? `Account created! Log in any time with ${newAccount.email}.` : `Account created! Your Patient ID is ${newAccount.loginId} — save it, you'll need it to log in next time.`);
  };
  const loadDemo = role => {
    let s = seedData();
    const existingDemo = accounts.find(a => a.id === "acc_demo_caregiver");
    if (!existingDemo) {
      setAccounts(as => [...as, ...s.accounts]);
      setPatients(ps => [...ps, ...s.patients]);
      setMedicines(ms => [...ms, ...s.medicines]);
      setHistory(h => [...h, ...s.history]);
      setAppointments(a => [...a, ...s.appointments]);
    }
    const targetId = role === "caregiver" ? "acc_demo_caregiver" : "acc_demo_patient";
    setSessionId(targetId);
    setPhase("app");
    setActiveTab("dashboard");
    t("Exploring with demo data — nothing here is real.");
  };
  const logout = () => {
    setSessionId(null);
    setPhase("auth");
    setActiveTab("dashboard");
    setActivePatientId(null);
    t("Signed out.");
  };
  if (phase === "splash") return /*#__PURE__*/React.createElement(Splash, {
    onDone: () => setPhase(onboarded ? account ? "app" : "auth" : "onboarding")
  });
  if (phase === "onboarding") return /*#__PURE__*/React.createElement(Onboarding, {
    onDone: () => {
      setOnboarded(true);
      setPhase(account ? "app" : "auth");
    }
  });
  if (phase === "auth" || !account) return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Auth, {
    accounts: accounts,
    onAuthed: onAuthed,
    onDemo: loadDemo,
    onResetPassword: (accountId, newPw) => {
      setAccounts(accs => accs.map(a => a.id === accountId ? {
        ...a,
        password: newPw
      } : a));
      t("Password reset — you can log in now.");
    },
    onRequestOtp: requestConnect,
    onVerifyOtp: verifyConnect,
    onResendOtp: resendConnectOtp,
    onCancelOtp: cancelConnectRequest
  }), /*#__PURE__*/React.createElement(ToastHost, {
    toasts: toasts
  }));
  const navItems = account.role === "caregiver" ? NAV_CAREGIVER : NAV_PATIENT;
  const renderView = () => {
    if (account.role === "caregiver") {
      switch (activeTab) {
        case "dashboard":
          return /*#__PURE__*/React.createElement(CaregiverDashboard, {
            data: data,
            go: go,
            openReminder: openReminder
          });
        case "patients":
          return /*#__PURE__*/React.createElement(PatientsView, {
            data: data,
            accounts: accounts,
            actions: actions,
            role: "caregiver",
            activeId: activePatientId,
            setActiveId: setActivePatientId,
            autoOpenAdd: autoOpenAdd,
            autoOpenAddMed: autoOpenAddMed,
            clearAuto: () => {
              setAutoOpenAdd(false);
              setAutoOpenAddMed(false);
            },
            go: go
          });
        case "history":
          return /*#__PURE__*/React.createElement(HistoryView, {
            data: data,
            role: "caregiver",
            initialTab: historyTab
          });
        case "alerts":
          return /*#__PURE__*/React.createElement(AlertsView, {
            data: data,
            actions: actions,
            toastFn: t
          });
        case "appointments":
          return /*#__PURE__*/React.createElement(AppointmentsView, {
            data: data,
            actions: actions,
            role: "caregiver",
            activePatientId: activePatientId,
            canManage: canManageOwnCare
          });
        case "health":
          return /*#__PURE__*/React.createElement(HealthView, {
            data: data,
            actions: actions,
            role: "caregiver",
            activePatientId: activePatientId
          });
        case "settings":
          return /*#__PURE__*/React.createElement(SettingsView, {
            account: account,
            settings: settings,
            setSettings: setSettings,
            onLogout: logout,
            data: data,
            activePatientId: activePatientId,
            actions: actions,
            accounts: accounts
          });
        default:
          return null;
      }
    }
    switch (activeTab) {
      case "dashboard":
        return /*#__PURE__*/React.createElement(PatientDashboard, {
          data: data,
          activePatientId: activePatientId,
          openReminder: openReminder,
          go: go
        });
      case "medicines":
        return /*#__PURE__*/React.createElement(PatientsView, {
          data: data,
          accounts: accounts,
          actions: actions,
          role: "patient",
          activeId: activePatientId,
          setActiveId: () => {},
          go: go
        });
      case "history":
        return /*#__PURE__*/React.createElement(HistoryView, {
          data: data,
          role: "patient",
          activePatientId: activePatientId
        });
      case "appointments":
        return /*#__PURE__*/React.createElement(AppointmentsView, {
          data: data,
          actions: actions,
          role: "patient",
          activePatientId: activePatientId,
          canManage: canManageOwnCare
        });
      case "health":
        return /*#__PURE__*/React.createElement(HealthView, {
          data: data,
          actions: actions,
          role: "patient",
          activePatientId: activePatientId
        });
      case "settings":
        return /*#__PURE__*/React.createElement(SettingsView, {
          account: account,
          settings: settings,
          setSettings: setSettings,
          onLogout: logout,
          data: data,
          activePatientId: activePatientId,
          actions: actions,
          accounts: accounts
        });
      default:
        return null;
    }
  };
  const completingProfile = completeProfileFor && patients.find(p => p.id === completeProfileFor);
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen w-full bg-slate-100 dark:bg-[#0B1220] flex justify-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-md bg-canvas dark:bg-dcanvas min-h-screen relative shadow-2xl flex flex-col overflow-hidden"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0 flex flex-col overflow-y-auto"
  }, /*#__PURE__*/React.createElement(Topbar, {
    user: account,
    onLogout: logout,
    dark: settings.dark,
    setDark: v => setSettings({
      ...settings,
      dark: v
    }),
    alertCount: alertCount,
    onOpenAlerts: account && account.role === "caregiver" ? () => go("alerts") : null
  }), /*#__PURE__*/React.createElement("main", {
    className: "w-full px-4 py-6 pb-28"
  }, renderView())), /*#__PURE__*/React.createElement(BottomTabs, {
    items: navItems,
    active: activeTab,
    setActive: setActiveTab
  }), reminderItem && /*#__PURE__*/React.createElement(ReminderOverlay, {
    item: reminderItem,
    onRespond: respondReminder,
    onClose: () => setReminderItem(null),
    onEscalate: onEscalate,
    voiceAssist: settings.voiceAssist,
    reminderTone: settings.reminderTone || DEFAULT_SETTINGS.reminderTone
  }), /*#__PURE__*/React.createElement(CompleteProfileModal, {
    open: !!completingProfile,
    patient: completingProfile,
    onSave: f => {
      actions.savePatient({
        ...f,
        id: completeProfileFor
      });
      setCompleteProfileFor(null);
    }
  }), /*#__PURE__*/React.createElement(ToastHost, {
    toasts: toasts
  })));
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(/*#__PURE__*/React.createElement(App, null));