import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Singleton service for Supabase operations
 * Handles authentication and database operations
 */
export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient | null = null;

  private constructor() {}

  public static getInstance(): SupabaseService {
    if (!SupabaseService.instance) {
      SupabaseService.instance = new SupabaseService();
    }
    return SupabaseService.instance;
  }

  /**
   * Initialize Supabase client
   */
  public initialize(): void {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('Supabase credentials not configured');
      return;
    }

    this.client = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');
  }

  /**
   * Get Supabase client instance
   */
  public getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }
    return this.client;
  }

  /**
   * Check if Supabase is configured
   */
  public isConfigured(): boolean {
    return this.client !== null;
  }
}
