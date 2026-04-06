import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { UserRole, Specialization } from '../types/cv.types';

interface User {
  id: string;
  email: string;
  role: UserRole;
  specialization?: Specialization;
}

interface AuthStore {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  checkSession: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,

  checkSession: async () => {
    // Try Supabase first
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        // In a real app, we would fetch the profile from Supabase profiles table
        // For now, we'll assume admin or try to find metadata
        const role = (data.session.user.user_metadata?.role as UserRole) || 'talent';
        set({ 
          user: { 
            id: data.session.user.id, 
            email: data.session.user.email!,
            role 
          }, 
          loading: false 
        });
        return;
      }
    }
    // Fallback: localStorage demo mode
    const stored = localStorage.getItem('cms_admin_v2');
    if (stored) {
      set({ user: JSON.parse(stored), loading: false });
    } else {
      set({ user: null, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    // ── MODO DEMO (Prioridad para fase de transición) ──
    const demoAccounts: Record<string, { pass: string; role: UserRole; spec?: Specialization }> = {
      'admin@re.com': { pass: 'admin123', role: 'admin' },
      'talent@re.com': { pass: 'talent123', role: 'talent', spec: 'ux_ui' },
      'sales@re.com': { pass: 'sales123', role: 'sales' },
    };

    const demo = demoAccounts[email];
    if (demo) {
      if (demo.pass === password) {
        const user: User = { 
          id: `demo-${demo.role}`, 
          email, 
          role: demo.role,
          specialization: demo.spec
        };
        localStorage.setItem('cms_admin_v2', JSON.stringify(user));
        set({ user });
        return null;
      } else {
        return 'Contraseña de demo incorrecta.';
      }
    }

    // ── MODO PROFESIONAL (Supabase Auth) ──
    if (import.meta.env.VITE_SUPABASE_URL) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return error.message;
      if (data.user) {
        const role = (data.user.user_metadata?.role as UserRole) || 'talent';
        set({ user: { id: data.user.id, email: data.user.email!, role } });
        return null;
      }
    }

    return 'Credenciales incorrectas.\nDemo: \n- admin@re.com / admin123\n- talent@re.com / talent123\n- sales@re.com / sales123';
  },

  signOut: async () => {
    localStorage.removeItem('cms_admin_v2');
    if (import.meta.env.VITE_SUPABASE_URL) await supabase.auth.signOut();
    set({ user: null });
  },
}));
