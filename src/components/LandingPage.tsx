import { motion } from "motion/react";

interface LandingPageProps {
  onStartJourney: () => void;
}

export default function LandingPage({ onStartJourney }: LandingPageProps) {
  // Micro-interactions and soft-animations on features
  const companionsLocal = [
    {
      id: "purr",
      name: "Purr",
      role: "Empathy",
      color: "bg-primary-fixed",
      iconColor: "text-primary",
      icon: "pets",
      desc: "Your cozy listener when exams feel like a weight. Purr is here for a purr-fectly calm talk.",
    },
    {
      id: "luma",
      name: "Luma",
      role: "Focus",
      color: "bg-secondary-container",
      iconColor: "text-secondary",
      icon: "lightbulb",
      desc: "Gently guides you back to your flow state without the pressure of typical productivity timers.",
    },
    {
      id: "cirrus",
      name: "Cirrus",
      role: "Calm",
      color: "bg-surface-container-high",
      iconColor: "text-on-surface-variant",
      icon: "cloud",
      desc: "A soft cloud that reminds you to breathe when the backlog of assignments starts to storm.",
    },
    {
      id: "sprout",
      name: "Sprout",
      role: "Growth",
      color: "bg-tertiary-fixed",
      iconColor: "text-tertiary",
      icon: "eco",
      desc: "Celebrates your tiny wins every day, because even a 1% progress is worth rooting for.",
    },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface font-sans overflow-x-hidden relative">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary-fixed/20 blur-3xl rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-secondary-fixed/25 blur-3xl rounded-full pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-tertiary-fixed/20 blur-3xl rounded-full pointer-events-none -z-10"></div>

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-surface/85 backdrop-blur-md border-b border-primary-container/10 shadow-sm shadow-primary/5">
        <nav className="flex justify-between items-center px-6 sm:px-10 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 font-display text-2xl font-bold text-primary select-none cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className="material-symbols-outlined text-primary text-3xl font-normal">spa</span>
            <span>Safe Haven</span>
          </div>
          
          <div className="hidden md:flex gap-8 items-center">
            <button 
              onClick={() => scrollToSection("hero")} 
              className="font-sans text-sm font-semibold text-primary border-b-2 border-primary pb-1 transition-colors duration-200"
            >
              Journey
            </button>
            <button 
              onClick={() => scrollToSection("companions")} 
              className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary pb-1 transition-colors duration-200"
            >
              Companions
            </button>
            <button 
              onClick={() => scrollToSection("circle")} 
              className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary pb-1 transition-colors duration-200"
            >
              Support Circle
            </button>
            <button 
              onClick={() => scrollToSection("toolkit")} 
              className="font-sans text-sm font-semibold text-on-surface-variant hover:text-primary pb-1 transition-colors duration-200"
            >
              Resources
            </button>
          </div>

          <button 
            onClick={onStartJourney}
            className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-sans font-bold text-sm hover:bg-surface-tint hover:scale-[1.03] active:scale-95 transition-all shadow-md shadow-primary/10 cursor-pointer"
          >
            Start Journey
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="pt-24">
        <section id="hero" className="relative min-h-[85vh] flex flex-col justify-center items-center px-6 sm:px-10 text-center max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto z-10 space-y-6 pt-10"
          >
            <span className="inline-block bg-primary-container/20 text-primary border border-primary-fixed-dim/30 px-4 py-1.5 rounded-full font-sans text-xs font-bold uppercase tracking-wider select-none mb-2">
              🌱 B.Tech Sanctuary &amp; Wellness Guide
            </span>
            
            <h1 className="font-display text-4xl md:text-6xl text-on-surface max-w-3xl mx-auto leading-tight font-bold">
              Your Academic Journey Deserves a <span className="text-primary italic">Safe Space</span>.
            </h1>
            
            <p className="font-sans text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
              Navigate the pressures of B.Tech life with empathetic companions and a community that cares. A digital sanctuary designed to help you breathe.
            </p>
            
            <div className="pt-4">
              <button 
                onClick={onStartJourney}
                className="bg-primary text-on-primary px-10 py-4 rounded-full font-display text-lg font-bold shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Start Your Journey
              </button>
            </div>
          </motion.div>

          {/* Hero Image Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-12 relative w-full max-w-5xl mx-auto floating-anim px-4 md:px-0"
          >
            <div className="relative rounded-[40px] md:rounded-[48px] overflow-hidden soft-shadow border border-white/40 bg-white/30 p-2">
              <img 
                alt="Group of friendly companions" 
                className="w-full h-auto rounded-[32px] md:rounded-[40px] object-cover" 
                src="https://lh3.googleusercontent.com/aida/AP1WRLsX_O_ehna1zr7lrMaHSQRpmty4f1TUFDwpaDSVjAkiHA-rGrIYcgYoJP910BfhVbjJoiXNKgYddRDTmE1hyof3SrAUtZXykHXYmK3R0GEfsNd7VkImXd6eAKLWdiCXauBQktGXhw5xIUrjgjfpNTxFsyccJojdW3XlSGPiKjB8iGRuXI58Ci6jK5CKbAQoHklADJthm1yQn8ltQNtLQaDfHKHt1JIh0tOeZD-WadQEIHo2bBYJTwlSG-Q"
              />
            </div>
          </motion.div>
        </section>

        {/* Feature Section 1: Meet Your Companions */}
        <section id="companions" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto border-t border-primary-container/10">
          <div className="text-center mb-16 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface">Meet Your Companions</h2>
            <p className="font-sans text-base text-on-surface-variant max-w-lg mx-auto">Small friends for big academic challenges.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companionsLocal.map((comp, idx) => (
              <motion.div 
                key={comp.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onClick={onStartJourney}
                className="bento-card cursor-pointer bg-surface-container-low p-8 rounded-[32px] flex flex-col items-center text-center border border-white group/comp"
              >
                <div className={`w-24 h-24 ${comp.color} rounded-full flex items-center justify-center mb-6 transition-all duration-300 group-hover/comp:scale-110 shadow-inner`}>
                  <span className={`material-symbols-outlined ${comp.iconColor} text-4xl`}>{comp.icon}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface">{comp.name}</h3>
                <p className={`font-sans text-xs font-bold ${comp.iconColor} tracking-wider uppercase mt-1 mb-3`}>
                  {comp.role}
                </p>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {comp.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Feature Section 2: Your Support Circle */}
        <section id="circle" className="py-20 bg-primary-container/5 px-6 sm:px-10">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left side text and benefits */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold font-sans uppercase">
                EMERGENCY RELIEF
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface">Your Support Circle</h2>
              <p className="font-sans text-base md:text-lg text-on-surface-variant leading-relaxed">
                In high-pressure moments, reaching out shouldn't be hard. Safe Haven allows you to designate an "Inner Circle" of up to 5 trusted friends, family members, or mentors.
              </p>
              
              <ul className="space-y-4">
                {[
                  "One-tap \"SOS\" reach out for times of maximum panic",
                  "Shared mood updates with chosen friends automatically",
                  "Encouragement notes and small virtual hugs from your community"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    <span className="font-sans text-base text-on-surface font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Right side Visual Card */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onClick={onStartJourney}
              className="bg-primary-container p-8 md:p-12 rounded-[40px] shadow-xl shadow-primary/10 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute top-0 right-0 p-8">
                <span className="material-symbols-outlined text-on-primary-container text-6xl opacity-15" style={{ fontVariationSettings: "'FILL' 1" }}>
                  diversity_3
                </span>
              </div>
              
              <div className="relative z-10 space-y-6">
                <div className="flex -space-x-3 select-none">
                  {[
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCEgBb_XTYnF3ExpKMdH8fmzHA2sFl3M-eKrHt6-qJqQQ-ZxqkKcoPQYRYywgnhYzFneGNDqDQ0ItBc5PuODRQhXQxh7qXhQaoc_O-Xq-QV6j8HXzarlxsM1zCFsfbyjo6AS3pJdlAqBNIMMt14d-J7kyqzYidrg4qXDDqASZ19p_Wvvrb4mIUu1y2FwIUKLpXTdAJk0CrbRq8foKnB9-gZUAcQN3CMQ9jhU846K23aB4nTdcOLDn5gQUD-o-vDuhSWKIcqztOFI-8",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuDcUJpVRrEIBUWlCODkRg9OZv-4NWnqlhiHEMYiVZ3jE4jCVAdYNvz-zUVzP01aRQZN_YwSSvBwRo4RY4XB7hmvpiJNQiGGTQZMSdH7VHaSaerizHT64KLixFvg1vzXoJSlCiewtnswu6Le4Oss45wDeZ5sMXpFdTkNmKqSsqWDlSMeSpd2CLpMzcFVckpW-3WKm9y9GWegy6AGQ_93PW7UwiGH_f_F313tcEvjNb5Lb3LrKl6PKo_jd1zpW9Ymjd4rlSnGXwb8uj0",
                    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQpoLHFSVh8lgddW9qzyaYVxqBmf4cZ7_K4mtl3EyUTPHN54ijBUOwrvOmdTLdYY4JjfLCBALNXaIRkbCbDw3R1wQINmwjxhsAoQ7_WdXKEVLMj6ug96dlF_zQfOSEkEEiQxY6kDQZD2ecGghit0tcRSteb-YqF4R6O4O-TVIYQ8UV1dP6rJ74t3VeElrlpDzWp08pe12P2bNqiShziPfk4vztnBsiUHIWm9pBFX9jLV5P21aVblymx78lkxc78DC-aTEt19fFhw8"
                  ].map((url, i) => (
                    <div key={i} className="w-16 h-16 rounded-full border-4 border-primary-container bg-surface flex items-center justify-center overflow-hidden soft-shadow">
                      <img alt={`Friend ${i + 1}`} className="w-full h-full object-cover" src={url} referrerPolicy="no-referrer" />
                    </div>
                  ))}
                  <div className="w-16 h-16 rounded-full border-4 border-primary-container bg-white/30 flex items-center justify-center font-sans font-bold text-on-primary-container text-base shadow-inner backdrop-blur-sm select-none">
                    +2
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-display text-2xl font-bold text-on-primary-container">Safe Circle Active</h3>
                  <p className="text-on-primary-container/85 font-sans text-sm">Your 5 companions are ready to support you.</p>
                </div>

                <button className="bg-surface text-primary px-8 py-3 rounded-full font-sans font-bold text-sm tracking-wide shadow-md transition-all duration-300 group-hover:scale-105 active:scale-95 cursor-pointer">
                  Manage Circle
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Section 3: Wellness Toolkit */}
        <section id="toolkit" className="py-20 px-6 sm:px-10 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface">Wellness Toolkit</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">Small rituals for a healthier academic mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Mood Tracker",
                desc: "Log how you feel with simple, wordless interaction. Observe patterns without the pressure of journaling.",
                icon: "mood",
                iconColor: "text-primary"
              },
              {
                title: "Gratitude Journal",
                desc: "Capture one good thing that happened today. Small moments of light build academic resilience over time.",
                icon: "auto_awesome",
                iconColor: "text-secondary"
              },
              {
                title: "Deep Breaths",
                desc: "Guided sessions led by Cirrus. Reset your nervous system in under 60 seconds before a lab or exam.",
                icon: "air",
                iconColor: "text-tertiary"
              }
            ].map((tool, index) => (
              <motion.div 
                key={tool.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                onClick={onStartJourney}
                className="p-8 rounded-[32px] bg-white border border-secondary-container/30 hover:border-primary/20 hover:scale-[1.02] soft-shadow flex flex-col gap-4 bento-card cursor-pointer"
              >
                <div className="w-14 h-14 rounded-2xl bg-background flex items-center justify-center">
                  <span className={`material-symbols-outlined ${tool.iconColor} text-3xl`}>{tool.icon}</span>
                </div>
                <h3 className="font-display text-xl font-bold text-on-surface">{tool.title}</h3>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">{tool.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-12 px-6 sm:px-10 max-w-4xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-surface-container-high rounded-[48px] p-8 md:p-16 space-y-6 border border-white/60 soft-shadow"
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-on-surface">Ready to find your peace?</h2>
            <p className="font-sans text-base md:text-lg text-on-surface-variant max-w-xl mx-auto leading-relaxed">
              Join 2,000+ students navigating academic pressure with a little more grace.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button 
                onClick={onStartJourney}
                className="bg-primary text-on-primary px-8 py-3.5 rounded-full font-sans font-bold text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                Download App
              </button>
              <button 
                onClick={onStartJourney}
                className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-3.5 rounded-full font-sans font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer"
              >
                Learn More
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-surface-container-low mt-20 border-t border-outline-variant/20">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 sm:px-10 gap-8 max-w-7xl mx-auto">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-1 text-primary font-display text-xl font-bold">
              <span className="material-symbols-outlined text-primary text-2xl font-normal">spa</span>
              <span>Safe Haven</span>
            </div>
            <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-normal">
              © 2026 Safe Haven. Your digital sanctuary for academic peace.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 font-sans text-xs font-bold text-on-surface-variant/80">
            <button onClick={onStartJourney} className="hover:underline hover:text-primary transition-all">Privacy Policy</button>
            <button onClick={onStartJourney} className="hover:underline hover:text-primary transition-all">Terms of Service</button>
            <button onClick={onStartJourney} className="hover:underline hover:text-primary transition-all">Emergency Resources</button>
            <button onClick={onStartJourney} className="hover:underline hover:text-primary transition-all">Contact Us</button>
          </div>
        </div>
      </footer>

    </div>
  );
}
