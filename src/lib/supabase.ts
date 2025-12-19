import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
  id: string;
  name: string;
  email: string;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface OnboardingResponse {
  id: string;
  user_id: string;
  relationship_status: string;
  location: string;
  good_traits: string[];
  bad_traits: string[];
  social_weekend: string;
  social_recharge: string;
  vacation_type: string;
  vacation_activity: string;
  planning_style: string;
  planning_preference: string;
  hobby_interest: string;
  hobby_activity: string;
  outlook: string;
  avatar_placeholder: string;
  created_at: string;
}
