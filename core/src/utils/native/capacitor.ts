import type { CapacitorInstance } from '@capacitor/core/types/definitions-internal'

export const capacitor = (window as any)?.Capacitor as CapacitorInstance;
