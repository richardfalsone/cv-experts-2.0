/**
 * versionStore.ts — Version Control System for Room of Experts CMS
 * Manages snapshots, drafts, and publish history per employee CV.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CVBlock } from '../types/cv.types';

export interface VersionSnapshot {
  id: string;
  employeeId: string;
  label: string;
  timestamp: string;
  blocks: CVBlock[];
  isDraft: boolean;
  isPublished: boolean;
  publishedAt?: string;
  createdBy?: string;
}

interface VersionStore {
  // All snapshots across all CVs
  snapshots: VersionSnapshot[];

  // Save a new snapshot (auto-save or manual)
  saveSnapshot: (employeeId: string, blocks: CVBlock[], label?: string, isDraft?: boolean) => string;

  // Get all snapshots for a specific employee
  getSnapshots: (employeeId: string) => VersionSnapshot[];

  // Get the most recent snapshot (auto-saved)
  getLatestSnapshot: (employeeId: string) => VersionSnapshot | null;

  // Mark a snapshot as published
  markAsPublished: (snapshotId: string) => void;

  // Restore a snapshot (returns the blocks to restore)
  restoreSnapshot: (snapshotId: string) => CVBlock[] | null;

  // Delete a snapshot
  deleteSnapshot: (snapshotId: string) => void;

  // Get the published snapshot for an employee
  getPublishedSnapshot: (employeeId: string) => VersionSnapshot | null;

  // Rename a snapshot
  renameSnapshot: (snapshotId: string, label: string) => void;
}

export const useVersionStore = create<VersionStore>()(
  persist(
    (set, get) => ({
      snapshots: [],

      saveSnapshot: (employeeId, blocks, label, isDraft = false) => {
        const id = `v-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const snapshot: VersionSnapshot = {
          id,
          employeeId,
          label: label || (isDraft ? `Borrador ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}` : `Auto-guardado ${new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })}`),
          timestamp: new Date().toISOString(),
          blocks: JSON.parse(JSON.stringify(blocks)), // deep clone
          isDraft,
          isPublished: false,
        };

        // Keep max 20 auto-saves, unlimited drafts
        set(state => {
          let existing = [...state.snapshots];
          if (!isDraft) {
            // Remove old auto-saves (keep last 15)
            const autoSaves = existing.filter(s => s.employeeId === employeeId && !s.isDraft && !s.isPublished);
            if (autoSaves.length >= 15) {
              const toRemove = autoSaves.slice(0, autoSaves.length - 14).map(s => s.id);
              existing = existing.filter(s => !toRemove.includes(s.id));
            }
          }
          return { snapshots: [snapshot, ...existing] };
        });

        return id;
      },

      getSnapshots: (employeeId) => {
        return get().snapshots
          .filter(s => s.employeeId === employeeId)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },

      getLatestSnapshot: (employeeId) => {
        const all = get().getSnapshots(employeeId);
        return all[0] || null;
      },

      markAsPublished: (snapshotId) => {
        set(state => ({
          snapshots: state.snapshots.map(s => {
            if (s.id === snapshotId) {
              return { ...s, isPublished: true, isDraft: false, publishedAt: new Date().toISOString() };
            }
            // Unpublish previously published snapshots for same employee
            const targetEmployee = state.snapshots.find(x => x.id === snapshotId)?.employeeId;
            if (s.employeeId === targetEmployee && s.isPublished) {
              return { ...s, isPublished: false };
            }
            return s;
          })
        }));
      },

      restoreSnapshot: (snapshotId) => {
        const snap = get().snapshots.find(s => s.id === snapshotId);
        return snap ? JSON.parse(JSON.stringify(snap.blocks)) : null;
      },

      deleteSnapshot: (snapshotId) => {
        set(state => ({ snapshots: state.snapshots.filter(s => s.id !== snapshotId) }));
      },

      getPublishedSnapshot: (employeeId) => {
        return get().snapshots.find(s => s.employeeId === employeeId && s.isPublished) || null;
      },

      renameSnapshot: (snapshotId, label) => {
        set(state => ({
          snapshots: state.snapshots.map(s => s.id === snapshotId ? { ...s, label } : s)
        }));
      },
    }),
    {
      name: 'cms_versions_v1',
    }
  )
);
