import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  signInWithOtp: (phone: string) => Promise<{ error: any }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSupport, setIsSupport] = useState(false);

  const checkUserRole = async (userId: string, role: 'admin' | 'support') => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', role)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user role:', error);
        return false;
      }

      return !!data;
    } catch (error) {
      console.error('Error checking user role:', error);
      return false;
    }
  };

  const cleanupAuthState = () => {
    localStorage.removeItem('supabase.auth.token');
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Create profile and check admin role if user signs in
        if (event === 'SIGNED_IN' && session?.user) {
          setTimeout(async () => {
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('user_id', session.user.id)
              .single();

            if (!existingProfile) {
              await supabase.from('profiles').insert({
                user_id: session.user.id,
                phone_number: session.user.phone,
              });
            }

            const adminStatus = await checkUserRole(session.user.id, 'admin');
            const supportStatus = await checkUserRole(session.user.id, 'support');
            setIsAdmin(adminStatus);
            setIsSupport(supportStatus);
          }, 0);
        } else if (!session?.user) {
          setIsAdmin(false);
          setIsSupport(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithOtp = async (phone: string) => {
    try {
      cleanupAuthState();
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms',
        },
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      cleanupAuthState();
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      
      if (data.user && !error) {
        // Force page reload for clean state
        setTimeout(() => {
          window.location.href = '/';
        }, 100);
      }
      
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      window.location.href = '/auth';
    } catch (error) {
      // Force redirect even if signOut fails
      window.location.href = '/auth';
    }
  };

  const value = {
    user,
    session,
    loading,
    isAdmin,
    isSupport,
    signInWithOtp,
    verifyOtp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};