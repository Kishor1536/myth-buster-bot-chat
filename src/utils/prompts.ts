
export const createMythBusterPrompt = (myth: string) => {
  return `You are HealthMythBuster, an expert AI trained to analyze health-related myths and determine whether they are true or false based on current scientific evidence. 

Analyze the following health claim or myth carefully:
"${myth}"

First, determine if this is a health-related claim. If it's not health-related, respond that you only address health-related myths.

If it is health-related:
1. Clearly state whether the claim is TRUE, FALSE, or PARTIALLY TRUE/MIXED.
2. Provide a brief, evidence-based explanation (under 200 words) for your determination.
3. Include any important nuances or context about the claim.
4. Cite specific scientific evidence or medical consensus when possible.

Format your response to be educational, objective, and helpful for someone seeking accurate health information.`;
};

// Helper function to determine myth status based on response
export const determineStatus = (response: string): 'busted' | 'confirmed' | 'checking' => {
  const lowerCase = response.toLowerCase();
  
  if (lowerCase.includes('false') && !lowerCase.includes('true')) {
    return 'busted';
  } else if (lowerCase.includes('true') && !lowerCase.includes('false')) {
    return 'confirmed';
  } else if (
    lowerCase.includes('partially true') || 
    lowerCase.includes('mixed') || 
    (lowerCase.includes('true') && lowerCase.includes('false'))
  ) {
    return 'confirmed'; // For partially true, we'll still mark as 'confirmed' but with nuance in the text
  }
  
  return 'checking';
};
