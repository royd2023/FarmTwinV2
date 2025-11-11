import { Request, Response } from 'express';
import { SupabaseService } from '../services/supabaseService';

/**
 * User signup
 * Creates a new user account with email and password
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password, fullName } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }

    const supabaseService = SupabaseService.getInstance();
    const supabase = supabaseService.getClient();

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || null
        }
      }
    });

    if (authError) {
      console.error('Signup error:', authError);
      return res.status(400).json({
        success: false,
        error: authError.message
      });
    }

    // Insert user into users table
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: authData.user.email,
          full_name: fullName || null,
          role: 'user'
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        // Note: User is created in auth but not in users table
        // You may want to handle this case differently
      }
    }

    res.status(201).json({
      success: true,
      message: 'User created successfully. Please check your email for verification.',
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        fullName: fullName || null
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * User login
 * Authenticates user with email and password
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    const supabaseService = SupabaseService.getInstance();
    const supabase = supabaseService.getClient();

    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('Login error:', error);
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Get user details from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        fullName: userData?.full_name || null,
        role: userData?.role || 'user'
      },
      session: {
        accessToken: data.session?.access_token,
        refreshToken: data.session?.refresh_token,
        expiresAt: data.session?.expires_at
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * User logout
 * Signs out the current user
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const supabaseService = SupabaseService.getInstance();
    const supabase = supabaseService.getClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('Logout error:', error);
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    res.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};

/**
 * Get current user
 * Returns the authenticated user's information
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authentication token provided'
      });
    }

    const token = authHeader.substring(7);
    const supabaseService = SupabaseService.getInstance();
    const supabase = supabaseService.getClient();

    // Get user from token
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token'
      });
    }

    // Get additional user details from users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: userData?.full_name || null,
        role: userData?.role || 'user',
        createdAt: userData?.created_at
      }
    });

  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};
