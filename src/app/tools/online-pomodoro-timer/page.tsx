"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { faqSchema } from "./faqSchema";
import { pomodoroFaqs } from "@/lib/faqs";
import ToolFaq from "@/app/components/tools/faq/ToolFaq";

/* ─────────────────────────────────────────────
   TYPES & CONSTANTS
───────────────────────────────────────────── */
type Mode = "focus" | "short" | "long";
type Task = {
  id: string;
  text: string;
  est: number;
  done: number;
  finished: boolean;
  note: string;
};

const MODE_CONFIG: Record<Mode, { label: string; mins: number; color: string; bg: string; lightBg: string }> = {
  focus: { label: "Focus", mins: 25, color: "#6366f1", bg: "#4f46e5", lightBg: "rgba(99,102,241,0.12)" },
  short: { label: "Short Break", mins: 5, color: "#10b981", bg: "#059669", lightBg: "rgba(16,185,129,0.12)" },
  long: { label: "Long Break", mins: 15, color: "#f59e0b", bg: "#d97706", lightBg: "rgba(245,158,11,0.12)" },
};

const SOUNDS = [
  { id: "bell", label: "Bell" },
  { id: "digital", label: "Digital" },
  { id: "chime", label: "Chime" },
  { id: "none", label: "None" },
];

const AMBIENT = [
  { id: "none", label: "None" },
  { id: "rain", label: "🌧 Rain" },
  { id: "cafe", label: "☕ Café" },
  { id: "forest", label: "🌲 Forest" },
  { id: "waves", label: "🌊 Waves" },
];


/* ─────────────────────────────────────────────
   THEMES — per-mode background + text colors
───────────────────────────────────────────── */
type ThemeId = "default" | "crimson" | "ocean" | "forest" | "midnight" | "sunset" | "rose" | "slate" | "amber" | "teal" | "charcoal" | "lavender";

type ThemeMode = { bg: string; color: string; textOnBg: string };
type Theme = {
  id: ThemeId;
  label: string;
  swatch: string;            // preview color in the picker
  focus: ThemeMode;
  short: ThemeMode;
  long: ThemeMode;
};

// textOnBg = "light" → use white text; "dark" → use dark text
function txt(light: boolean) { return light ? "#ffffff" : "#1a1a2e"; }
function mTxt(light: boolean, opacity = 0.65) {
  return light ? `rgba(255,255,255,${opacity})` : `rgba(26,26,46,${opacity})`;
}

const THEMES: Theme[] = [
  {
    id: "default", label: "Indigo", swatch: "#4f46e5",
    focus: { bg: "#4f46e5", color: "#6366f1", textOnBg: "light" },
    short: { bg: "#059669", color: "#10b981", textOnBg: "light" },
    long: { bg: "#d97706", color: "#f59e0b", textOnBg: "light" },
  },
  {
    id: "crimson", label: "Crimson", swatch: "#b91c1c",
    focus: { bg: "#b91c1c", color: "#ef4444", textOnBg: "light" },
    short: { bg: "#15803d", color: "#22c55e", textOnBg: "light" },
    long: { bg: "#c2410c", color: "#f97316", textOnBg: "light" },
  },
  {
    id: "ocean", label: "Ocean", swatch: "#0e7490",
    focus: { bg: "#0e7490", color: "#06b6d4", textOnBg: "light" },
    short: { bg: "#1d4ed8", color: "#3b82f6", textOnBg: "light" },
    long: { bg: "#0f766e", color: "#14b8a6", textOnBg: "light" },
  },
  {
    id: "forest", label: "Forest", swatch: "#166534",
    focus: { bg: "#166534", color: "#22c55e", textOnBg: "light" },
    short: { bg: "#065f46", color: "#10b981", textOnBg: "light" },
    long: { bg: "#854d0e", color: "#eab308", textOnBg: "light" },
  },
  {
    id: "midnight", label: "Midnight", swatch: "#1e1b4b",
    focus: { bg: "#1e1b4b", color: "#818cf8", textOnBg: "light" },
    short: { bg: "#134e4a", color: "#2dd4bf", textOnBg: "light" },
    long: { bg: "#312e81", color: "#a5b4fc", textOnBg: "light" },
  },
  {
    id: "sunset", label: "Sunset", swatch: "#c2410c",
    focus: { bg: "#c2410c", color: "#fb923c", textOnBg: "light" },
    short: { bg: "#9d174d", color: "#f472b6", textOnBg: "light" },
    long: { bg: "#7c3aed", color: "#c084fc", textOnBg: "light" },
  },
  {
    id: "rose", label: "Rose", swatch: "#9f1239",
    focus: { bg: "#9f1239", color: "#fb7185", textOnBg: "light" },
    short: { bg: "#7c3aed", color: "#c084fc", textOnBg: "light" },
    long: { bg: "#c2410c", color: "#fdba74", textOnBg: "light" },
  },
  {
    id: "slate", label: "Slate", swatch: "#334155",
    focus: { bg: "#334155", color: "#94a3b8", textOnBg: "light" },
    short: { bg: "#1e3a5f", color: "#60a5fa", textOnBg: "light" },
    long: { bg: "#374151", color: "#9ca3af", textOnBg: "light" },
  },
  {
    id: "amber", label: "Amber", swatch: "#b45309",
    focus: { bg: "#b45309", color: "#fbbf24", textOnBg: "light" },
    short: { bg: "#0e7490", color: "#22d3ee", textOnBg: "light" },
    long: { bg: "#166534", color: "#4ade80", textOnBg: "light" },
  },
  {
    id: "teal", label: "Teal", swatch: "#0f766e",
    focus: { bg: "#0f766e", color: "#2dd4bf", textOnBg: "light" },
    short: { bg: "#1d4ed8", color: "#93c5fd", textOnBg: "light" },
    long: { bg: "#065f46", color: "#6ee7b7", textOnBg: "light" },
  },
  {
    id: "charcoal", label: "Charcoal", swatch: "#18181b",
    focus: { bg: "#18181b", color: "#a1a1aa", textOnBg: "light" },
    short: { bg: "#27272a", color: "#d4d4d8", textOnBg: "light" },
    long: { bg: "#1c1917", color: "#a8a29e", textOnBg: "light" },
  },
  {
    id: "lavender", label: "Lavender", swatch: "#7c3aed",
    focus: { bg: "#7c3aed", color: "#c4b5fd", textOnBg: "light" },
    short: { bg: "#db2777", color: "#f9a8d4", textOnBg: "light" },
    long: { bg: "#0e7490", color: "#67e8f9", textOnBg: "light" },
  },
];

function uid() { return Math.random().toString(36).slice(2, 9); }
function pad(n: number) { return String(n).padStart(2, "0"); }
function fmt(s: number) { return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`; }

/* ─────────────────────────────────────────────
   WEB AUDIO — alarm beep (generated, no file)
───────────────────────────────────────────── */
function createBeep(type: string): () => void {
  // returns a "stop" function
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === "bell") { osc.type = "sine"; osc.frequency.value = 880; }
    if (type === "digital") { osc.type = "square"; osc.frequency.value = 440; }
    if (type === "chime") { osc.type = "triangle"; osc.frequency.value = 660; }

    // Repeating pattern: beep 0.6s → silence 0.4s → repeat
    let stopped = false;
    function scheduleBeep(startAt: number) {
      if (stopped) return;
      gain.gain.setValueAtTime(0.4, startAt);
      gain.gain.setValueAtTime(0, startAt + 0.6);
      // schedule next beep 1s after this one starts
      const nextAt = startAt + 1.0;
      const delay = (nextAt - ctx.currentTime) * 1000;
      setTimeout(() => scheduleBeep(nextAt), delay);
    }
    osc.start();
    scheduleBeep(ctx.currentTime);

    return () => {
      stopped = true;
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(0, ctx.currentTime);
      osc.stop();
      ctx.close();
    };
  } catch {
    return () => { };
  }
}

/* ═══════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════ */
export default function PomodoroPage() {
  /* ── timer ── */
  const [mode, setMode] = useState<Mode>("focus");
  const [secs, setSecs] = useState(MODE_CONFIG.focus.mins * 60);
  const [running, setRunning] = useState(false);
  const [pomoDone, setPomoDone] = useState(0);
  const [round, setRound] = useState(1);

  /* ── alarm ringing state ── */
  const [alarmRinging, setAlarmRinging] = useState(false);
  const stopAlarmRef = useRef<(() => void) | null>(null);

  /* ── tasks ── */
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskEst, setNewTaskEst] = useState(1);
  const [newTaskNote, setNewTaskNote] = useState("");
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  /* ── settings ── */
  const [showSettings, setShowSettings] = useState(false);
  const [cfgFocus, setCfgFocus] = useState(25);
  const [cfgShort, setCfgShort] = useState(5);
  const [cfgLong, setCfgLong] = useState(15);
  const [cfgLongAfter, setCfgLongAfter] = useState(4);
  const [autoStart, setAutoStart] = useState(false);
  const [alarmSound, setAlarmSound] = useState("bell");
  const [ambientSound, setAmbientSound] = useState("none");
  const [ambientVol, setAmbientVol] = useState(0.4);
  const [darkMode, setDarkMode] = useState(false);
  const [themeId, setThemeId] = useState<ThemeId>("default");
  const [showTheme, setShowTheme] = useState(false);

  /* ── session log ── */
  const [sessionLog, setSessionLog] = useState<{ date: string; mode: Mode; mins: number }[]>([]);

  /* ── refs ── */
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);

  const cfg = { focus: cfgFocus, short: cfgShort, long: cfgLong };

  /* ── reset timer on mode / config change ── */
  useEffect(() => {
    if (!running) {
      const m = mode === "focus" ? "focus" : mode === "short" ? "short" : "long";
      setSecs(cfg[m] * 60);
    }
  }, [mode, cfgFocus, cfgShort, cfgLong]);

  /* ── countdown tick ── */
  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            handleTimerEnd();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current!);
    }
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  /* ── ambient sound: play/stop when running or selection changes ── */
  useEffect(() => {
    // Stop previous ambient
    if (ambientRef.current) {
      ambientRef.current.pause();
      ambientRef.current.currentTime = 0;
      ambientRef.current = null;
    }

    // Start new ambient if timer running and a sound is selected
    if (running && ambientSound !== "none") {
      const audio = new Audio(`/sounds/${ambientSound}.mp3`);
      audio.loop = true;
      audio.volume = ambientVol;
      audio.play().catch(() => {
        // Browser may block autoplay — user must interact first (they clicked Start, so this should be fine)
      });
      ambientRef.current = audio;
    }

    return () => {
      ambientRef.current?.pause();
    };
  }, [running, ambientSound]);

  /* ── update ambient volume live ── */
  useEffect(() => {
    if (ambientRef.current) ambientRef.current.volume = ambientVol;
  }, [ambientVol]);

  /* ── browser tab title ── */
  useEffect(() => {
    document.title = alarmRinging
      ? "🔔 Time's up! — ForgeCode Timer"
      : running
        ? `${fmt(secs)} — ${MODE_CONFIG[mode].label} | ForgeCode Timer`
        : "ForgeCode Timer | Focus & Productivity";
  }, [secs, running, mode, alarmRinging]);

  /* ── persist ── */
  useEffect(() => {
    const log = localStorage.getItem("fch-timer-log");
    const saved = localStorage.getItem("fch-timer-tasks");
    if (log) setSessionLog(JSON.parse(log));
    if (saved) setTasks(JSON.parse(saved));
  }, []);
  useEffect(() => { localStorage.setItem("fch-timer-log", JSON.stringify(sessionLog)); }, [sessionLog]);
  useEffect(() => { localStorage.setItem("fch-timer-tasks", JSON.stringify(tasks)); }, [tasks]);

  /* ── STOP ALARM (call when user dismisses) ── */
  function stopAlarm() {
    if (stopAlarmRef.current) { stopAlarmRef.current(); stopAlarmRef.current = null; }
    setAlarmRinging(false);
  }

  /* ── TIMER END ── */
  function handleTimerEnd() {
    setRunning(false);

    // ── Start repeating alarm (keeps ringing until user clicks Stop) ──
    if (alarmSound !== "none") {
      const stop = createBeep(alarmSound);
      stopAlarmRef.current = stop;
      setAlarmRinging(true);
    }

    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("ForgeCode Timer 🔔", {
        body: `${MODE_CONFIG[mode].label} session complete! Click Stop Alarm to dismiss.`,
        requireInteraction: true,  // stays until user interacts
      });
    }

    // Log session
    const mins = cfg[mode === "focus" ? "focus" : mode === "short" ? "short" : "long"];
    setSessionLog(l => [...l, { date: new Date().toISOString(), mode, mins }]);

    if (mode === "focus") {
      const newDone = pomoDone + 1;
      setPomoDone(newDone);
      if (activeTask) setTasks(ts => ts.map(t => t.id === activeTask ? { ...t, done: t.done + 1 } : t));
      const goLong = round % cfgLongAfter === 0;
      setMode(goLong ? "long" : "short");
      setRound(r => goLong ? 1 : r + 1);
    } else {
      setMode("focus");
    }

    if (autoStart) setTimeout(() => setRunning(true), 500);
  }

  function startStop() {
    if (alarmRinging) { stopAlarm(); return; }   // clicking start while alarm rings = stop alarm
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    setRunning(r => !r);
  }

  function resetTimer() {
    stopAlarm();
    setRunning(false);
    const m = mode === "focus" ? "focus" : mode === "short" ? "short" : "long";
    setSecs(cfg[m] * 60);
  }

  function switchMode(m: Mode) {
    stopAlarm();
    setRunning(false);
    setMode(m);
    setSecs(cfg[m === "focus" ? "focus" : m === "short" ? "short" : "long"] * 60);
  }

  /* ── tasks ── */
  function addTask() {
    if (!newTaskText.trim()) return;
    setTasks(ts => [...ts, { id: uid(), text: newTaskText.trim(), est: newTaskEst, done: 0, finished: false, note: newTaskNote }]);
    setNewTaskText(""); setNewTaskEst(1); setNewTaskNote(""); setAddingTask(false);
  }
  function deleteTask(id: string) { setTasks(ts => ts.filter(t => t.id !== id)); if (activeTask === id) setActiveTask(null); }
  function toggleFinished(id: string) { setTasks(ts => ts.map(t => t.id === id ? { ...t, finished: !t.finished } : t)); }

  /* ── stats ── */
  const todayStr = new Date().toDateString();
  const todayMins = sessionLog.filter(l => new Date(l.date).toDateString() === todayStr && l.mode === "focus").reduce((s, l) => s + l.mins, 0);
  const weekMins = sessionLog.filter(l => { const d = new Date(l.date); return (Date.now() - d.getTime()) / 86400000 < 7 && l.mode === "focus"; }).reduce((s, l) => s + l.mins, 0);

  /* ── progress ring ── */
  const totalSecs = cfg[mode === "focus" ? "focus" : mode === "short" ? "short" : "long"] * 60;
  const progress = 1 - secs / totalSecs;
  const R = 110, C = 2 * Math.PI * R;

  /* ── active theme ── */
  const activeTheme = THEMES.find(t => t.id === themeId) ?? THEMES[0];
  const modeTheme = activeTheme[mode];                     // { bg, color, textOnBg }
  const isLightText = modeTheme.textOnBg === "light";
  const onBg = isLightText ? "#ffffff" : "#1a1a2e";   // primary text on colored bg
  const onBgMuted = isLightText ? "rgba(255,255,255,0.62)" : "rgba(26,26,46,0.55)";
  const onBgSubtle = isLightText ? "rgba(255,255,255,0.22)" : "rgba(26,26,46,0.14)";

  // mc kept for compatibility — now driven by theme
  const mc = {
    label: MODE_CONFIG[mode].label,
    color: modeTheme.color,
    bg: modeTheme.bg,
    lightBg: `${modeTheme.color}18`,
  };

  /* ── page theme (right side / nav) ── */
  const bg = darkMode ? "#0d0f1a" : "#f8f7ff";
  const surface = darkMode ? "#13162a" : "#ffffff";
  const border = darkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const text_c = darkMode ? "#e8e8f0" : "#1a1a2e";
  const muted = darkMode ? "rgba(255,255,255,0.38)" : "rgba(0,0,0,0.4)";
  const cardBg = darkMode ? "#1a1d35" : "#ffffff";

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text_c, fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .timer-font{font-family:'JetBrains Mono',monospace;}
        .heading-font{font-family:'Outfit',sans-serif;}
        .pulse-ring{animation:pulseRing 2s ease-in-out infinite;}
        .alarm-ring{animation:alarmPulse 0.5s ease-in-out infinite;}
        @keyframes pulseRing{0%,100%{transform:scale(1);}50%{transform:scale(1.03);}}
        @keyframes alarmPulse{0%,100%{transform:scale(1);filter:brightness(1);}50%{transform:scale(1.06);filter:brightness(1.15);}}
        .slide-in{animation:slideIn 0.3s ease;}
        @keyframes slideIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
        ::-webkit-scrollbar{width:5px;}
        ::-webkit-scrollbar-thumb{background:${darkMode ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)"};border-radius:3px;}

        /* ── RESPONSIVE ── */
        .main-grid{display:grid;grid-template-columns:1fr 1fr;min-height:calc(100vh - 105px);}
        .left-panel{position:sticky;top:105px;min-height:calc(100vh - 105px);}
        .right-panel{overflow-y:auto;max-height:calc(100vh - 105px);position:sticky;top:105px;}
        @media(max-width:900px){
          .main-grid{grid-template-columns:1fr!important;}
          .left-panel{position:static!important;min-height:auto!important;}
          .right-panel{position:static!important;max-height:none!important;overflow-y:visible!important;}
        }
        @media(max-width:600px){
          .left-panel{padding:24px 16px!important;}
          .right-panel{padding:28px 18px!important;}
          .settings-grid{grid-template-columns:1fr 1fr!important;}
          .feat-grid{grid-template-columns:1fr!important;}
          .stat-grid{grid-template-columns:1fr 1fr!important;}
        }
      `}</style>

      {/* ── ALARM BANNER ── */}
      {alarmRinging && (
        <div className="slide-in" style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 999, background: mode === "focus" ? "#ef4444" : mode === "short" ? "#10b981" : "#f59e0b", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 24, animation: "alarmPulse 0.5s ease-in-out infinite" }}>🔔</span>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: "#fff", fontFamily: "'Outfit',sans-serif" }}>
                {MODE_CONFIG[mode].label} session complete!
              </div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.8)" }}>
                Alarm is ringing — click Stop Alarm to dismiss
              </div>
            </div>
          </div>
          <button onClick={stopAlarm}
            style={{ padding: "10px 24px", background: "#fff", color: "#111", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 800, fontSize: 14, fontFamily: "'Outfit',sans-serif", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            ⏹ Stop Alarm
          </button>
        </div>
      )}

      {/* ── TOP NAV ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#272537", borderBottom: "1px solid ${border}", padding: "10px 20px", flexShrink: 0 }}>
        <Link href="/" className="logo">
          <div
            className="logo-icon"
            style={{ width: 22, height: 22, fontSize: 11 }}
          >
            ⚒
          </div>
          ForgeCodeHub
        </Link>
        <Link
          href="/"
          style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            fontSize: 12, fontWeight: 500, color: "rgb(232, 105, 42)",
            textDecoration: "none", padding: "6px 8px",
            borderRadius: 6,
            whiteSpace: "nowrap", transition: "color 0.15s, border-color 0.15s",
          }}
        >
          ← All Tools
        </Link>
      </div>
      <nav style={{ display: "flex", alignItems: "center", padding: "12px 28px", background: surface, borderBottom: `1px solid ${border}`, position: "sticky", top: alarmRinging ? 48 : 0, zIndex: 100, backdropFilter: "blur(12px)", transition: "top 0.3s" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: mc.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, transition: "background 0.4s" }}>⏱</div>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: 16, color: text_c }}>
            ForgeCodeHub <span style={{ color: mc.color, transition: "color 0.4s" }}>Timer</span>
          </span>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <button onClick={() => setDarkMode(d => !d)}
            style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${border}`, borderRadius: 7, background: "transparent", color: text_c, cursor: "pointer" }}>
            {darkMode ? "☀ Light" : "🌙 Dark"}
          </button>
          <button onClick={() => { setShowTheme(t => !t); setShowSettings(false); }}
            style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${border}`, borderRadius: 7, background: showTheme ? mc.color : "transparent", color: showTheme ? "#fff" : text_c, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 12, height: 12, borderRadius: "50%", background: activeTheme.swatch, display: "inline-block", border: "1.5px solid rgba(255,255,255,0.4)" }} />
            Theme
          </button>
          <button onClick={() => { setShowSettings(s => !s); setShowTheme(false); }}
            style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${border}`, borderRadius: 7, background: showSettings ? mc.color : "transparent", color: showSettings ? "#fff" : text_c, cursor: "pointer", transition: "all 0.2s" }}>
            ⚙ Settings
          </button>
        </div>
      </nav>

      {/* ── SETTINGS PANEL ── */}
      {showSettings && (
        <div className="slide-in" style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "20px 28px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div className="settings-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 20 }}>
              {[
                { label: "Focus (mins)", val: cfgFocus, set: setCfgFocus },
                { label: "Short Break (mins)", val: cfgShort, set: setCfgShort },
                { label: "Long Break (mins)", val: cfgLong, set: setCfgLong },
                { label: "Long break after #", val: cfgLongAfter, set: setCfgLongAfter },
              ].map(({ label, val, set }) => (
                <div key={label}>
                  <div style={{ fontSize: 11, color: muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button onClick={() => set((v: number) => Math.max(1, v - 1))} style={NB(border, text_c)}>−</button>
                    <span style={{ fontSize: 20, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, minWidth: 36, textAlign: "center" }}>{val}</span>
                    <button onClick={() => set((v: number) => v + 1)} style={NB(border, text_c)}>+</button>
                  </div>
                </div>
              ))}

              {/* Alarm sound */}
              <div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Alarm Sound</div>
                <select value={alarmSound} onChange={e => setAlarmSound(e.target.value)} style={SEL(surface, border, text_c)}>
                  {SOUNDS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                <button onClick={() => { if (alarmSound !== "none") { const stop = createBeep(alarmSound); setTimeout(stop, 3000); } }}
                  style={{ marginTop: 6, fontSize: 11, color: mc.color, background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                  ▶ Test (3s)
                </button>
              </div>

              {/* Ambient sound */}
              <div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Ambient Sound</div>
                <select value={ambientSound} onChange={e => setAmbientSound(e.target.value)} style={SEL(surface, border, text_c)}>
                  {AMBIENT.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
                {ambientSound !== "none" && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 11, color: muted, marginBottom: 4 }}>Volume: {Math.round(ambientVol * 100)}%</div>
                    <input type="range" min={0} max={1} step={0.05} value={ambientVol} onChange={e => setAmbientVol(Number(e.target.value))}
                      style={{ width: "100%", accentColor: mc.color }} />
                  </div>
                )}
              </div>

              {/* Auto-start */}
              <div>
                <div style={{ fontSize: 11, color: muted, marginBottom: 6, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8 }}>Auto-start Next</div>
                <button onClick={() => setAutoStart(a => !a)}
                  style={{ padding: "7px 18px", borderRadius: 7, border: `1px solid ${border}`, background: autoStart ? mc.color : "transparent", color: autoStart ? "#fff" : text_c, cursor: "pointer", fontWeight: 600, fontSize: 13, transition: "all 0.2s" }}>
                  {autoStart ? "✓ On" : "Off"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── THEME PICKER PANEL ── */}
      {showTheme && (
        <div className="slide-in" style={{ background: surface, borderBottom: `1px solid ${border}`, padding: "20px 28px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ fontSize: 11, color: muted, fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 14 }}>
              Choose a colour theme — applies to all 3 timer modes
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {THEMES.map(th => {
                const isActive = themeId === th.id;
                return (
                  <button key={th.id} onClick={() => setThemeId(th.id)}
                    title={th.label}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                      border: `2px solid ${isActive ? th.swatch : border}`,
                      background: isActive ? `${th.swatch}18` : "transparent",
                      transition: "all 0.15s", minWidth: 72,
                    }}
                    onMouseEnter={e => { if (!isActive) e.currentTarget.style.borderColor = th.swatch; }}
                    onMouseLeave={e => { if (!isActive) e.currentTarget.style.borderColor = border; }}
                  >
                    {/* 3 mode swatches stacked */}
                    <div style={{ display: "flex", gap: 4 }}>
                      {(["focus", "short", "long"] as Mode[]).map(m => (
                        <div key={m} style={{ width: 16, height: 16, borderRadius: 4, background: th[m].bg, border: "1px solid rgba(0,0,0,0.1)" }} />
                      ))}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? th.swatch : text_c, whiteSpace: "nowrap" }}>
                      {th.label}
                    </span>
                    {isActive && <span style={{ fontSize: 9, color: th.swatch, fontWeight: 700 }}>✓ Active</span>}
                  </button>
                );
              })}
            </div>
            {/* live preview strip */}
            <div style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 11, color: muted, fontWeight: 600 }}>Preview:</span>
              {(["focus", "short", "long"] as Mode[]).map(m => (
                <div key={m} style={{ background: activeTheme[m].bg, borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 700, color: activeTheme[m].textOnBg === "light" ? "#fff" : "#1a1a2e" }}>
                  {MODE_CONFIG[m].label}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}


      <div className="main-grid">

        {/* ════ LEFT — TIMER & TASKS ════ */}
        <div className="left-panel" style={{ background: mc.bg, display: "flex", flexDirection: "column", alignItems: "center", padding: "40px 32px", transition: "background 0.4s" }}>

          {/* Mode tabs */}
          <div style={{ display: "flex", gap: 5, background: "rgba(0,0,0,0.2)", borderRadius: 50, padding: "5px", marginBottom: 36 }}>
            {(["focus", "short", "long"] as Mode[]).map(m => (
              <button key={m} onClick={() => switchMode(m)}
                style={{ padding: "7px 18px", borderRadius: 50, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: mode === m ? activeTheme[m].color : "transparent", color: onBg, transition: "all 0.2s", opacity: mode === m ? 1 : 0.7 }}>
                {MODE_CONFIG[m].label}
              </button>
            ))}
          </div>

          {/* Timer ring */}
          <div style={{ position: "relative", marginBottom: 24 }} className={alarmRinging ? "alarm-ring" : running ? "pulse-ring" : ""}>
            <svg width={260} height={260} style={{ transform: "rotate(-90deg)" }}>
              <circle cx={130} cy={130} r={R} fill="none" strokeWidth={10} stroke={onBgSubtle} />
              <circle cx={130} cy={130} r={R} fill="none" strokeWidth={10}
                stroke={alarmRinging ? onBg : mc.color}
                strokeDasharray={C} strokeDashoffset={C * (1 - progress)} strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s" }} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div className="timer-font" style={{ fontSize: 62, fontWeight: 700, color: onBg, lineHeight: 1, letterSpacing: 2 }}>
                {alarmRinging ? "🔔" : fmt(secs)}
              </div>
              <div style={{ fontSize: 12, color: onBgMuted, marginTop: 6, fontWeight: 500, letterSpacing: 1, textTransform: "uppercase" }}>
                {alarmRinging ? "Time's Up!" : mc.label}
              </div>
            </div>
          </div>

          {/* Round dots */}
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {Array.from({ length: cfgLongAfter }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: i < (round - 1) ? onBg : onBgSubtle, transition: "background 0.3s" }} />
            ))}
          </div>

          {/* Active task label */}
          {activeTask && !alarmRinging && (
            <div style={{ fontSize: 12, color: onBgMuted, marginBottom: 16, background: "rgba(0,0,0,0.15)", padding: "5px 14px", borderRadius: 50, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              🎯 {tasks.find(t => t.id === activeTask)?.text ?? ""}
            </div>
          )}

          {/* Controls */}
          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            <button onClick={startStop}
              style={{ padding: "14px 44px", fontSize: 15, fontWeight: 800, fontFamily: "'Outfit',sans-serif", letterSpacing: 1.5, textTransform: "uppercase", background: onBg, color: alarmRinging ? "#ef4444" : mc.bg, border: "none", borderRadius: 50, cursor: "pointer", boxShadow: "0 4px 20px rgba(0,0,0,0.25)", transition: "all 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.04)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              {alarmRinging ? "⏹ Stop Alarm" : running ? "⏸ Pause" : "▶ Start"}
            </button>
            <button onClick={resetTimer}
              style={{ padding: "14px 18px", fontSize: 18, background: onBgSubtle, color: onBg, border: `1px solid ${onBgMuted}`, borderRadius: 50, cursor: "pointer" }}
              title="Reset">↺</button>
          </div>

          {/* Stats strip */}
          <div style={{ display: "flex", gap: 20, marginBottom: 28, background: "rgba(0,0,0,0.2)", borderRadius: 14, padding: "14px 24px", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Today", val: `${todayMins}m` },
              { label: "Week", val: `${weekMins}m` },
              { label: "Sessions", val: `${pomoDone} 🍅` },
            ].map(({ label, val }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: onBg, fontFamily: "'JetBrains Mono',monospace" }}>{val}</div>
                <div style={{ fontSize: 10, color: onBgMuted, marginTop: 2, textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* ── TASKS ── */}
          <div style={{ width: "100%", maxWidth: 420 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: onBg, textTransform: "uppercase", letterSpacing: 1 }}>Tasks</span>
              <button onClick={() => { if (confirm("Clear all tasks?")) { setTasks([]); setActiveTask(null); } }}
                style={{ fontSize: 11, color: onBgMuted, background: "transparent", border: "none", cursor: "pointer" }}>Clear all</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 10, maxHeight: 260, overflowY: "auto" }}>
              {tasks.map(task => (
                <div key={task.id}
                  style={{ background: activeTask === task.id ? onBgSubtle : "rgba(0,0,0,0.12)", borderRadius: 10, padding: "10px 13px", border: `1px solid ${activeTask === task.id ? onBgMuted : "rgba(0,0,0,0.1)"}`, cursor: "pointer", transition: "background 0.15s" }}
                  onClick={() => setActiveTask(id => id === task.id ? null : task.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <button onClick={e => { e.stopPropagation(); toggleFinished(task.id); }}
                      style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${onBgMuted}`, background: task.finished ? onBg : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: mc.bg }}>
                      {task.finished ? "✓" : ""}
                    </button>
                    <span style={{ flex: 1, fontSize: 13, color: onBg, textDecoration: task.finished ? "line-through" : "none", opacity: task.finished ? 0.5 : 1 }}>{task.text}</span>
                    <span style={{ fontSize: 11, color: onBgMuted, fontFamily: "'JetBrains Mono',monospace", whiteSpace: "nowrap" }}>{task.done}/{task.est}🍅</span>
                    <button onClick={e => { e.stopPropagation(); setExpandedTask(t => t === task.id ? null : task.id); }} style={{ background: "transparent", border: "none", color: onBgMuted, cursor: "pointer", fontSize: 14 }}>⋯</button>
                    <button onClick={e => { e.stopPropagation(); deleteTask(task.id); }} style={{ background: "transparent", border: "none", color: onBgMuted, cursor: "pointer", fontSize: 14 }}>✕</button>
                  </div>
                  {expandedTask === task.id && task.note && (
                    <div style={{ marginTop: 7, fontSize: 12, color: onBgMuted, paddingLeft: 29, fontStyle: "italic" }}>{task.note}</div>
                  )}
                  <div style={{ marginTop: 7, height: 3, background: "rgba(0,0,0,0.15)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${Math.min(100, (task.done / task.est) * 100)}%`, background: onBg, borderRadius: 2, transition: "width 0.3s", opacity: 0.7 }} />
                  </div>
                </div>
              ))}
            </div>

            {addingTask ? (
              <div className="slide-in" style={{ background: "rgba(0,0,0,0.15)", borderRadius: 10, padding: 14, border: `1px solid ${onBgSubtle}` }}>
                <input autoFocus placeholder="What are you working on?" value={newTaskText} onChange={e => setNewTaskText(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") addTask(); if (e.key === "Escape") setAddingTask(false); }}
                  style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: onBg, fontSize: 14, marginBottom: 10 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 12, color: onBgMuted }}>Est:</span>
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button key={n} onClick={() => setNewTaskEst(n)}
                      style={{ width: 26, height: 26, borderRadius: "50%", border: `1px solid ${onBgMuted}`, background: newTaskEst === n ? onBg : "transparent", color: newTaskEst === n ? mc.bg : onBg, cursor: "pointer", fontSize: 12, fontWeight: 700 }}>{n}</button>
                  ))}
                  <span style={{ fontSize: 12, color: onBgMuted }}>🍅</span>
                </div>
                <input placeholder="Note (optional)" value={newTaskNote} onChange={e => setNewTaskNote(e.target.value)}
                  style={{ width: "100%", background: "transparent", border: "none", borderTop: `1px solid ${onBgSubtle}`, outline: "none", color: onBgMuted, fontSize: 12, paddingTop: 8 }} />
                <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                  <button onClick={addTask} style={{ padding: "7px 20px", background: onBg, color: mc.bg, border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 700, fontSize: 13 }}>Add</button>
                  <button onClick={() => setAddingTask(false)} style={{ padding: "7px 16px", background: "transparent", color: onBgMuted, border: `1px solid ${onBgSubtle}`, borderRadius: 6, cursor: "pointer", fontSize: 13 }}>Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setAddingTask(true)}
                style={{ width: "100%", padding: "11px", background: "rgba(0,0,0,0.1)", border: `1.5px dashed ${onBgMuted}`, borderRadius: 10, color: onBgMuted, cursor: "pointer", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                ＋ Add Task
              </button>
            )}
          </div>
        </div>

        {/* ════ RIGHT — INFO ════ */}
        <div className="right-panel" style={{ padding: "44px 40px", background: bg }}>

          {/* Hero */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: mc.lightBg, border: `1px solid ${mc.color}33`, borderRadius: 50, padding: "5px 14px", marginBottom: 16 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: mc.color, display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: mc.color, letterSpacing: 0.8 }}>FOCUS & PRODUCTIVITY</span>
            </div>
            <h1 style={{ fontFamily: "'Outfit',sans-serif", fontSize: "clamp(26px,3vw,40px)", fontWeight: 800, lineHeight: 1.2, color: text_c, marginBottom: 14 }}>
              Forge your focus.<br />
              <span style={{ color: mc.color }}>Ship more. Stress less.</span>
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: muted }}>
              ForgeCode Timer is a Pomodoro-based focus session manager built for developers, designers, and makers. No account. No ads. Completely free.
            </p>
          </div>

          {/* How to use */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 19, fontWeight: 700, color: text_c, marginBottom: 6 }}>How to use it</h2>
            <div style={{ width: 32, height: 3, background: mc.color, borderRadius: 2, marginBottom: 20 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { n: "01", t: "Add your tasks", d: "List what you need to get done with estimated pomodoro counts (1 🍅 = 25 min)." },
                { n: "02", t: "Select a task", d: "Click a task to mark it as your active focus target — it shows on the timer." },
                { n: "03", t: "Start the timer", d: "Hit Start and work on that single task for 25 minutes without distractions." },
                { n: "04", t: "Take your break", d: "When the alarm rings, take a 5-min break. After 4 rounds, take a long 15-min break." },
                { n: "05", t: "Track your progress", d: "Your pomodoros count up. Stats update live. Session history is saved locally." },
              ].map(s => (
                <div key={s.n} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 8, background: mc.lightBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, fontWeight: 700, color: mc.color }}>{s.n}</span>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: text_c, marginBottom: 2 }}>{s.t}</div>
                    <div style={{ fontSize: 13, color: muted, lineHeight: 1.65 }}>{s.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Features */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 19, fontWeight: 700, color: text_c, marginBottom: 6 }}>Features</h2>
            <div style={{ width: 32, height: 3, background: mc.color, borderRadius: 2, marginBottom: 20 }} />
            <div className="feat-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { icon: "⏱", t: "Smart Timer", d: "Focus, short & long break modes with animated progress ring." },
                { icon: "✅", t: "Task Tracking", d: "Estimated vs actual pomodoro counts with a mini progress bar." },
                { icon: "🔔", t: "Repeating Alarm", d: "Alarm keeps ringing until you click Stop — never miss it." },
                { icon: "🌧", t: "Ambient Sounds", d: "Rain, café, forest & waves from your public/sounds/ folder." },
                { icon: "📊", t: "Focus Stats", d: "Daily & weekly focus minutes tracked in your browser." },
                { icon: "🔁", t: "Auto-start", d: "Automatically start the next session without clicking." },
                { icon: "📱", t: "Notifications", d: "Browser notifications with requireInteraction so they persist." },
                { icon: "⚙", t: "Custom Durations", d: "Set any focus/break length and long break threshold." },
              ].map(f => (
                <div key={f.t} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: "13px 15px" }}>
                  <div style={{ fontSize: 20, marginBottom: 6 }}>{f.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: text_c, marginBottom: 3 }}>{f.t}</div>
                  <div style={{ fontSize: 12, color: muted, lineHeight: 1.55 }}>{f.d}</div>
                </div>
              ))}
            </div>
          </section>

          {/* What is Pomodoro */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 19, fontWeight: 700, color: text_c, marginBottom: 6 }}>What is the Pomodoro Technique?</h2>
            <div style={{ width: 32, height: 3, background: mc.color, borderRadius: 2, marginBottom: 16 }} />
            <p style={{ fontSize: 14, lineHeight: 1.8, color: muted, marginBottom: 12 }}>
              Developed by Francesco Cirillo in the late 1980s, the Pomodoro Technique uses a timer to break work into 25-minute focused intervals separated by short breaks. Each interval is called a "pomodoro" — Italian for tomato.
            </p>
            <p style={{ fontSize: 14, lineHeight: 1.8, color: muted }}>
              Frequent breaks reduce mental fatigue and maintain consistent output throughout the day. It's widely used by developers, writers, students, and creators worldwide.
            </p>
          </section>

          {/* Stats */}
          <section>
            <h2 style={{ fontFamily: "'Outfit',sans-serif", fontSize: 19, fontWeight: 700, color: text_c, marginBottom: 6 }}>Today's Progress</h2>
            <div style={{ width: 32, height: 3, background: mc.color, borderRadius: 2, marginBottom: 20 }} />
            <div className="stat-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Focus today", val: `${todayMins} min`, color: mc.color },
                { label: "Pomodoros", val: String(pomoDone), color: "#10b981" },
                { label: "This week", val: `${weekMins} min`, color: "#f59e0b" },
              ].map(s => (
                <div key={s.label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 12px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 22, fontWeight: 700, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {sessionLog.length > 0 && (
              <div style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: muted, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 }}>Recent Sessions</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, maxHeight: 180, overflowY: "auto" }}>
                  {[...sessionLog].reverse().slice(0, 10).map((s, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: MODE_CONFIG[s.mode].color }} />
                        <span style={{ color: text_c }}>{MODE_CONFIG[s.mode].label}</span>
                      </div>
                      <span style={{ color: muted }}>{s.mins} min · {new Date(s.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => { if (confirm("Clear history?")) { setSessionLog([]); setPomoDone(0); } }}
                  style={{ marginTop: 10, fontSize: 11, color: muted, background: "transparent", border: "none", cursor: "pointer" }}>Clear history</button>
              </div>
            )}
          </section>
          {/* <PomodoroFaq  /> */}
          <ToolFaq
                  faqs={pomodoroFaqs}
                  title="Frequently Asked Questions"
                  subtitle="Everything you need to know about using the Online Notepad."
                />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqSchema),
            }}
          />

        </div>
      </div>
    </div>
  );
}

function NB(border: string, text: string) {
  return { width: 32, height: 32, borderRadius: 7, border: `1px solid ${border}`, background: "transparent", color: text, cursor: "pointer", fontSize: 18, fontWeight: 700, display: "flex" as const, alignItems: "center" as const, justifyContent: "center" as const };
}
function SEL(surface: string, border: string, text: string) {
  return { padding: "6px 10px", fontSize: 13, border: `1px solid ${border}`, borderRadius: 7, background: surface, color: text, cursor: "pointer", outline: "none", width: "100%" };
}