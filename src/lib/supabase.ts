
import { createClient } from '@supabase/supabase-js';

// Valores fixos para desenvolvimento - em ambiente de produção, usar variáveis de ambiente
const supabaseUrl = 'https://shmivkcfzqrwugwmmjbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNobWl2a2NmenFyd3Vnd21tamJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExODc4ODQsImV4cCI6MjA1Njc2Mzg4NH0.XYidGu1ZH--Vnxrsrq71HN-Hti8yf15Ikj9KQWhOh6w';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
