/**
 * Database queries for Sturdy App
 * All queries use Supabase client with RLS policies
 */

import { supabase } from './supabase';
import { Child, Script, Plan, Profile } from './types';

/**
 * Profile Queries
 */
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Children Queries
 */
export async function getChildren(parentId: string) {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Child[];
}

export async function getChild(childId: string) {
  const { data, error } = await supabase
    .from('children')
    .select('*')
    .eq('id', childId)
    .single();

  if (error) throw error;
  return data as Child;
}

export async function createChild(
  parentId: string,
  name: string,
  birthDate: string,
  neurotype: string
) {
  const { data, error } = await supabase
    .from('children')
    .insert({
      parent_id: parentId,
      name,
      birth_date: birthDate,
      neurotype,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Child;
}

export async function updateChild(childId: string, updates: Partial<Child>) {
  const { data, error } = await supabase
    .from('children')
    .update(updates)
    .eq('id', childId)
    .select()
    .single();

  if (error) throw error;
  return data as Child;
}

export async function deleteChild(childId: string) {
  const { error } = await supabase
    .from('children')
    .delete()
    .eq('id', childId);

  if (error) throw error;
}

/**
 * Scripts Queries
 */
export async function getScripts(parentId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('scripts')
    .select('*, children(name)')
    .eq('parent_id', parentId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getScript(scriptId: string) {
  const { data, error } = await supabase
    .from('scripts')
    .select('*, children(name)')
    .eq('id', scriptId)
    .single();

  if (error) throw error;
  return data;
}

export async function createScript(scriptData: {
  parent_id: string;
  child_id: string;
  situation: string;
  script_text: string;
  validation: string;
  reframe: string;
  psych_insight: string;
  tone: string;
}) {
  const { data, error } = await supabase
    .from('scripts')
    .insert(scriptData)
    .select()
    .single();

  if (error) throw error;
  return data as Script;
}

export async function updateScript(scriptId: string, updates: Partial<Script>) {
  const { data, error } = await supabase
    .from('scripts')
    .update(updates)
    .eq('id', scriptId)
    .select()
    .single();

  if (error) throw error;
  return data as Script;
}

export async function deleteScript(scriptId: string) {
  const { error } = await supabase
    .from('scripts')
    .delete()
    .eq('id', scriptId);

  if (error) throw error;
}

export async function searchScripts(parentId: string, query: string) {
  const { data, error } = await supabase
    .from('scripts')
    .select('*, children(name)')
    .eq('parent_id', parentId)
    .ilike('situation', `%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Plans Queries
 * IMPORTANT: Plans use user_id, not parent_id!
 */
export async function getPlans(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('plans')
    .select('*, children(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

export async function getPlan(planId: string) {
  const { data, error } = await supabase
    .from('plans')
    .select('*, children(name)')
    .eq('id', planId)
    .single();

  if (error) throw error;
  return data;
}

export async function createPlan(planData: {
  user_id: string;
  child_id: string;
  struggle: string;
  frequency: string;
  triggers: string;
  prevention: string;
  intervention: string;
  escalation: string;
}) {
  const { data, error } = await supabase
    .from('plans')
    .insert(planData)
    .select()
    .single();

  if (error) throw error;
  return data as Plan;
}

export async function updatePlan(planId: string, updates: Partial<Plan>) {
  const { data, error } = await supabase
    .from('plans')
    .update(updates)
    .eq('id', planId)
    .select()
    .single();

  if (error) throw error;
  return data as Plan;
}

export async function deletePlan(planId: string) {
  const { error } = await supabase
    .from('plans')
    .delete()
    .eq('id', planId);

  if (error) throw error;
}
