import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      portfolio_data: {
        Row: {
          id: string;
          data_type: string;
          content: any;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          data_type: string;
          content: any;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          data_type?: string;
          content?: any;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}