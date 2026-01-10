/**
 * OpenAI helper functions for generating parenting scripts and plans
 */

import OpenAI from 'openai';
import { GenerateScriptResponse, GeneratePlanResponse } from './types';
import { calculateAge } from './utils';

// Initialize OpenAI client
// Note: API key should be in environment variables
let openaiClient: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    openaiClient = new OpenAI({ apiKey });
  }
  return openaiClient;
}

/**
 * Generate a parenting script using OpenAI
 */
export async function generateScript(
  situation: string,
  childName: string,
  childAge: number,
  neurotype: string,
  tone: string
): Promise<GenerateScriptResponse> {
  const openai = getOpenAIClient();

  const prompt = `You are Sturdy, a compassionate parenting coach using Attachment Theory, Internal Family Systems (IFS), and "Good Inside" methodology.

Generate a parenting script for this situation:

Situation: ${situation}
Child: ${childAge} years old, ${neurotype}
Tone: ${tone}

Provide your response in this EXACT JSON format:
{
  "validation": "2-3 sentences acknowledging the parent's feelings and validating their experience",
  "reframe": "2-3 sentences helping the parent see the child's behavior through attachment/IFS lens",
  "script": "1-2 paragraphs with exact words the parent can say to their child",
  "insight": "1-2 sentences explaining why this approach works based on developmental psychology"
}

Important guidelines:
- Be warm, non-judgmental, and evidence-based
- Avoid medical or clinical advice
- Focus on connection and co-regulation
- Emphasize that the child is "good inside"
- Use age-appropriate language in the script
- Consider the child's neurotype in your approach
- Match the requested tone while staying compassionate`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content) as GenerateScriptResponse;
    return result;
  } catch (error) {
    console.error('Error generating script:', error);
    throw new Error('Failed to generate script. Please try again.');
  }
}

/**
 * Generate a "What If" plan using OpenAI
 */
export async function generatePlan(
  struggle: string,
  childName: string,
  childAge: number,
  neurotype: string,
  frequency: string,
  triggers: string
): Promise<GeneratePlanResponse> {
  const openai = getOpenAIClient();

  const prompt = `You are Sturdy, a compassionate parenting coach using Attachment Theory, Internal Family Systems (IFS), and "Good Inside" methodology.

Generate a comprehensive "What If" plan for this recurring struggle:

Struggle: ${struggle}
Child: ${childAge} years old, ${neurotype}
Frequency: ${frequency}
Triggers: ${triggers}

Provide your response in this EXACT JSON format:
{
  "prevention": "2-3 paragraphs with proactive strategies to prevent this struggle before it starts. Include environmental changes, routine adjustments, and connection rituals.",
  "intervention": "2-3 paragraphs with in-the-moment strategies when the struggle begins. Focus on co-regulation, validation, and maintaining connection.",
  "escalation": "2-3 paragraphs with de-escalation techniques for when the situation intensifies. Emphasize safety, calm presence, and repair."
}

Important guidelines:
- Be warm, practical, and evidence-based
- Focus on prevention over reaction
- Use age-appropriate strategies for a ${childAge}-year-old
- Consider the child's neurotype (${neurotype}) in all recommendations
- Emphasize co-regulation and attachment security
- Include specific, actionable steps
- Remember: the child is "good inside" - behavior is communication`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content) as GeneratePlanResponse;
    return result;
  } catch (error) {
    console.error('Error generating plan:', error);
    throw new Error('Failed to generate plan. Please try again.');
  }
}

/**
 * Scrub sensitive information before sending to OpenAI
 * Remove child's actual name and replace with generic term
 */
export function scrubSensitiveData(text: string, childName: string): string {
  if (!childName) return text;
  
  // Replace variations of the name
  const namePattern = new RegExp(childName, 'gi');
  return text.replace(namePattern, '[child]');
}
