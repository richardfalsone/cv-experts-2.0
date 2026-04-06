import { create } from 'zustand';
import type { CVBlock } from '../types/cv.types';
import { supabase } from '../lib/supabase';

export interface VersionSnapshot {
  id: string;
  expert_id: string; // Changed from employeeId to match DB
  label: string;
  created_at: string; // Match DB
  blocks: CVBlock[];
  is_published: boolean;
  is_draft: boolean; // We'll assume we add this or handle it
}

interface VersionStore {
  snapshots: VersionSnapshot[];
  loading: boolean;

  fetchSnapshots: (expertId: string) => Promise<void>;
  saveSnapshot: (expertId: string, blocks: CVBlock[], label?: string, isDraft?: boolean) => Promise<string | null>;
  markAsPublished: (snapshotId: string, expertId: string) => Promise<void>;
  deleteSnapshot: (snapshotId: string) => Promise<void>;
  
  // Helpers (synchronous on current state)
  getSnapshots: (expertId: string) => VersionSnapshot[];
  getPublishedSnapshot: (expertId: string) => VersionSnapshot | null;
}

export const useVersionStore = create<VersionStore>((set, get) => ({
  snapshots: [],
  loading: false,

  fetchSnapshots: async (expertId) => {
    set({ loading: true });
    try {
      const { data, error } = await supabase
        .from('versions')
        .select('*')
        .eq('expert_id', expertId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mapped = (data || []).map(d => ({
        ...d,
        is_draft: d.label.startsWith('[DRAFT]'),
        label: d.label.replace('[DRAFT] ', '')
      }));

      set({ snapshots: mapped as any[] });
    } catch (err) {
      console.error('Error fetching snapshots:', err);
    } finally {
      set({ loading: false });
    }
  },

  saveSnapshot: async (expertId, blocks, label, isDraft = false) => {
    try {
      const finalLabel = label || (isDraft ? `Borrador ${new Date().toLocaleTimeString()}` : `Auto-guardado ${new Date().toLocaleTimeString()}`);
      
      const newSnapshot = {
        expert_id: expertId,
        blocks,
        label: isDraft ? `[DRAFT] ${finalLabel}` : finalLabel,
        is_published: false,
      };

      const { data, error } = await supabase
        .from('versions')
        .insert([newSnapshot])
        .select()
        .single();

      if (error) throw error;
      
      // Map back for local state
      const mapped = {
        ...data,
        is_draft: data.label.startsWith('[DRAFT]'),
        label: data.label.replace('[DRAFT] ', '')
      };

      set(state => ({ snapshots: [mapped, ...state.snapshots] }));
      return data.id;
    } catch (err) {
      console.error('Error saving snapshot:', err);
      return null;
    }
  },

  markAsPublished: async (snapshotId, expertId) => {
    try {
      const snap = get().snapshots.find(s => s.id === snapshotId);
      if (!snap) return;

      // 1. Unpublish others for this expert
      await supabase
        .from('versions')
        .update({ is_published: false })
        .eq('expert_id', expertId);

      // 2. Mark this one and REMOVE draft prefix if exists
      const cleanLabel = snap.label.replace('[DRAFT] ', '');
      const { error } = await supabase
        .from('versions')
        .update({ 
          is_published: true, 
          label: cleanLabel 
        })
        .eq('id', snapshotId);

      if (error) throw error;

      set(state => ({
        snapshots: state.snapshots.map(s => ({
          ...s,
          label: s.id === snapshotId ? cleanLabel : s.label,
          is_published: s.id === snapshotId,
          is_draft: s.id === snapshotId ? false : s.is_draft
        }))
      }));
    } catch (err) {
      console.error('Error marking as published:', err);
    }
  },

  deleteSnapshot: async (snapshotId) => {
    try {
      const { error } = await supabase
        .from('versions')
        .delete()
        .eq('id', snapshotId);

      if (error) throw error;
      set(state => ({ snapshots: state.snapshots.filter(s => s.id !== snapshotId) }));
    } catch (err) {
      console.error('Error deleting snapshot:', err);
    }
  },

  getSnapshots: (expertId) => {
    return get().snapshots
      .filter(s => s.expert_id === expertId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  },

  getPublishedSnapshot: (expertId) => {
    return get().snapshots.find(s => s.expert_id === expertId && s.is_published) || null;
  },
}));
