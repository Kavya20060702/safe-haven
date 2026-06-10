import React from "react";
import { motion } from "motion/react";
import { CompanionId } from "../types";

interface CompanionMascotProps {
  companionId: CompanionId;
  emotion: "idle" | "happy" | "calm" | "concerned" | "thinking" | "talking";
  isListening?: boolean;
  isSpeaking?: boolean;
  size?: "sm" | "md" | "lg";
}

/**
 * Animated Mascot for Purr (Empathetic Lavender Cat holding a heart)
 */
function PurrMascot({ emotion, isSpeaking }: { emotion: string; isSpeaking: boolean }) {
  // Eye paths/shapes based on emotion
  const getEyesVariant = () => {
    switch (emotion) {
      case "happy":
        return (
          <>
            {/* Happy laughing closed eyes curving UP (⌒⌒) */}
            <motion.path d="M 28 44 Q 35 34 42 44" stroke="#5d4eb8" strokeWidth="4" strokeLinecap="round" fill="none" />
            <motion.path d="M 58 44 Q 65 34 72 44" stroke="#5d4eb8" strokeWidth="4" strokeLinecap="round" fill="none" />
          </>
        );
      case "concerned":
        return (
          <>
            {/* Big cute worried eyes with glossy sparkles */}
            <ellipse cx="35" cy="45" rx="8" ry="7" fill="#5d4eb8" />
            <circle cx="33" cy="43" r="2.5" fill="#ffffff" />
            <circle cx="37" cy="47.5" r="1" fill="#ffffff" />
            <ellipse cx="65" cy="45" rx="8" ry="7" fill="#5d4eb8" />
            <circle cx="63" cy="43" r="2.5" fill="#ffffff" />
            <circle cx="67" cy="47.5" r="1" fill="#ffffff" />
            <motion.path d="M 29 35 Q 35 32 40 36" stroke="#5e49a8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <motion.path d="M 71 35 Q 65 32 60 36" stroke="#5e49a8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Adorable thinking look under smart glasses */}
            <ellipse cx="35" cy="45" rx="7.5" ry="6.5" fill="#5d4eb8" />
            <circle cx="37.5" cy="42" r="2.5" fill="#ffffff" />
            <ellipse cx="65" cy="45" rx="7.5" ry="6.5" fill="#5d4eb8" />
            <circle cx="67.5" cy="42" r="2.5" fill="#ffffff" />
            <motion.path d="M 29 34 L 39 34" stroke="#5d4eb8" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <motion.path d="M 61 34 L 71 34" stroke="#5d4eb8" strokeWidth="2.8" strokeLinecap="round" fill="none" />
          </>
        );
      case "calm":
        return (
          <>
            {/* Extremely peaceful sleeping curved eyes (⌒⌒), matching the picture exactly! */}
            <motion.path d="M 27 45 Q 34.5 36 42 45" stroke="#5d4eb8" strokeWidth="3.8" strokeLinecap="round" fill="none" />
            <motion.path d="M 58 45 Q 65.5 36 72 45" stroke="#5d4eb8" strokeWidth="3.8" strokeLinecap="round" fill="none" />
          </>
        );
      default: // idle / talking (Peaceful cozy sleeping eyes by default, identical to picture!)
        return (
          <>
            <motion.path 
              d="M 27 45 Q 34.5 36 42 45" 
              stroke="#5d4eb8" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
            />
            <motion.path 
              d="M 58 45 Q 65.5 36 72 45" 
              stroke="#5d4eb8" 
              strokeWidth="4" 
              strokeLinecap="round" 
              fill="none" 
            />
          </>
        );
    }
  };

  // Mouth path based on emotion and speaking state
  const getMouthVariant = () => {
    if (isSpeaking || emotion === "talking") {
      return (
        <motion.path 
          d="M 46 51 Q 50 60 54 51" 
          stroke="#5d4eb8" 
          strokeWidth="3.2" 
          strokeLinecap="round" 
          fill="#ff8fa3" 
          animate={{ d: ["M 47 51 Q 50 55 53 51", "M 46 51 Q 50 60 54 51", "M 48 51 L 52 51"] }}
          transition={{ repeat: Infinity, duration: 0.35, ease: "easeOut" }}
        />
      );
    }
    switch (emotion) {
      case "happy":
        return <motion.path d="M 45 50 Q 50 58 55 50" stroke="#5d4eb8" strokeWidth="3" strokeLinecap="round" fill="#ff8fa3" />;
      case "concerned":
        return <motion.path d="M 47 52 L 53 52" stroke="#5d4eb8" strokeWidth="3" strokeLinecap="round" fill="none" />;
      case "calm":
        return <motion.path d="M 46 51 Q 50 54 54 51" stroke="#5d4eb8" strokeWidth="2.8" strokeLinecap="round" fill="none" />;
      default: // idle / thinking (Feline double muzzle smile curve "w" - incredibly cute!)
        return <path d="M 45 49 Q 47.5 52 50 49 Q 52.5 52 55 49" stroke="#5d4eb8" strokeWidth="2.8" strokeLinecap="round" fill="none" />;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sparkles / Coding floating braces for cat */}
      {emotion === "thinking" && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-2 left-6 text-purple-400 font-mono text-sm font-bold" animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2.2, delay: 0 }}>{"{ }"}</motion.div>
          <motion.div className="absolute top-8 right-6 text-pink-400 font-mono text-xs font-bold" animate={{ y: [0, -14, 0], opacity: [0, 0.8, 0] }} transition={{ repeat: Infinity, duration: 2.5, delay: 0.8 }}>{"</>"}</motion.div>
          <motion.div className="absolute bottom-6 left-12 text-purple-500 font-mono text-xs" animate={{ y: [0, -8, 0], opacity: [0, 0.7, 0] }} transition={{ repeat: Infinity, duration: 1.8, delay: 1.2 }}>{"const"}</motion.div>
        </div>
      )}

      {/* Floating hearts for happy vibes */}
      {emotion === "happy" && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.span className="absolute top-4 left-10 text-xl" animate={{ scale: [0, 1.2, 0], y: [-5, -25], rotate: [0, 12, -12] }} transition={{ repeat: Infinity, duration: 2, delay: 0 }}>💖</motion.span>
          <motion.span className="absolute top-10 right-10 text-lg" animate={{ scale: [0, 1.3, 0], y: [-5, -30], rotate: [0, -15, 15] }} transition={{ repeat: Infinity, duration: 1.8, delay: 0.6 }}>💖</motion.span>
        </div>
      )}

      <motion.svg 
        viewBox="0 0 100 100" 
        className="w-40 h-40 md:w-52 md:h-52 drop-shadow-xl overflow-visible"
        animate={
          emotion === "happy" 
            ? { y: [0, -10, 0], scaleY: [1, 0.96, 1.04, 1] } 
            : emotion === "concerned" 
            ? { x: [-1, 1, -1, 1, 0] }
            : { y: [0, -3, 0] }
        }
        transition={
          emotion === "happy" 
            ? { repeat: Infinity, duration: 0.8, ease: "easeInOut" } 
            : emotion === "concerned"
            ? { repeat: Infinity, duration: 2 }
            : { repeat: Infinity, duration: 3.5, ease: "easeInOut" }
        }
      >
        <defs>
          {/* Stunning multidirectional specular gradients for clay shader realism */}
          <radialGradient id="purrHeadGrad" cx="30%" cy="25%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#e2dbfa" />
            <stop offset="75%" stopColor="#beb0e4" />
            <stop offset="100%" stopColor="#8471bd" />
          </radialGradient>
          <radialGradient id="purrBodyGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f3efff" />
            <stop offset="50%" stopColor="#aea2d6" />
            <stop offset="100%" stopColor="#7a6cb3" />
          </radialGradient>
          <radialGradient id="purrEarGrad" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stopColor="#beb0e4" />
            <stop offset="100%" stopColor="#7e6ca9" />
          </radialGradient>
          <radialGradient id="innerEarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffecf1" />
            <stop offset="100%" stopColor="#ffb3c6" />
          </radialGradient>
          <radialGradient id="purrHeartGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffe6f3" />
            <stop offset="45%" stopColor="#ffa6d2" />
            <stop offset="100%" stopColor="#e879bf" />
          </radialGradient>
          <radialGradient id="catBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffccd5" />
            <stop offset="100%" stopColor="#ffccd500" />
          </radialGradient>
        </defs>

        {/* Tail - smooth 3D clay rendering */}
        <motion.path 
          d="M 72 74 Q 90 74 88 56 Q 86 44 80 46" 
          stroke="url(#purrEarGrad)" 
          strokeWidth="11" 
          strokeLinecap="round" 
          fill="none" 
          animate={{ rotate: [0, 5, -5, 0], y: [0, 1.5, -1.5, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        />

        {/* Smooth organic, rounded clay molded Ears */}
        {/* Left Ear */}
        <path d="M 17 32 C 13 17, 23 5, 32 7 C 40 9, 41 23, 41 33 Z" fill="url(#purrEarGrad)" />
        <path d="M 20 29 C 17 18, 24 9, 31 10 C 37 11, 38 21, 38 29 Z" fill="url(#innerEarGrad)" />

        {/* Right Ear */}
        <path d="M 83 32 C 87 17, 77 5, 68 7 C 60 9, 59 23, 59 33 Z" fill="url(#purrEarGrad)" />
        <path d="M 80 29 C 83 18, 76 9, 69 10 C 63 11, 62 21, 62 29 Z" fill="url(#innerEarGrad)" />

        {/* Rounded Chubby Body */}
        <ellipse cx="50" cy="74" rx="32" ry="22" fill="url(#purrBodyGrad)" />

        {/* Chubby Cat Head */}
        <ellipse cx="50" cy="46" rx="33" ry="25" fill="url(#purrHeadGrad)" />

        {/* Smooth visual highlights on top of head for 3D realism */}
        <ellipse cx="44" cy="30" rx="12" ry="5" fill="#ffffff" opacity="0.32" transform="rotate(-15 44 30)" />

        {/* Dynamic Expressions */}
        {getEyesVariant()}

        {/* Ultra-soft aesthetic pink blushing cheeks */}
        <ellipse cx="23" cy="51" rx="6" ry="4" fill="url(#catBlush)" opacity={emotion === "happy" ? 0.95 : emotion === "thinking" ? 0.5 : 0.8} />
        <ellipse cx="77" cy="51" rx="6" ry="4" fill="url(#catBlush)" opacity={emotion === "happy" ? 0.95 : emotion === "thinking" ? 0.5 : 0.8} />

        {/* Real clay-like Cat Nose (Tiny violet-plum heart/button) */}
        <path d="M 48.5 45 C 48.5 44, 51.5 44, 51.5 45 C 51.5 46.5, 50 48.2, 50 48.2 C 50 48.2, 48.5 46.5, 48.5 45 Z" fill="#5d4eb8" />

        {/* Subtle Whiskers modeled with soft lavender details */}
        <line x1="20" y1="46" x2="8" y2="46" stroke="#8d7cb8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1="20" y1="51" x2="10" y2="52" stroke="#8d7cb8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1="80" y1="46" x2="92" y2="46" stroke="#8d7cb8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
        <line x1="80" y1="51" x2="90" y2="52" stroke="#8d7cb8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />

        {/* Cohesive Cat Mouth */}
        {getMouthVariant()}

        {/* Programmer Glasses for Thinking state */}
        {emotion === "thinking" && (
          <>
            <motion.rect x="25" y="36" width="20" height="12" rx="3" stroke="#5d4eb8" strokeWidth="3" fill="none" />
            <motion.rect x="55" y="36" width="20" height="12" rx="3" stroke="#5d4eb8" strokeWidth="3" fill="none" />
            <line x1="45" y1="41" x2="55" y2="41" stroke="#5d4eb8" strokeWidth="3" />
          </>
        )}

        {/* Lavender-pink heart held on the chest (Highly 3D Specular Highlight!) */}
        <g>
          <motion.path 
            d="M 50 71 C 45 61, 36 61, 36 70 C 36 78, 45 83, 50 86 C 55 83, 64 78, 64 70 C 64 61, 55 61, 50 71"
            fill="url(#purrHeartGrad)" 
            stroke="#e79cc3" 
            strokeWidth="1.2"
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            style={{ transformOrigin: "50px 73px" }}
          />
          {/* Heart white glossy specular line */}
          <path d="M 40 68 Q 38 72 40 76" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.45" />
        </g>

        {/* Cute chubby paws wrapped elegantly around the heart, matching image perfectly! */}
        <path d="M 23 72 C 30 76, 36 76, 42 74" stroke="url(#purrHeadGrad)" strokeWidth="8.5" strokeLinecap="round" fill="none" />
        <path d="M 77 72 C 70 76, 64 76, 58 74" stroke="url(#purrHeadGrad)" strokeWidth="8.5" strokeLinecap="round" fill="none" />

        {/* Tiny chubby feet sitting flatly below the sphere */}
        <circle cx="36" cy="87" r="6" fill="url(#purrHeadGrad)" />
        <circle cx="64" cy="87" r="6" fill="url(#purrHeadGrad)" />
      </motion.svg>
    </div>
  );
}

/**
 * Animated Mascot for Luma (Meditation Orb of Light)
 */
function LumaMascot({ emotion, isSpeaking }: { emotion: string; isSpeaking: boolean }) {
  // Glow background styling based on emotion
  const getGlowColor = () => {
    switch (emotion) {
      case "happy":
        return "bg-cyan-300/40 shadow-cyan-300/60";
      case "concerned":
        return "bg-rose-300/35 shadow-rose-300/50";
      case "thinking":
        return "bg-purple-300/40 shadow-purple-300/60";
      case "calm":
        return "bg-teal-300/40 shadow-teal-300/60";
      default: // idle / talking
        return "bg-emerald-300/35 shadow-emerald-300/55";
    }
  };

  const getRadialGradient = () => {
    switch (emotion) {
      case "happy":
        return "url(#cyanGrad)";
      case "concerned":
        return "url(#roseGrad)";
      case "thinking":
        return "url(#purpleGrad)";
      case "calm":
        return "url(#emeraldGrad)";
      default:
        return "url(#mintGrad)";
    }
  };

  // Eyes designed to mimic the mega-cute huge violet round clay eyes in the reference photo!
  const getEyesVariant = () => {
    switch (emotion) {
      case "happy":
        return (
          <>
            {/* Happy squeezed cute eyes */}
            <motion.path d="M 32 50 Q 38 42 44 50" stroke="#645ab3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <motion.path d="M 56 50 Q 62 42 68 50" stroke="#645ab3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "concerned":
        return (
          <>
            {/* Big worried eyes */}
            <ellipse cx="38" cy="51" rx="8.5" ry="7.5" fill="#645ab3" />
            <circle cx="36" cy="48" r="3" fill="#ffffff" />
            <ellipse cx="62" cy="51" rx="8.5" ry="7.5" fill="#645ab3" />
            <circle cx="60" cy="48" r="3" fill="#ffffff" />
            <motion.path d="M 31 39 Q 38 37 43 41" stroke="#645ab3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <motion.path d="M 69 39 Q 62 37 57 41" stroke="#645ab3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Skeptical looking up eyes */}
            <ellipse cx="38" cy="50" rx="9" ry="8" fill="#645ab3" />
            <circle cx="41" cy="46" r="3.2" fill="#ffffff" />
            <ellipse cx="62" cy="50" rx="9" ry="8" fill="#645ab3" />
            <circle cx="65" cy="46" r="3.2" fill="#ffffff" />
          </>
        );
      default: // idle / talking
        // Giant beautiful round glossy purple mascot eyes, EXACTLY like the image!
        return (
          <>
            {/* Left Eye */}
            <g>
              <circle cx="38" cy="50" r="10.5" fill="#645ab3" />
              <circle cx="35" cy="46" r="3.8" fill="#ffffff" />
              <circle cx="41.5" cy="53" r="1.4" fill="#ffffff" />
            </g>
            {/* Right Eye */}
            <g>
              <circle cx="62" cy="50" r="10.5" fill="#645ab3" />
              <circle cx="59" cy="46" r="3.8" fill="#ffffff" />
              <circle cx="65.5" cy="53" r="1.4" fill="#ffffff" />
            </g>
          </>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer Pulse Glow Field */}
      <motion.div 
        className={`absolute w-36 h-36 md:w-44 md:h-44 rounded-full blur-2xl ${getGlowColor()} transition-all duration-700`}
        animate={{
          scale: emotion === "happy" ? [1, 1.25, 1] : emotion === "thinking" ? [1, 1.12, 1] : isSpeaking ? [1, 1.2, 1] : [1, 1.08, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: emotion === "happy" ? 1.2 : emotion === "calm" ? 4 : 2,
          ease: "easeInOut",
        }}
      />

      {/* Soundwaves expanding (Ripples) */}
      {(isSpeaking || emotion === "talking") && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute border border-emerald-300/40 rounded-full"
              initial={{ width: 100, height: 100, opacity: 0.6 }}
              animate={{ width: 220, height: 220, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.6, ease: "easeOut" }}
            />
          ))}
        </div>
      )}

      {/* Interactive Orb Vector SVG */}
      <svg viewBox="0 0 100 100" className="w-40 h-40 md:w-52 md:h-52 z-10 overflow-visible">
        <defs>
          {/* Enhanced multi-stop 3D radial clay/glass rendering */}
          <radialGradient id="mintGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#e2faf2" />
            <stop offset="65%" stopColor="#75eed0" />
            <stop offset="100%" stopColor="#0ea57c" />
          </radialGradient>
          <radialGradient id="emeraldGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#e6fdf2" />
            <stop offset="65%" stopColor="#3cdba2" />
            <stop offset="100%" stopColor="#047854" />
          </radialGradient>
          <radialGradient id="cyanGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#e0fbfc" />
            <stop offset="65%" stopColor="#4de5fc" />
            <stop offset="100%" stopColor="#088ba6" />
          </radialGradient>
          <radialGradient id="roseGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#ffe4e6" />
            <stop offset="65%" stopColor="#fb7185" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>
          <radialGradient id="purpleGrad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#f3e8ff" />
            <stop offset="65%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#7e22ce" />
          </radialGradient>
          <radialGradient id="orbBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffb3c1" />
            <stop offset="100%" stopColor="#ffb3c100" />
          </radialGradient>
        </defs>

        {/* Core Sphere - soft glossy 3D clay ball with shifted lighting focus */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r="28" 
          fill={getRadialGradient()}
          animate={{
            scale: emotion === "happy" ? [1, 1.1, 1] : emotion === "calm" ? [1, 1.04, 0.96, 1] : [1, 1.06, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: emotion === "happy" ? 1.4 : emotion === "calm" ? 5 : 3.2,
            ease: "easeInOut",
          }}
        />

        {/* Dynamic Specular Highlights for premium 3D volume effect */}
        {/* Top-left intense glossy spot reflection */}
        <ellipse cx="43" cy="33" rx="10.5" ry="5.2" fill="#ffffff" opacity="0.45" transform="rotate(-20 43 33)" />
        
        {/* Bottom-right smooth volumetric bounce highlight reflection */}
        <ellipse cx="57" cy="67" rx="13" ry="3.5" fill="#ffffff" opacity="0.25" transform="rotate(15 57 67)" />

        {/* Peaceful facial features inscribed on the orb projection */}
        <g opacity="0.95">
          {getEyesVariant()}
          
          {/* Big gorgeous blushing cheeks matching reference cloud blush style */}
          <ellipse cx="26" cy="54" rx="7" ry="5.2" fill="url(#orbBlush)" opacity="0.7" />
          <ellipse cx="74" cy="54" rx="7" ry="5.2" fill="url(#orbBlush)" opacity="0.7" />
        </g>
      </svg>
    </div>
  );
}

/**
 * Animated Mascot for Cirrus (Philosopher Cloud)
 */
function CirrusMascot({ emotion, isSpeaking }: { emotion: string; isSpeaking: boolean }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Decorative Rainbow Path background */}
      {emotion === "happy" && (
        <motion.div 
          className="absolute bottom-1 w-44 h-12 overflow-hidden pointer-events-none"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Virtual Pastel Rainbow rings */}
          <div className="absolute inset-0 rounded-full border-[6px] border-red-300/30 w-full h-40 -top-10" />
          <div className="absolute inset-0 rounded-full border-[6px] border-amber-300/35 w-[85%] h-36 -top-8 left-[7.5%]" />
          <div className="absolute inset-0 rounded-full border-[6px] border-teal-300/40 w-[70%] h-32 -top-6 left-[15%]" />
        </motion.div>
      )}

      {/* Floating Raindrops when CONCERNED */}
      {emotion === "concerned" && (
        <div className="absolute inset-x-0 bottom-4 flex justify-around px-8 pointer-events-none z-10">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-1 h-3.5 bg-sky-400 rounded-full"
              animate={{ y: [0, 42], opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.3, ease: "linear" }}
            />
          ))}
        </div>
      )}

      {/* Sidelong Breeze Paths when calm or talking */}
      {(emotion === "calm" || isSpeaking) && (
        <div className="absolute inset-x-0 bottom-6 pointer-events-none">
          <motion.div 
            className="w-8 h-1 bg-sky-200/50 rounded-full ml-6"
            animate={{ x: [-20, 140], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
          <motion.div 
            className="w-12 h-1 bg-sky-300/30 rounded-full mr-6 self-end ml-auto"
            animate={{ x: [20, -140], opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 3, delay: 1, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Cloud SVG drawing */}
      <motion.svg 
        viewBox="0 0 120 100" 
        className="w-44 h-44 md:w-56 md:h-56 drop-shadow-lg overflow-visible"
        animate={{
          y: emotion === "happy" ? [0, -10, 0] : [0, -5, 0],
          rotate: emotion === "concerned" ? [-2, 2, -2] : [0, 0],
        }}
        transition={{
          repeat: Infinity,
          duration: emotion === "happy" ? 1.2 : 4,
          ease: "easeInOut"
        }}
      >
        <defs>
          {/* Super soft premium multi-stop 3D cloud depth gradient */}
          <radialGradient id="cloudGrad" cx="30%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="30%" stopColor="#f4f8ff" />
            <stop offset="75%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#a5c6f7" />
          </radialGradient>
          {/* Gorgeous realistic 3D purple clay eyes gradient */}
          <radialGradient id="buttonEyeGrad" cx="35%" cy="33%" r="65%">
            <stop offset="0%" stopColor="#8d7ce5" />
            <stop offset="100%" stopColor="#4f38b8" />
          </radialGradient>
          <radialGradient id="cloudBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9fae" />
            <stop offset="100%" stopColor="#ff9fae00" />
          </radialGradient>
        </defs>

        {/* Main Fluffy Cloud Body (composed of organic overlapping perfect circles like reference) */}
        <g fill="url(#cloudGrad)" className="transition-colors duration-500">
          <circle cx="34" cy="56" r="23" />
          <circle cx="60" cy="46" r="27" />
          <circle cx="86" cy="56" r="22" />
          <circle cx="60" cy="66" r="21" />
          {/* Base fill */}
          <rect x="24" y="52" width="72" height="26" rx="13" />
        </g>

        {/* 3D Specular Highlight gloss bubbles on top of segments */}
        <ellipse cx="60" cy="30" rx="11" ry="5" fill="#ffffff" opacity="0.35" transform="rotate(-12 60 30)" />
        <ellipse cx="32" cy="42" rx="8" ry="4" fill="#ffffff" opacity="0.25" transform="rotate(-15 32 42)" />
        <ellipse cx="85" cy="43" rx="7.5" ry="3.5" fill="#ffffff" opacity="0.25" transform="rotate(-10 85 43)" />

        {/* Interactive face markings with high alignment to image */}
        <g opacity="0.95">
          {emotion === "happy" ? (
            <>
              {/* Happy squinty eye paths */}
              <motion.path d="M 36 49 Q 42 41 46 49" stroke="#5d4eb8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <motion.path d="M 74 49 Q 80 41 84 49" stroke="#5d4eb8" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 54 54 Q 60 62 66 54" stroke="#5d4eb8" strokeWidth="3" strokeLinecap="round" fill="#ff9fae" />
            </>
          ) : emotion === "concerned" ? (
            <>
              {/* Worried eyes */}
              <path d="M 38 45 Q 42 49 46 45" stroke="#5d4eb8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 74 45 Q 78 49 82 45" stroke="#5d4eb8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 54 57 L 66 57" stroke="#5d4eb8" strokeWidth="3" strokeLinecap="round" />
            </>
          ) : emotion === "thinking" ? (
            <>
              {/* Curious look */}
              <circle cx="42" cy="48" r="4.2" fill="url(#buttonEyeGrad)" />
              <circle cx="78" cy="48" r="4.2" fill="url(#buttonEyeGrad)" />
              <path d="M 53 55 Q 59 52 65 55" stroke="#5d4eb8" strokeWidth="2" strokeLinecap="round" fill="none" />
              {/* Floating cozy ideas lightbulb spark */}
              <motion.circle 
                cx="60" cy="14" r="3.5" 
                fill="#facc15" 
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.8 }}
              />
            </>
          ) : (
            // calm / idle / talking
            <>
              {/* Sweet small round widely-spaced deep purple 3D button eyes, identical to reference cloud! */}
              <circle cx="39" cy="49" r="4.5" fill="url(#buttonEyeGrad)" />
              <circle cx="81" cy="49" r="4.5" fill="url(#buttonEyeGrad)" />
              
              {isSpeaking ? (
                <motion.path 
                  d="M 54 54 Q 60 63 66 54" 
                  stroke="#5d4eb8" 
                  strokeWidth="3.2" 
                  strokeLinecap="round" 
                  fill="none" 
                  animate={{ d: ["M 56 54 L 64 54", "M 54 54 Q 60 63 66 54", "M 57 54 L 63 54"] }}
                  transition={{ repeat: Infinity, duration: 0.35 }}
                />
              ) : (
                <path d="M 54 54 Q 60 59 66 54" stroke="#5d4eb8" strokeWidth="3" strokeLinecap="round" fill="none" />
              )}
            </>
          )}

          {/* Gorgeous soft blush red cheek glows - identical to the reference image blushes! */}
          <circle cx="25" cy="57" r="9" fill="url(#cloudBlush)" />
          <circle cx="95" cy="57" r="9" fill="url(#cloudBlush)" />
        </g>
      </motion.svg>
    </div>
  );
}

/**
 * Animated Mascot for Sprout (Growth Bud)
 */
function SproutMascot({ emotion, isSpeaking }: { emotion: string; isSpeaking: boolean }) {
  // Leaf shaking angles
  const leftLeafAngle = emotion === "happy" ? [0, 24, -18, 0] : emotion === "concerned" ? [-8, -8] : [0, 10, -5, 0];
  const rightLeafAngle = emotion === "happy" ? [0, -24, 18, 0] : emotion === "concerned" ? [8, 8] : [0, -10, 5, 0];

  const getEyesVariant = () => {
    switch (emotion) {
      case "happy":
        return (
          <>
            {/* Happy laughing closed curved eyes curving UP (⌒⌒) */}
            <motion.path d="M 33 46 Q 39 37 45 46" stroke="#645ab3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <motion.path d="M 55 46 Q 61 37 67 46" stroke="#645ab3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
      case "concerned":
        return (
          <>
            {/* Worried cute eyes */}
            <ellipse cx="38" cy="47" rx="7" ry="6" fill="#645ab3" />
            <circle cx="36" cy="45" r="2.2" fill="#ffffff" />
            <ellipse cx="62" cy="47" rx="7" ry="6" fill="#645ab3" />
            <circle cx="60" cy="45" r="2.2" fill="#ffffff" />
            <path d="M 33 37 Q 38 34 42 38" stroke="#645ab3" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <path d="M 67 37 Q 62 34 58 38" stroke="#645ab3" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </>
        );
      case "thinking":
        return (
          <>
            {/* Curious wide gaze with a cute thinking shine */}
            <ellipse cx="38" cy="46" rx="7.5" ry="6.5" fill="#645ab3" />
            <circle cx="40" cy="43.5" r="2.5" fill="#ffffff" />
            <ellipse cx="62" cy="46" rx="7.5" ry="6.5" fill="#645ab3" />
            <circle cx="64" cy="43.5" r="2.5" fill="#ffffff" />
          </>
        );
      default: // idle / talking / calm (Dreamy sweet curved sleeping eyes, exactly like the image!)
        return (
          <>
            {/* Giant beautiful curved happy eyes (⌒⌒) */}
            <motion.path d="M 33 46 Q 39 37 45 46" stroke="#645ab3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <motion.path d="M 55 46 Q 61 37 67 46" stroke="#645ab3" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          </>
        );
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Sparkles when HAPPY */}
      {emotion === "happy" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <motion.div
              key={angle}
              className="absolute w-1.5 h-5 bg-lime-300/60 rounded-full"
              style={{ transform: `rotate(${angle}deg) translateY(-85px)` }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.7, 1.2, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.6, delay: (angle / 360) }}
            />
          ))}
        </div>
      )}

      {/* Sprout Turnip Baby Vector SVG - No Pot, Floating Floating Baby! */}
      <motion.svg 
        viewBox="0 0 100 100" 
        className="w-40 h-40 md:w-52 md:h-52 drop-shadow-md overflow-visible"
        animate={{
          y: emotion === "happy" ? [4, -8, 4] : [2, -4, 2]
        }}
        transition={{
          repeat: Infinity,
          duration: emotion === "happy" ? 1.0 : 3.6,
          ease: "easeInOut"
        }}
      >
        <defs>
          {/* Champagne peach 3D turnip lighting gradient */}
          <radialGradient id="sproutBodyGrad" cx="30%" cy="25%" r="70%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#fefbf4" />
            <stop offset="85%" stopColor="#fce9d2" />
            <stop offset="100%" stopColor="#facca5" />
          </radialGradient>
          {/* Rich spring greens for leaves */}
          <radialGradient id="sproutLeafGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#f0ffd8" />
            <stop offset="50%" stopColor="#bef264" />
            <stop offset="100%" stopColor="#58a005" />
          </radialGradient>
          <radialGradient id="sproutBlush" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9fae" />
            <stop offset="100%" stopColor="#ff9fae00" />
          </radialGradient>
        </defs>

        {/* Floating soft baby feet sitting at the bottom */}
        <ellipse cx="38" cy="80" rx="3.5" ry="5.2" fill="#facca5" transform="rotate(-10 38 80)" />
        <ellipse cx="62" cy="80" rx="3.5" ry="5.2" fill="#facca5" transform="rotate(10 62 80)" />

        {/* The beautiful organic teardrop turnip head-body tapering seamlessly */}
        <path 
          d="M 50 16 
             C 74 16, 84 32, 84 48 
             C 84 66, 68 76, 50 78 
             C 32 76, 16 66, 16 48 
             C 16 32, 26 16, 50 16 Z" 
          fill="url(#sproutBodyGrad)" 
        />

        {/* Tiny sweet turnip root tip nub tail curving slightly */}
        <path d="M 47 77 Q 50 88 45 92 Q 51 86 53 77 Z" fill="#facca5" />

        {/* Glossy turnip spotlight specular highlight reflection */}
        <ellipse cx="42" cy="27" rx="10" ry="5.5" fill="#ffffff" opacity="0.45" transform="rotate(-15 42 27)" />

        {/* Tiny sweet stubby chubby arms on the sides */}
        <ellipse cx="14" cy="54" rx="3" ry="4.5" fill="#fdfaf4" transform="rotate(35 14 54)" />
        <ellipse cx="86" cy="54" rx="3" ry="4.5" fill="#fdfaf4" transform="rotate(-35 86 54)" />

        {/* Double Leaf Ears - Jointed perfectly at the top center of turnip head */}
        {/* Left leafy sprout */}
        <motion.g 
          style={{ transformOrigin: "50px 16px" }}
          animate={{ rotate: leftLeafAngle }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          {/* Main Leaf and shading ridge */}
          <path d="M 50 16 C 42 16, 26 2, 34 0 C 42 -2, 48 8, 50 16" fill="url(#sproutLeafGrad)" />
          <path d="M 50 16 C 44 14, 38 10, 34 0" stroke="#bef264" strokeWidth="1" fill="none" opacity="0.6" />
        </motion.g>

        {/* Right leafy sprout */}
        <motion.g 
          style={{ transformOrigin: "50px 16px" }}
          animate={{ rotate: rightLeafAngle }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
          {/* Main Leaf and shading ridge */}
          <path d="M 50 16 C 58 16, 74 2, 66 0 C 58 -2, 52 8, 50 16" fill="url(#sproutLeafGrad)" />
          <path d="M 50 16 C 56 14, 62 10, 66 0" stroke="#bef264" strokeWidth="1" fill="none" opacity="0.6" />
        </motion.g>

        {/* Cute Blushing Face on the Turnip clay Baby */}
        <g opacity="0.95">
          {getEyesVariant()}

          {/* Large soft circular peachy rouge blushes right by the eyes */}
          <circle cx="26" cy="54" r="8.5" fill="url(#sproutBlush)" />
          <circle cx="74" cy="54" r="8.5" fill="url(#sproutBlush)" />
          
          {emotion === "happy" || emotion === "idle" || emotion === "talking" || emotion === "calm" ? (
            // Giant super cute open mouth laughing with pink tongue inside
            <g>
              <path d="M 44 54 Q 50 63 56 54 Z" fill="#5d4eb8" />
              <path d="M 44 54 Q 50 63 56 54" stroke="#645ab3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              {/* Cute little heart tongue inside */}
              <path d="M 46 58 Q 50 63 54 58" fill="#ff709b" />
            </g>
          ) : emotion === "concerned" ? (
            <path d="M 46 53 Q 50 50 54 53" stroke="#645ab3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : ( // thinking
            <path d="M 46 53 Q 50 56 54 53" stroke="#645ab3" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          )}
        </g>
      </motion.svg>
    </div>
  );
}

/**
 * Universal Unified Companion Mascot Component Mapper
 */
export default function CompanionMascot({
  companionId,
  emotion,
  isListening = false,
  isSpeaking = false,
  size = "md"
}: CompanionMascotProps) {
  
  // Custom wrappers
  const renderSelectedMascot = () => {
    switch (companionId) {
      case "purr":
        return <PurrMascot emotion={emotion} isSpeaking={isSpeaking} />;
      case "luma":
        return <LumaMascot emotion={emotion} isSpeaking={isSpeaking} />;
      case "cirrus":
        return <CirrusMascot emotion={emotion} isSpeaking={isSpeaking} />;
      case "sprout":
        return <SproutMascot emotion={emotion} isSpeaking={isSpeaking} />;
      default:
        return <LumaMascot emotion={emotion} isSpeaking={isSpeaking} />;
    }
  };

  const getContainerSizes = () => {
    switch (size) {
      case "sm":
        return "w-28 h-28 sm:w-32 sm:h-32";
      case "lg":
        return "w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64";
      default: // md
        return "w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48";
    }
  };

  return (
    <div className={`relative ${getContainerSizes()} flex items-center justify-center select-none`}>
      {/* Absolute Sound Waves for Listening Speech Input */}
      {isListening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute border border-dashed border-primary/40 rounded-full"
              initial={{ width: "95%", height: "95%", opacity: 0.6 }}
              animate={{ width: "135%", height: "135%", opacity: 0 }}
              transition={{ repeat: Infinity, duration: 1.4, delay: i * 0.7, ease: "linear" }}
            />
          ))}
          <span className="absolute bottom-[-24px] bg-primary text-white font-sans text-[10px] font-bold px-3 py-1 rounded-full border border-white/20 soft-shadow animate-pulse">
            🎤 Listening...
          </span>
        </div>
      )}

      {/* Speaking Speech feedback ring indicator */}
      {isSpeaking && !isListening && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute border-4 border-solid border-primary/25 rounded-full w-[110%] h-[110%]"
            animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
          />
        </div>
      )}

      {/* Render Mascot Visuals */}
      {renderSelectedMascot()}
    </div>
  );
}
