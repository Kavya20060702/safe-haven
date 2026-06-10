import { useState } from "react";
import { COMPANIONS } from "../data";
import { Companion, StudentProfile, CompanionId } from "../types";
import { motion, AnimatePresence } from "motion/react";
import CompanionMascot from "./CompanionMascot";

interface CompanionSelectorProps {
  studentProfile: StudentProfile;
  onSelect: (companion: Companion) => void;
  onSignOut: () => void;
}

// Empathy campus-aligned qualities, vibes and narrative introductions matching mascot colors
const COMPANION_SPECIAL_DETAILS = {
  purr: {
    vibe: "Cozy • Code-Savvy • Programmer Cat 🐱",
    themeClass: "text-[#9381ff]",
    bgGradient: "from-[#9381ff]/12 via-[#a29bfe]/6 to-transparent",
    accentBorder: "border-[#9381ff]/40 dark:border-purple-900/40",
    glowColor: "rgba(147, 129, 255, 0.15)",
    sparkleColor: "#9381ff",
    bubbleBg: "bg-purple-50/85 dark:bg-purple-950/40 text-purple-950 dark:text-purple-100 border-purple-200/50 dark:border-purple-900/50",
    skills: [
      { name: "Backlog Management", desc: "Helps you break exam & lab backlogs into tiny task chunks.", icon: "format_list_bulleted" },
      { name: "Sessional Prep Companion", desc: "Cozy presence that stays up with you during late-night compiles.", icon: "dark_mode" },
      { name: "Caffeine & Burnout Shield", desc: "Warm companion cat jokes that neutralize imposter syndrome.", icon: "local_cafe" }
    ],
    greeting: "Mew! *wakes up cozy on your keyboard, blinks slowly* I'm Purr! I know engineering semesters feel like an infinite compiler error right now, with strict 75% attendance rules and competitive CGPA pressure. Let's study one micro-step at a time and take warm recovery naps!"
  },
  luma: {
    vibe: "Serene • Shimmering Meditation Orb 🔮",
    themeClass: "text-[#2dd4bf]",
    bgGradient: "from-[#2dd4bf]/12 via-[#06b6d4]/6 to-transparent",
    accentBorder: "border-[#2dd4bf]/40 dark:border-teal-900/40",
    glowColor: "rgba(45, 212, 191, 0.15)",
    sparkleColor: "#2dd4bf",
    bubbleBg: "bg-teal-50/85 dark:bg-teal-950/40 text-teal-950 dark:text-teal-100 border-teal-200/50 dark:border-teal-900/50",
    skills: [
      { name: "CGPA Pressure Shield", desc: "Silences the competitive noise in student WhatsApp/placement chats.", icon: "shield" },
      { name: "Breath Synchronization", desc: "Expands & blinks to anchor your nervous system in stressful times.", icon: "air" },
      { name: "Mindful Reminders", desc: "Reminds you that your worth is infinite, beyond placement metrics.", icon: "eco" }
    ],
    greeting: "Greetings... I am Luma. *glows with gentle inner warmth* I see a high frequency of stress spinning around your college assignments today. Pause for a brief moment. Breathe in with me, and realize you are safe, whole, and completely sufficient."
  },
  cirrus: {
    vibe: "Philosophical • Breezy Space Cloud ☁️",
    themeClass: "text-[#38bdf8]",
    bgGradient: "from-sky-450/12 via-blue-500/5 to-transparent",
    accentBorder: "border-sky-200/60 dark:border-sky-900/40",
    glowColor: "rgba(56, 189, 248, 0.15)",
    sparkleColor: "#38bdf8",
    bubbleBg: "bg-sky-50/85 dark:bg-sky-950/40 text-sky-950 dark:text-sky-100 border-sky-200/50 dark:border-sky-900/50",
    skills: [
      { name: "10,000-Ft perspective", desc: "Helps you see that one bad grade is a tiny speck in a beautiful long career.", icon: "zoom_out_map" },
      { name: "Silver Linings Finder", desc: "Converts frustrating college blockages into creative design pivots.", icon: "filter_drama" },
      { name: "Lighthearted Optimism", desc: "Warm, funny cloud metaphors that instantly lower your heart rate.", icon: "wb_sunny" }
    ],
    greeting: "Yo! *floats in with a refreshing cool breeze* Cirrus here! 🪁 Are placement stats or attendance gates bringing you down? Let's zoom out high into the sky together. A three-hour exam can never darken your entire horizon, friend!"
  },
  sprout: {
    vibe: "Energetic • Resilient Action Bud 🌱",
    themeClass: "text-[#e2b885]",
    bgGradient: "from-[#fdf4e3]/30 via-[#fce9d2]/15 to-transparent",
    accentBorder: "border-[#ffedd5]/80 dark:border-amber-950/40",
    glowColor: "rgba(253, 186, 116, 0.15)",
    sparkleColor: "#bef264",
    bubbleBg: "bg-[#fffbf4]/90 dark:bg-amber-950/20 text-amber-950 dark:text-orange-100 border-orange-200/40 dark:border-orange-950/50",
    skills: [
      { name: "Syllabus Micro-Slicer", desc: "Slices giant 20-chapter subjects into single study-sprint seeds.", icon: "content_cut" },
      { name: "Joyful Study Cheerleader", desc: "Celebrates simple wins (like opening slides, finalizing PPTs, or rewriting lines).", icon: "celebration" },
      { name: "Growth-Mindset Anchor", desc: "Treats academic setbacks not as final grades, but as nourishing soil.", icon: "forest" }
    ],
    greeting: "Hi hi! Sprout here! 🌱 *pops out of the soil with double-leaf ears twitching* Is that huge exam syllabus looking like a scary monster? No worries! Massive oak trees grow from teeny tiny seeds. Let's plant just one micro-task win together today!"
  }
};

export default function CompanionSelector({ studentProfile, onSelect, onSignOut }: CompanionSelectorProps) {
  const [activeId, setActiveId] = useState<CompanionId>("purr");

  // Background image of the gorgeous character collage
  const SPRITE_URL = "https://lh3.googleusercontent.com/aida-public/AB6AXuDFfgext9HvxnDu25BTPp7I17gRtyq5nvfwG3zqb4xQg8UI7vrxUxV-DUDbfCE2eIbk1jpTEJ5D3BGIpQPvQT1pj_KltDWZt67NDdD1i1zJi1G8YwQqgUTsanZ5EdfcvIBGY_ogyZNc8BR54EJq7U3VvcDx_FxtVuY7OzyuvOZWq7wX1qK9SpKDUYHqAagBHO5AhYds1pyN7KZR4iFPJv1dNOxTzz_jifhAp_ngN71UkQikaAThgoR9OYqv9ioIVaHmmMpo_8zC5JU";

  const getAvatarStyle = (id: string) => {
    switch (id) {
      case "cirrus": // Cloud
        return {
          backgroundImage: `url(${SPRITE_URL})`,
          backgroundSize: "280% auto",
          backgroundPosition: "7% 42%",
        };
      case "luma": // Sphere
        return {
          backgroundImage: `url(${SPRITE_URL})`,
          backgroundSize: "280% auto",
          backgroundPosition: "45% 53%",
        };
      case "purr": // Cat
        return {
          backgroundImage: `url(${SPRITE_URL})`,
          backgroundSize: "280% auto",
          backgroundPosition: "68% 40%",
        };
      case "sprout": // Sprout
        return {
          backgroundImage: `url(${SPRITE_URL})`,
          backgroundSize: "280% auto",
          backgroundPosition: "89% 33%",
        };
      default:
        return {};
    }
  };

  const getAvatarBgClass = (id: string) => {
    switch (id) {
      case "cirrus":
        return "bg-cyan-50 dark:bg-cyan-950/20";
      case "luma":
        return "bg-teal-50 dark:bg-teal-950/20";
      case "purr":
        return "bg-purple-50 dark:bg-purple-950/20";
      case "sprout":
        return "bg-amber-50 dark:bg-amber-950/20";
      default:
        return "bg-slate-50 dark:bg-slate-900/20";
    }
  };

  const getProfileIconBorderColor = (id: string, isActive: boolean) => {
    if (!isActive) return "border-slate-200 dark:border-slate-800 scale-95 opacity-65 grayscale hover:grayscale-[30%] hover:opacity-100 hover:scale-100";
    switch (id) {
      case "purr":
        return "border-purple-400 ring-4 ring-purple-400/20 shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-108";
      case "luma":
        return "border-teal-300 ring-4 ring-teal-300/20 shadow-[0_0_20px_rgba(45,212,191,0.4)] scale-108";
      case "cirrus":
        return "border-sky-400 ring-4 ring-sky-400/20 shadow-[0_0_20px_rgba(56,189,248,0.4)] scale-108";
      case "sprout":
        return "border-amber-300 ring-4 ring-amber-300/20 shadow-[0_0_20px_rgba(253,186,116,0.4)] scale-108";
      default:
        return "border-primary scale-108";
    }
  };

  const activeCompanion = COMPANIONS.find(c => c.id === activeId) || COMPANIONS[0];
  const spec = COMPANION_SPECIAL_DETAILS[activeId];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-xl bg-background min-h-screen text-on-surface">
      
      {/* 1. COMPACT ACTIVE STUDENT BANNER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-lowest/80 backdrop-blur-md border border-white/50 dark:border-slate-800/50 rounded-3xl p-4 mb-6 soft-shadow">
        <div>
          <p className="text-[11px] font-sans text-on-surface-variant font-bold uppercase tracking-wider">
            Active Session: <strong className="text-primary">{studentProfile.nickname}</strong>
          </p>
          <p className="text-[11px] font-sans text-on-surface-variant">
            Branch: <strong className="text-secondary">{studentProfile.branch}</strong> • Sem: <strong className="text-secondary">{studentProfile.semester}</strong>
          </p>
        </div>
        <button
          onClick={onSignOut}
          className="text-xs font-sans font-bold text-error duration-200 border border-error-container bg-error-container/20 hover:bg-error-container/40 px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[15px] font-normal">logout</span>
          <span>Reset Session</span>
        </button>
      </div>

      {/* 2. PROGRESS BANNER */}
      <div className="mb-8 max-w-xl mx-auto text-center space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-label-md text-primary font-bold">Step 2: Co-Pilot Sanctuary Setup</span>
          <span className="text-label-sm text-on-surface-variant font-mono">50% Completed</span>
        </div>
        <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary progress-glow rounded-full transition-all duration-1000 ease-out" 
            style={{ width: "50%" }}
          ></div>
        </div>
        <p className="font-sans text-md text-on-surface/90 max-w-sm mx-auto pt-1 leading-relaxed">
          Select each friend below to preview their interactive features, colors, and engineering qualities.
        </p>
      </div>

      {/* 3. SMALL PROFILE SELECTION ICONS BAR (ABOVE ACCORDING TO REQUEST) */}
      <div className="flex justify-center items-center gap-4 sm:gap-6 md:gap-8 bg-surface-container-lowest/60 border border-slate-100 dark:border-slate-900 rounded-[32px] p-6 max-w-2xl mx-auto mb-10 soft-shadow">
        {COMPANIONS.map((companion) => {
          const avatarStyle = getAvatarStyle(companion.id);
          const bgClass = getAvatarBgClass(companion.id);
          const isActive = activeId === companion.id;
          return (
            <button
              key={companion.id}
              onClick={() => setActiveId(companion.id)}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div 
                style={avatarStyle}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 transition-all duration-500 bg-no-repeat bg-cover group-hover:scale-105 ${bgClass} ${getProfileIconBorderColor(companion.id, isActive)}`}
              />
              <span className={`mt-2.5 text-xs font-sans font-bold transition-all duration-300 ${
                isActive ? `${spec.themeClass} scale-110 tracking-wide` : "text-on-surface-variant group-hover:text-on-surface"
              }`}>
                {companion.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. THE MAGICAL PREVIEW HUB (AN INTERACTIVE ENTRANCE ARENA WITH CUSTOM BG COLORS, SPEECH BALLOONS AND SPECIAL ABILITIES) */}
      <div id="magical-preview-container" className="relative max-w-4xl mx-auto mb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0, scale: 0.94, y: 35, rotate: -0.5 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -25, rotate: 0.5 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            className={`relative rounded-[36px] border border-white/80 dark:border-slate-800/80 p-6 sm:p-10 md:p-12 shadow-2xl bg-gradient-to-b ${spec.bgGradient} overflow-hidden backdrop-blur-md flex flex-col md:flex-row gap-8 md:gap-12 items-center`}
          >
            
            {/* PORTAL/AURA GRAPHIC ACCENT */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-hidden">
              <motion.div
                animate={{ scale: [1, 1.15, 1], rotate: [0, 360] }}
                transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                className="absolute w-80 h-80 rounded-full opacity-35 filter blur-[45px] transition-all duration-700"
                style={{ backgroundColor: spec.sparkleColor }}
              />
            </div>

            {/* FLOATING STARDUST MAGICAL PARTICLES */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {[...Array(7)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ y: 90, x: (idx - 3) * 60, scale: 0, opacity: 0 }}
                  animate={{
                    y: [-15, -130],
                    scale: [0, 1.3, 0.9, 0],
                    opacity: [0, 0.95, 0.95, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 3.2 + idx * 0.4,
                    delay: idx * 0.3,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 bottom-1/6 w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: spec.sparkleColor,
                    boxShadow: `0 0 12px ${spec.sparkleColor}, 0 0 4px #ffffff`,
                  }}
                />
              ))}
            </div>

            {/* LEFT COMPANION MASCOT GRAPHICAL RING PORTAL */}
            <div className="relative shrink-0 flex flex-col items-center">
              
              {/* Magical Portal Ground Ring */}
              <div 
                className="absolute -bottom-1 w-32 h-6 rounded-full filter blur-[2px] border-2 border-dashed animate-spin"
                style={{ 
                  borderColor: spec.sparkleColor, 
                  backgroundColor: `${spec.glowColor}`,
                  animationDuration: "14s"
                }}
              />

              {/* The Live Character Mascot component in Action with active talking/happy motions */}
              <CompanionMascot 
                companionId={activeId} 
                emotion="talking"
                isSpeaking={true}
                size="lg"
              />

              {/* Character Vibe Status Pill badge */}
              <div className={`mt-4 px-3.5 py-1 text-xs font-sans font-bold select-none border rounded-full bg-surface-container-lowest/90 ${spec.accentBorder} ${spec.themeClass} backdrop-blur-sm self-center shadow-md`}>
                {spec.vibe}
              </div>
            </div>

            {/* RIGHT COMPANION SUMMARY & EMPATHETIC EXPLANATION SCROLL */}
            <div className="flex-1 space-y-6">
              
              {/* Dynamic Speech balloon telling about qualities inside custom styling */}
              <div className={`relative px-6 py-5 rounded-[24px] border ${spec.bubbleBg} shadow-sm font-sans text-sm leading-relaxed`}>
                <p className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1.5 block opacity-75">
                  Interactive Greeting:
                </p>
                <div className="italic text-base md:text-md leading-relaxed font-sans text-on-surface/95">
                  "{spec.greeting}"
                </div>
                {/* Speech tail */}
                <span className="absolute bottom-6 md:bottom-auto md:top-12 -left-3 border-y-8 border-y-transparent border-r-8 border-r-surface-container-lowest/90" />
              </div>

              {/* Qualities Grid explaining B.Tech coping strategies matching character colors */}
              <div className="space-y-3">
                <h4 className="text-xs font-sans font-extrabold uppercase tracking-widest text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] font-normal text-primary">diversity_3</span>
                  <span>Companion Qualities & Coping Skills</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {spec.skills.map((skill, index) => (
                    <div 
                      key={index} 
                      className={`flex flex-col p-3 rounded-2xl bg-surface-container-lowest/80 border border-slate-100 dark:border-slate-900 shadow-sm transition-all duration-300 hover:shadow-md hover:${spec.accentBorder}`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span 
                          className="material-symbols-outlined text-[18px] font-normal shrink-0"
                          style={{ color: spec.sparkleColor }}
                        >
                          {skill.icon}
                        </span>
                        <span className={`text-[11px] font-bold tracking-tight uppercase leading-none truncate ${spec.themeClass}`}>
                          {skill.name}
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed font-sans font-medium line-clamp-3">
                        {skill.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOND CONFIRMATION TRIGGER FOOTER */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100 dark:border-slate-900/60">
                <button
                  id={`confirm-bond-${activeId}`}
                  onClick={() => onSelect(activeCompanion)}
                  className="w-full sm:w-auto px-8 py-3.5 bg-primary text-on-primary hover:bg-primary/95 text-label-md font-bold rounded-2xl hover:shadow-[0_4px_20px_rgba(var(--color-primary),0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span className="material-symbols-outlined font-normal transform group-hover:scale-110 duration-200">spa</span>
                  <span>Foster Bond with {activeCompanion.name}</span>
                </button>
                <div className="text-[11px] text-on-surface-variant flex items-center gap-1 opacity-80">
                  <span className="material-symbols-outlined text-[14px]">lock_open</span>
                  <span>Sessional & placement companion available anytime</span>
                </div>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>
      </div>

      {/* 5. USER HELPFUL TIP BANNER */}
      <div className="flex justify-center">
        <div className="glass-bg p-4 rounded-2xl border border-primary-fixed-dim/25 flex items-center gap-3 max-w-lg shadow-sm">
          <span className="material-symbols-outlined text-primary scale-110 select-none font-normal shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>
            lightbulb
          </span>
          <p className="text-body-md text-on-secondary-fixed-variant leading-relaxed text-xs">
            <strong>Campus Sanctuary Guideline</strong>: Take your time to compare characters. Each has unique dialogue, visuals, and dynamic responses written to buffer students against academic fatigue.
          </p>
        </div>
      </div>

    </main>
  );
}
