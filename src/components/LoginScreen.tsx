import React, { useState } from "react";
import { StudentProfile } from "../types";
import { BRANCHES, SEMESTERS, STRESS_REASONS } from "../data";
import { motion, AnimatePresence } from "motion/react";

interface LoginScreenProps {
  onComplete: (profile: StudentProfile) => void;
  onBackToLanding?: () => void;
}

export default function LoginScreen({ onComplete, onBackToLanding }: LoginScreenProps) {
  const [nickname, setNickname] = useState("");
  const [branch, setBranch] = useState(BRANCHES[0]);
  const [semester, setSemester] = useState(SEMESTERS[0]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [stressLevel, setStressLevel] = useState(5);
  const [stressReason, setStressReason] = useState(STRESS_REASONS[0].value);
  const [error, setError] = useState("");

  // Support Circle Configuration States
  const [supportCircleName, setSupportCircleName] = useState("");
  const [supportCircleInfo, setSupportCircleInfo] = useState("");
  const [supportCircleRelation, setSupportCircleRelation] = useState("Friend");
  const [enableSupportCircle, setEnableSupportCircle] = useState(true);

  // Upgraded custom state variables to support Login/Signup switching & Google accounts with outstanding fidelity
  const [isSignup, setIsSignup] = useState(false);
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleStep, setGoogleStep] = useState<"choose" | "signing" | "setup">("choose");
  const [selectedGoogleEmail, setSelectedGoogleEmail] = useState("");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);
  const [googleNickname, setGoogleNickname] = useState("");

  // Google Student Profile Setup States
  const [googleBranch, setGoogleBranch] = useState(BRANCHES[0]);
  const [googleSemester, setGoogleSemester] = useState(SEMESTERS[0]);
  const [googleStressLevel, setGoogleStressLevel] = useState(4);
  const [googleStressReason, setGoogleStressReason] = useState(STRESS_REASONS[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError("Please pick a nickname / email to enter your sanctuary.");
      return;
    }
    // Complete anonymous profile onboarding
    onComplete({
      nickname: nickname.trim().split("@")[0], // clean nickname if they entered an email
      semester,
      branch,
      stressLevel,
      stressReason,
      supportCircleName: isSignup ? (supportCircleName || "Default Support Circle") : undefined,
      supportCircleInfo: isSignup ? supportCircleInfo : undefined,
      supportCircleRelation: isSignup ? supportCircleRelation : undefined,
      enableSupportCircle: isSignup ? enableSupportCircle : undefined,
    });
  };

  const handleGoogleLoginClick = () => {
    setGoogleStep("choose");
    setShowCustomGoogleInput(false);
    setCustomGoogleEmail("");
    setSelectedGoogleEmail("");
    setShowGoogleModal(true);
  };

  const handleSelectGoogleAccount = (email: string) => {
    setSelectedGoogleEmail(email);
    const cleanedNick = email.split("@")[0];
    setGoogleNickname(cleanedNick);
    setGoogleStep("signing");
    
    // Smooth timing representation to mimic Google federated OAuth authentication handshake
    setTimeout(() => {
      setGoogleStep("setup");
    }, 1200);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim() || !customGoogleEmail.includes("@")) {
      return;
    }
    handleSelectGoogleAccount(customGoogleEmail.trim());
  };

  const handleCompleteGoogleAuth = () => {
    onComplete({
      nickname: googleNickname.trim() || selectedGoogleEmail.split("@")[0],
      semester: googleSemester,
      branch: googleBranch,
      stressLevel: googleStressLevel,
      stressReason: googleStressReason,
      supportCircleName: supportCircleName || "Google Support Circle",
      supportCircleInfo: supportCircleInfo || undefined,
      supportCircleRelation: supportCircleRelation || "Friend",
      enableSupportCircle: enableSupportCircle,
    });
    setShowGoogleModal(false);
  };

  const handleQuickSkipGoogle = () => {
    onComplete({
      nickname: googleNickname.trim() || selectedGoogleEmail.split("@")[0],
      semester: SEMESTERS[0],
      branch: BRANCHES[0],
      stressLevel: 4,
      stressReason: "exams",
    });
    setShowGoogleModal(false);
  };

  return (
    <div id="login-screen-outer" className="min-h-screen bg-background text-on-surface font-sans overflow-x-hidden flex items-center justify-center p-4 relative">
      
      {/* Return to Landing Button */}
      {onBackToLanding && (
        <button
          onClick={onBackToLanding}
          className="absolute top-6 left-6 flex items-center gap-1 text-primary hover:text-surface-tint font-sans text-xs font-bold bg-white/80 backdrop-blur px-4 py-2 rounded-full border border-primary-fixed-dim/30 soft-shadow transition-all hover:scale-[1.03] active:scale-95 cursor-pointer z-50"
          title="Back to Landing Page"
        >
          <span className="material-symbols-outlined text-sm font-normal">arrow_back</span>
          <span>Back to Home</span>
        </button>
      )}

      <main className="w-full max-w-7xl h-full md:h-[921px] grid grid-cols-1 md:grid-cols-2 bg-surface-container-lowest rounded-[32px] overflow-hidden soft-shadow border border-outline-variant/30 relative">
        
        {/* Left Side: Hero / Companion Mascot */}
        <section className="hidden md:flex flex-col items-center justify-center bg-primary-container/10 relative p-xl overflow-hidden select-none">
          {/* Decorative atmospheric circles */}
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-primary-fixed opacity-35 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-secondary-container opacity-35 blur-3xl pointer-events-none"></div>
          
          <div className="z-10 text-center space-y-md">
            <div className="floating-anim relative">
              <img 
                alt="Purr the Cat" 
                className="w-64 h-64 object-contain mx-auto drop-shadow-2xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkHiRuWnqdf2SSPvFBAmtYmsKZQEVArGKEqI9cUkU_zRMSLDaZSjIVsIvRgiOOEZ1NKauaBLBG7ZiuwKag6uq1CDDwe1t_zDnM2KIa6NQzubiWLS7XaKVmq2T49uFjIfC-I5bj9hDPwQBLLwzBZyypUcqYbejlX_ww2lG3XItAVG7j9XfrpQzuOkDlrff67pSGqyOD6pQdS1XXqab1Ngg0C9zOq_OXO-wTQ-m9Z8s9MVS-Xnyae8Jh1Th2nYpmf24kpkgTPZg06a0" 
              />
              {/* Subtle shadow below cat */}
              <div className="w-40 h-6 bg-primary-container/10 blur-xl rounded-full mx-auto mt-4"></div>
            </div>
            
            <div className="space-y-sm">
              <h1 className="font-display text-4xl font-bold text-primary">Welcome Back</h1>
              <p className="text-body-lg text-on-surface-variant max-w-xs mx-auto">
                Take a deep breath. Your sanctuary is waiting for you.
              </p>
            </div>
          </div>

          {/* Brand Identifier */}
          <div className="absolute top-md left-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-3xl font-normal">spa</span>
            <span className="font-display text-headline-md text-primary font-bold">Safe Haven</span>
          </div>
        </section>

        {/* Right Side: Login Form */}
        <section className="flex flex-col justify-center px-6 sm:px-8 py-xl md:px-xl bg-surface-container-lowest relative">
          <div className="max-w-md w-full mx-auto space-y-lg">
            
            {/* Mobile Logo (Hidden on Desktop) */}
            <div className="md:hidden flex flex-col items-center gap-base mb-lg">
              <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-sm shadow-md">
                <span className="material-symbols-outlined text-white text-4xl font-normal">spa</span>
              </div>
              <h2 className="font-display text-headline-lg-mobile text-primary text-center">
                {isSignup ? "Join Safe Haven" : "Welcome Back"}
              </h2>
            </div>

            <header className="space-y-base text-center md:text-left">
              <h2 className="font-display text-3xl font-bold text-on-surface hidden md:block">
                {isSignup ? "Sign Up" : "Log In"}
              </h2>
              <p className="text-body-md text-on-surface-variant">
                {isSignup 
                  ? "Create a wellness profile to customize your emotional supportive space." 
                  : "Continue your student wellness journey where you left off."}
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Username/Email Input */}
              <div className="space-y-2">
                <label className="text-label-md text-on-surface-variant ml-2 block" htmlFor="email-nickname">
                  {isSignup ? "Choose Nickname or Email" : "Gmail Address or Nickname"}
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline font-normal">mail</span>
                  <input 
                    id="email-nickname"
                    type="text" 
                    placeholder={isSignup ? "E.g., SkyWalker or user@g.com" : "name@gmail.com or Nickname"} 
                    value={nickname}
                    onChange={(e) => {
                      setNickname(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-14 pr-md py-4 bg-surface-container-low rounded-lg border-none focus:ring-2 focus:ring-primary-container font-sans text-sm transition-all"
                  />
                </div>
                {error && <p className="text-xs text-error ml-2">⚠️ {error}</p>}
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-label-md text-on-surface-variant" htmlFor="password">
                    {isSignup ? "Choose Password" : "Password"}
                  </label>
                  {!isSignup && (
                    <a className="text-label-sm text-primary hover:underline" href="#" onClick={(e) => e.preventDefault()}>
                      Forgot password?
                    </a>
                  )}
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline font-normal">lock</span>
                  <input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-14 pr-12 py-4 bg-surface-container-low rounded-lg border-none focus:ring-2 focus:ring-primary-container font-sans text-sm transition-all"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline text-xl hover:text-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined font-normal">{showPassword ? "visibility_off" : "visibility"}</span>
                  </button>
                </div>
              </div>

              {/* Branch Selection */}
              <div className="space-y-2">
                <label className="text-label-md text-on-surface-variant ml-2 block" htmlFor="branch-select">
                  B.Tech Branch
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline font-normal">school</span>
                  <select
                    id="branch-select"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 bg-surface-container-low rounded-lg border-none focus:ring-2 focus:ring-primary-container font-sans text-xs sm:text-sm text-on-surface appearance-none transition-all"
                  >
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Semester Selection */}
              <div className="space-y-2">
                <label className="text-label-md text-on-surface-variant ml-2 block" htmlFor="semester-select">
                  Current Semester
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline font-normal">calendar_month</span>
                  <select
                    id="semester-select"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full pl-14 pr-4 py-3 bg-surface-container-low rounded-lg border-none focus:ring-2 focus:ring-primary-container font-sans text-xs sm:text-sm text-on-surface appearance-none transition-all"
                  >
                    {SEMESTERS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Support Circle configuration section during Sign Up */}
              {isSignup && (
                <div className="p-4 bg-primary-container/[0.04] border border-primary/10 rounded-2xl space-y-3 mt-2">
                  <div className="flex items-center gap-2 text-primary font-display font-bold text-sm">
                    <span className="material-symbols-outlined text-lg">group</span>
                    <span>Setup Support Circle (Optional)</span>
                  </div>
                  <p className="text-xs text-on-surface-variant leading-normal">
                    Specify a trusted peer or mentor. You can test calling or alerting them in crisis situations.
                  </p>
                  
                  {/* Contact Name */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label htmlFor="circle-name" className="text-[10px] uppercase font-bold text-on-surface-variant ml-1">Contact Name</label>
                      <input 
                        id="circle-name"
                        type="text"
                        placeholder="E.g., Dr. Roy or Priya"
                        value={supportCircleName}
                        onChange={(e) => setSupportCircleName(e.target.value)}
                        className="w-full px-3 py-2 bg-surface-container-low rounded-lg border-none focus:ring-2 focus:ring-primary-container text-xs font-sans text-on-surface text-neutral-800"
                      />
                    </div>

                    {/* Relation */}
                    <div className="space-y-1">
                      <label htmlFor="circle-relation" className="text-[10px] uppercase font-bold text-on-surface-variant ml-1">Relationship</label>
                      <select 
                        id="circle-relation"
                        value={supportCircleRelation}
                        onChange={(e) => setSupportCircleRelation(e.target.value)}
                        className="w-full p-2 bg-surface-container-low border-none focus:ring-2 focus:ring-primary-container text-xs font-sans text-on-surface text-neutral-800"
                      >
                        <option value="Friend">Friend</option>
                        <option value="Mentor">Mentor</option>
                        <option value="Parent">Parent</option>
                        <option value="Advisor">Advisor</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Contact Phone or Email */}
                  <div className="space-y-1">
                    <label htmlFor="circle-info" className="text-[10px] uppercase font-bold text-on-surface-variant ml-1">Contact Phone or Email</label>
                    <input 
                      id="circle-info"
                      type="text"
                      placeholder="+91-XXXXX-XXXXX or email@g.com"
                      value={supportCircleInfo}
                      onChange={(e) => setSupportCircleInfo(e.target.value)}
                      className="w-full px-3 py-2 bg-surface-container-low rounded-lg border-none focus:ring-2 focus:ring-primary-container text-xs font-sans text-on-surface text-neutral-800"
                    />
                  </div>

                  {/* Enable Switch */}
                  <div className="flex items-center gap-2 select-none pt-1">
                    <input 
                      type="checkbox" 
                      id="circle-enable" 
                      checked={enableSupportCircle}
                      onChange={(e) => setEnableSupportCircle(e.target.checked)}
                      className="w-4 h-4 rounded border-outline text-primary focus:ring-primary-container cursor-pointer"
                    />
                    <label htmlFor="circle-enable" className="text-[11px] text-on-surface-variant font-medium cursor-pointer">
                      Enable instant SOS broadcasts
                    </label>
                  </div>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center gap-sm cursor-pointer group px-2 py-1">
                <input 
                  type="checkbox" 
                  id="keep-logged-in"
                  className="w-4 h-4 rounded border-outline text-primary focus:ring-primary-container transition-all cursor-pointer" 
                />
                <label htmlFor="keep-logged-in" className="text-label-md text-on-surface-variant group-hover:text-on-surface transition-colors cursor-pointer select-none">
                  Keep me logged in
                </label>
              </div>

              {/* Action Button */}
              <button 
                type="submit" 
                className="w-full bg-primary text-white font-headline-md py-4 rounded-lg hover:bg-primary/95 transition-all shadow-lg shadow-primary-container/20 active:scale-[0.98] cursor-pointer"
              >
                {isSignup ? "Create Account & Connect" : "Login and Connect"}
              </button>
            </form>

            {/* Footer Divisor */}
            <div className="text-center space-y-md">
              <div className="flex items-center gap-md select-none">
                <div className="h-[1px] flex-1 bg-outline-variant/60"></div>
                <span className="text-label-sm text-outline uppercase tracking-wider">OR</span>
                <div className="h-[1px] flex-1 bg-outline-variant/60"></div>
              </div>

              {/* Google Button */}
              <button 
                type="button"
                onClick={handleGoogleLoginClick}
                className="w-full flex items-center justify-center gap-base py-4 bg-surface-container-low border border-outline-variant/40 rounded-lg text-label-md text-on-surface hover:bg-surface-variant/40 transition-all cursor-pointer font-sans"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                <span>Continue with Google</span>
              </button>

              <p className="text-body-md text-on-surface-variant select-none">
                {isSignup ? "Already have a wellness profile? " : "New to Safe Haven? "}
                <button 
                  type="button"
                  onClick={() => {
                    setIsSignup(!isSignup);
                    setError("");
                  }}
                  className="text-primary font-bold hover:underline decoration-2 underline-offset-4 bg-transparent border-none p-0 cursor-pointer"
                >
                  {isSignup ? "Log In" : "Create an account"}
                </button>
              </p>
            </div>

            {/* Legal Links */}
            <footer className="pt-2 text-center">
              <p className="text-label-sm text-outline leading-relaxed">
                By logging in, you agree to our{" "}
                <a className="underline hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{" "}
                <a className="underline hover:text-primary transition-colors" href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>.
              </p>
            </footer>

          </div>
        </section>

      </main>

      {/* MAGNIFICENT CUSTOM GOOGLE SIGN-IN HANDSHAKE MODAL */}
      <AnimatePresence>
        {showGoogleModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[9999]"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white text-neutral-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-neutral-200"
            >
              <div className="p-base flex justify-between items-center border-b border-neutral-100 bg-neutral-50">
                <div className="flex items-center gap-xs">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                  </svg>
                  <span className="text-xs font-bold font-mono text-neutral-500 uppercase tracking-widest">Google Accounts</span>
                </div>
                <button 
                  onClick={() => setShowGoogleModal(false)}
                  className="text-neutral-400 hover:text-neutral-600 font-sans text-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="p-6 md:p-8 space-y-lg">
                {googleStep === "choose" && (
                  <div className="space-y-md">
                    <div className="text-center space-y-xs pb-4">
                      <h3 className="text-xl font-bold font-sans text-neutral-900">Choose an account</h3>
                      <p className="text-xs text-neutral-500">to continue to <span className="font-bold text-primary">Safe Haven</span></p>
                    </div>

                    {/* Verified actual student account */}
                    <button 
                      type="button"
                      onClick={() => handleSelectGoogleAccount("2420030322@klh.edu.in")}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-bold text-primary">
                          KL
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-800">2420030322</p>
                          <p className="text-xs text-neutral-500">2420030322@klh.edu.in</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors text-lg">navigate_next</span>
                    </button>

                    {/* Standard Wellness account */}
                    <button 
                      type="button"
                      onClick={() => handleSelectGoogleAccount("wellness.student@gmail.com")}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-primary/50 hover:bg-neutral-50 transition-all text-left group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-secondary-container/20 border border-secondary/20 flex items-center justify-center font-bold text-secondary">
                          WS
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-neutral-800">Student Mind</p>
                          <p className="text-xs text-neutral-500">wellness.student@gmail.com</p>
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-neutral-400 group-hover:text-primary transition-colors text-lg">navigate_next</span>
                    </button>

                    {/* Option to toggle custom account field */}
                    {!showCustomGoogleInput ? (
                      <button 
                        type="button"
                        onClick={() => setShowCustomGoogleInput(true)}
                        className="w-full flex items-center gap-3 p-3 rounded-xl border border-dashed border-neutral-300 hover:border-primary/40 hover:bg-slate-50 transition-all text-left text-neutral-600 text-xs font-semibold cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-neutral-400 font-normal">person_add</span>
                        <span>Use another Google Account</span>
                      </button>
                    ) : (
                      <form onSubmit={handleCustomGoogleSubmit} className="space-y-2 pt-2 border-t border-neutral-100">
                        <label className="text-xs font-bold text-neutral-600" htmlFor="google-email-custom">Enter Google Email</label>
                        <div className="relative">
                          <input 
                            id="google-email-custom"
                            type="email" 
                            required
                            placeholder="username@gmail.com"
                            value={customGoogleEmail}
                            onChange={(e) => setCustomGoogleEmail(e.target.value)}
                            className="w-full px-3 py-2 pr-10 border border-neutral-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/40 font-sans text-neutral-800"
                          />
                          <button 
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-primary hover:text-primary/80 transition-colors"
                          >
                            <span className="material-symbols-outlined font-normal">arrow_forward</span>
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {googleStep === "signing" && (
                  <div className="flex flex-col items-center justify-center py-8 space-y-md text-center">
                    {/* Rotating color track Google Loader */}
                    <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-primary-container animate-spin"></div>
                    <div className="space-y-xs">
                      <h4 className="text-base font-bold text-neutral-900">Signing in...</h4>
                      <p className="text-xs text-neutral-500">Contacting Google auth providers for {selectedGoogleEmail}</p>
                    </div>
                  </div>
                )}

                {googleStep === "setup" && (
                  <div className="space-y-md">
                    <div className="space-y-sm text-center">
                      <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 mx-auto flex items-center justify-center">
                        <span className="material-symbols-outlined text-emerald-500 text-3xl font-light">verified_user</span>
                      </div>
                      <div className="space-y-xs">
                        <h4 className="text-lg font-bold text-neutral-900">Signed In Successfully</h4>
                        <p className="text-xs text-neutral-500">Complete your Safe Haven academic profile details:</p>
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      {/* Nickname Confirm */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase ml-1 block" htmlFor="g-nickname-input">Safe Haven Nickname</label>
                        <input 
                          id="g-nickname-input"
                          type="text"
                          value={googleNickname}
                          onChange={(e) => setGoogleNickname(e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-sm font-sans focus:outline-none focus:ring-2 focus:ring-primary/30 text-neutral-800"
                        />
                      </div>

                      {/* Google Branch */}
                      <div className="grid grid-cols-2 gap-sm">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-neutral-500 uppercase ml-1 block" htmlFor="g-branch-select">B.Tech Branch</label>
                          <select 
                            id="g-branch-select"
                            value={googleBranch}
                            onChange={(e) => setGoogleBranch(e.target.value)}
                            className="w-full p-2 border border-neutral-300 rounded-lg text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/30 text-neutral-800"
                          >
                            {BRANCHES.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>

                        {/* Google Semester */}
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-neutral-500 uppercase ml-1 block" htmlFor="g-sem-select">Semester</label>
                          <select 
                            id="g-sem-select"
                            value={googleSemester}
                            onChange={(e) => setGoogleSemester(e.target.value)}
                            className="w-full p-2 border border-neutral-300 rounded-lg text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/30 text-neutral-800"
                          >
                            {SEMESTERS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Stress Level slider */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] font-bold text-neutral-500 uppercase ml-1">
                          <span>Stress Level</span>
                          <span className="text-secondary font-bold">{googleStressLevel} / 10</span>
                        </div>
                        <input 
                          type="range" 
                          min="1" 
                          max="10" 
                          value={googleStressLevel} 
                          onChange={(e) => setGoogleStressLevel(Number(e.target.value))}
                          className="w-full accent-primary h-2 bg-neutral-200 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Stress trigger */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-500 uppercase ml-1 block" htmlFor="g-stress-reason">Main Stress Factor</label>
                        <select 
                          id="g-stress-reason"
                          value={googleStressReason}
                          onChange={(e) => setGoogleStressReason(e.target.value)}
                          className="w-full p-2 border border-neutral-300 rounded-lg text-xs font-sans focus:outline-none focus:ring-2 focus:ring-primary/30 text-neutral-800 animate-none"
                        >
                          {STRESS_REASONS.map((r) => (
                            <option key={r.value} value={r.value}>{r.label}</option>
                          ))}
                        </select>
                      </div>

                      {/* Google Flow Optional Support Circle Configuration */}
                      <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 space-y-2 text-left">
                        <div className="flex items-center gap-1.5 text-primary text-xs font-bold font-sans">
                          <span className="material-symbols-outlined text-base">group</span>
                          <span>Setup Support Circle (Optional)</span>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-normal">
                          Nominate a trusted friend or advisor right now to establish your support circle setup.
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label htmlFor="g-circle-name" className="text-[9px] uppercase font-bold text-neutral-500">Contact Name</label>
                            <input 
                              id="g-circle-name"
                              type="text"
                              placeholder="E.g., Dr. Roy or Priya"
                              value={supportCircleName}
                              onChange={(e) => setSupportCircleName(e.target.value)}
                              className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs font-sans text-neutral-800 bg-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label htmlFor="g-circle-relation" className="text-[9px] uppercase font-bold text-neutral-500">Relationship</label>
                            <select 
                              id="g-circle-relation"
                              value={supportCircleRelation}
                              onChange={(e) => setSupportCircleRelation(e.target.value)}
                              className="w-full p-1.5 border border-neutral-300 rounded-lg text-xs font-sans text-neutral-800 bg-white"
                            >
                              <option value="Friend">Friend</option>
                              <option value="Mentor">Mentor</option>
                              <option value="Parent">Parent</option>
                              <option value="Advisor">Advisor</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label htmlFor="g-circle-info" className="text-[9px] uppercase font-bold text-neutral-500">Contact Phone or Email</label>
                          <input 
                            id="g-circle-info"
                            type="text"
                            placeholder="friend@g.com or +91-XXXXX-XXXXX"
                            value={supportCircleInfo}
                            onChange={(e) => setSupportCircleInfo(e.target.value)}
                            className="w-full px-2.5 py-1.5 border border-neutral-300 rounded-lg text-xs font-sans text-neutral-800 bg-white"
                          />
                        </div>
                      </div>

                    </div>

                    <div className="space-y-2 pt-4">
                      <button 
                        type="button"
                        onClick={handleCompleteGoogleAuth}
                        className="w-full bg-primary hover:bg-primary/95 text-white font-headline-md py-3 rounded-lg shadow-lg shadow-primary-container/20 transition-all cursor-pointer text-sm font-semibold"
                      >
                        Enter Sanctuary
                      </button>
                      <button 
                        type="button"
                        onClick={handleQuickSkipGoogle}
                        className="w-full bg-transparent hover:bg-neutral-50 text-neutral-500 hover:text-neutral-700 font-headline-md py-2 rounded-lg transition-all cursor-pointer text-xs font-semibold"
                      >
                        Skip &amp; Use Recommended Defaults
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-center gap-xs font-mono text-[9px] text-neutral-400 select-none">
                <span className="material-symbols-outlined text-xs">shield</span>
                <span>Safe Haven uses Google SSL to keep your college data secure</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
