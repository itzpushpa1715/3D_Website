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
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `images/${fileName}`;

    // Upload the file directly - bucket should already exist
    const { error: uploadError } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

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

// Utility function to delete images
export const deleteImage = async (imageUrl: string): Promise<boolean> => {
  if (!isSupabaseConfigured() || !imageUrl.includes('supabase')) {
    return true; // Can't delete local object URLs, but that's fine
  }

  try {
    // Extract file path from URL
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `images/${fileName}`;

    const { error } = await supabase.storage
      .from('portfolio-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    return false;
  }
};