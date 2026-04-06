import { create } from 'zustand';
import type { CVBlock, CVPage } from '../types/cv.types';

interface HistoryEntry {
  blocks: CVBlock[];
}

interface EditorStore {
  page: CVPage | null;
  selectedBlockId: string | null;
  isDirty: boolean;
  history: HistoryEntry[];
  historyIndex: number;

  setPage: (page: CVPage) => void;
  selectBlock: (id: string | null) => void;
  updateBlock: (id: string, props: Record<string, unknown>) => void;
  moveBlock: (activeId: string, overId: string) => void;
  addBlock: (block: CVBlock) => void;
  removeBlock: (id: string) => void;
  toggleBlockVisibility: (id: string) => void;
  updateMeta: (meta: Partial<CVPage['meta']>) => void;
  undo: () => void;
  redo: () => void;
  markSaved: () => void;
}

export const useEditorStore = create<EditorStore>((set, get) => ({
  page: null,
  selectedBlockId: null,
  isDirty: false,
  history: [],
  historyIndex: -1,

  setPage: (page) => {
    set({
      page,
      history: [{ blocks: page.blocks }],
      historyIndex: 0,
      isDirty: false,
    });
  },

  selectBlock: (id) => set({ selectedBlockId: id }),

  updateBlock: (id, props) => {
    set((state) => {
      if (!state.page) return state;
      const blocks = state.page.blocks.map((b) =>
        b.id === id ? { ...b, props: { ...b.props, ...props } } as any : b
      );
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ blocks: blocks as CVBlock[] });
      return {
        page: { ...state.page, blocks },
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      };
    });
  },

  moveBlock: (activeId, overId) => {
    set((state) => {
      if (!state.page) return state;
      const blocks = [...state.page.blocks];
      const fromIdx = blocks.findIndex((b) => b.id === activeId);
      const toIdx = blocks.findIndex((b) => b.id === overId);
      if (fromIdx === -1 || toIdx === -1) return state;
      const [moved] = blocks.splice(fromIdx, 1);
      blocks.splice(toIdx, 0, moved);
      const reordered = blocks.map((b, i) => ({ ...b, order: i }));
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push({ blocks: reordered });
      return {
        page: { ...state.page, blocks: reordered },
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isDirty: true,
      };
    });
  },

  addBlock: (block) => {
    set((state) => {
      if (!state.page) return state;
      const blocks = [...state.page.blocks, { ...block, order: state.page.blocks.length }];
      return { page: { ...state.page, blocks }, isDirty: true };
    });
  },

  removeBlock: (id) => {
    set((state) => {
      if (!state.page) return state;
      const blocks = state.page.blocks.filter((b) => b.id !== id).map((b, i) => ({ ...b, order: i }));
      return { page: { ...state.page, blocks }, isDirty: true, selectedBlockId: null };
    });
  },

  toggleBlockVisibility: (id) => {
    set((state) => {
      if (!state.page) return state;
      const blocks = state.page.blocks.map((b) =>
        b.id === id ? { ...b, visible: !b.visible } : b
      );
      return { page: { ...state.page, blocks }, isDirty: true };
    });
  },

  updateMeta: (meta) => {
    set((state) => {
      if (!state.page) return state;
      return { page: { ...state.page, meta: { ...state.page.meta, ...meta } }, isDirty: true };
    });
  },

  undo: () => {
    const { history, historyIndex, page } = get();
    if (historyIndex <= 0 || !page) return;
    const prev = history[historyIndex - 1];
    set({ page: { ...page, blocks: prev.blocks }, historyIndex: historyIndex - 1, isDirty: true });
  },

  redo: () => {
    const { history, historyIndex, page } = get();
    if (historyIndex >= history.length - 1 || !page) return;
    const next = history[historyIndex + 1];
    set({ page: { ...page, blocks: next.blocks }, historyIndex: historyIndex + 1, isDirty: true });
  },

  markSaved: () => set({ isDirty: false }),
}));
