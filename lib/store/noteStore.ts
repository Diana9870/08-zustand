import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { NewNote } from "@/types/note";

export const initialDraft: NewNote = {
  title: "",
  content: "",
  tag: "Todo",
};

interface NoteStore {
  draft: NewNote;
  setDraft: (note: Partial<NewNote>) => void;
  clearDraft: () => void;
}

export const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note) => set((state) => ({ draft: { ...state.draft, ...note } })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "notehub-draft",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ draft: state.draft }) as NoteStore,
    },
  ),
);
