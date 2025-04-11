
import { useState } from 'react';
import { createMythBusterPrompt, determineStatus } from '@/utils/prompts';
import { useToast } from '@/components/ui/use-toast';

// Simulated response since we can't directly integrate with Grok API in this demo
// In a real implementation, this would make actual API calls to Grok
const simulateGrokResponse = async (prompt: string) => {
  console.log("Prompt sent to Grok:", prompt);
  
  // Wait for a realistic delay
  await new Promise((resolve) => setTimeout(resolve, 2000));
  
  // Extract the myth from the prompt
  const mythMatch = prompt.match(/"([^"]*)"/);
  const myth = mythMatch ? mythMatch[1] : '';
  
  // Some predetermined responses for common health myths
  const commonMyths: Record<string, { response: string }> = {
    "drinking water cures cancer": {
      response: "FALSE. While proper hydration is important for overall health, drinking water does not cure cancer. Cancer treatment requires medical interventions such as surgery, chemotherapy, radiation therapy, immunotherapy, or other evidence-based approaches depending on the type and stage of cancer. Hydration can help manage some treatment side effects, but water itself has no direct anti-cancer properties. Patients with cancer should follow treatment plans prescribed by healthcare professionals and not rely on unproven remedies.",
    },
    "vitamin c prevents colds": {
      response: "PARTIALLY TRUE. Vitamin C does not prevent colds in the general population, according to multiple systematic reviews. However, research suggests it may slightly reduce the duration and severity of cold symptoms in some people. Regular vitamin C supplementation might benefit specific groups like marathon runners or those exposed to extreme physical stress or cold environments, where it may help reduce their risk of developing colds. For most people, though, taking vitamin C supplements after cold symptoms appear shows little benefit.",
    },
    "vaccines cause autism": {
      response: "FALSE. There is no credible scientific evidence that vaccines cause autism. This myth originated from a fraudulent 1998 study that was retracted due to ethical violations and manipulated data. Since then, numerous large-scale studies involving millions of children have thoroughly investigated this claim and found no link between vaccines and autism. Scientific consensus from organizations like the CDC, WHO, and medical associations worldwide confirms vaccines are safe and do not cause autism. Vaccines undergo rigorous safety testing and continue to be monitored for adverse effects.",
    }
  };
  
  // Simple naive match for demo purposes
  let responseText = "";
  for (const key in commonMyths) {
    if (myth.toLowerCase().includes(key)) {
      responseText = commonMyths[key].response;
      break;
    }
  }
  
  // If no match is found, generate a generic response
  if (!responseText) {
    if (!isHealthRelated(myth)) {
      responseText = "I'm specifically trained to address health-related myths and claims. The statement you provided doesn't appear to be directly related to health or medical information. Please try asking about a health claim, such as those related to nutrition, diseases, treatments, or wellness practices.";
    } else {
      // Random response for demo purposes
      const responses = [
        "FALSE. Current scientific evidence does not support this claim. Multiple peer-reviewed studies have investigated this belief and found no significant evidence to back it up. Medical professionals and health organizations generally advise against following this practice as it may distract from seeking proven treatments.",
        "TRUE. This is supported by substantial scientific evidence. Multiple peer-reviewed studies have confirmed this claim, and it aligns with guidance from major medical organizations. However, it's important to note that individual responses may vary, and this should be part of a broader health approach.",
        "PARTIALLY TRUE. While there is some truth to this claim, it's more nuanced than a simple yes or no. Some studies show limited benefits under specific conditions, but the evidence isn't strong enough for broad recommendations. Medical consensus suggests considering this as one factor among many in health decisions, rather than a definitive rule."
      ];
      responseText = responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  return { text: responseText };
};

// Simple check for health-related content
const isHealthRelated = (text: string): boolean => {
  const healthTerms = ['health', 'medical', 'disease', 'doctor', 'medicine', 'treatment', 
                      'cure', 'symptom', 'diet', 'exercise', 'vitamin', 'nutrition', 
                      'hospital', 'drug', 'therapy', 'wellness', 'body', 'heart', 'brain',
                      'cancer', 'diabetes', 'blood', 'pressure', 'cholesterol', 'vaccine',
                      'immune', 'pain', 'sleep', 'mental', 'anxiety', 'depression'];
  
  return healthTerms.some(term => text.toLowerCase().includes(term));
};

export const useGrokAPI = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const analyzeHealthMyth = async (myth: string) => {
    setIsLoading(true);
    
    try {
      const prompt = createMythBusterPrompt(myth);
      const response = await simulateGrokResponse(prompt);
      const status = determineStatus(response.text);
      
      return {
        content: response.text,
        status
      };
    } catch (error) {
      console.error('Error analyzing myth:', error);
      toast({
        title: "Error",
        description: "Failed to analyze the myth. Please try again.",
        variant: "destructive"
      });
      return {
        content: "Sorry, I encountered an error while analyzing this myth. Please try again.",
        status: 'checking' as const
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeHealthMyth, isLoading };
};
