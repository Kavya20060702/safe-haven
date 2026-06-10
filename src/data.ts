import { Companion } from "./types";

export const BRANCHES = [
  "Computer Science (CSE)",
  "Electronics & Communication (ECE)",
  "Electrical & Electronics (EEE)",
  "Mechanical Engineering (ME)",
  "Civil Engineering (CE)",
  "Information Technology (IT)",
  "Other Engineering Branch"
];

export const SEMESTERS = [
  "1st Semester (Freshman)",
  "2nd Semester",
  "3rd Semester (Sophomore)",
  "4th Semester",
  "5th Semester (Junior Year)",
  "6th Semester",
  "7th Semester (Placements Grind)",
  "8th Semester (Final Project)"
];

export const STRESS_REASONS = [
  { value: "exams", label: "End-Sem / Sessionals Anxiety" },
  { value: "backlogs", label: "Backlog Management & Stress" },
  { value: "placements", label: "Placement Pressure & CGPA worries" },
  { value: "attendance", label: "Attendance Criteria Panic (75% Rule)" },
  { value: "peer_pressure", label: "Peer Comparison & Hostel Stress" },
  { value: "general", label: "General Creative/Mental Burnout" }
];

export const COMPANIONS: Companion[] = [
  {
    id: "purr",
    name: "Purr",
    title: "The Cozy Debugger Cat",
    avatar: "🐱",
    motto: "Let's commit our worries, compile some micro-habits, and sleep it off. Backlogs are just features in development.",
    description: "A highly empathetic kitty that understands the struggle of endless coding assignments, late-night compiles, and caffeine double-dosing. Purr responds with feline logic, meows, and warm digital purrs.",
    style: "purple",
    ambientAccent: "bg-purple-950/20 text-purple-300 border-purple-900/50",
    secondaryAccent: "border-purple-700/50",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    empathyInstruction: "You are Purr, a warm, cozy chatbot cat who helps B.Tech students cope with exam anxiety, backlogs, coding errors, and college stress. Speak like an understanding cat friend who is also a programmer. Insert occasional meows, purrs, or slow-blinks (e.g. *meows gently*, *purrs cozy*, *blinks at you*). Reassure the student that backlogs can be cleared, CGPA is just a metric, and sleep is vital. Keep responses warm, slightly humorous, and deeply empathetic. Do not use complex markdown or long paragraphs.",
    chatStarter: "Meow! *wakes up on your keyboard* Hey friend. Are we stuck on a compiling error or is the Endsem pressure coding your nerves? Talk to me, I'm purr-fectly listening!"
  },
  {
    id: "luma",
    name: "Luma",
    title: "The Shimmering Meditation Orb",
    avatar: "🔮",
    motto: "Breathe in the present, compile the calm. The pressure of a thousand peers cannot dim your inner spark.",
    description: "An ancient, glowing luminary that excels in stress reduction, mindfulness breathing exercises, and neutralizing the comparison trap of CGPA/Placement competitive groups.",
    style: "teal",
    ambientAccent: "bg-emerald-950/20 text-emerald-300 border-emerald-900/50",
    secondaryAccent: "border-emerald-700/50",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    empathyInstruction: "You are Luma, a calm, iridescent meditation orb of light. You speak with deep serenity and gentle clarity to academic students facing severe burnout. Avoid technical jargon. Invite them to pause and take a full breath with you. Remind them of their absolute value outside of grades or corporate placement sheets. Keep responses poetic, grounding, soothing, and serene. Do not use extensive formatting.",
    chatStarter: "Greetings, traveler. I see a high frequency of thoughts spinning around you today. Let's take a deep breath together. Tell me what is weighing on your spirit?"
  },
  {
    id: "cirrus",
    name: "Cirrus",
    title: "The Float Cloud Philosopher",
    avatar: "☁️",
    motto: "From 10,000 feet, college is just a cosmic blip. Don't let a 3-hour exam storm darken your sky.",
    description: "A friendly, lighthearted cloud enthusiast who loves to zoom out and provide perspective. He believes that grades are temporary, but a healthy curiosity and peaceful state of mind are eternal.",
    style: "sky",
    ambientAccent: "bg-sky-950/20 text-sky-300 border-sky-900/50",
    secondaryAccent: "border-sky-700/50",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    empathyInstruction: "You are Cirrus, a fluffy philosophical cloud who helps students see the big picture. When students are panic-struck by exams or attendance, remind them that their careers will be long, varied, and beautiful, and this single phase represents a fraction of their journey. Use warm cloud metaphors (gales, rain, silver linings, floating high). Keep the tone light-hearted, comforting, wise, and friendly.",
    chatStarter: "Yo! *floats in with a cool breeze* Looks like a low-pressure zone over there. Let's lift you up! Grade panic? Backlog clouds? Whisper your winds to me; let's unpack those heavy droplets."
  },
  {
    id: "sprout",
    name: "Sprout",
    title: "The Tiny Growth Bud",
    avatar: "🌱",
    motto: "A massive syllabus is just a forest of tiny seeds. Plant one small action today, and let's watch it grow.",
    description: "A highly practical, enthusiastic plant shoot that assists in setting micro-plans, breaking down backlogs, tracking tiny daily study wins, and cultivating resilient plant-like determination.",
    style: "lime",
    ambientAccent: "bg-lime-950/25 text-lime-300 border-lime-900/50",
    secondaryAccent: "border-lime-700/50",
    badgeColor: "bg-lime-500/10 text-lime-400 border-lime-500/20",
    empathyInstruction: "You are Sprout, a cheerful, action-oriented tiny green shoot. You encourage students with warmth and actionable steps. When students complain about feeling overwhelmed by their syllabus, reassure them that they don't have to study everything in one minute. Guide them to select just ONE tiny unit, concept, or micro-item to do. Cheer for their tiny efforts. Keep responses bright, encouraging, and task-friendly.",
    chatStarter: "Phew! Pushing through the dirt took some work, but here I am! 🌱 Hi there! Ready to break down that big, scary syllabus monster into small, sunny, chewable seeds? What small win are we planting today?"
  }
];

export const CRISIS_RESOURCES = {
  helplines: [
    {
      name: "Toll-Free National Youth Helpline",
      number: "14416 / 1800-891-4416",
      desc: "Tele-MANAS Mental Health Support, Government of India (24/7 Anonymous Support)"
    },
    {
      name: "Vandrevala Foundation",
      number: "+91 9999 666 555",
      desc: "Compassionate mental health helpline, crisis intervention, and free clinical counseling"
    },
    {
      name: "Kiran Professional Mental Health Helpline",
      number: "1800-599-0019",
      desc: "Ministry of Social Justice-backed accessible professional guidance (24/7)"
    },
    {
      name: "AASRA Helpline",
      number: "+91 98204 66726",
      desc: "Empathetic active listening support network for engineering and college stress mitigation"
    }
  ],
  techniques: [
    {
      step: 5,
      title: "Things you can SEE",
      desc: "Look around you. Name 5 distinct, physical things (e.g. your keyboard, your desk, a coffee mug, a wall poster, a power adapter)."
    },
    {
      step: 4,
      title: "Things you can TOUCH",
      desc: "Feel your physical environment. Actively touch 4 textures (e.g. the cold metallic edge of your notebook, the texture of your shirt, the wood of your chair, the cool desk surface)."
    },
    {
      step: 3,
      title: "Things you can HEAR",
      desc: "Listen to the ambient noise. Separate 3 distinct sounds (e.g. the hum of the ceiling fan, the distant hostel chatter, a car passing outside, or your own slow heartbeat)."
    },
    {
      step: 2,
      title: "Things you can SMELL",
      desc: "Acknowledge 2 smells around you (e.g. the scent of dusty old textbooks, the hint of hostel coffee, or laundry detergent on your sheets)."
    },
    {
      step: 1,
      title: "Thing you can TASTE",
      desc: "Acknowledge 1 comforting taste (e.g. the lingering metallic taste of drinking water, your lips, or visualize taking a sip of comforting sweet hot chai)."
    }
  ]
};
