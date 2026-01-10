/**
 * API Route: Generate Plan
 * POST /api/generate-plan
 * 
 * Generates a "What If" plan using OpenAI GPT-4
 * IMPORTANT: Plans use user_id, not parent_id!
 */

import { generatePlan } from '@/lib/openai';
import { getChild, createPlan } from '@/lib/queries';
import { calculateAge } from '@/lib/utils';
import { GeneratePlanRequest } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body: GeneratePlanRequest = await request.json();
    const { struggle, childId, frequency, triggers, userId } = body;

    // Validate input
    if (!struggle || !childId || !frequency || !userId) {
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

    // Generate plan using OpenAI
    const result = await generatePlan(
      struggle,
      childName,
      childAge,
      neurotype,
      frequency,
      triggers || ''
    );

    // Save plan to database
    // IMPORTANT: Use user_id, not parent_id!
    const plan = await createPlan({
      user_id: userId,
      child_id: childId,
      struggle,
      frequency,
      triggers: triggers || '',
      prevention: result.prevention,
      intervention: result.intervention,
      escalation: result.escalation,
    });

    return Response.json(plan, { status: 200 });
  } catch (error) {
    console.error('Error in generate-plan API:', error);
    
    // Return user-friendly error
    return Response.json(
      { 
        error: 'Failed to generate plan. Please try again.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
