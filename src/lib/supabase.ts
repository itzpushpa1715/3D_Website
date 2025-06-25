import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         supabaseUrl !== 'https://your-project.supabase.co' && 
         supabaseAnonKey !== 'your-anon-key' &&
         !supabaseUrl.includes('your-project') &&
         !supabaseAnonKey.includes('your-anon');
};

// Create client with fallback values
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

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

// Utility function to handle image uploads
export const uploadImage = async (file: File): Promise<string> => {
  if (!isSupabaseConfigured()) {
    // Return a placeholder URL when Supabase is not configured
    return URL.createObjectURL(file);
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `images/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return URL.createObjectURL(file);
    }

    const { data } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return URL.createObjectURL(file);
  }
};