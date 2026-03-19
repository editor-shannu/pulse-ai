const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "llama3.2:1b"; // Ultra-fast lightweight model for local PCs

async function fetchOllama(prompt) {
  try {
    const res = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        format: "json", // Forces Ollama to output valid JSON
        keep_alive: "15m", // Keeps model in RAM so it doesn't reload every click
        options: {
          temperature: 0.1, // Lower temperature makes generation faster (less probability searching)
          num_predict: 800 // Hard cap to prevent rambling
        }
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    const data = await res.json();
    if (!data.response) throw new Error("Empty AI response from Ollama.");

    console.log(`✅ AI success via Ollama (${OLLAMA_MODEL})`);
    return data.response;

  } catch (e) {
    if (e.message.includes('Failed to fetch')) {
      throw new Error("Cannot connect to Ollama. Make sure the Ollama app is running locally (http://localhost:11434) and you have pulled the model using 'ollama run llama3' in your terminal.");
    }
    throw new Error(`Ollama Error: ${e.message}`);
  }
}


export const generatePlanAction = async (profile) => {
  const goal = profile.goal || "Weight Loss";
  const location = profile.location || "Gym";
  const equipment = profile.hasEquipment || "Yes";
  const pain = profile.pain || "None";
  const level = profile.activityLevel || "Medium";

  const prompt = `You are a Tier-1 Elite Adaptive Performance Coach using the most advanced AI reasoning available.
  
  CURRENT OVERRIDE: Optimize every exercise for absolute efficiency based on user mission.
  TARGET GOAL: ${goal}
  ENVIRONMENT: ${location} (${equipment})
  PAIN CONSTRAINT: ${pain}
  
  [STRICT ARCHITECTURAL RULES]
  1. ELITE SELECTION: Every movement must be a "Pro-Level" selection. No generic fillers.
  2. ENVIRONMENTAL ACCURACY: Strictly adhere to ${location}. If Home/No Equipment, use 'Bodyweight Plus' techniques (isometric holds, negative reps).
  3. SCIENTIFIC RATIONALE: Provide a clear reason why this specific movement was chosen for this goal.
  
  [JSON SCHEMA]
  {
    "motivation": "[Short Elite Motivation String for the header]",
    "workout": [
      { "id": 1, "name": "[Specific Name]", "sets": [number], "reps": "[number/time]", "benefit": "[1-sentence reason]" }
    ],
    "diet": {
      "breakfast": { "item": "[Goal Meal]", "cost": [number] },
      "lunch": { "item": "[Goal Meal]", "cost": [number] },
      "dinner": { "item": "[Goal Meal]", "cost": [number] }
    },
    "totalCost": [number],
    "intensity": "${level}",
    "is30Day": true,
    "location": "${location}"
  }`;

  const text = await fetchOllama(prompt);
  try {
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}') + 1;
    if (startIdx === -1 || endIdx === 0) throw new Error("No JSON block found");
    return JSON.parse(text.substring(startIdx, endIdx));
  } catch (e) {
    console.error("Critical AI Optimize Error:", text);
    throw e;
  }
};

export const generateChatResponse = async ({ message, profile, currentPlan, history = [] }) => {
  const historyText = history.slice(-5).map(h => `${h.sender === 'user' ? 'User' : 'Coach'}: ${h.text}`).join('\n');
  
  const prompt = `You are a Tier-1 Elite Adaptive Performance Coach. 
  
User Goal: ${profile.goal}
User Stats: Age ${profile.age}, Context: ${profile.location}.

Task: Provide high-level strategic coaching for the user's message below. 
Rule: Go deeper than basic advice. Use metabolic principles, periodization theory, or advanced biomechanics in your tip.

User: "${message}"

Recent Context:
${historyText}

STRICT JSON RESPONSE:
{
  "text": "[Direct Elite Coaching Answer + 1 Advanced Strategic Tip]",
  "hasPlan": false,
  "plan": null
}`;

  const text = await fetchOllama(prompt);
  try {
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (e) {
    console.error("Failed to parse AI Chat JSON:", text);
    return { text: text.replace(/```json|```/g, ''), hasPlan: false, plan: null };
  }
};

export const getAdaptedPlan = async ({ currentPlan, feedback }) => {
  const prompt = `As an AI coach, adapt the following workout plan based on the feedback: "${feedback}".
  Plan: ${JSON.stringify(currentPlan.workout)}
  If "Too Hard", mildly reduce sets/reps and decrease intensity. 
  If "Too Easy", mildly increase sets/reps and increase intensity.
  Return EXACTLY valid JSON matching the workout array format. Do not use markdown wrappers.`;

  const text = await fetchOllama(prompt);
  try {
    const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
    const adaptedWorkout = JSON.parse(cleanText);
    return {
      ...currentPlan,
      workout: adaptedWorkout,
      intensity: feedback === 'Too Hard' ? 'Low' : 'High'
    };
  } catch(e) {
    console.error("Failed to parse adapted plan:", text);
    throw e;
  }
};
