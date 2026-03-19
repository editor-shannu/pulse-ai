/**
 * PulseAI High-Precision Plan Extractor
 * Uses Gemini 1.5 Flash via Optimized REST bridge for Vite Stability.
 * Follows strict structured output instructions.
 */

const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "llama3.2:1b";

export const extractWorkoutPlan = async (userInput, userProfile) => {
  const prompt = `
    You are a high-precision fitness data extractor. 
    Task: Extract or generate a structured workout plan based EXACTLY on the user's input.
    Rule: NO random exercises. Only use scientifically proven movements suitable for: ${userProfile.goal}.
    
    User Input: "${userInput}"
    User Profile: Age ${userProfile.age}, Goal: ${userProfile.goal}, Pain: ${userProfile.pain || 'None'}.

    Response MUST be a valid JSON object matching this schema exactly:
    {
      "workout": [
        { "id": number, "name": "string", "sets": number, "reps": "string", "completed": false }
      ],
      "diet": {
        "breakfast": { "item": "string", "cost": number },
        "lunch": { "item": "string", "cost": number },
        "dinner": { "item": "string", "cost": number }
      },
      "intensity": "Low|Medium|High",
      "isCalibrated": true
    }

    Return ONLY the JSON. No conversational text.
  `;

  try {
    const response = await fetch(OLLAMA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        format: "json", // Forces Ollama into JSON mode
        keep_alive: "15m", // Keeps model pre-loaded in memory for instant subsequent answers
        options: {
          temperature: 0.1, // Near-zero for deterministic extraction
          num_predict: 800 // Hard cap memory footprint
        }
      })
    });

    if (!response.ok) throw new Error("Ollama extraction failed.");
    
    const data = await response.json();
    return JSON.parse(data.response);
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      console.error("Make sure Ollama is running locally!");
    } else {
      console.error("Extraction Error:", error);
    }
    return null;
  }
};
