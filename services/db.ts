
import { createClient } from '@supabase/supabase-js';
import { User, LeaderboardEntry } from '../types';

const SUPABASE_URL = 'https://zovdjndjquhqsilvoltt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdmRqbmRqcXVocXNpbHZvbHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2ODY0OTMsImV4cCI6MjA4MTI2MjQ5M30.z3kMGePOuUyYZhbyQBaWn9pU2MVsxfErkJ9rw0HeWDk';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const CURRENT_USER_KEY = 'zcash_current_user_local_cache';
const PENDING_NAME_KEY = 'zcash_pending_auth_name';

// Helper to sanitize data
const sanitizeUser = (u: any): User => ({
  name: u?.name || 'User',
  email: u?.email || '',
  totalScore: typeof u?.totalScore === 'number' ? u.totalScore : 0,
  badges: Array.isArray(u?.badges) ? u.badges : [],
  completedLessons: Array.isArray(u?.completedLessons) ? u.completedLessons : []
});

export const AuthService = {

  // 1. Send OTP to Email
  signInWithOtp: async (email: string) => {
    const { error } = await (supabase.auth as any).signInWithOtp({
      email: email,
      options: {
        shouldCreateUser: true,
      }
    });
    if (error) throw error;
  },

  // 2. Verify OTP and Sync with Public Table
  verifyOtp: async (email: string, token: string, name: string): Promise<User> => {
    const { data: { session }, error } = await (supabase.auth as any).verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) throw error;
    if (!session?.user?.email) throw new Error("No email found in session");

    // After successful auth, sync with public 'users' table
    return await AuthService.syncUserWithTable(session.user.email, name);
  },

  // 3. Google Login
  signInWithGoogle: async (pendingName?: string) => {
    // Store name temporarily to be used after redirect
    if (pendingName) {
      localStorage.setItem(PENDING_NAME_KEY, pendingName);
    }

    const { data, error } = await (supabase.auth as any).signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin, // Redirect back to the app
      },
    });
    if (error) throw error;
  },

  // 4. Sync Auth User with Public 'users' Table (The Leaderboard Table)
  syncUserWithTable: async (email: string, name?: string): Promise<User> => {
    try {
      // Check if user exists in public table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (existingUser) {
        // Only update name if it was explicitly provided (e.g. from the pending name storage or new input)
        // AND it's different from what we have.
        // We prioritize the 'name' argument if passed.
        if (name && existingUser.name !== name) {
          await supabase.from('users').update({ name }).eq('email', email);
          existingUser.name = name;
        }
        const finalUser = sanitizeUser(existingUser);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(finalUser));
        return finalUser;
      } else {
        // New user - insert
        const newUser = {
          email,
          name: name || email.split('@')[0], // Fallback name
          totalScore: 0,
          completedLessons: [],
          badges: []
        };

        const { data: created, error } = await supabase
          .from('users')
          .insert([newUser])
          .select()
          .single();

        if (error) throw error;

        const finalUser = sanitizeUser(created);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(finalUser));
        return finalUser;
      }
    } catch (e) {
      console.error("Sync Error:", e);
      throw e;
    }
  },

  // Check current session on load
  getSession: async (): Promise<User | null> => {
    // 1. Check Supabase Session
    const { data: { session } } = await (supabase.auth as any).getSession();

    if (session?.user?.email) {
      // Check for pending name from OAuth redirect flow
      const pendingName = localStorage.getItem(PENDING_NAME_KEY);
      if (pendingName) {
        localStorage.removeItem(PENDING_NAME_KEY); // Clear it
      }

      // We have a session, ensure we have the public user data
      // If pendingName exists, we MUST fetch/sync with DB to update/create with that name
      if (pendingName) {
        try {
          return await AuthService.syncUserWithTable(session.user.email, pendingName);
        } catch (e) {
          return null;
        }
      }

      // Standard cached check
      const cached = localStorage.getItem(CURRENT_USER_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.email === session.user.email) return sanitizeUser(parsed);
      }

      // If not in cache or mismatch, fetch from DB
      try {
        // [FIX]: Check if user exists first to avoid overwriting name with Google metadata
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (existingUser) {
          const finalUser = sanitizeUser(existingUser);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(finalUser));
          return finalUser;
        }

        // Fallback name logic only if NO existing DB record
        const nameFromMeta = session.user.user_metadata?.full_name || session.user.user_metadata?.name;
        return await AuthService.syncUserWithTable(session.user.email, nameFromMeta);
      } catch (e) {
        return null;
      }
    }

    return null;
  },

  getCurrentUserLocal: (): User | null => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_KEY);
      if (!stored) return null;
      return sanitizeUser(JSON.parse(stored));
    } catch (e) {
      return null;
    }
  },

  logout: async () => {
    await (supabase.auth as any).signOut();
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  updateUserProgress: async (scoreToAdd: number, lessonId?: string): Promise<User | null> => {
    const currentUser = AuthService.getCurrentUserLocal();
    if (!currentUser) return null;

    // Optimistic UI Update
    const updatedUser = { ...currentUser };
    updatedUser.totalScore += scoreToAdd;

    if (lessonId && !updatedUser.completedLessons.includes(lessonId)) {
      updatedUser.completedLessons.push(lessonId);
    }

    // Save locally
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // Sync to Cloud
    try {
      const { error } = await supabase
        .from('users')
        .update({
          totalScore: updatedUser.totalScore,
          completedLessons: updatedUser.completedLessons
        })
        .eq('email', currentUser.email);

      if (error) throw error;
    } catch (e) {
      console.error("Failed to sync progress to Supabase", e);
    }

    return updatedUser;
  },

  getLeaderboard: async (): Promise<LeaderboardEntry[]> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('name, totalScore')
        .order('totalScore', { ascending: false })
        .limit(10);

      if (error) throw error;

      return (data || []).map((u: any, index: number) => ({
        rank: index + 1,
        name: u.name,
        score: u.totalScore,
        isUser: false
      }));
    } catch (e) {
      console.error("Leaderboard fetch error", e);
      return [];
    }
  },

  getTotalUsersCount: async (): Promise<number> => {
    try {
      const { count, error } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (error) throw error;
      return count || 0;
    } catch (e) {
      console.error("Count fetch error", e);
      return 0;
    }
  }
};

export const ArticleService = {
  getArticles: async (): Promise<import('../types').Article[]> => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  },

  getArticleBySlug: async (slug: string): Promise<import('../types').Article | null> => {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error) return null;
    return data;
  },

  addArticle: async (article: Omit<import('../types').Article, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  updateArticle: async (id: string, updates: Partial<import('../types').Article>) => {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  deleteArticle: async (id: string) => {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);
    if (error) throw error;
  }
};

