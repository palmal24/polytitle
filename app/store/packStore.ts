import { create } from 'zustand';

export type PackStatus = 'not_installed' | 'downloading' | 'installed' | 'update_available';

export interface PackState {
  status: PackStatus;
  version: string | null;
  downloadProgress: number; // 0–1
}

interface PackStore {
  packs: Record<string, PackState>;
  setPackStatus: (code: string, status: PackStatus) => void;
  setPackProgress: (code: string, progress: number) => void;
  setPackVersion: (code: string, version: string) => void;
  getPackStatus: (code: string) => PackState;
}

const DEFAULT_PACK_STATE: PackState = {
  status: 'not_installed',
  version: null,
  downloadProgress: 0,
};

export const usePackStore = create<PackStore>((set, get) => ({
  packs: {},

  setPackStatus: (code, status) =>
    set((state) => ({
      packs: {
        ...state.packs,
        [code]: { ...DEFAULT_PACK_STATE, ...state.packs[code], status },
      },
    })),

  setPackProgress: (code, downloadProgress) =>
    set((state) => ({
      packs: {
        ...state.packs,
        [code]: { ...DEFAULT_PACK_STATE, ...state.packs[code], downloadProgress },
      },
    })),

  setPackVersion: (code, version) =>
    set((state) => ({
      packs: {
        ...state.packs,
        [code]: { ...DEFAULT_PACK_STATE, ...state.packs[code], version },
      },
    })),

  getPackStatus: (code) => get().packs[code] ?? DEFAULT_PACK_STATE,
}));
