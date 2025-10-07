import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iwipefxjymkqpsuxkupo.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3aXBlZnhqeW1rcXBzdXhrdXBvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNjYxNDgsImV4cCI6MjA3NDg0MjE0OH0.qj38NOb_tq3hLOvXqlIXkAd7NNbw_EDV3pfQxe6JHPo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
