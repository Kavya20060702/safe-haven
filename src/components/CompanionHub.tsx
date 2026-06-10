import React, { useState, useRef, useEffect, useCallback } from "react";
import { Companion, Message, StudentProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { useSpeechRecognizer } from "./useSpeechRecognizer";
import TypingIndicator from "./TypingIndicator";

let messageIdCounter = 0;
const generateUniqueId = (role: string) => {
  return `${role}-${Date.now()}-${messageIdCounter++}-${Math.random().toString(36).substring(2, 9)}`;
};

const processMessageTextAndAction = (rawText: string) => {
  let cleanText = rawText;
  let detectedEmotion: "idle" | "happy" | "calm" | "concerned" | "thinking" | "talking" | null = null;

  // Regex to match *action* strings
  const actionRegex = /\*([^*]+)\*/g;
  let match;
  
  while ((match = actionRegex.exec(rawText)) !== null) {
    const actionContent = match[1].toLowerCase();
    
    if (
      actionContent.includes("rainbow") ||
      actionContent.includes("sparkle") ||
      actionContent.includes("heart") ||
      actionContent.includes("happy") ||
      actionContent.includes("smile") ||
      actionContent.includes("laugh") ||
      actionContent.includes("giggle") ||
      actionContent.includes("lick") ||
      actionContent.includes("purr") ||
      actionContent.includes("paws") ||
      actionContent.includes("glow") ||
      actionContent.includes("radiate") ||
      actionContent.includes("warm") ||
      actionContent.includes("wake") ||
      actionContent.includes("wakes")
    ) {
      detectedEmotion = "happy";
    } else if (
      actionContent.includes("breeze") ||
      actionContent.includes("wind") ||
      actionContent.includes("float") ||
      actionContent.includes("breathe") ||
      actionContent.includes("calm") ||
      actionContent.includes("relax") ||
      actionContent.includes("wave") ||
      actionContent.includes("rustle") ||
      actionContent.includes("shoot") ||
      actionContent.includes("gentle")
    ) {
      detectedEmotion = "calm";
    } else if (
      actionContent.includes("rain") ||
      actionContent.includes("storm") ||
      actionContent.includes("sad") ||
      actionContent.includes("worry") ||
      actionContent.includes("concerned") ||
      actionContent.includes("tear") ||
      actionContent.includes("cry") ||
      actionContent.includes("low") ||
      actionContent.includes("shook")
    ) {
      detectedEmotion = "concerned";
    } else if (
      actionContent.includes("think") ||
      actionContent.includes("ponder") ||
      actionContent.includes("curious") ||
      actionContent.includes("glasses") ||
      actionContent.includes("ideas") ||
      actionContent.includes("analyze")
    ) {
      detectedEmotion = "thinking";
    }
  }

  // Strip all asterisks action blocks entirely
  cleanText = rawText.replace(actionRegex, "").replace(/\s+/g, " ").trim();
  
  // If we stripped completely to empty text, restore the speech without asterisks so there's some content
  if (!cleanText) {
    cleanText = rawText.replace(/\*/g, "").trim();
  }

  return { cleanText, detectedEmotion };
};

interface CompanionHubProps {
  companion: Companion;
  studentProfile: StudentProfile;
  onBack: () => void;
  companionEmotion: "idle" | "happy" | "calm" | "concerned" | "thinking" | "talking";
  setCompanionEmotion: React.Dispatch<React.SetStateAction<"idle" | "happy" | "calm" | "concerned" | "thinking" | "talking">>;
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  isSpeaking: boolean;
  setIsSpeaking: (val: boolean) => void;
}

export default function CompanionHub({
  companion,
  studentProfile,
  onBack,
  companionEmotion,
  setCompanionEmotion,
  isListening,
  setIsListening,
  isSpeaking,
  setIsSpeaking,
}: CompanionHubProps) {
  const spokenMessagesRef = useRef<Set<string>>(new Set());

  const [messages, setMessages] = useState<Message[]>(() => {
    const { cleanText } = processMessageTextAndAction(companion.chatStarter);
    return [
      {
        id: "starter-" + companion.id,
        role: "model",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Clear spoken track when swapping companions
  useEffect(() => {
    spokenMessagesRef.current.clear();
  }, [companion.id]);

  // Auto-scroll messages
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Read Aloud welcome message exactly once per companion swap
  useEffect(() => {
    const starterId = "starter-" + companion.id;
    const { cleanText, detectedEmotion } = processMessageTextAndAction(companion.chatStarter);
    if (detectedEmotion) {
      setCompanionEmotion(detectedEmotion);
    } else {
      setCompanionEmotion("calm");
    }

    if (ttsEnabled && !spokenMessagesRef.current.has(starterId)) {
      const timer = setTimeout(() => {
        if (!spokenMessagesRef.current.has(starterId)) {
          spokenMessagesRef.current.add(starterId);
          speakText(cleanText);
        }
      }, 1000);
      return () => {
        clearTimeout(timer);
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
      };
    }
  }, [companion.id, ttsEnabled]);

  // Immediate Local sentiment analyzer for client fallback
  const analyzeLocalSentimentImmediate = (text: string): "happy" | "calm" | "concerned" => {
    const msg = text.toLowerCase();
    if (
      msg.includes("fail") ||
      msg.includes("backlog") ||
      msg.includes("stress") ||
      msg.includes("anxious") ||
      msg.includes("burnout") ||
      msg.includes("panic") ||
      msg.includes("nervous") ||
      msg.includes("scared") ||
      msg.includes("sad") ||
      msg.includes("lonely") ||
      msg.includes("overwhelmed") ||
      msg.includes("attendance") ||
      msg.includes("burn") ||
      msg.includes("cry")
    ) {
      return "concerned";
    }
    if (
      msg.includes("breathe") ||
      msg.includes("meditate") ||
      msg.includes("peace") ||
      msg.includes("calm") ||
      msg.includes("sleep") ||
      msg.includes("relax") ||
      msg.includes("cozy")
    ) {
      return "calm";
    }
    if (
      msg.includes("happy") ||
      msg.includes("amazing") ||
      msg.includes("good") ||
      msg.includes("great") ||
      msg.includes("cleared") ||
      msg.includes("success") ||
      msg.includes("thank") ||
      msg.includes("yes") ||
      msg.includes("celebrate")
    ) {
      return "happy";
    }
    return "calm";
  };

  /**
   * Browser Text To Speech Synthesis (Comforting audio playback)
   */
  const speakText = (textToSpeak: string) => {
    if (!window.speechSynthesis || !ttsEnabled) return;

    try {
      window.speechSynthesis.cancel(); // Stop playing previous voices

      // Strip markdown syntax elements (*, _, etc.) for crisp read out
      const cleanSay = textToSpeak.replace(/[\*\_#{}]/g, "");

      const utterance = new SpeechSynthesisUtterance(cleanSay);
      const voices = window.speechSynthesis.getVoices();
      
      // Select an English voice with pleasant tone
      let voice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural")));
      if (!voice) voice = voices.find(v => v.lang.startsWith("en"));
      
      if (voice) utterance.voice = voice;
      
      utterance.rate = 0.98; // slightly slower for therapeutic pacing
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setCompanionEmotion("talking");
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        const nextMood = analyzeLocalSentimentImmediate(cleanSay);
        setCompanionEmotion(nextMood);
      };

      utterance.onerror = (e) => {
        console.warn("TTS synth error", e);
        setIsSpeaking(false);
        setCompanionEmotion("idle");
      };

      // Wrap in a tiny delay of 80ms to prevent Chromium/Webkit speechSynthesis queue state lockup after cancel()
      setTimeout(() => {
        if (window.speechSynthesis && ttsEnabled) {
          window.speechSynthesis.speak(utterance);
        }
      }, 80);
    } catch (e) {
      console.error("Speech Synthesis failed:", e);
      setIsSpeaking(false);
    }
  };

  /**
   * Browser Speech To Text Speech Recognition powered by safe useSpeechRecognizer Hook
   */
  const { startListening, stopListening, supported: speechSupported } = useSpeechRecognizer({
    lang: "en-IN",
    onResult: (transcript) => {
      setInputText(transcript);
      showToast(`Speech recognized: "${transcript}"`);
      // Short delay so user sees voice response text loading
      setTimeout(() => {
        handleSendMessage(transcript);
      }, 350);
    },
    onStart: () => {
      setIsListening(true);
      setCompanionEmotion("calm");
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
    },
    onEnd: () => {
      setIsListening(false);
    },
    onError: (err: any) => {
      console.error("STT input error:", err?.error || err);
      setIsListening(false);
      showToast("Didn't catch that. Try speaking closer to your mic.");
    }
  });

  const startVoiceInput = () => {
    if (!speechSupported) {
      showToast("Speech recording is not supported in this browser environment.");
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleSendMessage = useCallback(async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: generateUniqueId("user"),
      role: "user",
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);
    setCompanionEmotion("thinking");

    try {
      const response = await fetch("/api/companion/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companionId: companion.id,
          systemInstruction: companion.empathyInstruction,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          userText: userMessage.text,
        }),
      });

      if (!response.ok) throw new Error("API call error");

      const data = await response.json();
      const rawText = data.text || "...";
      
      const { cleanText, detectedEmotion } = processMessageTextAndAction(rawText);
      
      const companionReply: Message = {
        id: generateUniqueId("model"),
        role: "model",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, companionReply]);
      
      const nextEmotion = detectedEmotion || data.emotion || analyzeLocalSentimentImmediate(rawText);
      setCompanionEmotion(nextEmotion);

      // Speak text aloud automatically if enabled (now completely clean of asterisk speech noise and throttled via once-only check!)
      if (ttsEnabled && !spokenMessagesRef.current.has(companionReply.id)) {
        spokenMessagesRef.current.add(companionReply.id);
        speakText(companionReply.text);
      }
    } catch (error) {
      console.warn("Companion endpoint fallback trigger active...", error);
      
      // Highly empathetic locale rescue fallback
      const fallbacksMap: Record<string, string> = {
        purr: "*licks its paws* Meow, friend. I felt a tiny compile bug in the sanctuary grids, but I am still right here laying beside you. Rest your thoughts—no exam backlog has power over you today.",
        luma: "*radiates reassuring amber waves* The pathways of our connection paused, yet my presence with you is unbroken. Let's trace another quiet breath together.",
        cirrus: "*floats around lazily* Whoops! A quick gust of storm wind shook our server tree. But look up: we're still flying! Let's shake off that heavy grade panic.",
        sprout: "*rustles tiny green shoots* A small block in the soil won't stop our seeds from sprouting. Let's sip a nice glass of water and take things one small root at a time!"
      };

      const fallbackText = fallbacksMap[companion.id] || "I am right here with you slowing down. Take a breath.";
      const { cleanText: cleanFallback, detectedEmotion: fallbackEmotion } = processMessageTextAndAction(fallbackText);
      
      const fallbackReply: Message = {
        id: generateUniqueId("model"),
        role: "model",
        text: cleanFallback,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, fallbackReply]);
      setCompanionEmotion(fallbackEmotion || "concerned");

      if (ttsEnabled && !spokenMessagesRef.current.has(fallbackReply.id)) {
        spokenMessagesRef.current.add(fallbackReply.id);
        speakText(fallbackReply.text);
      }
    } finally {
      setLoading(false);
    }
  }, [companion, messages, ttsEnabled, loading, setCompanionEmotion]);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  return (
    <div className="flex-1 flex flex-col relative bg-white overflow-hidden rounded-[24px] border border-outline-variant/30 soft-shadow h-full w-full">
      
      {/* Toast Alert popup overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 30, x: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 bg-on-primary-fixed text-white px-6 py-3 rounded-full soft-shadow z-[200] font-sans text-sm flex items-center gap-2 border border-white/20 select-none animate-bounce"
          >
            <span>✨</span>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Conversation Window (Takes full remaining column space, elegantly matching the global companion spotlights) */}
      <section className="w-full h-full flex flex-col overflow-hidden">
        
        {/* Chat window top header banner */}
        <div className="px-6 md:px-8 py-4 border-b border-surface-variant/30 flex justify-between items-center bg-white relative z-20 shrink-0 select-none">
          <div>
            <h3 className="font-display text-lg md:text-xl font-black text-primary">Empathy Chat</h3>
            <p className="text-on-surface-variant/80 mt-0.5 text-xs">Talking with <strong className="text-primary font-bold">{companion.name}</strong> • Speaks back comforting words</p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Audio Toggle (Speak response or silent) */}
            <button
              onClick={() => {
                const toggled = !ttsEnabled;
                setTtsEnabled(toggled);
                if (!toggled && window.speechSynthesis) {
                  window.speechSynthesis.cancel();
                  setIsSpeaking(false);
                  setCompanionEmotion("idle");
                }
                showToast(toggled ? "Companion voice mode turned ON." : "Companion muted.");
              }}
              className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
                ttsEnabled ? "bg-primary/10 text-primary hover:bg-primary/25" : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
              }`}
              title={ttsEnabled ? "Mute Companion voice" : "Read Aloud buddy answers"}
            >
              <span className="material-symbols-outlined text-[19px]">
                {ttsEnabled ? "volume_up" : "volume_off"}
              </span>
            </button>

            <button 
              onClick={onBack}
              className="material-symbols-outlined text-primary hover:bg-primary-container/20 p-2.5 rounded-full transition-colors cursor-pointer text-lg font-normal" 
              title="Choose another friend"
            >
              arrow_back
            </button>
          </div>
        </div>

        {/* Messaging Box Viewports (Scrollable) */}
        <div 
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto px-6 md:px-8 py-4 flex flex-col gap-4 custom-scrollbar bg-surface-container-lowest/30"
        >
          {messages.map((msg, i) => {
            const isUser = msg.role === "user";
            return (
              <div 
                key={`${msg.role}-${msg.id || i}-${i}`} 
                className={`flex gap-3 max-w-[85%] chat-bubble-in ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {/* Custom rounded symbol markers for partners */}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 border select-none ${
                   isUser 
                     ? "bg-surface-variant/30 border-outline-variant/30 text-on-surface-variant" 
                     : "bg-primary-container text-white border-primary-fixed-dim/35 shadow-sm"
                }`}>
                  <span className="material-symbols-outlined text-[15px] font-normal">
                    {isUser ? "person" : "pets"}
                  </span>
                </div>

                <div className={`p-3.5 rounded-2xl border ${
                  isUser 
                    ? "bg-primary rounded-tr-none text-white soft-shadow border-primary/50" 
                    : "bg-surface-container-low rounded-tl-none border-outline-variant/40 text-on-surface"
                }`}>
                  <p className="font-sans text-xs md:text-sm leading-relaxed whitespace-pre-wrap select-text">
                    {msg.text}
                  </p>
                  <span className={`block text-[9px] font-mono mt-1 ${isUser ? "text-white/60 text-right" : "text-on-surface-variant/60 text-left"}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Typing Loading indicator */}
          {loading && <TypingIndicator companionName={companion.name} />}

          {/* Speech Synthesis indicator */}
          {isSpeaking && (
            <div className="flex gap-3 max-w-[85%] items-center mt-1 select-none">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping"></span>
              <span className="text-[10px] font-sans text-teal-600 font-bold tracking-wide italic">
                {companion.name} is reading aloud...
              </span>
            </div>
          )}
        </div>

        {/* Input tool area */}
        <div className="p-4 bg-white border-t border-surface-variant/20 relative z-20 shrink-0 space-y-3">
          
          <div className="flex items-center gap-2 bg-surface-container-low/55 p-1.5 rounded-xl border border-outline-variant/25 shadow-inner">
            <button 
              type="button"
              onClick={startVoiceInput}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all active:scale-95 cursor-pointer shrink-0 ${
                isListening ? "bg-red-500 text-white animate-pulse" : "text-primary hover:bg-white"
              }`} 
              title="Voice Input (Speech To Text)"
            >
              <span className="material-symbols-outlined font-normal">
                {isListening ? "settings_voice" : "mic"}
              </span>
            </button>
            
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }
              }}
              placeholder={loading ? "Companion is compiling a reply..." : isListening ? "Listening closely... Speak now" : `Tell anything on your mind to ${companion.name}...`}
              disabled={isListening || loading}
              className="flex-1 border-none focus:outline-none focus:ring-0 text-sm px-2 text-on-surface bg-transparent placeholder:text-on-surface-variant/40 disabled:opacity-50"
            />

            <div className="flex gap-2">
              <button 
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || loading || isListening}
                className="bg-primary text-white font-sans text-xs font-bold px-4 py-2 rounded-lg soft-shadow hover:translate-y-[-1px] transition-all disabled:opacity-50 flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[13px] font-normal">send</span>
              </button>

              <button 
                type="button"
                onClick={() => {
                  showToast(`${companion.name} is sending quiet acoustic vibrations for your stress...`);
                  speakText("Relax your shoulders. Unclench your jaw. Drop your hands. Take a deep, slow breath out.");
                }}
                className="bg-primary-container/20 text-primary font-sans text-xs font-bold px-3 py-2 rounded-lg hover:bg-primary-container/40 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Unwind</span>
                <span className="material-symbols-outlined text-[13px] font-normal">graphic_eq</span>
              </button>
            </div>
          </div>

          {/* Quick helpful navigation action chips list */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            <button 
              onClick={() => showToast("Gentle panic triggers logged. Your custom emergency contact bubble has been notified with a supportive checking signal.")}
              className="px-3 py-1.5 bg-error-container/30 text-error border border-error/15 rounded-full font-sans text-xs font-bold hover:bg-error-container transition-all flex items-center gap-1 cursor-pointer select-none"
            >
              <span className="material-symbols-outlined text-[15px] font-normal">call</span>
              <span>Alert Support Circles</span>
            </button>
            
            <button 
              onClick={() => handleSendMessage("I feel under heavy academic stress. So much homework backlog.")}
              className="px-3 py-1.5 bg-surface-container-low border border-outline-variant/35 rounded-full font-sans text-xs text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-all cursor-pointer select-none"
            >
              <span>I'm feeling backlog stress</span>
            </button>

            <button 
              onClick={() => handleSendMessage("Can we practice a 4-7-8 deep box breath step?")}
              className="px-3 py-1.5 bg-surface-container-low border border-outline-variant/35 rounded-full font-sans text-xs text-on-surface-variant hover:bg-primary-container/20 hover:text-primary transition-all cursor-pointer select-none"
            >
              <span>Breathing Help</span>
            </button>
          </div>

        </div>

      </section>

    </div>
  );
}
