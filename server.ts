import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GoogleGenAI Client
let genAIClient: GoogleGenAI | null = null;
let isGeminiBlocked = false;

function getGenAI(): GoogleGenAI | null {
  if (isGeminiBlocked) {
    return null;
  }
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Local rule-based analyzer for offline fallbacks
function analyzeSentimentLocal(text: string): "happy" | "calm" | "concerned" {
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
    msg.includes("tired") ||
    msg.includes("overwhelmed") ||
    msg.includes("pressure") ||
    msg.includes("hostel") ||
    msg.includes("depression") ||
    msg.includes("cry") ||
    msg.includes("hopeless")
  ) {
    return "concerned";
  }
  if (
    msg.includes("breathe") ||
    msg.includes("meditate") ||
    msg.includes("quiet") ||
    msg.includes("calm") ||
    msg.includes("sleep") ||
    msg.includes("rest") ||
    msg.includes("breathing") ||
    msg.includes("peace") ||
    msg.includes("relax")
  ) {
    return "calm";
  }
  if (
    msg.includes("happy") ||
    msg.includes("yes") ||
    msg.includes("cleared") ||
    msg.includes("success") ||
    msg.includes("love") ||
    msg.includes("thank") ||
    msg.includes("good") ||
    msg.includes("great") ||
    msg.includes("won") ||
    msg.includes("pass") ||
    msg.includes("compiled") ||
    msg.includes("celebrate") ||
    msg.includes("haha") ||
    msg.includes("smile")
  ) {
    return "happy";
  }
  return "calm"; // default pleasant companion resting state
}

// Simulated local response generator for offline fallback/testing
function generateLocalFallback(companionId: string, userMessage: string): string {
  const msg = userMessage.toLowerCase();
  
  if (companionId === "purr") {
    if (msg.includes("backlog") || msg.includes("fail")) {
      return "*purrs loudly* Hey friend, I hear you. Backlogs feel like a massive stack overflow in your brain. But remember, a B.Tech degree is a marathon. A backlog is just a feature with a delayed release. Let's tackle one tiny module tomorrow. For now, close your editor and let me sleep on your lap. *meows warm*";
    }
    if (msg.includes("placement") || msg.includes("job") || msg.includes("cgpa")) {
      return "Meow. Placement drives are basically competitive coding puzzles designed by corporate kittens. Your CGPA is just a compiler warning—it doesn't mean your life has code execution errors. Take a breath, write a clean resume, and let's get some warm treats. *stretches lazily*";
    }
    if (msg.includes("stress") || msg.includes("anxious") || msg.includes("burnout")) {
      return "*offers you a soft cat paw* Error: Infinite Stress Loop detected. Recommended fix: Drink warm tea, play with some yarn, or just close your laptop. Everything will compile fine in the end. Meow!";
    }
    return "*licks its paw and slow-blinks* Meow, standard input received! B.Tech life is highly non-linear, but you are doing great. Want to hear a joke? Why do programmers wear glasses? Because they can't C#! Let's write some cleaner sleep schedules tonight!";
  }
  
  if (companionId === "luma") {
    if (msg.includes("backlog") || msg.includes("fail") || msg.includes("exam")) {
      return "*glows with a warm amber pulse* Feel the weight of these exams in your chest. Close your eyes, and let it dissolve. You are a star experiencing a brief academic fog. The grade sheet has no capacity to hold your brilliance. Breathe in... let the past cycle fade, and step into the present.";
    }
    if (msg.includes("stress") || msg.includes("anxious") || msg.includes("nervous")) {
      return "*radiates serene, oscillating waves of green light* Let's anchor ourselves. Breathe in for 4 seconds... hold for 4... exhale for 4. The storm of academic peer comparison is just wild wind. You are safe. You are grounded here with me.";
    }
    return "*pulses with a calm, slow light* Every step you take is a transition of learning. Do not rush to the final code. Talk to me about what inspires you, or simply let the quiet glow envelop your worries.";
  }
  
  if (companionId === "cirrus") {
    if (msg.includes("backlog") || msg.includes("placement") || msg.includes("exam")) {
      return "*floats upside down cheerfully* Whoa, that's a heavy storm cloud you're dragging! Let's float up to 10,000 feet. In five years, this specific sessional exam or CGPA drop is gonna look like a tiny dust speck on your bumper. Let's make a funny face, shake off the gravity, and remember you're a human first, engineer second! *blows a light breeze*";
    }
    if (msg.includes("attendance") || msg.includes("75%")) {
      return "Ah, the legendary 75% attendance rule. A true classic of administrative wizardry! While we can't vaporize the dean, we can definitely float through the lectures with some creative daydreaming. Let's focus on the classes that spark joy, and survive the rest with a fluffy smile!";
    }
    return "*creates a tiny rainbow* The thing about clouds is, we never stand still, and neither does your stress. This week is tough, next week is a breeze. Let's ride the currents together! What's one happy thing that happened today?";
  }
  
  if (companionId === "sprout") {
    if (msg.includes("backlog") || msg.includes("exam") || msg.includes("syllabus") || msg.includes("overwhelmed")) {
      return "*rustles its tiny green leaves enthusiastically* Oh! I know! That syllabus is like a dense jungle! But wait! We don't have to eat the whole forest. Let's plant ONE seed. What is the title of the very first chapter? Just read the list of definitions. That is a massive growth step! I'm cheering so hard for you! 🌱";
    }
    if (msg.includes("stress") || msg.includes("anxious") || msg.includes("tired")) {
      return "Hey, tiny bud! Even the tallest banyans started with a sleepy seed resting in warm, quiet soil. It's okay to feel tired. Let's hydrate! Drink a glass of water right now, stretch your branches up high, and let's try again in five minutes.";
    }
    return "*sprouts a small virtual flower* Yes! Growth is slow, but it is happening. Let's write down just ONE tiny study task for today—something so small that it's impossible to fail. Tell me, what's a small task you can crush right now?";
  }

  return "I am here, listening. B.Tech life is full of challenges, but you have survived 100% of your worst compilation errors so far. Let's take a peaceful step forward together.";
}

// POST endpoint to handle proxying to Google GenAI
app.post("/api/companion/chat", async (req, res) => {
  const { companionId, systemInstruction, history, userText } = req.body || {};
  try {
    if (!companionId || !userText) {
      return res.status(400).json({ error: "Missing required parameters: companionId, userText" });
    }

    const ai = getGenAI();
    const localEmotion = analyzeSentimentLocal(userText);

    // Fallback if no real API key is supplied
    if (!ai) {
      const fallbackReply = generateLocalFallback(companionId, userText);
      // Wait slightly to simulate server environment
      await new Promise((resolve) => setTimeout(resolve, 800));
      return res.json({ text: fallbackReply, emotion: localEmotion });
    }

    // Format UI message history to the Gemini SDK requirements
    interface ChatMessagePart {
      role: "user" | "model";
      parts: { text: string }[];
    }
    
    const formattedHistory: ChatMessagePart[] = [];
    
    if (Array.isArray(history) && history.length > 0) {
      // Gemini chat history MUST start with a 'user' turn.
      // If the first message is from the model (such as the default welcome message),
      // we prepend a user greeting so the alternating pattern is valid.
      if (history[0].role !== "user") {
        formattedHistory.push({
          role: "user",
          parts: [{ text: "Hello!" }],
        });
      }

      history.forEach((msg: any) => {
        const mappedRole = msg.role === "user" ? "user" : "model";
        // Enforce alternating roles: if the last element in history has the same role,
        // merge their parts instead of creating consecutive duplicate roles.
        if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === mappedRole) {
          formattedHistory[formattedHistory.length - 1].parts[0].text += "\n" + msg.text;
        } else {
          formattedHistory.push({
            role: mappedRole,
            parts: [{ text: msg.text || "" }],
          });
        }
      });
    }

    // Append current user message text
    if (formattedHistory.length > 0 && formattedHistory[formattedHistory.length - 1].role === "user") {
      formattedHistory[formattedHistory.length - 1].parts[0].text += "\n" + userText;
    } else {
      formattedHistory.push({
        role: "user",
        parts: [{ text: userText }],
      });
    }

    // We append a structured JSON output instruction
    const fullSystemInstruction = systemInstruction + 
      "\nYou MUST respond in a structured JSON format containing two fields: " +
      '"reply" (the text response, empathetic, comforting, using your character traits) ' +
      'and "emotion" (the expression value representing your state in reaction to user statement. Must be one of: "happy", "calm", "concerned").';

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: formattedHistory,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description: "The companion's empathetic response.",
            },
            emotion: {
              type: Type.STRING,
              description: "The companion's emotional state inside standard options.",
            }
          },
          required: ["reply", "emotion"]
        }
      },
    });

    const responseText = response.text?.trim() || "";
    try {
      const parsed = JSON.parse(responseText);
      const cleanedEmotion = ["happy", "calm", "concerned"].includes(parsed.emotion) ? parsed.emotion : localEmotion;
      return res.json({ text: parsed.reply || responseText, emotion: cleanedEmotion });
    } catch (e) {
      return res.json({ text: responseText, emotion: localEmotion });
    }

  } catch (error: any) {
    const errorStr = String(error?.stack || error?.message || error || "");
    if (errorStr.includes("403") || errorStr.includes("PERMISSION_DENIED") || errorStr.includes("denied")) {
      isGeminiBlocked = true;
    }
    console.log("Notice: Interactive companion active in offline empathy mode.");
    const localEmotion = analyzeSentimentLocal(userText);
    const fallbackReply = generateLocalFallback(companionId, userText);
    return res.json({ text: fallbackReply, emotion: localEmotion });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
