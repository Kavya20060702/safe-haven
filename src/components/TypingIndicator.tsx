import React from "react";
import { motion } from "motion/react";

interface TypingIndicatorProps {
  companionName: string;
}

export default function TypingIndicator({ companionName }: TypingIndicatorProps) {
  const dotTransition = {
    duration: 1.2,
    repeat: Infinity,
    ease: "easeInOut",
  };

  return (
    <div className="flex gap-3 max-w-[85%] items-end mt-2" id="companion-typing-indicator">
      {/* Companion Avatar element with gentle bobbing active frame */}
      <motion.div 
        animate={{ 
          rotate: [0, 8, -8, 0],
          y: [0, -3, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center shrink-0 shadow-sm border border-primary-fixed-dim/35 select-none"
      >
        <span className="material-symbols-outlined text-white text-[15px] font-normal">pets</span>
      </motion.div>

      {/* Bubble containing the Custom stagger-pulsing thinking dots */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface-container-high px-4 py-2.5 rounded-2xl rounded-tl-none flex gap-1.5 items-center h-9 border border-[#eae8e7] select-none shadow-sm"
      >
        {/* Animated dot 1 */}
        <motion.span 
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            ...dotTransition,
            delay: 0,
          }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        {/* Animated dot 2 */}
        <motion.span 
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            ...dotTransition,
            delay: 0.2,
          }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        {/* Animated dot 3 */}
        <motion.span 
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4]
          }}
          transition={{
            ...dotTransition,
            delay: 0.4,
          }}
          className="w-2 h-2 bg-primary rounded-full"
        />
        <motion.span 
          initial={{ opacity: 0.8 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[11px] font-sans text-on-surface-variant/75 ml-1.5 font-semibold select-none"
        >
          {companionName} is thinking...
        </motion.span>
      </motion.div>
    </div>
  );
}
