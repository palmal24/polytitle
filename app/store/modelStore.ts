import { create } from 'zustand';

export type WhisperStatus = 'unknown' | 'not_installed' | 'installed' | 'update_available';

interface ModelStore {
  whisperStatus: WhisperStatus;
  whisperVersion: string | null;
  setWhisperStatus: (status: WhisperStatus) => void;
  setWhisperVersion: (version: string) => void;
}

export const useModelStore = create<ModelStore>((set) => ({
  whisperStatus: 'unknown',
  whisperVersion: null,
  setWhisperStatus: (status) => set({ whisperStatus: status }),
  setWhisperVersion: (version) => set({ whisperVersion: version }),
}));
