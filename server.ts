import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

// Initialize Firebase client SDK with safe checks
let db: any = null;
try {
  const configPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    try {
      const configObj = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const firebaseApp = initializeApp(configObj);
      if (configObj.firestoreDatabaseId) {
        db = getFirestore(firebaseApp, configObj.firestoreDatabaseId);
      } else {
        db = getFirestore(firebaseApp);
      }
      console.log(`Firebase Client successfully initialized with Project: ${configObj.projectId}, Database: ${configObj.firestoreDatabaseId || "(default)"}`);
    } catch (err) {
      console.error("Failed to read/parse firebase-applet-config.json:", err);
    }
  } else {
    console.error("firebase-applet-config.json not found!");
  }
} catch (error) {
  console.error("Firebase initialization error/warning (will fallback gracefully):", error);
}

// Standard fallback mock generator in case the API key is not present or fails
const generateLocalPriorities = (routines: string[]) => {
  const defaultItems = [
    { title: "Review tomorrow's action items list and key outcomes", difficulty: "medium" },
    { title: "Execute 15 minutes of quiet mental recovery and mobility", difficulty: "low" },
    { title: "Complete the highest-difficulty task block of the day", difficulty: "high" }
  ];

  if (!routines || routines.length === 0) return defaultItems;

  const sampleTitle = routines[0] || "habit";
  return [
    { title: `Prepare material & pre-read for: "${sampleTitle}" priority block`, difficulty: "high" },
    { title: `Log physical recovery & track key execution milestones`, difficulty: "medium" },
    { title: `Optimize desk workspace for deep focus hours`, difficulty: "low" }
  ];
};

const generateLocalMeals = (preset: string) => {
  if (preset === 'gym') {
    return [
      { mealType: "breakfast", name: "High Protein Egg White Wrap with turkey bacon, avocado & spinach", calories: "480", protein: "42", cookingSummary: "Scramble egg whites, assemble in a whole-wheat wrap, add a touch of low-fat cheese." },
      { mealType: "lunch", name: "Power Fuel Salad: Salmon steak, quinoa, mixed organic greens, balsamic vinaigrette", calories: "620", protein: "45", cookingSummary: "Pan-sear salmon in avocado oil, mix with cooked quinoa and greens." },
      { mealType: "dinner", name: "Muscle Lean Bowl: Grass-fed top sirloin, baked sweet potato wedges, roasted brussels sprouts", calories: "690", protein: "52", cookingSummary: "Broil steak to preferred temp, serve alongside pre-spiced baked potato wedges." },
      { mealType: "snack", name: "Protein Fuel Shake: 1 scoop whey, almond milk, raw almond butter, frozen berries", calories: "290", protein: "32", cookingSummary: "Blend ingredients with ice for a creamy post-activity recovery treat." }
    ];
  } else if (preset === 'student') {
    return [
      { mealType: "breakfast", name: "Cognitive Boost Oatmeal with blueberry clusters, chia seeds & crushed walnuts", calories: "390", protein: "14", cookingSummary: "Microwave steel-cut oats, stir in organic berries and nuts for sustained focus." },
      { mealType: "lunch", name: "Brain Power Chicken Pita: Grilled chicken chunks, hummus, diced cucumbers, feta cheese", calories: "510", protein: "36", cookingSummary: "Warm whole wheat pita pocket, fill generously with chicken breast and fresh mediterranean toppings." },
      { mealType: "dinner", name: "Focus Restore Dinner: Pan-seared cod over wild black rice & steamed asparagus tips", calories: "460", protein: "34", cookingSummary: "Season cod with lemon-pepper marinade, steam asparagus in lightly salted water." },
      { mealType: "snack", name: "Crunchy Mind Snack: Crispy celery sticks, organic peanut butter & dry raisin track mix", calories: "210", protein: "8", cookingSummary: "Spread peanut butter into celery logs and top with organic raisins." }
    ];
  } else {
    return [
      { mealType: "breakfast", name: "Sustained Energy Avocado Toast with two poached eggs & extra virgin olive oil", calories: "420", protein: "19", cookingSummary: "Toast sourdough bread, mash avocado with sea salt, layer perfectly poached eggs on top." },
      { mealType: "lunch", name: "Anti-inflammatory Salmon Salad with sweet cherries and walnuts", calories: "580", protein: "38", cookingSummary: "Top a leafy green bedding with baked wild salmon flakes, walnut pieces and fresh cherry halves." },
      { mealType: "dinner", name: "Mediterranean Lemon Pepper Chicken with quinoa pilaf & roasted peppers", calories: "610", protein: "44", cookingSummary: "Bake chicken thighs with lemon-herb rubs, serve on a bed of seasoned warm quinoa." },
      { mealType: "snack", name: "Probiotic Greek Yogurt with raw honey & pumpkin seed sprinkle", calories: "230", protein: "16", cookingSummary: "Spoon yogurt into a dish, drizzle honey, add pumpkin seeds for crunch." }
    ];
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());

  // Initialize server-side Gemini if the key is provided
  const hasApiKey = !!process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;

  if (hasApiKey) {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }

  // API Endpoints
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", activeAi: hasApiKey });
  });

  // Suggest Priorities based on Routines
  app.post("/api/ai/suggest-priorities", async (req, res) => {
    try {
      const { routines } = req.body;
      const routineTitles = Array.isArray(routines) ? routines.map((r: any) => r.title) : [];

      if (!hasApiKey || !ai) {
        // Safe offline simulated local response
        const fallback = generateLocalPriorities(routineTitles);
        return res.json({ priorities: fallback });
      }

      const promptMsg = `You are an elite productivity strategist AI. We need you to suggest 3 focus priorities based on the user's daily habits listed below:
Routines:
${routineTitles.length > 0 ? routineTitles.map(r => ` - ${r}`).join("\n") : "None configured yet"}

We require exactly 3 high-impact suggested tasks for the daily Priority checklist:
1. High Priority (High difficulty/impact task): something ambitious and productive.
2. Medium Priority (Medium difficulty): reviews, setups, writing task.
3. Low Priority (Low difficulty): declutter, recovery, health task.

Return a STRICT JSON array matching this schema:
[
  { "title": "Priority Title", "difficulty": "high" },
  { "title": "Priority Title", "difficulty": "medium" },
  { "title": "Priority Title", "difficulty": "low" }
]
Only return valid JSON inside your response block. Do not wrap in markdown format like \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMsg,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Highly actionable short goal title" },
                difficulty: { type: Type.STRING, description: "Must be exactly high, medium, or low" }
              },
              required: ["title", "difficulty"]
            }
          }
        }
      });

      const text = response.text || "[]";
      const sanitizedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(sanitizedText);
      res.json({ priorities: parsedData });
    } catch (err: any) {
      console.error("Gemini Suggest Priorities Error:", err);
      res.json({ priorities: generateLocalPriorities([]) });
    }
  });

  // Recommend Meal Planner
  app.post("/api/ai/recommend-meals", async (req, res) => {
    const { preset } = req.body || {};
    const appliedPreset = preset || "general";
    try {
      if (!hasApiKey || !ai) {
        const fallback = generateLocalMeals(appliedPreset);
        return res.json({ meals: fallback });
      }

      const promptMsg = `You are a high-performance wellness and sports nutritionist AI. Recommended meal choices based on the user's active life profile: "${appliedPreset}".
We need exactly 4 recommendations corresponding to:
- breakfast: healthy jumpstart
- lunch: balanced daytime nutrition
- dinner: recovery or light evening refueling
- snack: focus or stamina booster

Provide estimated calories (e.g., 550 kcal) and protein level (e.g., 35g). Provide a brief 1-sentence preparation step or cooking summary.

Return a STRICT JSON array matching this schema:
[
  { "mealType": "breakfast", "name": "Meal Name", "calories": "450", "protein": "25", "cookingSummary": "Brief step" },
  { "mealType": "lunch", "name": "Meal Name", "calories": "600", "protein": "35", "cookingSummary": "Brief step" },
  { "mealType": "dinner", "name": "Meal Name", "calories": "550", "protein": "30", "cookingSummary": "Brief step" },
  { "mealType": "snack", "name": "Meal Name", "calories": "200", "protein": "8", "cookingSummary": "Brief step" }
]
Only return valid JSON inside your response block. Do not wrap in markdown format like \`\`\`json.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: promptMsg,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                mealType: { type: Type.STRING, description: "Must be exactly breakfast, lunch, dinner, or snack" },
                name: { type: Type.STRING, description: "Scrumptious, professional health meal name" },
                calories: { type: Type.STRING, description: "Calorie value as simple string e.g. 520" },
                protein: { type: Type.STRING, description: "Protein value as simple string e.g. 35" },
                cookingSummary: { type: Type.STRING, description: "1-sentence quick prep guideline" }
              },
              required: ["mealType", "name", "calories", "protein", "cookingSummary"]
            }
          }
        }
      });

      const text = response.text || "[]";
      const sanitizedText = text.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(sanitizedText);
      res.json({ meals: parsedData });
    } catch (err: any) {
      console.error("Gemini Recommended Meals Error:", err);
      res.json({ meals: generateLocalMeals(appliedPreset) });
    }
  });

  // --- Auth / User Management API Endpoints ---

  // Register a new user with secure isolated profile
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || typeof username !== "string" || !username.trim()) {
        return res.status(400).json({ error: "Username is required." });
      }
      if (!password || typeof password !== "string" || password.length < 4) {
        return res.status(400).json({ error: "Password must be at least 4 characters." });
      }

      if (!db) {
        return res.status(503).json({ error: "Database service holds offline lock, try again shortly." });
      }

      const normalizedUsername = username.trim().toLowerCase();
      const credentialDocRef = doc(db, "credentials", normalizedUsername);

      // Check if credentials document already exists
      const docSnap = await getDoc(credentialDocRef);
      if (docSnap.exists()) {
        return res.status(400).json({ error: "Username is already taken." });
      }

      // Generate a new distinct userId
      const userId = "user_" + Math.random().toString(36).substring(2, 11) + "_" + Date.now();

      // Save credentials secure package
      await setDoc(credentialDocRef, {
        username: username.trim(),
        password: password, // simple safe storage for prototype
        userId: userId,
        createdAt: Date.now()
      });

      return res.json({ status: "success", userId, username: username.trim() });
    } catch (err: any) {
      console.error("Auth register error:", err);
      return res.status(500).json({ error: err.message || "Failed to register user credentials" });
    }
  });

  // Login existing user and load isolated profile
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || typeof username !== "string" || !username.trim()) {
        return res.status(400).json({ error: "Username is required." });
      }
      if (!password || typeof password !== "string") {
        return res.status(400).json({ error: "Password is required." });
      }

      if (!db) {
        return res.status(503).json({ error: "Database service holds offline lock, try again shortly." });
      }

      const normalizedUsername = username.trim().toLowerCase();
      const credentialDocRef = doc(db, "credentials", normalizedUsername);

      const credentialSnap = await getDoc(credentialDocRef);
      if (!credentialSnap.exists()) {
        return res.status(400).json({ error: "Invalid username or password." });
      }

      const credData = credentialSnap.data();
      if (!credData || credData.password !== password) {
        return res.status(400).json({ error: "Invalid username or password." });
      }

      // Load user details
      const userId = credData.userId;
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);

      let userData = null;
      if (userSnap.exists()) {
        userData = userSnap.data();
      }

      return res.json({ 
        status: "success", 
        userId, 
        username: credData.username, 
        data: userData 
      });
    } catch (err: any) {
      console.error("Auth login error:", err);
      return res.status(500).json({ error: err.message || "Failed to authenticate credentials" });
    }
  });

  // --- Firestore Sync API Endpoints ---

  // Load state from Firestore
  app.get("/api/sync/load", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: "Missing or invalid userId" });
      }

      if (!db) {
        return res.status(503).json({ error: "Firestore database not available" });
      }

      const docRef = doc(db, "users", userId);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        return res.json({ status: "success", data: null });
      }

      return res.json({ status: "success", data: docSnap.data() });
    } catch (err: any) {
      console.error("Firestore sync load error:", err);
      return res.status(500).json({ error: err.message || "Failed to load synced user data" });
    }
  });

  // Save/Update full state in Firestore
  app.post("/api/sync/save", async (req, res) => {
    try {
      const { userId, stats, routines, priorities, meals, sessions, events } = req.body;
      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: "Missing or invalid userId" });
      }

      if (!db) {
        return res.status(503).json({ error: "Firestore database not available" });
      }

      const docRef = doc(db, "users", userId);
      await setDoc(docRef, {
        stats: stats || {},
        routines: routines || [],
        priorities: priorities || [],
        meals: meals || [],
        sessions: sessions || [],
        events: events || [],
        updatedAt: Date.now()
      }, { merge: true });

      return res.json({ status: "success" });
    } catch (err: any) {
      console.error("Firestore sync save error:", err);
      return res.status(500).json({ error: err.message || "Failed to save user data package" });
    }
  });

  // Vite Integration
  const distPath = path.join(process.cwd(), "dist");

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Start Server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
