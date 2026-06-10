import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

interface WelcomeVideoProps {
  onComplete: () => void;
}

export default function WelcomeVideo({
  onComplete,
}: WelcomeVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.play().catch((err) => {
        console.log("Video autoplay failed:", err);
      });
    }

    const timer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-black"
    >
      {/* Full Screen Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src="/assets/welcome.mp4"
        autoPlay
        muted
        playsInline
        onEnded={onComplete}
        onError={() => {
          console.log("Video not found");
          onComplete();
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Branding */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white z-10 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <h1 className="text-5xl md:text-7xl font-black tracking-tight">
            Safe Haven
          </h1>

          <p className="mt-4 text-lg md:text-2xl text-white/90">
            Your AI Mental Wellness Companion
          </p>

          <p className="mt-2 text-sm md:text-base text-white/70">
            Supporting B.Tech students through stress,
            anxiety and academic challenges.
          </p>
        </motion.div>
      </div>

      {/* Skip Button */}
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 z-20 px-5 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-medium hover:bg-white/30 transition-all"
      >
        Skip Intro
      </button>

      {/* Bottom Loading Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 w-64">
        <div className="h-1 rounded-full bg-white/20 overflow-hidden">
          <motion.div
            className="h-full bg-white"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>

        <p className="text-center text-white/70 text-xs mt-2">
          Entering Safe Haven...
        </p>
      </div>
    </motion.div>
  );
}
