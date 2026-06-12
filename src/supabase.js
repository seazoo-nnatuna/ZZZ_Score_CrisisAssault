import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jpchrhxnvjampvfvmpkc.supabase.co';
const supabaseAnonKey = 'sb_publishable_F2rDAUxA5xM9zjgHD25pbA_diMedLAW';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);