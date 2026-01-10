/**
 * Type definitions for Sturdy App database models
 */

export interface Profile {
  id: string;
  email: string | null;
  subscription_tier: string;
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  name: string | null;
  birth_date: string | null;
  neurotype: string | null;
  created_at: string;
  updated_at: string;
}

export interface Script {
  id: string;
  parent_id: string;
  child_id: string;
  situation: string | null;
  script_text: string | null;
  validation: string | null;
  reframe: string | null;
  script_language: string | null;
  psych_insight: string | null;
  tone: string | null;
  user_rating: number | null;
  user_helpful: boolean | null;
  generated_script: string | null;
  created_at: string;
  updated_at: string;
}

export interface Plan {
  id: string;
  user_id: string; // Note: Plans use user_id, not parent_id!
  child_id: string;
  struggle: string | null;
  frequency: string | null;
  triggers: string | null;
  prevention: string | null;
  intervention: string | null;
  escalation: string | null;
  created_at: string;
  updated_at: string;
}

export type ToneType = 'Calm' | 'Playful' | 'Firm' | 'Empathetic';
export type FrequencyType = 'Daily' | 'Weekly' | 'Monthly';
export type NeurotypeType = 'Neurotypical' | 'ADHD' | 'Autism' | 'Other';

export interface GenerateScriptRequest {
  situation: string;
  childId: string;
  tone: ToneType;
  userId: string;
}

export interface GenerateScriptResponse {
  validation: string;
  reframe: string;
  script: string;
  insight: string;
}

export interface GeneratePlanRequest {
  struggle: string;
  childId: string;
  frequency: FrequencyType;
  triggers: string;
  userId: string;
}

export interface GeneratePlanResponse {
  prevention: string;
  intervention: string;
  escalation: string;
}
