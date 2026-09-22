import { Component } from '@angular/core';

const IONIC_SESSION_KEY = 'ionic-persist-config';

const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

const getStoredMode = (): string => {
  if (!isBrowser) return 'md';
  // A ?ionic:mode= URL param wins over session, matching core's config merge
  // (configFromURL takes precedence over configFromSession). Read it first so
  // the label reflects what Ionic will actually render on URL-pinned pages.
  const urlMode = new URLSearchParams(window.location.search).get('ionic:mode');
  if (urlMode === 'ios' || urlMode === 'md') return urlMode;
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
  // Hide during SSR (no DOM) and automated e2e runs. Most base Playwright specs
  // navigate without ionic:_testing=true, so navigator.webdriver (true under any
  // WebDriver/CDP-driven browser) is the primary guard that keeps this fixed,
  // high-z-index button from overlapping page UI during tests. The component is
  // intentionally visible in normal browsers, including Vercel previews, as a
  // reviewer convenience for flipping iOS/MD without editing the URL.
  if (!isBrowser) return true;
  const params = new URLSearchParams(window.location.search);
  return params.get('ionic:_testing') === 'true' || !!(window as any).Cypress || !!navigator.webdriver;
};

@Component({
  selector: 'app-mode-switcher',
  standalone: true,
  template: `
    @if (!isTest) {
      <div
        class="mode-switcher"
        [class.mode-switcher-ios]="currentMode === 'ios'"
        [title]="'Switch to ' + (currentMode === 'ios' ? 'MD' : 'iOS') + ' mode'"
        (click)="toggleMode()"
      >
        {{ currentMode === 'ios' ? 'iOS' : 'MD' }}
      </div>
    }
  `,
  styles: [
    `
      .mode-switcher {
        position: fixed;
        bottom: 16px;
        right: 16px;
        z-index: 99999;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #6200ee;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 11px;
        font-weight: 700;
        font-family: system-ui, sans-serif;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        user-select: none;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .mode-switcher-ios {
        background: #007aff;
      }
    `,
  ],
})
export class ModeSwitcherComponent {
  isTest = isTestEnvironment();
  currentMode = getStoredMode();

  toggleMode() {
    const newMode = this.currentMode === 'ios' ? 'md' : 'ios';
    setStoredMode(newMode);
    // If the page is pinned to a mode via ?ionic:mode=, the URL would override
    // the session value on reload, so update the param too; otherwise a plain
    // reload lets Ionic re-read the persisted mode from sessionStorage
    // (configFromSession) on bootstrap.
    const url = new URL(window.location.href);
    if (url.searchParams.has('ionic:mode')) {
      url.searchParams.set('ionic:mode', newMode);
      window.location.href = url.href;
    } else {
      window.location.reload();
    }
  }
}
