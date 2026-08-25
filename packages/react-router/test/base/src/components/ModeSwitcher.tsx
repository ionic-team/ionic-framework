import React from 'react';

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
  return params.get('ionic:_testing') === 'true' || !!(window as any).Cypress || !!navigator.webdriver;
};

const ModeSwitcher: React.FC = () => {
  if (isTestEnvironment()) return null;

  const currentMode = getStoredMode();

  const toggleMode = () => {
    const newMode = currentMode === 'ios' ? 'md' : 'ios';
    setStoredMode(newMode);
    window.location.reload();
  };

  return (
    <div
      onClick={toggleMode}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 99999,
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        background: currentMode === 'ios' ? '#007aff' : '#6200ee',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '11px',
        fontWeight: 700,
        fontFamily: 'system-ui, sans-serif',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        userSelect: 'none',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
      }}
      title={`Switch to ${currentMode === 'ios' ? 'MD' : 'iOS'} mode`}
    >
      {currentMode === 'ios' ? 'iOS' : 'MD'}
    </div>
  );
};

export default ModeSwitcher;
