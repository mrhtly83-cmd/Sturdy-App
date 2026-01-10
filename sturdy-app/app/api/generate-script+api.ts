/**
 * API Route: Generate Script
 * POST /api/generate-script
 * 
 * Generates a parenting script using OpenAI GPT-4
 */

import { generateScript } from '@/lib/openai';
import { getChild, createScript } from '@/lib/queries';
import { calculateAge } from '@/lib/utils';
import { GenerateScriptRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: GenerateScriptRequest = await request.json();
    const { situation, childId, tone, userId } = body;

    // Validate input
    if (!situation || !childId || !tone || !userId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get child details
    const child = await getChild(childId);
    if (!child) {
      return Response.json(
        { error: 'Child not found' },
        { status: 404 }
      );
    }

    // Verify child belongs to user
    if (child.parent_id !== userId) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Calculate child age
    const childAge = calculateAge(child.birth_date);
    const childName = child.name || 'child';
    const neurotype = child.neurotype || 'Neurotypical';

    // Generate script using OpenAI
    const result = await generateScript(
      situation,
      childName,
      childAge,
      neurotype,
      tone
    );

    // Save script to database
    const script = await createScript({
      parent_id: userId,
      child_id: childId,
      situation,
      script_text: result.script,
      validation: result.validation,
      reframe: result.reframe,
      psych_insight: result.insight,
      tone,
    });

    return Response.json(script, { status: 200 });
  } catch (error) {
    console.error('Error in generate-script API:', error);
    
    // Return user-friendly error
    return Response.json(
      { 
        error: 'Failed to generate script. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
