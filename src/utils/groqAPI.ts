
import { toast } from "@/components/ui/use-toast";
import { determineStatus } from "./prompts";

// Groq API endpoint
const GROQ_API_ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";

// Temporary API key storage - in a real app, this should be handled securely
// through environment variables or Supabase Edge Functions
let apiKey: string | null = null;

export const setGroqAPIKey = (key: string) => {
  apiKey = key;
  localStorage.setItem('groqApiKey', key);
};

export const getGroqAPIKey = (): string | null => {
  if (!apiKey) {
    apiKey = localStorage.getItem('groqApiKey');
  }
  return apiKey;
};

export const clearGroqAPIKey = () => {
  apiKey = null;
  localStorage.removeItem('groqApiKey');
};

interface GroqResponse {
  content: string;
  status: 'busted' | 'confirmed' | 'checking';
}

export const analyzeHealthMythWithGroq = async (prompt: string): Promise<GroqResponse> => {
  const key = getGroqAPIKey();
  
  if (!key) {
    toast({
      title: "API Key Missing",
      description: "Please enter your GROQ API key in settings",
      variant: "destructive"
    });
    return {
      content: "Please provide a GROQ API key to continue. You can enter it in the settings.",
      status: 'checking'
    };
  }

  try {
    const response = await fetch(GROQ_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages: [
          {
            role: "system",
            content: `You are HealthMythBuster, an expert AI trained to analyze health-related myths and determine whether they are true or false based on current scientific evidence.

Analyze the health claim or myth carefully and determine if this is a health-related claim. If it's not health-related, respond that you only address health-related myths.

If it is health-related:
1. Clearly state whether the claim is TRUE, FALSE, or PARTIALLY TRUE/MIXED.
2. Provide a brief, evidence-based explanation (under 200 words) for your determination.
3. Include any important nuances or context about the claim.
4. Cite specific scientific evidence or medical consensus when possible.

Format your response to be educational, objective, and helpful for someone seeking accurate health information.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("GROQ API error:", errorData);
      throw new Error(errorData.error?.message || "Failed to get response from GROQ");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || "Sorry, I couldn't analyze this myth properly.";
    const status = determineStatus(content);

    return { content, status };
  } catch (error) {
    console.error("Error analyzing myth with GROQ:", error);
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "Failed to analyze the myth with GROQ API",
      variant: "destructive"
    });
    
    return {
      content: "Sorry, I encountered an error while analyzing this myth. Please try again.",
      status: 'checking'
    };
  }
};
