import { createClient } from "@supabase/supabase-js";

// These are the secret keys that allow our website to talk to our Supabase database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// This line creates the "messenger" (the client) that we use to send and receive data
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
