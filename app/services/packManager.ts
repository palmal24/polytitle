// In DEV mode, "installing" a pack just saves its metadata to AsyncStorage.
// In production this will download the actual ONNX files via expo-file-system.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pack } from '../constants/packs';

const INSTALLED_PACKS_KEY = 'polytitle_installed_packs';

export interface InstalledPack {
  code: string;
  version: string;
  installedAt: string;
}

export async function getInstalledPacks(): Promise<Record<string, InstalledPack>> {
  try {
    const raw = await AsyncStorage.getItem(INSTALLED_PACKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export async function isPackInstalled(code: string): Promise<boolean> {
  const packs = await getInstalledPacks();
  return !!packs[code];
}

export async function markPackInstalled(pack: Pack): Promise<void> {
  const packs = await getInstalledPacks();
  packs[pack.code] = {
    code: pack.code,
    version: pack.version,
    installedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(INSTALLED_PACKS_KEY, JSON.stringify(packs));
}

export async function uninstallPack(code: string): Promise<void> {
  const packs = await getInstalledPacks();
  delete packs[code];
  await AsyncStorage.setItem(INSTALLED_PACKS_KEY, JSON.stringify(packs));
}
