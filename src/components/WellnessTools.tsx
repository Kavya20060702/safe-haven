import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface GratitudeLog {
  id: string;
  items: string[];
  date: string;
}

export default function WellnessTools() {
  // --- AFFIRMATION ROTATION STATES ---
  const [affirmationIndex, setAffirmationIndex] = useState(0);

  const affirmations = [
    {
      quote: "A semicolon means the sentence isn't over. Your journey through B.Tech is just a chapter, not the whole book. Keep writing.",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKJ6zP-mXluoBSKf6EAJevr7yPzJd7hZqYeECSgEN09RatLRbfhrikeSVKKGTpKf-BbPRTUpYFeb6ybc_TCHRE27Etlo2el8iCetQO3AqTCWlhgj_5f7y-EoxsMBxaF43LxBKIODMDN1tOkMkng1JF9hjlAQdPd2ZVNrC64QKIYSKhlNfUKDq7g-A5h2L2oHsnbVipVQwG3gHygEzHyhzhYu_GL8eR_Trdbo_Ib8h7INqKFjQZflRqCcbO806ETDrZLyWwKcn8AB8"
    },
    {
      quote: "Breathe in peace, breathe out semester stress. You are capable, resilient, and far more than just a GPA.",
      img: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80"
    },
    {
      quote: "Your value is not compiled by lines of code or grade sheets. You are a human being, designed to grow at your own beautiful pace.",
      img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80"
    },
    {
      quote: "Small daily steps accumulate into quiet miracles. Give yourself permission to pause, reset, and start fresh today.",
      img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80"
    },
    {
      quote: "An error is a learning signal, not a final stamp. Embrace the bugs of life—they are just test cases for your strength.",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80"
    }
  ];

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setAffirmationIndex((prev) => (prev + 1) % affirmations.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, [affirmations.length]);

  // --- BREATHING STATES ---
  const [breathStage, setBreathStage] = useState<"Inhale" | "Hold" | "Exhale">("Inhale");
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathCount, setBreathCount] = useState(4);

  // --- MOOD TRACKER STATES ---
  const [selectedMood, setSelectedMood] = useState<string>("Okay");
  const [moodLogs, setMoodLogs] = useState<{ mood: string; time: string }[]>(() => {
    try {
      const saved = localStorage.getItem("safehaven_mood_logs");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- GRATITUDE STATES ---
  const [gridInputs, setGridInputs] = useState<string[]>(["", "", ""]);
  const [savedEntries, setSavedSavedEntries] = useState<GratitudeLog[]>(() => {
    try {
      const saved = localStorage.getItem("safehaven_gratitude_entries");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // --- POMODORO STATES ---
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoTimeLeft, setPomoTimeLeft] = useState(1500); // 25 mins
  const [soundSynthesizerOn, setSoundSynthesizerOn] = useState(false);
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const brownNoiseSourceRef = useRef<AudioNode | null>(null);

  const showToast = (msg: string) => {
    setToastAlert(msg);
    setTimeout(() => setToastAlert(null), 3500);
  };

  // --- BREATHING REGULATOR TIMER ---
  useEffect(() => {
    let timer: any = null;
    if (breathingActive) {
      timer = setInterval(() => {
        setBreathCount((prev) => {
          if (prev <= 1) {
            // cycle stage
            setBreathStage((curr) => {
              if (curr === "Inhale") return "Hold";
              if (curr === "Hold") return "Exhale";
              return "Inhale";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathStage("Inhale");
      setBreathCount(4);
    }
    return () => clearInterval(timer);
  }, [breathingActive, breathStage]);

  // --- FOCUS MODE POMODORO TIMER ---
  useEffect(() => {
    let interval: any = null;
    if (pomoActive && pomoTimeLeft > 0) {
      interval = setInterval(() => {
        setPomoTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomoActive && pomoTimeLeft === 0) {
      setPomoActive(false);
      setPomoTimeLeft(1500);
      showToast("🌸 Focus cycle completed! Take a well-deserved rest, bud.");
      triggerAudioChime();
    }
    return () => clearInterval(interval);
  }, [pomoActive, pomoTimeLeft]);

  const triggerAudioChime = () => {
    try {
      const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 Helper chime
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
      osc.start();
      osc.stop(ctx.currentTime + 1.5);
    } catch (e) {}
  };

  // --- Rain Synthesizer ---
  const activateSynthesizerNoise = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const bufferSize = 4 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 4.0; 
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const lowpassFilter = ctx.createBiquadFilter();
      lowpassFilter.type = "lowpass";
      lowpassFilter.frequency.setValueAtTime(320, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15, ctx.currentTime);

      source.connect(lowpassFilter);
      lowpassFilter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      brownNoiseSourceRef.current = source;
    } catch (error) {
      console.warn("AudioContext brown noise generator blocked", error);
    }
  };

  const deactivateSynthesizerNoise = () => {
    if (brownNoiseSourceRef.current) {
      try {
        (brownNoiseSourceRef.current as any).stop();
      } catch (err) {}
      brownNoiseSourceRef.current = null;
    }
  };

  useEffect(() => {
    if (soundSynthesizerOn) {
      activateSynthesizerNoise();
    } else {
      deactivateSynthesizerNoise();
    }
    return () => deactivateSynthesizerNoise();
  }, [soundSynthesizerOn]);

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
    setMoodLogs((prev) => {
      const updated = [{ mood, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }, ...prev];
      localStorage.setItem("safehaven_mood_logs", JSON.stringify(updated));
      return updated;
    });
    showToast(`Mood logged: ${mood}. Be proud for prioritizing self-awareness.`);
  };

  const handleGratitudeSave = () => {
    const filled = gridInputs.filter((x) => x.trim() !== "");
    if (filled.length === 0) {
      showToast("Write down at least one positive note in the fields.");
      return;
    }
    const newEntry: GratitudeLog = {
      id: Date.now().toString(),
      items: filled,
      date: new Date().toLocaleDateString([], { month: "short", day: "numeric" }),
    };
    setSavedSavedEntries((prev) => {
      const updated = [newEntry, ...prev];
      localStorage.setItem("safehaven_gratitude_entries", JSON.stringify(updated));
      return updated;
    });
    setGridInputs(["", "", ""]);
    showToast("💖 Saved to your gratitude archive. True growth is a series of small, quiet steps.");
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div id="digital-sanctuary" className="flex-1 space-y-6 select-none py-2 px-1 max-w-5xl mx-auto">
      
      {/* Toast Alert Pop Over Overlay */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-neutral-900 border border-neutral-800 text-white px-6 py-3 rounded-full shadow-2xl z-[200] font-sans text-xs flex items-center gap-2 select-none"
          >
            <span className="text-secondary">✦</span>
            <span>{toastAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION PANEL */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
        <div>
          <span className="text-[10px] uppercase font-bold text-primary tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
            Rest and Recovery
          </span>
          <h1 className="font-display text-2xl font-black text-on-surface mt-2 tracking-tight">Digital Sanctuary</h1>
          <p className="text-xs text-on-surface-variant font-sans mt-0.5">
            A minimalist recovery shelter designed to lower cortisol levels and release campus burnout.
          </p>
        </div>
      </section>

      {/* MODERN BENTO DASHBOARD GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* ============================================================ */}
        {/* 1. BREATHING REGULATOR (lg:col-span-7) */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 bg-white border border-neutral-150 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-sm font-black text-neutral-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">air</span>
              <span>Concentric Box Breath Regulator</span>
            </h2>
            <span className="text-[10px] font-sans font-bold text-neutral-400 uppercase tracking-widest">
              {breathingActive ? "Exercising Active" : "Idle"}
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center py-6">
            <button 
              onClick={() => setBreathingActive(!breathingActive)}
              className="relative w-44 h-44 flex items-center justify-center cursor-pointer outline-none transition-transform active:scale-95 duration-500"
            >
              {/* Pulsing breathing indicator layers */}
              {breathingActive && (
                <>
                  <motion.div 
                    animate={{ scale: [1, 1.4, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-primary/5 rounded-full"
                  />
                  <motion.div 
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 }}
                    className="absolute inset-4 bg-primary/10 rounded-full"
                  />
                </>
              )}
              
              <div className="z-10 w-32 h-32 bg-primary rounded-full flex flex-col items-center justify-center text-white font-sans font-bold shadow-xl border border-primary-container">
                <span className="text-[10px] tracking-wider uppercase font-black opacity-80">
                  {breathingActive ? breathStage : "Click to"}
                </span>
                <span className="text-2xl mt-1 tracking-tight font-display">
                  {breathingActive ? `${breathCount}s` : "Start"}
                </span>
              </div>
            </button>
          </div>

          {/* Timeline Stages progress */}
          <div className="border-t border-neutral-100 pt-5 mt-2 flex justify-around text-neutral-600 font-sans text-xs">
            <div className={`text-center space-y-0.5 transition duration-300 ${breathingActive && breathStage === "Inhale" ? "scale-105 text-primary font-bold" : "opacity-40"}`}>
              <p className="text-[9px] tracking-wide font-black uppercase text-neutral-400">Inhale</p>
              <div className="w-10 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden">
                {breathingActive && breathStage === "Inhale" && <div className="h-full bg-primary w-full animate-pulse" />}
              </div>
              <p className="font-mono text-[10px] font-bold mt-1">4.0 sec</p>
            </div>
            <div className={`text-center space-y-0.5 transition duration-300 ${breathingActive && breathStage === "Hold" ? "scale-105 text-primary font-bold" : "opacity-40"}`}>
              <p className="text-[9px] tracking-wide font-black uppercase text-neutral-400">Hold</p>
              <div className="w-10 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden">
                {breathingActive && breathStage === "Hold" && <div className="h-full bg-primary w-full animate-pulse" />}
              </div>
              <p className="font-mono text-[10px] font-bold mt-1">4.0 sec</p>
            </div>
            <div className={`text-center space-y-0.5 transition duration-300 ${breathingActive && breathStage === "Exhale" ? "scale-105 text-primary font-bold" : "opacity-40"}`}>
              <p className="text-[9px] tracking-wide font-black uppercase text-neutral-400">Exhale</p>
              <div className="w-10 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden">
                {breathingActive && breathStage === "Exhale" && <div className="h-full bg-primary w-full animate-pulse" />}
              </div>
              <p className="font-mono text-[10px] font-bold mt-1">4.0 sec</p>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2. ROTATING AFFIRMATION DECK (lg:col-span-5) */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 bg-[#faf8f4] border border-[#f0ece5] rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 min-h-[340px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[9px] font-black uppercase text-amber-800 tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-600 rounded-full animate-pulse"></span>
              <span>Daily Affirmation Deck</span>
            </span>
            <span className="text-[10px] font-mono text-amber-700/80 font-bold bg-amber-100/50 px-2.5 py-0.5 rounded-full">
              {affirmationIndex + 1}/{affirmations.length}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={affirmationIndex}
              initial={{ opacity: 0, scale: 0.98, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -5 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <span className="material-symbols-outlined text-amber-400 text-3xl block leading-none select-none font-normal">
                  format_quote
                </span>
                <p className="font-display text-sm font-bold text-amber-950/90 leading-relaxed italic">
                  {affirmations[affirmationIndex].quote}
                </p>
              </div>

              <div>
                <div className="w-full h-28 rounded-2xl overflow-hidden border border-amber-200/40 shadow-inner relative">
                  <img 
                    alt="mindfulness sanctuary" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none transition-transform duration-700 hover:scale-105" 
                    src={affirmations[affirmationIndex].img} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ============================================================ */}
        {/* 3. EMOTION GAUGING BAR (lg:col-span-5) */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 bg-white border border-neutral-150 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-display text-sm font-black text-neutral-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-lg">mood</span>
                <span>Calibrate Emotion State</span>
              </h3>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                Real-time Log
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5 p-1.5 bg-neutral-50 rounded-2xl border border-neutral-100 shadow-inner mb-4">
              {[
                { emoji: "sentiment_very_dissatisfied", title: "Low" },
                { emoji: "sentiment_dissatisfied", title: "Down" },
                { emoji: "sentiment_neutral", title: "Okay" },
                { emoji: "sentiment_satisfied", title: "Good" },
                { emoji: "sentiment_very_satisfied", title: "Great" }
              ].map((btn, i) => {
                const isActive = selectedMood === btn.title;
                return (
                  <button
                    key={i}
                    onClick={() => handleMoodSelect(btn.title)}
                    className={`flex flex-col items-center py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer select-none ${
                      isActive 
                        ? "bg-primary text-white scale-105 shadow-md font-bold" 
                        : "hover:bg-neutral-200/50 text-neutral-500 hover:text-neutral-700"
                    }`}
                  >
                    <span 
                      className="material-symbols-outlined text-2xl leading-none font-normal"
                      style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {btn.emoji}
                    </span>
                    <span className="text-[9px] font-sans tracking-wide uppercase mt-1 font-bold">{btn.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center">
            <p className="text-xs text-neutral-600 leading-relaxed italic">
              "Consistency is better than perfection. Log your daily states to observe slow growth spirals over the semesters."
            </p>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. GRATITUDE REFLECTION MATRIX (lg:col-span-7) */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 bg-white border border-neutral-150 rounded-3xl p-6 flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-display text-sm font-black text-neutral-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">book_heart</span>
                  <span>Silver Linings Gratitude Journal</span>
                </h3>
                <p className="text-[10px] text-neutral-400 font-sans tracking-tight mt-0.5">
                  Write down three positive logs to rewire your subconscious mind for resilience.
                </p>
              </div>
              <span className="material-symbols-outlined text-neutral-300 text-3xl font-normal leading-none">
                edit_note
              </span>
            </div>

            <div className="space-y-2.5 font-sans">
              {gridInputs.map((val, idx) => (
                <div key={idx} className="relative flex items-center group">
                  <span className="absolute left-3 text-neutral-400 font-bold font-mono text-xs select-none">
                    {idx + 1}.
                  </span>
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => {
                      const copy = [...gridInputs];
                      copy[idx] = e.target.value;
                      setGridInputs(copy);
                    }}
                    placeholder={
                      idx === 0 
                        ? "I finished that complex lab assignment file..." 
                        : idx === 1 
                        ? "Had a nice supportive tea breakout with friends..." 
                        : "My compiler finally successfully ran!"
                    }
                    className="w-full bg-neutral-50/50 border border-neutral-150 rounded-xl py-3 pl-8 pr-3 text-xs placeholder-neutral-400 focus:outline-none focus:border-primary/40 focus:bg-white text-neutral-800 font-semibold transition-all"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleGratitudeSave}
            className="mt-4 w-full bg-primary/10 text-primary hover:bg-primary/15 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm font-normal">save</span>
            <span>Record Gratitude Subconscious State</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* 5. DEEP FOCUS & POMODORO HUB (lg:col-span-12) */}
        {/* ============================================================ */}
        <div className="lg:col-span-12 bg-neutral-900 border border-neutral-800 text-white rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-2xl bg-neutral-800 border border-neutral-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-amber-400 text-xl font-normal">alarm</span>
            </div>
            <div>
              <h4 className="font-display text-sm font-black tracking-tight flex items-center justify-center md:justify-start gap-1.5">
                <span>Anti-Distraction Focus Metronome</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </h4>
              <p className="text-[10px] text-neutral-400 font-sans tracking-tight leading-normal mt-0.5">
                {pomoActive 
                  ? `Active Focus Session: ${formatTimer(pomoTimeLeft)} remaining. Stay sharp, buddy!` 
                  : "Enable 25-minute Pomodoro timers backed by specialized lowpass white hostel noise synths."
                }
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 font-sans">
            {/* Ambient noise trigger */}
            <button 
              type="button"
              onClick={() => setSoundSynthesizerOn(!soundSynthesizerOn)}
              className={`px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all text-[11px] font-bold cursor-pointer border ${
                soundSynthesizerOn
                  ? "bg-amber-400 border-amber-300 text-neutral-950 shadow-md shadow-amber-400/10"
                  : "bg-neutral-800 border-neutral-700 text-neutral-100 hover:bg-neutral-700"
              }`}
            >
              <span className="material-symbols-outlined text-sm font-normal">
                {soundSynthesizerOn ? "volume_up" : "volume_off"}
              </span>
              <span>{soundSynthesizerOn ? "Rain Synthesizer ON" : "Brown Rain Synth"}</span>
            </button>

            {/* Pomodoro toggle */}
            <button 
              onClick={() => {
                setPomoActive(!pomoActive);
                if (!pomoActive) setPomoTimeLeft(1500); 
                showToast(pomoActive ? "Pomodoro session reset." : "🌿 Focus mode started! Get cozy and let's work.");
              }}
              className="px-5 py-2 bg-white text-neutral-900 rounded-xl font-bold hover:bg-neutral-100 active:scale-95 transition-all text-[11px] cursor-pointer"
            >
              {pomoActive ? "Reset Timer" : "Start 25m Pomodoro"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
