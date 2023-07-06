import type { CapacitorGlobal } from '@capacitor/core';

export const capacitor = (window as any).capacitor as CapacitorGlobal;
