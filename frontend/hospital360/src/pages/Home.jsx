// src/pages/Home.jsx
import React from "react";
import AppLayout from "../components/GenericComponents/AppLayout";

export default function Home() {
  return (
    <AppLayout>
      {/* HERO — bold, minimal, glossy */}
      <section className="relative overflow-hidden">
        {/* more visible gradient field */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#cfe2ff] via-[#e6f0ff] to-[#c8fff1]" />
        {/* glow blobs (slightly stronger) */}
        <div className="pointer-events-none absolute -top-16 -left-16 w-64 h-64 bg-[#0f4c81]/30 blur-3xl rounded-full animate-pulse" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 bg-[#0fb5a3]/30 blur-3xl rounded-full animate-pulse" />
        {/* sheen strip */}
        <div className="pointer-events-none absolute -top-10 left-1/3 h-72 w-1/2 rotate-12 bg-gradient-to-r from-white/10 via-white/50 to-white/10 blur-sm" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <span className="inline-block text-[11px] tracking-wider uppercase text-[#0f4c81] bg-[#0f4c81]/10 px-3 py-1 rounded-full">
            Smart Healthcare System
          </span>

          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            <span className="bg-gradient-to-r from-[#0f4c81] via-[#0f7aa0] to-[#0fb5a3] bg-clip-text text-transparent drop-shadow">
              Modern care for busy urban hospitals
            </span>
          </h1>

          <p className="mt-4 text-gray-600 max-w-2xl">
            Check-ins, appointments, billing, and analytics — streamlined with a clean, fast UI.
          </p>

          {/* minimal stats (no links) */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            <Stat label="Avg. Check-in" value="&lt; 10s" />
            <Stat label="Report Types" value="9+" />
            <Stat label="Uptime" value="99.9%" />
          </div>
        </div>
      </section>

      {/* WHAT’S IN THIS SYSTEM (static, pretty) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-semibold text-gray-900">What’s in this system</h2>
        <p className="text-gray-600 mt-1 mb-6">
          Core modules prototyped for the Smart Healthcare platform.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <Feature
            title="Manage Appointments"
            desc="Search, schedule, modify, and cancel appointments with time-slot validation."
            icon={<SvgCalendar className="w-6 h-6" />}
          />
          <Feature
            title="Patient Check-in"
            desc="Fast QR/barcode scanning at the counter to fetch patient records instantly."
            icon={<SvgScan className="w-6 h-6" />}
          />
          <Feature
            title="Payments Portal"
            desc="Full or partial payments with receipts; card and insurance flows supported."
            icon={<SvgCard className="w-6 h-6" />}
          />
          <Feature
            title="Analytics & Reports"
            desc="Filter by range and export clean A4 PDFs for decision-making."
            icon={<SvgChart className="w-6 h-6" />}
          />
          <Feature
            title="Staff Activity"
            desc="Monitor recent access events and utilization to spot bottlenecks."
            icon={<SvgUsers className="w-6 h-6" />}
          />
          <Feature
            title="Patient Insights"
            desc="Age, gender, type, and blood group distributions for planning."
            icon={<SvgInsights className="w-6 h-6" />}
          />
        </div>
      </section>

      {/* HOW IT WORKS (static) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-xl font-semibold text-gray-900">How it works</h2>
        <div className="mt-6 grid md:grid-cols-4 gap-4">
          <Step n={1} title="Register / Scan" text="Patients show a digital card; staff scans to fetch records." />
          <Step n={2} title="Manage Visits" text="Create or update appointments with conflict checks." />
          <Step n={3} title="Payments" text="Pay in full or partially; card or insurance with receipts." />
          <Step n={4} title="Analyze" text="Filter by date and type, then export clear PDF reports." />
        </div>
      </section>

      {/* footer-ish note — no CTAs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="rounded-xl border bg-white p-5 sm:p-6 shadow">
          <p className="text-sm text-gray-500">
            Prototype • SE3070 – Case Studies in Software Engineering • Smart Healthcare System
          </p>
        </div>
      </section>
    </AppLayout>
  );
}

/* ---------- building blocks ---------- */

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border bg-white/90 backdrop-blur px-4 py-5 shadow hover:shadow-md transition">
      <div
        className="text-2xl font-bold text-gray-900"
        dangerouslySetInnerHTML={{ __html: value }}
      />
      <div className="text-xs text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function Feature({ title, desc, icon }) {
  return (
    <div className="group relative rounded-xl border bg-white p-5 shadow hover:shadow-lg transition">
      <div className="absolute -right-3 -top-3 w-10 h-10 rounded-full bg-[#0fb5a3]/15 blur" />
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-[#0f4c81]">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="relative rounded-xl border bg-white p-5 shadow hover:shadow-lg transition">
      <div className="absolute -left-3 -top-3 w-8 h-8 rounded-full bg-[#0f4c81] text-white text-xs flex items-center justify-center shadow">
        {n}
      </div>
      <h4 className="font-semibold text-gray-900">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{text}</p>
    </div>
  );
}

/* ---------- inline icons (no extra deps) ---------- */

function SvgChart(props){ return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 3v18h18" />
    <rect x="7" y="10" width="3" height="7" rx="1" />
    <rect x="12" y="6"  width="3" height="11" rx="1" />
    <rect x="17" y="13" width="3" height="4" rx="1" />
  </svg>
)}
function SvgCalendar(props){ return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18" />
  </svg>
)}
function SvgScan(props){ return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M4 7V5a1 1 0 011-1h2M20 7V5a1 1 0 00-1-1h-2M4 17v2a1 1 0 001 1h2M20 17v2a1 1 0 01-1 1h-2" />
    <path d="M3 12h18" />
  </svg>
)}
function SvgCard(props){ return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
)}
function SvgUsers(props){ return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M16 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4z" />
    <path d="M7 13c2.21 0 4-2.24 4-5S9.21 3 7 3 3 5.24 3 8s1.79 5 4 5z" />
    <path d="M21 21v-2a4 4 0 00-4-4h-2" />
    <path d="M11 21v-2a5 5 0 00-5-5H5" />
  </svg>
)}
function SvgInsights(props){ return (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M3 19h18" />
    <rect x="5" y="11" width="3" height="6" rx="1" />
    <rect x="10" y="7" width="3" height="10" rx="1" />
    <rect x="15" y="4" width="3" height="13" rx="1" />
  </svg>
)}
