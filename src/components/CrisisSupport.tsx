import React, { useState, useEffect, useRef } from "react";
import { CRISIS_RESOURCES } from "../data";
import { motion, AnimatePresence } from "motion/react";
import { StudentProfile } from "../types";

interface CrisisSupportProps {
  onBack: () => void;
  studentProfile?: StudentProfile | null;
  onUpdateProfile?: (profile: StudentProfile) => void;
}

export default function CrisisSupport({ onBack, studentProfile, onUpdateProfile }: CrisisSupportProps) {
  // Common states
  const [toastAlert, setToastAlert] = useState<string | null>(null);

  // Guided Grounding Method states
  const [isGroundingActive, setIsGroundingActive] = useState(false);
  const [groundingStep, setGroundingStep] = useState(1); // 1: See, 2: Touch, 3: Hear, 4: Smell, 5: Taste, 6: Complete
  const [groundingInputs, setGroundingInputs] = useState({
    see: ["", "", "", "", ""],
    touch: ["", "", "", ""],
    hear: ["", "", ""],
    smell: ["", ""],
    taste: [""],
  });

  // Call Dialer Overlay States
  const [activeCall, setActiveCall] = useState<"helpline" | "support_circle" | null>(null);
  const [callTimer, setCallTimer] = useState(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [callSubtitles, setCallSubtitles] = useState("");

  // SMS Composer Modal States
  const [activeSmsTemplate, setActiveSmsTemplate] = useState<string>("");
  const [smsMessage, setSmsMessage] = useState("");
  const [showSmsComposer, setShowSmsComposer] = useState(false);
  const [isSmsSending, setIsSmsSending] = useState(false);

  // Contact Editor Edit State
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactName, setContactName] = useState(studentProfile?.supportCircleName || "");
  const [contactRelation, setContactRelation] = useState(studentProfile?.supportCircleRelation || "Friend");
  const [contactInfo, setContactInfo] = useState(studentProfile?.supportCircleInfo || "");

  // Acoustic Ambient noise states inside support tab
  const [isAmbientOn, setIsAmbientOn] = useState(false);

  // Active Resource Tab Directory State
  const [activeResourceTab, setActiveResourceTab] = useState<"helplines" | "grounding">("helplines");

  // Quick Relief Panic Button states
  const [showQuickRelief, setShowQuickRelief] = useState(false);
  const [panicBreathStage, setPanicBreathStage] = useState<"Inhale" | "Hold" | "Exhale" | "Pause">("Inhale");
  const [panicBreathCount, setPanicBreathCount] = useState(4);

  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseSourceRef = useRef<AudioNode | null>(null);
  const callIntervalRef = useRef<any>(null);

  // Sync state initially when profile loads
  useEffect(() => {
    if (studentProfile) {
      setContactName(studentProfile.supportCircleName || "");
      setContactRelation(studentProfile.supportCircleRelation || "Friend");
      setContactInfo(studentProfile.supportCircleInfo || "");
    }
  }, [studentProfile]);

  // Panic Breathing Scheduler for Quick Relief Modal
  useEffect(() => {
    let timer: any = null;
    if (showQuickRelief) {
      timer = setInterval(() => {
        setPanicBreathCount((prev) => {
          if (prev <= 1) {
            setPanicBreathStage((curr) => {
              if (curr === "Inhale") return "Hold";
              if (curr === "Hold") return "Exhale";
              if (curr === "Exhale") return "Pause";
              return "Inhale";
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setPanicBreathStage("Inhale");
      setPanicBreathCount(4);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [showQuickRelief]);

  // Toast notifier
  const showToast = (msg: string) => {
    setToastAlert(msg);
    setTimeout(() => setToastAlert(null), 4000);
  };

  // MOCK CALL TIMERS & TRANSCRIPTS
  useEffect(() => {
    if (activeCall) {
      setCallTimer(0);
      setCallSubtitles("Initiating encrypted secure peer-to-peer line...");
      
      // Trigger a brief beep to simulate caller connect
      triggerSoundChime(440, 0.1);

      callIntervalRef.current = setInterval(() => {
        setCallTimer((prev) => {
          const next = prev + 1;
          
          // Custom transcript subtitles dialogue sequence depending on caller
          if (activeCall === "helpline") {
            if (next === 2) setCallSubtitles("Connecting to Tele-MANAS Wellness Center...");
            if (next === 5) setCallSubtitles("Line connected. Standard and fully anonymous counselor stands online.");
            if (next === 9) setCallSubtitles("Counselor: 'Hello friend, I see you are logged in from Safe Haven. Let's take a deep breath.'");
            if (next === 15) setCallSubtitles("Counselor: 'You are completely safe. Take your time, we are here for you.'");
          } else {
            const nick = studentProfile?.supportCircleName || "your Peer Circle advocate";
            if (next === 3) setCallSubtitles(`Pinging ${nick}'s cellular emergency node...`);
            if (next === 6) setCallSubtitles("Connection verified. Broadcast signals triggered on their dashboard device.");
            if (next === 10) setCallSubtitles("Dialer: 'Hostel backup node ringing. A secure SMS dispatch is also being cached.'");
          }
          return next;
        });
      }, 1000);
    } else {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    }
    return () => {
      if (callIntervalRef.current) clearInterval(callIntervalRef.current);
    };
  }, [activeCall]);

  const triggerSoundChime = (frequency: number, duration: number) => {
    try {
      const ctx = audioContextRef.current || new (window.AudioContext || (window as any).webkitAudioContext)();
      if (!audioContextRef.current) audioContextRef.current = ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  };

  // --- Rain Noise Generator copy for localized grounding ---
  const startLocalAmbient = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") ctx.resume();

      const bufferSize = 3 * ctx.sampleRate;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let lastOut = 0.0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02; // pinky brown noise lowpass behavior
        lastOut = output[i];
        output[i] *= 3.5;
      }

      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(280, ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start();
      noiseSourceRef.current = source;
    } catch (e) {
      console.warn("Grounding audio blocked", e);
    }
  };

  const stopLocalAmbient = () => {
    if (noiseSourceRef.current) {
      try {
        (noiseSourceRef.current as any).stop();
      } catch (err) {}
      noiseSourceRef.current = null;
    }
  };

  useEffect(() => {
    if (isAmbientOn) {
      startLocalAmbient();
    } else {
      stopLocalAmbient();
    }
    return () => stopLocalAmbient();
  }, [isAmbientOn]);


  const formatDuration = (secs: number) => {
    const min = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${min.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  // SMS Handler
  const handleSelectSmsTemplate = (key: string, body: string) => {
    setActiveSmsTemplate(key);
    let name = studentProfile?.nickname || "a friend";
    let formatted = body.replace("[MyName]", name);
    setSmsMessage(formatted);
  };

  const handleSendMockSms = () => {
    if (!smsMessage.trim()) {
      showToast("Please state your distress message first.");
      return;
    }
    setIsSmsSending(true);
    triggerSoundChime(660, 0.15);
    
    setTimeout(() => {
      setIsSmsSending(false);
      setShowSmsComposer(false);
      const recipient = studentProfile?.supportCircleName || "Emergency Support Friend";
      showToast(`✉️ SOS Alert successfully dispatched to ${recipient}! Backlogs, CGPA stress parameters, or panic markers documented securely.`);
    }, 2800);
  };

  // Update Peer Contact Profile
  const handleSaveContactDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim()) {
      showToast("Please provide a name of your companion contact.");
      return;
    }
    if (onUpdateProfile && studentProfile) {
      const updated: StudentProfile = {
        ...studentProfile,
        supportCircleName: contactName,
        supportCircleRelation: contactRelation,
        supportCircleInfo: contactInfo,
      };
      onUpdateProfile(updated);
      setIsEditingContact(false);
      showToast("💖 Emergency support card successfully re-configured in local storage.");
    } else {
      showToast("Authentication state missing. Please verify you are logged in.");
    }
  };

  const handleStartGroundingList = () => {
    setIsGroundingActive(true);
    setGroundingStep(1);
    setGroundingInputs({
      see: ["", "", "", "", ""],
      touch: ["", "", "", ""],
      hear: ["", "", ""],
      smell: ["", ""],
      taste: [""],
    });
    triggerSoundChime(523.25, 0.2); // C5 Start
  };

  const handleNextGroundingStep = () => {
    if (groundingStep === 1) {
      const filled = groundingInputs.see.filter(item => item.trim() !== "");
      if (filled.length < 3) {
        showToast("Please name at least 3 things you can see around your desk or room.");
        return;
      }
    }
    if (groundingStep === 2) {
      const filled = groundingInputs.touch.filter(item => item.trim() !== "");
      if (filled.length < 2) {
        showToast("Please name at least 2 textures you can touch physically.");
        return;
      }
    }
    
    triggerSoundChime(523.25 + (groundingStep * 50), 0.12);
    setGroundingStep((prev) => prev + 1);
  };

  return (
    <div id="crisis-support-workspace" className="flex-1 py-1 sm:py-2 px-1 max-w-4xl mx-auto space-y-6">
      
      {/* Dynamic Toast Alert Layer */}
      <AnimatePresence>
        {toastAlert && (
          <motion.div 
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-neutral-900 text-white border border-neutral-800 px-6 py-3.5 rounded-full shadow-2xl z-[220] font-sans text-xs flex items-center gap-2 max-w-md text-center select-none"
          >
            <span className="text-amber-400 font-bold">✦</span>
            <span>{toastAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FULL CANVAS INTERACTIVE CONTENT */}
      <div className="relative min-h-[90vh] flex flex-col items-center justify-center py-10 px-4 overflow-hidden font-sans">
        
        {/* Breathing background effects matching Image 2.html */}
        <div className="absolute inset-0 -z-10 breathing-bg opacity-30 rounded-3xl"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[350px] h-[350px] bg-primary-fixed opacity-15 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-secondary-fixed opacity-15 blur-[80px] rounded-full pointer-events-none"></div>

        {/* Go Back navigation top-left inside layout */}
        <div className="absolute top-4 left-4 z-20">
          <button 
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 p-2 px-4 rounded-full bg-white/60 hover:bg-[#d9bbf5]/30 text-primary hover:text-[#5B4573] font-semibold text-sm transition-all border border-purple-100/50 cursor-pointer shadow-sm animate-in fade-in duration-300"
          >
            <span className="material-symbols-outlined text-sm font-bold">arrow_back</span>
            <span>Go Back</span>
          </button>
        </div>

        {/* Inner layout wrapper centered */}
        <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-8 pt-10">

          {/* Pulsing Heart Circle Anchor */}
          <div className="w-20 h-20 bg-primary-container/20 rounded-full flex items-center justify-center text-primary shadow-inner animate-pulse">
            <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          </div>

          {/* Header Typography Group */}
          <div className="space-y-3">
            <h1 className="font-display text-4xl font-extrabold text-[#6d5487] leading-tight select-none">
              You are not alone. <br/>Help is available.
            </h1>
            <p className="text-base font-sans text-on-surface-variant max-w-sm mx-auto leading-relaxed select-none">
              It sounds like you're going through a really tough time. We've compiled immediate systems to support you.
            </p>
          </div>

          {/* Quick Action Matrix mapping helpline & circles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full pt-2">
            
            {/* Primary Action Button: Contact Professional Helpline */}
            <button 
              type="button"
              onClick={() => {
                setShowQuickRelief(true);
                triggerSoundChime(600, 0.2);
              }}
              className="md:col-span-2 group relative overflow-hidden bg-primary text-on-primary font-display font-semibold text-lg py-4 px-6 rounded-3xl soft-shadow hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-between border-none cursor-pointer"
            >
              <span className="flex items-center gap-3">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
                <span>Contact Professional Helpline</span>
              </span>
              <span className="material-symbols-outlined opacity-90 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>

            {/* Secondary Action: Call Support Circle */}
            <button 
              type="button"
              onClick={() => {
                if (!studentProfile?.supportCircleName) {
                  setIsEditingContact(true);
                  showToast("Please configure your supporter contact below first!");
                  return;
                }
                setActiveCall("support_circle");
              }}
              className="flex flex-col items-center justify-center gap-2 bg-[#e6d2ff] text-[#68587f] hover:bg-[#d9beeb] font-display font-bold text-lg p-5 rounded-3xl shadow-sm hover:scale-[1.01] transition-all border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 0" }}>group</span>
              <span className="text-sm">Call Support Circle</span>
            </button>

            {/* Tertiary Action: Send Alert Message */}
            <button 
              type="button"
              onClick={() => {
                if (!studentProfile?.supportCircleName) {
                  setIsEditingContact(true);
                  showToast("Please configure your supporter contact below first!");
                  return;
                }
                setSmsMessage("");
                setActiveSmsTemplate("");
                setShowSmsComposer(true);
              }}
              className="flex flex-col items-center justify-center gap-2 bg-[#b4a9c2] text-[#453e53] hover:bg-[#aea2ba] font-display font-bold text-lg p-5 rounded-3xl shadow-sm hover:scale-[1.01] transition-all border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-4xl">send_and_archive</span>
              <span className="text-sm">Send Alert Message</span>
            </button>

          </div>

          {/* Affirmation Soft Glass Card */}
          <div className="bg-white/60 backdrop-blur-md border border-white/40 p-5 rounded-3xl text-left shadow-sm max-w-2xl w-full">
            <div className="flex items-start gap-4">
              <div className="text-primary mt-1">
                <span className="material-symbols-outlined">spa</span>
              </div>
              <div className="space-y-1 font-sans">
                <p className="text-[10px] font-black uppercase tracking-wider text-primary">A GENTLE REMINDER</p>
                <p className="text-[12px] text-[#4a454e] leading-relaxed font-medium">
                  Take a moment to breathe. You are incredibly brave for reaching out. You are <strong className="font-bold text-[#b91c1c]">loved, valued, and your presence matters deeply</strong> to the world.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Resource directories panel tabs */}
          <div className="w-full bg-white/40 backdrop-blur-md rounded-[24px] p-1.5 border border-purple-100/40 flex gap-2 shadow-sm">
            <button
              type="button"
              onClick={() => {
                setActiveResourceTab("helplines");
                triggerSoundChime(400, 0.08);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-display font-black transition-all duration-200 cursor-pointer border-none ${
                activeResourceTab === "helplines"
                  ? "bg-primary text-white shadow-sm"
                  : "text-[#6d5487] hover:bg-[#e6d2ff]/30"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base">contact_phone</span>
                <span>Helpline Directory</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveResourceTab("grounding");
                triggerSoundChime(450, 0.08);
              }}
              className={`flex-1 py-3 px-4 rounded-2xl text-xs sm:text-sm font-display font-black transition-all duration-200 cursor-pointer border-none ${
                activeResourceTab === "grounding"
                  ? "bg-primary text-white shadow-sm"
                  : "text-[#6d5487] hover:bg-[#e6d2ff]/30"
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-base">spa</span>
                <span>Grounding Techniques</span>
              </span>
            </button>
          </div>

          {/* Directory Content Area */}
          {activeResourceTab === "helplines" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
              {CRISIS_RESOURCES.helplines.map((hp) => (
                <div 
                  key={hp.name} 
                  className="bg-white/70 backdrop-blur-md border border-purple-100/50 p-5 rounded-[24px] flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-display font-black text-sm text-[#4e3668] leading-tight select-all">
                        {hp.name}
                      </h4>
                      <span className="text-[9px] font-sans font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                        24/7 Free
                      </span>
                    </div>
                    <p className="text-[11px] text-[#635175] font-sans leading-relaxed select-all">
                      {hp.desc}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 pt-3 mt-4 border-t border-purple-100/30">
                    <span className="font-mono text-xs font-black text-primary select-all">
                      {hp.number}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveCall("helpline");
                        setCallSubtitles(`Connecting to ${hp.name}...`);
                        triggerSoundChime(523, 0.1);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary hover:bg-[#5B4573] text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">phone</span>
                      <span>Call Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeResourceTab === "grounding" && (
            <div className="space-y-4 w-full text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-amber-50/50 border border-amber-100/60 p-5 rounded-3xl flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <div className="space-y-0.5">
                  <h4 className="font-display font-bold text-sm text-amber-950">5-4-3-2-1 Somatic Grounding</h4>
                  <p className="text-[11px] text-amber-800 font-sans leading-relaxed">
                    Centering your raw focus onto the room counters adrenaline and stops feedback panic.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleStartGroundingList()}
                  className="px-4 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-sans font-bold text-xs rounded-xl transition duration-200 flex items-center gap-1.5 border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                  <span>Interactive Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-1 gap-2.5 w-full">
                {CRISIS_RESOURCES.techniques.map((tech) => (
                  <div 
                    key={tech.step} 
                    onClick={() => {
                      triggerSoundChime(440 + (tech.step * 45), 0.12);
                      showToast(`Centered on sensory snapshot ${tech.step}: ${tech.title}`);
                    }}
                    className="bg-white/60 hover:bg-white/95 border border-purple-100/20 p-4 rounded-2xl flex items-start gap-4 transition-all duration-200 cursor-pointer group hover:border-primary/20 shadow-sm"
                  >
                    <span className="w-9 h-9 rounded-full bg-[#f4ebfe] text-primary font-display font-black text-sm flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                      {tech.step}
                    </span>
                    <div className="space-y-0.5 pt-0.5">
                      <h4 className="font-display font-bold text-xs text-[#5c4475]">{tech.title}</h4>
                      <p className="text-[11px] text-[#6e5d7a] font-sans leading-relaxed">{tech.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Scenic Peaceful Sunset Nature Image Banner matching image/HTML link */}
          <div 
            className="w-full aspect-[16/8] rounded-[24px] bg-neutral-100 shadow-sm border border-purple-100/50 overflow-hidden relative flex items-end p-4 bg-center bg-cover"
            style={{ backgroundImage: "url('/src/assets/images/serene_lake_sunset_1781094934065.png')" }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#6d5487]/50 via-transparent to-transparent"></div>
            <p className="text-white text-xs sm:text-sm font-sans font-semibold italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)] pr-2 select-none text-left leading-normal relative z-10">
              "This moment will pass. You are safe."
            </p>
          </div>

          {/* Subtitle control links (Inline toggle commands for utilities) */}
          <div className="w-full pt-1 border-t border-purple-100/20 flex flex-wrap items-center justify-center gap-4 text-xs text-[#9E86B3] font-sans font-bold">
            
            {isEditingContact ? (
              <button 
                type="button"
                onClick={() => setIsEditingContact(false)}
                className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 font-bold"
              >
                ✕ Cancel Setup
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => setIsEditingContact(true)}
                className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">settings</span>
                <span>Configure Support Circle</span>
              </button>
            )}

            <span>•</span>

            {isGroundingActive ? (
              <button 
                type="button"
                onClick={() => setIsGroundingActive(false)}
                className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 font-bold"
              >
                ✕ Cancel Grounding
              </button>
            ) : (
              <button 
                type="button"
                onClick={() => handleStartGroundingList()}
                className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 font-bold flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">mindfulness</span>
                <span>Interactive Grounding</span>
              </button>
            )}

            <span>•</span>

            <button 
              type="button"
              onClick={() => setIsAmbientOn(!isAmbientOn)}
              className="hover:text-primary transition-colors cursor-pointer bg-transparent border-none p-0 font-bold flex items-center gap-1"
            >
              <span className={`material-symbols-outlined text-[14px] ${isAmbientOn ? "animate-pulse text-primary" : ""}`}>
                {isAmbientOn ? "volume_up" : "volume_off"}
              </span>
              <span>{isAmbientOn ? "Mute Ambient" : "Rain Ambient"}</span>
            </button>

          </div>

          {/* Settings & Utility Sheets Render Section dynamically positioned as inset */}
          <AnimatePresence>
            {isEditingContact && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-purple-100/50 rounded-2xl p-5 text-left space-y-4 w-full shadow-lg"
              >
                <div className="flex justify-between items-center border-b border-purple-50 pb-2">
                  <h4 className="font-display font-bold text-sm text-[#4e3668] flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">settings</span>
                    <span>Configure Supporter Contact</span>
                  </h4>
                  <button type="button" onClick={() => setIsEditingContact(false)} className="text-[11px] text-purple-400 font-bold hover:underline bg-transparent border-none cursor-pointer">Discard</button>
                </div>
                <form onSubmit={handleSaveContactDetails} className="space-y-3 text-left font-sans text-xs">
                  <div>
                    <label className="block font-bold text-neutral-600 mb-1">Companion/Peer Supporter Name</label>
                    <input 
                      type="text" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder=" Aryan (Hostel Roommate)"
                      className="w-full p-2.5 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold text-neutral-600 mb-1">Relationship</label>
                      <select
                        value={contactRelation}
                        onChange={(e) => setContactRelation(e.target.value)}
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white"
                      >
                        <option value="Friend">Friend / Peer</option>
                        <option value="Hostel Roommate">Roommate</option>
                        <option value="Parent">Parent</option>
                        <option value="Academic Mentor">Mentor / Advisor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-neutral-600 mb-1">Contact No</label>
                      <input 
                        type="text" 
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                        placeholder="+91 99999 88888"
                        className="w-full p-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-primary text-white font-bold rounded-lg text-xs hover:bg-[#5A417C] transition cursor-pointer border-none shadow-sm"
                  >
                    Save Support Configuration
                  </button>
                </form>
              </motion.div>
            )}

            {isGroundingActive && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#FAF8F4] border border-[#F0ECE5] rounded-3xl p-6 text-left w-full shadow-inner space-y-4"
              >
                {/* Grounding Wizard */}
                <div className="flex items-center justify-between border-b border-amber-200 pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-850">
                      Step {groundingStep} of 5
                    </span>
                    <h4 className="font-display font-bold text-sm text-amber-950 mt-0.5">
                      {groundingStep === 1 && "👀 Name 5 physical things you see around you"}
                      {groundingStep === 2 && "🤝 Name 4 tactile sensations you can touch"}
                      {groundingStep === 3 && "👂 Name 3 ambient frequencies you hear"}
                      {groundingStep === 4 && "👃 Focus and recognize 2 scents in your space"}
                      {groundingStep === 5 && "👅 Acknowledge 1 comforting taste"}
                      {groundingStep >= 6 && "🌿 Guided grounding complete"}
                    </h4>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setIsGroundingActive(false)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 cursor-pointer bg-transparent border-none"
                  >
                    Quit Guide
                  </button>
                </div>

                <div className="py-1">
                  {groundingStep === 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {groundingInputs.see.map((val, idx) => (
                        <input 
                          key={idx}
                          type="text" 
                          value={val}
                          onChange={(e) => {
                            const copy = { ...groundingInputs };
                            copy.see[idx] = e.target.value;
                            setGroundingInputs(copy);
                          }}
                          placeholder={`Visible Item ${idx + 1}`}
                          className="w-full bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 pl-3 text-xs focus:outline-none focus:border-amber-400 text-amber-950 font-medium"
                        />
                      ))}
                    </div>
                  )}

                  {groundingStep === 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {groundingInputs.touch.map((val, idx) => (
                        <input 
                          key={idx}
                          type="text" 
                          value={val}
                          onChange={(e) => {
                            const copy = { ...groundingInputs };
                            copy.touch[idx] = e.target.value;
                            setGroundingInputs(copy);
                          }}
                          placeholder={`Sensory Feel ${idx + 1}`}
                          className="w-full bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 pl-3 text-xs focus:outline-none focus:border-amber-400 text-amber-950 font-medium"
                        />
                      ))}
                    </div>
                  )}

                  {groundingStep === 3 && (
                    <div className="space-y-2">
                      {groundingInputs.hear.map((val, idx) => (
                        <input 
                          key={idx}
                          type="text" 
                          value={val}
                          onChange={(e) => {
                            const copy = { ...groundingInputs };
                            copy.hear[idx] = e.target.value;
                            setGroundingInputs(copy);
                          }}
                          placeholder={`Ambient sound/hum ${idx + 1}`}
                          className="w-full bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 pl-3 text-xs focus:outline-none focus:border-amber-400 text-amber-950 font-medium"
                        />
                      ))}
                    </div>
                  )}

                  {groundingStep === 4 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {groundingInputs.smell.map((val, idx) => (
                        <input 
                          key={idx}
                          type="text" 
                          value={val}
                          onChange={(e) => {
                            const copy = { ...groundingInputs };
                            copy.smell[idx] = e.target.value;
                            setGroundingInputs(copy);
                          }}
                          placeholder={`Recognized scent ${idx + 1}`}
                          className="w-full bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 pl-3 text-xs focus:outline-none focus:border-amber-400 text-amber-950 font-medium"
                        />
                      ))}
                    </div>
                  )}

                  {groundingStep === 5 && (
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        value={groundingInputs.taste[0]}
                        onChange={(e) => {
                          const copy = { ...groundingInputs };
                          copy.taste[0] = e.target.value;
                          setGroundingInputs(copy);
                        }}
                        placeholder="Comforting clean taste or note..."
                        className="w-full bg-amber-50/80 border border-amber-200 rounded-xl p-2.5 pl-3 text-xs focus:outline-none focus:border-amber-400 text-amber-950 font-medium"
                      />
                    </div>
                  )}

                  {groundingStep >= 6 && (
                    <div className="space-y-3 text-xs font-semibold text-amber-900 bg-amber-100/50 p-4 rounded-2xl border border-amber-200">
                      <p className="font-bold flex items-center gap-1.5 text-amber-950">
                        <span className="material-symbols-outlined text-sm text-amber-800">check_circle</span>
                        <span>Somatic anchor perfectly engaged.</span>
                      </p>
                      <p className="text-[11px] text-neutral-600 font-medium leading-relaxed">
                        Fantastic work. Taking simple physical snapshots anchors your cognitive channels securely to the here and now.
                      </p>
                      <button 
                        type="button" 
                        onClick={() => setIsGroundingActive(false)}
                        className="px-4 py-2 bg-amber-800 text-white rounded-lg hover:bg-amber-900 transition font-bold"
                      >
                        Finish Anchoring
                      </button>
                    </div>
                  )}
                </div>

                {groundingStep < 6 && (
                  <div className="flex justify-between items-center border-t border-amber-200/40 pt-3">
                    <span className="text-[10px] text-amber-700 font-medium italic">Feel the solid ground under your feet...</span>
                    <button
                      type="button"
                      onClick={handleNextGroundingStep}
                      className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs rounded-xl transition border-none cursor-pointer flex items-center gap-1"
                    >
                      <span>Continue</span>
                      <span className="material-symbols-outlined text-xs leading-none">arrow_forward</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Minimalist Safe Haven Support Triage disclaimer */}
          <footer className="pt-6 pb-2 select-none font-sans">
            <p className="text-[10px] sm:text-[11px] font-sans text-on-surface-variant font-bold opacity-60">
              Safe Haven Crisis Triage • Immediate Help Available 24/7
            </p>
          </footer>

        </div>
      </div>

      {/* ============================================================ */}
      {/* OVERLAY 1: ACTIVE SECURE CALL DIALER POP OVER OVERLAY */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeCall && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[300] flex items-center justify-center p-4 select-none"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className="bg-neutral-900 border border-neutral-800 rounded-[32px] w-full max-w-md p-8 text-center text-white space-y-6 relative overflow-hidden shadow-2xl"
            >
              {/* Animated green ring ripple circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-56 h-56 bg-emerald-500/5 rounded-full blur-[40px] animate-pulse"></div>
              </div>

              {/* Secure connection sign */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 max-w-max mx-auto">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Encrypted Audio Connection Active</span>
              </div>

              {/* Call identity visual */}
              <div className="space-y-2 pt-4 relative z-10">
                <div className="w-24 h-24 rounded-full bg-neutral-800 border border-neutral-700 mx-auto flex items-center justify-center text-5xl relative shadow-inner">
                  {activeCall === "helpline" ? "🩺" : "🔮"}
                  {/* Pulse ripples */}
                  <div className="absolute -inset-1 border border-emerald-500/40 rounded-full animate-ping opacity-75"></div>
                </div>

                <h3 className="font-display text-lg font-black tracking-tight mt-3">
                  {activeCall === "helpline" ? "Tele-MANAS Youth Wellness Line" : (studentProfile?.supportCircleName || "Support Circle Peer")}
                </h3>
                <p className="text-xs text-neutral-400 font-mono font-bold tracking-widest mt-1">
                  Active Duration: {formatDuration(callTimer)}
                </p>
              </div>

              {/* Call subtitle transcript */}
              <div className="bg-black/40 border border-neutral-800 p-4 rounded-2xl min-h-[70px] flex items-center justify-center text-xs text-center text-emerald-300 font-sans max-w-sm mx-auto leading-relaxed italic">
                "{callSubtitles}"
              </div>

              {/* Dialer controllers mimicking actual mobile action bar */}
              <div className="grid grid-cols-3 gap-3 pt-4 max-w-xs mx-auto">
                {/* Speaker toggle */}
                <button
                  onClick={() => {
                    setIsSpeakerOn(!isSpeakerOn);
                    triggerSoundChime(320, 0.08);
                    showToast(isSpeakerOn ? "Speaker muted, audio routing to earpiece." : "Speaker phone active.");
                  }}
                  className={`p-3.5 rounded-full flex flex-col items-center gap-1 cursor-pointer transition ${
                    isSpeakerOn ? "bg-white text-neutral-950 font-bold" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-750"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg leading-none">volume_up</span>
                  <span className="text-[9px] font-sans font-bold">Speaker</span>
                </button>

                {/* Keypad */}
                <button
                  onClick={() => triggerSoundChime(880, 0.1)}
                  className="p-3.5 bg-neutral-800 hover:bg-neutral-750 text-neutral-300 rounded-full flex flex-col items-center gap-1 cursor-pointer transition"
                >
                  <span className="material-symbols-outlined text-lg leading-none">dialpad</span>
                  <span className="text-[9px] font-sans font-bold">Keypad</span>
                </button>

                {/* Mute microphone */}
                <button
                  onClick={() => {
                    setIsMuted(!isMuted);
                    triggerSoundChime(150, 0.08);
                  }}
                  className={`p-3.5 rounded-full flex flex-col items-center gap-1 cursor-pointer transition ${
                    isMuted ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-neutral-800 text-neutral-300 hover:bg-neutral-750"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg leading-none">mic_off</span>
                  <span className="text-[9px] font-sans font-bold">{isMuted ? "Muted" : "Mute"}</span>
                </button>
              </div>

              {/* End Call red button */}
              <div className="pt-6">
                <button 
                  onClick={() => {
                    setActiveCall(null);
                    triggerSoundChime(220, 0.25); // tone out sound
                    showToast("Emergency encrypted call successfully disconnected.");
                  }}
                  className="w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 duration-200 transition mx-auto cursor-pointer"
                  title="Hang Up"
                >
                  <span className="material-symbols-outlined text-2xl font-normal text-white">call_end</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* OVERLAY 2: SOS SMS COMPOSER MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showSmsComposer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm z-[300] flex items-center justify-center p-4 text-left select-none"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white border border-neutral-150 rounded-[28px] max-w-lg w-full p-6 text-on-surface space-y-5 shadow-2x flex flex-col justify-between"
            >
              
              {/* Header inside SMS composer */}
              <div className="flex justify-between items-start border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="font-display text-base font-black text-rose-950 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-rose-500 font-normal">sms</span>
                    <span>SOS Secure SMS dispatch board</span>
                  </h3>
                  <p className="text-[10px] text-neutral-400 font-sans tracking-tight">
                    Sending to verified peer: <strong className="text-secondary">{studentProfile?.supportCircleName || "Generic Supporters"}</strong>
                  </p>
                </div>
                <button 
                  onClick={() => setShowSmsComposer(false)}
                  className="material-symbols-outlined text-neutral-400 hover:text-neutral-600 cursor-pointer"
                >
                  close
                </button>
              </div>

              {/* Template Chills tags for quick selection */}
              <div className="space-y-1.5 text-xs font-sans">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block mb-1">Select Reassurance templates:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { key: "backlog", title: "📝 Exam/Backlog Panic", body: "Hey! I am feeling deeply overwhelmed by the end-semester syllabus and backlog stress. Can we take a small walk or tea breakout? - [MyName]" },
                    { key: "gpa", title: "💼 Placement Burnout", body: "Hey. Really stressing out about placements/CGPA benchmarks today. No rush, but drop a meow or call me when you are in your hostel room. - [MyName]" },
                    { key: "meltdown", title: "🚨 Sensory Grounding Assist", body: "I am having severe anxiety right now. Could you please check on me in room or call me back? Need an anchor friend. - [MyName]" }
                  ].map((temp, index) => {
                    const isSel = activeSmsTemplate === temp.key;
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSelectSmsTemplate(temp.key, temp.body)}
                        className={`text-[10px] px-2.5 py-1.5 rounded-lg border font-bold transition-all cursor-pointer ${
                          isSel 
                            ? "bg-primary text-white border-primary-fixed shadow-sm" 
                            : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border-neutral-200"
                        }`}
                      >
                        {temp.title}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Text Area Custom Edit */}
              <div className="space-y-1 font-sans text-xs">
                <label className="block font-bold text-neutral-500">SOS distress message body:</label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Type your emergency peer message details or customize templates above..."
                  className="w-full h-24 p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none font-semibold text-neutral-800 placeholder-neutral-400 text-xs"
                />
                <span className="text-[10px] text-neutral-400 block text-right mt-1">
                  Characters: {smsMessage.length}/320 max
                </span>
              </div>

              {/* Action Buttons footer inside SMS */}
              <div className="flex gap-2 justify-end border-t border-neutral-100 pt-3">
                <button
                  onClick={() => setShowSmsComposer(false)}
                  className="px-4 py-2 border border-neutral-200 text-neutral-600 rounded-xl font-bold font-sans text-xs hover:bg-neutral-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendMockSms}
                  disabled={isSmsSending}
                  className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-bold font-sans text-xs rounded-xl flex items-center gap-1 shadow-md cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-normal">
                    {isSmsSending ? "sync" : "forward_to_inbox"}
                  </span>
                  <span>{isSmsSending ? "Broadcasting signal wave..." : "Send SOS Message"}</span>
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* OVERLAY 3: QUICK RELIEF PANIC PANEL MODAL */}
      {/* ============================================================ */}
      <AnimatePresence>
        {showQuickRelief && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-xl z-[400] flex items-center justify-center p-3 sm:p-4 select-none"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="bg-white border border-neutral-150 rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-5 sm:p-7 space-y-6 relative shadow-2xl"
            >
              
              {/* Close Button & Title */}
              <div className="flex justify-between items-start border-b border-rose-100 pb-4 text-left">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-100 animate-pulse">
                      Active Distress Relief Control
                    </span>
                  </div>
                  <h2 className="font-display text-xl font-black text-rose-950 mt-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-rose-600 text-2xl animate-spin">wifi_protected_setup</span>
                    <span>Emergency Quick Relief Panel</span>
                  </h2>
                  <p className="text-xs text-neutral-500 font-sans">
                    Grounding loops and immediate contact channels are fully active. Follow the steps below calmly.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowQuickRelief(false)}
                  className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900 rounded-xl font-bold font-sans text-xs transition duration-205 cursor-pointer"
                >
                  Close
                </button>
              </div>

              {/* THREE SECTIONS: 
                  1. PANIC BREATH STABILIZER 
                  2. IMMEDIATE DIRECT HELPLINE VOICE DIALS
                  3. SOMATIC GROUNDING LOOPS
              */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 text-left">
                
                {/* 1. SOMATIC ANCHOR BREATH (col-span-12) */}
                <div className="md:col-span-12 bg-rose-50/40 border border-rose-100/60 p-4.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-5 relative overflow-hidden">
                  <div className="text-left space-y-1.5 max-w-sm">
                    <div className="flex items-center gap-1 text-[9px] uppercase font-bold text-rose-700 tracking-wider">
                      <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
                      <span>Regulation Stage 1: Stabilize Breathing</span>
                    </div>
                    <h3 className="font-display text-sm font-black text-rose-950">
                      Vagus Nerve Box Breathing
                    </h3>
                    <p className="text-[11px] text-neutral-500 font-sans leading-relaxed">
                      Somatic breathing triggers the parasympathetic nervous system to slow your heart rate output instantly to counter panic.
                    </p>
                  </div>

                  {/* Somatic Animated Breathing Core */}
                  <div className="flex items-center gap-5 justify-center mr-0 sm:mr-4">
                    <div className="relative w-24 h-24 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: 
                            panicBreathStage === "Inhale" ? [1, 1.25] : 
                            panicBreathStage === "Hold" ? 1.25 : 
                            panicBreathStage === "Exhale" ? [1.25, 1] : 1
                        }}
                        transition={{ duration: 4, ease: "easeInOut" }}
                        className="absolute inset-0 bg-rose-500/10 rounded-full"
                      />
                      <div className="z-10 w-18 h-18 bg-rose-600 rounded-full flex flex-col items-center justify-center text-white font-sans font-bold shadow-md">
                        <span className="text-[8px] uppercase tracking-wider font-black opacity-85">
                          {panicBreathStage}
                        </span>
                        <span className="text-base font-display mt-0.5">
                          {panicBreathCount}s
                        </span>
                      </div>
                    </div>

                    <div className="space-y-0.5 font-sans text-left text-[11px] min-w-[110px]">
                      <p className={`font-bold ${panicBreathStage === "Inhale" ? "text-rose-600 font-black scale-102" : "text-neutral-400"}`}>
                        ✦ Inhale (4s)
                      </p>
                      <p className={`font-bold ${panicBreathStage === "Hold" ? "text-rose-600 font-black scale-102" : "text-neutral-400"}`}>
                        ✦ Hold (4s)
                      </p>
                      <p className={`font-bold ${panicBreathStage === "Exhale" ? "text-rose-600 font-black scale-102" : "text-neutral-400"}`}>
                        ✦ Exhale (4s)
                      </p>
                      <p className={`font-bold ${panicBreathStage === "Pause" ? "text-rose-600 font-black scale-102" : "text-neutral-400"}`}>
                        ✦ Rest (4s)
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. VOICE CALL HOTLINES */}
                <div className="md:col-span-6 space-y-3">
                  <h3 className="font-display text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm font-normal">call</span>
                    <span>1. Direct Voice Helpline</span>
                  </h3>

                  <div className="space-y-2.5 font-sans">
                    {/* Tele-Manas Contact Card */}
                    <div className="border border-neutral-150 p-3.5 rounded-xl space-y-2 hover:bg-rose-50/10 transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-neutral-850 text-xs">Tele-MANAS Gov Helpline</h4>
                          <p className="text-[10px] text-neutral-400">Psychological backup &amp; clinical mental support</p>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                          24/7 Free
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="font-mono text-xs font-black text-rose-700 bg-neutral-50 border px-2.5 py-0.5 rounded-lg">
                          14416
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCall("helpline");
                            triggerSoundChime(523, 0.1);
                          }}
                          className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs leading-none">phone</span>
                          <span>Call Triage</span>
                        </button>
                      </div>
                    </div>

                    {/* Vandrevala Foundation */}
                    <div className="border border-neutral-150 p-3.5 rounded-xl space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-neutral-850 text-xs">Vandrevala Foundation</h4>
                          <p className="text-[10px] text-neutral-400">Immediate suicide defense/crisis therapist desk</p>
                        </div>
                        <span className="text-[9px] uppercase font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                          Anonymous
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="font-mono text-xs font-black text-[#7a5c36] bg-neutral-50 border px-2 py-0.5 rounded-lg">
                          +91 99996 66555
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveCall("helpline");
                            setCallSubtitles("Connecting to Vandrevala Foundation suicide prevention network counselor...");
                            triggerSoundChime(523, 0.1);
                          }}
                          className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-xs leading-none">phone</span>
                          <span>Call Advisor</span>
                        </button>
                      </div>
                    </div>

                    {/* Configured Companion */}
                    <div className="border border-neutral-150 p-3.5 rounded-xl bg-neutral-50/60 font-sans">
                      <p className="text-[9px] uppercase font-bold text-neutral-500 leading-none">Emergency support circle</p>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <h4 className="font-bold text-neutral-800 text-xs">
                            {studentProfile?.supportCircleName || "Support Circle Advocate"}
                          </h4>
                          <p className="text-[10px] text-neutral-400">
                            Relation: {studentProfile?.supportCircleRelation || "Friend"}
                          </p>
                        </div>
                        {studentProfile?.supportCircleName ? (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveCall("support_circle");
                              triggerSoundChime(530, 0.1);
                            }}
                            className="px-2.5 py-1.5 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-primary/95 transition flex items-center gap-0.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-xs leading-none">call</span>
                            <span>Dial Peer</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditingContact(true);
                              setShowQuickRelief(false);
                              showToast("Please save contact details first.");
                            }}
                            className="text-[10px] font-bold text-primary underline"
                          >
                            Add Peer
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. SOMATIC GROUNDING CHECKS */}
                <div className="md:col-span-6 space-y-3 text-left">
                  <h3 className="font-display text-xs font-black uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm font-normal">spa</span>
                    <span>2. Grounding Diagnostics</span>
                  </h3>

                  <div className="space-y-2.5 font-sans text-xs text-left">
                    {/* Splash cold water */}
                    <div className="flex gap-2.5 bg-sky-50/50 border border-sky-100 p-3 rounded-xl">
                      <span className="text-lg shrink-0">💦</span>
                      <div>
                        <h4 className="font-bold text-sky-950 text-xs">Shock the Vagus Nerve</h4>
                        <p className="text-[10px] text-neutral-600 mt-0.5 leading-normal">
                          Splash deep ice-cold water on your forehead immediately. This forces the mammalian diving reflex to slow high heart rate feedback loops.
                        </p>
                      </div>
                    </div>

                    {/* Somatic anchoring */}
                    <div className="flex gap-2.5 bg-amber-50/40 border border-amber-100 p-3 rounded-xl">
                      <span className="text-lg shrink-0">👣</span>
                      <div>
                        <h4 className="font-bold text-amber-950 text-xs">Double Foot Solid Anchor</h4>
                        <p className="text-[10px] text-neutral-600 mt-0.5 leading-normal">
                          Place both feet flat and heavy on the floor. Grab your chair arms or desk edges solidly. Hold tightly to anchor your neurological system.
                        </p>
                      </div>
                    </div>

                    {/* Color Spotting panel */}
                    <div className="flex gap-2.5 bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl">
                      <span className="text-lg shrink-0">🎨</span>
                      <div>
                        <h4 className="font-bold text-emerald-950 text-xs">Fast Color Matching exercise</h4>
                        <p className="text-[10px] text-neutral-600 mt-0.5 leading-normal">
                          Decelerate spiraling thought tunnels by scanning your viewport and locating:
                          <strong className="block font-black text-emerald-800 mt-0.5">
                            • 1 Blue desk item • 1 Green texture • 1 Bright point
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer footer reassurance */}
              <div className="border-t border-neutral-100 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400 font-sans">
                <div className="flex items-center gap-1 justify-center sm:justify-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-bold">Sanitized Offline Sandbox - Safe Haven Secured</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuickRelief(false);
                    handleStartGroundingList();
                  }}
                  className="text-primary hover:underline font-bold text-xs font-sans"
                >
                  Start intensive 5-4-3-2-1 Somatic guide →
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
