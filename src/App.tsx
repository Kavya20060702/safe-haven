import { useState, useEffect } from "react";
import { Companion, StudentProfile } from "./types";
import WelcomeVideo from "./components/WelcomeVideo";
import LandingPage from "./components/LandingPage";
import LoginScreen from "./components/LoginScreen";
import CompanionSelector from "./components/CompanionSelector";
import CompanionHub from "./components/CompanionHub";
import WellnessTools from "./components/WellnessTools";
import CrisisSupport from "./components/CrisisSupport";
import CompanionMascot from "./components/CompanionMascot";
import SelfCareSpace from "./components/SelfCareSpace";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [selectedCompanion, setSelectedCompanion] = useState<Companion | null>(null);
  const [activeTab, setActiveTab] = useState<"chat" | "wellness" | "support" | "selfcare">("chat");
  const [showLanding, setShowLanding] = useState<boolean>(true);
  const [showWelcomeVideo, setShowWelcomeVideo] = useState<boolean>(true);

  // Companion Voice & Animation States
  const [companionEmotion, setCompanionEmotion] = useState<"idle" | "happy" | "calm" | "concerned" | "thinking" | "talking">("idle");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Load session or credentials anonymously from client-side persistent storage
  useEffect(() => {
    const savedProfile = localStorage.getItem("safehaven_profile");
    const savedCompanion = localStorage.getItem("safehaven_companion");
    if (savedProfile) {
      try {
        setStudentProfile(JSON.parse(savedProfile));
      } catch (e) {}
    }
    if (savedCompanion) {
      try {
        setSelectedCompanion(JSON.parse(savedCompanion));
      } catch (e) {}
    }
  }, []);

  const handleOnboardingComplete = (profile: StudentProfile) => {
    setStudentProfile(profile);
    localStorage.setItem("safehaven_profile", JSON.stringify(profile));
  };

  const handleCompanionSelect = (companion: Companion) => {
    setSelectedCompanion(companion);
    setActiveTab("chat");
    localStorage.setItem("safehaven_companion", JSON.stringify(companion));
  };

  const handleResetCompanion = () => {
    setSelectedCompanion(null);
    localStorage.removeItem("safehaven_companion");
  };

  const handleFullReset = () => {
    setStudentProfile(null);
    setSelectedCompanion(null);
    setShowLanding(true);
    localStorage.removeItem("safehaven_profile");
    localStorage.removeItem("safehaven_companion");
  };

  // 1. Welcome Cinematic or Onboarding Screens
  if (showWelcomeVideo) {
    return <WelcomeVideo onComplete={() => setShowWelcomeVideo(false)} />;
  }

  if (!studentProfile) {
    if (showLanding) {
      return <LandingPage onStartJourney={() => setShowLanding(false)} />;
    }
    return (
      <LoginScreen
        onComplete={handleOnboardingComplete}
        onBackToLanding={() => setShowLanding(true)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans flex flex-col md:flex-row relative">
      
      {/* BACKGROUND GRAPHIC MOTIFS */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary-fixed opacity-20 blur-3xl rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-secondary-fixed opacity-20 blur-3xl rounded-full pointer-events-none -z-10"></div>

      {/* DESKTOP SIDEBAR PANEL NAVIGATION */}
      <aside className="hidden md:flex flex-col justify-between w-[260px] h-screen bg-surface-container-lowest border-r border-[#eae8e7] px-base py-lg shrink-0 select-none">
        
        {/* Branding Title logo */}
        <div className="space-y-xl">
          <div className="flex items-center gap-sm px-2 cursor-pointer" onClick={() => setActiveTab("chat")}>
            <span className="material-symbols-outlined text-primary text-3xl font-normal">spa</span>
            <span className="font-display text-2xl font-bold tracking-tight text-primary">Safe Haven</span>
          </div>

          <div className="p-4 bg-primary-fixed/20 rounded-3xl border border-primary-fixed-dim/30">
            <p className="text-[10px] font-sans font-bold text-primary uppercase tracking-wider">Sanctuary Active</p>
            <p className="text-sm font-display font-bold text-on-primary-fixed-variant tracking-normal truncate mt-0.5">
              {studentProfile.nickname}
            </p>
            <p className="text-[10px] text-on-surface-variant font-sans mt-0.5 opacity-85 truncate">
              {studentProfile.branch}
            </p>
          </div>

          {/* Nav pills list bar */}
          <nav className="space-y-sm flex flex-col pt-2 font-sans text-sm">
            
            <button
              onClick={() => setActiveTab("chat")}
              className={`w-full flex items-center gap-base px-md py-3.5 rounded-full font-bold transition-all cursor-pointer ${
                activeTab === "chat"
                  ? "bg-primary text-white soft-shadow"
                  : "text-on-surface-variant hover:bg-primary-container/20 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined font-normal text-xl">smart_toy</span>
              <span>Companion Hub</span>
            </button>

            <button
              onClick={() => setActiveTab("wellness")}
              className={`w-full flex items-center gap-base px-md py-3.5 rounded-full font-bold transition-all cursor-pointer ${
                activeTab === "wellness"
                  ? "bg-primary text-white soft-shadow"
                  : "text-on-surface-variant hover:bg-primary-container/20 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined font-normal text-xl">spa</span>
              <span>Wellness Tools</span>
            </button>

            <button
              onClick={() => setActiveTab("support")}
              className={`w-full flex items-center gap-base px-md py-3.5 rounded-full font-bold transition-all cursor-pointer ${
                activeTab === "support"
                  ? "bg-primary text-white soft-shadow"
                  : "text-on-surface-variant hover:bg-primary-container/20 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined font-normal text-xl">favorite</span>
              <span>Crisis Support</span>
            </button>

            <button
              onClick={() => setActiveTab("selfcare")}
              className={`w-full flex items-center gap-base px-md py-3.5 rounded-full font-bold transition-all cursor-pointer ${
                activeTab === "selfcare"
                  ? "bg-primary text-white soft-shadow"
                  : "text-on-surface-variant hover:bg-primary-container/20 hover:text-primary"
              }`}
            >
              <span className="material-symbols-outlined font-normal text-xl">insights</span>
              <span>Self-Care Space</span>
            </button>

          </nav>
        </div>

        {/* Outer footer links within sidebar */}
        <div className="space-y-md">
          <button
            onClick={handleFullReset}
            className="w-full flex items-center gap-base px-4 py-2.5 rounded-lg transition-all cursor-pointer text-xs font-sans font-bold text-outline hover:text-error hover:bg-error-container/10 border border-outline-variant/30 hover:border-error/20"
          >
            <span className="material-symbols-outlined font-normal text-base">logout</span>
            <span>Sign Out Session</span>
          </button>
        </div>

      </aside>

      {/* PERSISTENT COMPANION SPOTLIGHT COLUMN (Isolated only to the chat tab when a companion is chosen) */}
      {selectedCompanion && activeTab === "chat" && (
        <section className="hidden md:flex flex-col items-center justify-center w-[250px] lg:w-[280px] h-screen bg-gradient-to-b from-surface to-surface-container-low shrink-0 select-none border-r border-[#eae8e7] p-5 relative">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-56 h-56 bg-primary/10 rounded-full blur-[50px] animate-pulse"></div>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center text-center w-full">
            <CompanionMascot
              companionId={selectedCompanion.id}
              emotion={companionEmotion}
              isListening={isListening}
              isSpeaking={isSpeaking}
              size="md"
            />

            {/* Active Expression badge */}
            <div className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full border border-primary-fixed-dim/30 shadow-sm flex items-center gap-1.5 mt-4 mb-2">
              <span className="font-sans text-[10px] font-black uppercase text-primary flex items-center gap-1.5 leading-none">
                <span className={`w-2 h-2 rounded-full ${
                  companionEmotion === "happy" ? "bg-cyan-400" :
                  companionEmotion === "concerned" ? "bg-rose-400" :
                  companionEmotion === "thinking" ? "bg-purple-400" :
                  companionEmotion === "talking" ? "bg-teal-400" : "bg-emerald-400"
                } animate-pulse`}></span>
                {companionEmotion}
              </span>
            </div>

            <h2 className="font-display text-lg font-bold text-primary">{selectedCompanion.name}</h2>
            
            <p className="font-sans text-[11px] text-on-surface-variant/90 font-medium tracking-normal mt-1 leading-normal max-w-[200px]">
              {isListening ? (
                <span className="text-secondary font-bold">Listening closest to you...</span>
              ) : isSpeaking ? (
                <span className="text-teal-600 font-bold">Speaking comforting words...</span>
              ) : companionEmotion === "thinking" ? (
                <span>Reflecting on a cozy response...</span>
              ) : companionEmotion === "concerned" ? (
                <span>Fully here for you with open ears...</span>
              ) : companionEmotion === "happy" ? (
                <span>Smiles at your progress!</span>
              ) : (
                <span>Your loyal helper stands by.</span>
              )}
            </p>

            <div className="bg-white/40 border border-outline-variant/20 p-3 rounded-2xl text-[10px] text-on-surface-variant text-center max-w-[210px] mt-4 shadow-sm backdrop-blur-sm">
              "{selectedCompanion.description}"
            </div>
          </div>
        </section>
      )}

      {/* MOBILE TOP NAVIGATION BAR */}
      <header className="md:hidden flex items-center justify-between bg-surface-container-lowest border-b border-[#eae8e7] px-md py-sm sticky top-0 w-full z-50 select-none">
        <div className="flex items-center gap-xs cursor-pointer" onClick={() => setActiveTab("chat")}>
          <span className="material-symbols-outlined text-primary text-2xl font-normal">spa</span>
          <span className="font-display text-sm font-bold tracking-tight text-primary">Safe Haven</span>
        </div>

        {selectedCompanion && (
          <div className="flex items-center gap-sm">
            {/* Circular mascot view on Mobile Top Bar */}
            <div className="w-9 h-9 rounded-full bg-primary-container/20 border border-primary-fixed-dim/30 flex items-center justify-center overflow-hidden scale-90">
              <CompanionMascot
                companionId={selectedCompanion.id}
                emotion={companionEmotion}
                isListening={isListening}
                isSpeaking={isSpeaking}
                size="sm"
              />
            </div>
            <span className="text-[11px] font-sans font-bold px-2 py-0.5 bg-primary-container/20 text-primary border border-primary-fixed-dim/30 rounded">
              {selectedCompanion.name}
            </span>
          </div>
        )}
      </header>

      {/* MAIN VIEWPORT PORT */}
      <div className="flex-1 flex flex-col h-[calc(100vh-56px)] md:h-screen overflow-hidden bg-background">
        <main className={`flex-1 flex flex-col focus:outline-none ${
          activeTab === "chat" 
            ? "overflow-hidden p-2 sm:p-3 md:p-4 lg:p-5 h-full" 
            : "overflow-y-auto px-4 sm:px-6 md:px-8 py-6 scroll-smooth"
        }`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full flex flex-col"
            >
              {activeTab === "chat" && (
                selectedCompanion ? (
                  <CompanionHub
                    companion={selectedCompanion}
                    studentProfile={studentProfile}
                    onBack={handleResetCompanion}
                    companionEmotion={companionEmotion}
                    setCompanionEmotion={setCompanionEmotion}
                    isListening={isListening}
                    setIsListening={setIsListening}
                    isSpeaking={isSpeaking}
                    setIsSpeaking={setIsSpeaking}
                  />
                ) : (
                  <div className="overflow-y-auto flex-1 p-2 sm:p-4">
                    <div className="text-center py-5">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-wider bg-primary/10 px-3 py-1 rounded-full">
                        Empathy Campus Network
                      </span>
                      <h2 className="font-display text-xl md:text-2xl font-black mt-2 text-on-surface">
                        Select a Wellness Companion
                      </h2>
                      <p className="text-xs text-on-surface-variant font-sans mt-1">
                        Pick a friendly buddy to help unpack academic worries and release stress.
                      </p>
                    </div>
                    <CompanionSelector
                      studentProfile={studentProfile}
                      onSelect={handleCompanionSelect}
                      onSignOut={handleFullReset}
                    />
                  </div>
                )
              )}
              
              {activeTab === "wellness" && <WellnessTools />}
              
              {activeTab === "support" && (
                <CrisisSupport 
                  onBack={() => setActiveTab("chat")} 
                  studentProfile={studentProfile} 
                  onUpdateProfile={(updatedProfile) => {
                    setStudentProfile(updatedProfile);
                    localStorage.setItem("safehaven_profile", JSON.stringify(updatedProfile));
                  }}
                />
              )}

              {activeTab === "selfcare" && (
                <SelfCareSpace 
                  studentProfile={studentProfile}
                  selectedCompanion={selectedCompanion}
                  onResetCompanion={handleResetCompanion}
                  onNavigateToTab={(tab) => setActiveTab(tab)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION BAR BAR */}
      <footer className="md:hidden flex justify-around bg-surface-container-lowest border-t border-[#eae8e7] py-2 sticky bottom-0 w-full z-50 select-none font-sans text-[10px]">
        
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
            activeTab === "chat" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined font-normal text-xl">smart_toy</span>
          <span>Companion</span>
        </button>

        <button
          onClick={() => setActiveTab("wellness")}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
            activeTab === "wellness" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined font-normal text-xl">spa</span>
          <span>Wellness</span>
        </button>

        <button
          onClick={() => setActiveTab("support")}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
            activeTab === "support" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined font-normal text-xl">favorite</span>
          <span>Crisis</span>
        </button>

        <button
          onClick={() => setActiveTab("selfcare")}
          className={`flex flex-col items-center gap-0.5 p-1 transition-colors cursor-pointer ${
            activeTab === "selfcare" ? "text-primary font-bold" : "text-on-surface-variant"
          }`}
        >
          <span className="material-symbols-outlined font-normal text-xl">insights</span>
          <span>Insights</span>
        </button>
        
      </footer>

    </div>
  );
}
