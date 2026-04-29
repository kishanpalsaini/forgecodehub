import type { Metadata } from "next";
import PomodoroPage from "./PomodoroClient"; // rename your current file to PomodoroClient.tsx

export const metadata: Metadata = {
  title: "Pomodoro Timer - Free Focus Timer Online | ForgeCodeHub",
  description:
    "Free Pomodoro timer with task tracking, ambient sounds, and session history. Boost focus and productivity with 25-minute work sessions and smart breaks. No login required.",
  keywords: [
    "pomodoro timer",
    "focus timer",
    "pomodoro technique",
    "online pomodoro",
    "productivity timer",
    "work timer",
    "pomodoro app",
    "focus sessions",
    "task tracker",
    "time management tool",
  ],
  authors: [{ name: "ForgeCodeHub" }],
  creator: "ForgeCodeHub",
  openGraph: {
    title: "Pomodoro Timer — Free Focus Timer | ForgeCodeHub",
    description:
      "Boost productivity with Pomodoro sessions, task tracking, ambient sounds, and focus stats. Free, no login required.",
    url: "https://www.forgecodehub.com/tools/online-pomodoro-timer",
    siteName: "ForgeCodeHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomodoro Timer — Free Focus Timer | ForgeCodeHub",
    description:
      "25-minute focus sessions with task tracking, ambient sounds, and break reminders. Free Pomodoro timer online.",
  },
  alternates: {
    canonical: "https://www.forgecodehub.com/tools/online-pomodoro-timer",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function Page() {
  return <PomodoroPage />;
}