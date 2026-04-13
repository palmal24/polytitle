import { create } from 'zustand';

interface SettingsStore {
  sourceLanguage: string;
  targetLanguage: string;
  setSourceLanguage: (code: string) => void;
  setTargetLanguage: (code: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  sourceLanguage: 'en',
  targetLanguage: 'es',
  setSourceLanguage: (code) => set({ sourceLanguage: code }),
  setTargetLanguage: (code) => set({ targetLanguage: code }),
}));
