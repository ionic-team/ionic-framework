<template>
  <div
    v-if="!isTest"
    :style="buttonStyle"
    :title="`Switch to ${currentMode === 'ios' ? 'MD' : 'iOS'} mode`"
    @click="toggleMode"
  >
    {{ currentMode === 'ios' ? 'iOS' : 'MD' }}
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

const IONIC_SESSION_KEY = 'ionic-persist-config';

const getStoredMode = (): string => {
  try {
    const stored = sessionStorage.getItem(IONIC_SESSION_KEY);
    if (stored) {
      const config = JSON.parse(stored);
      if (config.mode) return config.mode;
    }
  } catch {
    // ignore
  }
  return document.documentElement.getAttribute('mode') || 'md';
};

const setStoredMode = (mode: string) => {
  try {
    const stored = sessionStorage.getItem(IONIC_SESSION_KEY);
    const config = stored ? JSON.parse(stored) : {};
    config.mode = mode;
    sessionStorage.setItem(IONIC_SESSION_KEY, JSON.stringify(config));
  } catch {
    // ignore
  }
};

const isTestEnvironment = (): boolean => {
  const params = new URLSearchParams(window.location.search);
  return (
    params.get('ionic:_testing') === 'true' ||
    !!(window as any).Cypress ||
    !!navigator.webdriver
  );
};

export default defineComponent({
  name: 'ModeSwitcher',
  setup() {
    const isTest = isTestEnvironment();
    const currentMode = ref(getStoredMode());

    const buttonStyle = computed(() => ({
      position: 'fixed' as const,
      bottom: '16px',
      right: '16px',
      zIndex: 99999,
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      background: currentMode.value === 'ios' ? '#007aff' : '#6200ee',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 700,
      fontFamily: 'system-ui, sans-serif',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      userSelect: 'none' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: '0.5px',
    }));

    const toggleMode = () => {
      const newMode = currentMode.value === 'ios' ? 'md' : 'ios';
      setStoredMode(newMode);
      window.location.reload();
    };

    return { isTest, currentMode, buttonStyle, toggleMode };
  },
});
</script>
