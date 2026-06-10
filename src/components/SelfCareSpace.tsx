import React, { useState, useEffect } from "react";
import { StudentProfile, Companion } from "../types";
import { motion } from "motion/react";

interface SelfCareSpaceProps {
  studentProfile: StudentProfile;
  selectedCompanion: Companion | null;
  onResetCompanion: () => void;
  onNavigateToTab: (tab: "chat" | "wellness" | "support") => void;
}

interface MoodLog {
  mood: string;
  time: string;
}

interface GratitudeLog {
  id: string;
  items: string[];
  date: string;
}

export default function SelfCareSpace({
  studentProfile,
  selectedCompanion,
  onResetCompanion,
  onNavigateToTab,
}: SelfCareSpaceProps) {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [gratitudeEntries, setGratitudeEntries] = useState<GratitudeLog[]>([]);

  // Load latest stats from local storage
  useEffect(() => {
    try {
      const savedMoods = localStorage.getItem("safehaven_mood_logs");
      if (savedMoods) {
        setMoodLogs(JSON.parse(savedMoods));
      }
    } catch {}

    try {
      const savedGratitude = localStorage.getItem("safehaven_gratitude_entries");
      if (savedGratitude) {
        setGratitudeEntries(JSON.parse(savedGratitude));
      }
    } catch {}
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem("safehaven_mood_logs");
    localStorage.removeItem("safehaven_gratitude_entries");
    setMoodLogs([]);
    setGratitudeEntries([]);
  };

  // Stress indicator color mapping
  const getStressColor = (level: number) => {
    if (level <= 3) return "bg-emerald-500";
    if (level <= 7) return "bg-amber-500";
    return "bg-rose-500";
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "Low": return "😔";
      case "Down": return "😢";
      case "Okay": return "😐";
      case "Good": return "🙂";
      case "Great": return "🤩";
      default: return "🌱";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-primary-container/[0.08] to-secondary-container/[0.04] p-6 rounded-3xl border border-primary/10">
        <div>
          <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-2.5 py-1 rounded-full">
            Your Personal Sanctuary Space
          </span>
          <h1 className="font-display text-2xl font-black text-on-surface mt-2">
            Welcome back, {studentProfile.nickname}!
          </h1>
          <p className="text-xs text-on-surface-variant font-sans mt-1">
            Track your well-being stats, review logs, and configure active mental partners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateToTab("wellness")}
            className="px-4 py-2 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-sans font-bold rounded-xl transition-all cursor-pointer"
          >
            Log Session
          </button>
          
          {(moodLogs.length > 0 || gratitudeEntries.length > 0) && (
            <button
              onClick={handleClearHistory}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-sans font-bold rounded-xl transition-all cursor-pointer"
              title="Clear all local logs"
            >
              Clear Logs
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: STUDENT WELLNESS SCORECARD */}
        <div className="md:col-span-1 space-y-6">
          
          {/* PROFILE CARD */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-5 soft-shadow space-y-4">
            <h3 className="text-sm font-display font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">account_circle</span>
              <span>Academic Profile</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between border-b border-neutral-150 pb-2">
                <span className="text-on-surface-variant">Nickname</span>
                <span className="font-bold text-on-surface">{studentProfile.nickname}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-150 pb-2">
                <span className="text-on-surface-variant">Department / Branch</span>
                <span className="font-bold text-on-surface truncate max-w-[120px]" title={studentProfile.branch}>
                  {studentProfile.branch}
                </span>
              </div>
              <div className="flex justify-between border-b border-neutral-150 pb-2">
                <span className="text-on-surface-variant">Semester Info</span>
                <span className="font-bold text-on-surface">{studentProfile.semester}</span>
              </div>
              <div className="flex justify-between border-b border-neutral-150 pb-2">
                <span className="text-on-surface-variant">Primary Stressor</span>
                <span className="font-bold text-primary bg-primary/5 px-2 py-0.5 rounded capitalize">
                  {studentProfile.stressReason.replace("_", " ")}
                </span>
              </div>

              {/* Stress assessment bar */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Stress Level Gauge</span>
                  <span className="font-bold text-on-surface font-mono">{studentProfile.stressLevel}/10</span>
                </div>
                <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${getStressColor(studentProfile.stressLevel)}`}
                    style={{ width: `${studentProfile.stressLevel * 10}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE COMPANION CONFIG CARD */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-5 soft-shadow space-y-4">
            <h3 className="text-sm font-display font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
              <span>Active Companion</span>
            </h3>

            {selectedCompanion ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-primary-container/10 p-3 rounded-2xl border border-primary/5">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-white text-[18px]">pets</span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm text-primary">{selectedCompanion.name}</h4>
                    <p className="text-[10px] text-on-surface-variant truncate max-w-[160px]">{selectedCompanion.description}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={() => onNavigateToTab("chat")}
                    className="w-full py-2 bg-primary text-white text-xs font-sans font-bold rounded-xl transition-all hover:bg-primary/95 cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm leading-none">chat</span>
                    <span>Hold a Chat session</span>
                  </button>

                  <button
                    onClick={onResetCompanion}
                    className="w-full py-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-600 text-xs font-sans font-bold rounded-xl transition-all border border-neutral-200 cursor-pointer text-center flex items-center justify-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-sm leading-none">sync</span>
                    <span>Change Companion</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-4 space-y-3">
                <p className="text-xs text-on-surface-variant">No companion has been selected as your active tutor.</p>
                <button
                  onClick={() => onNavigateToTab("chat")}
                  className="w-full py-2 bg-primary text-white text-xs font-sans font-bold rounded-xl hover:bg-primary/90 transition-all cursor-pointer text-center block"
                >
                  Choose Companion
                </button>
              </div>
            )}
          </div>

          {/* SUPPORT CIRCLE INFORMATION */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-5 soft-shadow space-y-4">
            <h3 className="text-sm font-display font-black text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">group</span>
              <span>My Support Circle</span>
            </h3>

            {studentProfile.supportCircleName ? (
              <div className="bg-neutral-50 p-3.5 rounded-2xl space-y-2 text-xs border border-neutral-100">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-on-surface">{studentProfile.supportCircleName}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    {studentProfile.supportCircleRelation || "Friend"}
                  </span>
                </div>
                {studentProfile.supportCircleInfo && (
                  <p className="text-on-surface-variant font-mono text-[10px] mt-1 break-all bg-white p-2 rounded border border-neutral-200/50">
                    📞 {studentProfile.supportCircleInfo}
                  </p>
                )}
                {studentProfile.enableSupportCircle !== false && (
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] mt-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Rapid SOS Alerts Enabled</span>
                  </div>
                )}
                <button
                  onClick={() => onNavigateToTab("support")}
                  className="w-full mt-2 py-1.5 bg-rose-50 text-rose-600 text-[11px] font-sans font-bold text-center rounded-lg hover:bg-rose-100 transition-all cursor-pointer"
                >
                  Test SOS Alerts
                </button>
              </div>
            ) : (
              <p className="text-xs text-on-surface-variant leading-relaxed">
                You haven't setup a trusted peer contact details yet. Log out to reset and build your support network easily.
              </p>
            )}
          </div>

        </div>

        {/* MIDDLE & RIGHT COLUMNS: INTERACTIVE MOODS PATH & GRATITUDE ARCHIVES */}
        <div className="md:col-span-2 space-y-6">
          
          {/* MOOD HISTORY FEED */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 soft-shadow space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-display font-black text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">show_chart</span>
                <span>Emotion History Insights</span>
              </h3>
              <span className="text-[10px] font-sans text-on-surface-variant bg-neutral-100 px-2 py-1 rounded font-bold">
                {moodLogs.length} logged states
              </span>
            </div>

            {moodLogs.length > 0 ? (
              <div className="max-h-[220px] overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                {moodLogs.slice(0, 10).map((log, idx) => (
                  <div 
                    key={idx} 
                    className="flex justify-between items-center p-3.5 bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl leading-none select-none">{getMoodEmoji(log.mood)}</span>
                      <span className="text-xs font-bold text-on-surface font-sans">
                        Felt <span className="text-primary">{log.mood}</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-on-surface-variant font-mono bg-white px-2 py-0.5 rounded border border-neutral-100/80">
                      {log.time}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
                <span className="text-2xl">🌱</span>
                <p className="text-xs text-on-surface-variant mt-2 max-w-sm mx-auto">
                  Your emotional path is empty right now. Go to <strong>Wellness Tools</strong> to record how you're coping.
                </p>
                <button
                  onClick={() => onNavigateToTab("wellness")}
                  className="mt-3 px-4 py-2 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-sans font-bold rounded-xl transition-all cursor-pointer"
                >
                  Record My First Mood
                </button>
              </div>
            )}
          </div>

          {/* GRATITUDE ARCHIVES COLLECTION */}
          <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-3xl p-6 soft-shadow space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-display font-black text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">book_heart</span>
                <span>My Gratitude Journal Archive</span>
              </h3>
              <span className="text-[10px] font-sans text-on-surface-variant bg-neutral-100 px-2 py-1 rounded font-bold">
                {gratitudeEntries.length} saved entries
              </span>
            </div>

            {gratitudeEntries.length > 0 ? (
              <div className="max-h-[360px] overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                {gratitudeEntries.map((entry) => (
                  <div 
                    key={entry.id} 
                    className="p-4 bg-[#fffbf4]/80 border border-orange-100 rounded-2xl space-y-3.5 shadow-sm hover:border-orange-200 transition-all"
                  >
                    <div className="flex justify-between items-center border-b border-orange-100 pb-1.5">
                      <span className="text-[10px] font-black uppercase text-amber-700 tracking-wider flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[13px] leading-none">favorite</span>
                        <span>Filled Subconscious Sparkles</span>
                      </span>
                      <span className="text-[10px] text-neutral-500 font-bold font-mono bg-white px-2 py-0.5 rounded border border-orange-100/50">
                        {entry.date}
                      </span>
                    </div>

                    <ul className="space-y-1 text-xs text-on-surface font-semibold font-sans list-none pl-1">
                      {entry.items.map((item, index) => (
                        <li key={index} className="flex items-start gap-1.5 leading-relaxed text-amber-900/90">
                          <span className="text-amber-500 select-none text-[11px] mt-0.5">✦</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
                <span className="text-2xl">✍️</span>
                <p className="text-xs text-on-surface-variant mt-2 max-w-sm mx-auto">
                  You haven't added entries to your positive journal today. Jot down three silver linings in the <strong>Wellness Tools</strong> tab.
                </p>
                <button
                  onClick={() => onNavigateToTab("wellness")}
                  className="mt-3 px-4 py-2 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-sans font-bold rounded-xl transition-all cursor-pointer"
                >
                  Write Gratitude Journal
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
