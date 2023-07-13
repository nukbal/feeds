import { createSignal } from 'solid-js';
import { os } from '@tauri-apps/api';
import type { Platform } from '@tauri-apps/api/os';

const platformSig = createSignal<Platform | null>(null);

os.platform().then((p) => platformSig[1](p));

export const platform = platformSig[0];
