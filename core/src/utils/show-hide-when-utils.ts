import { Config } from '../interface';

import { matchBreakpoint } from './media';
import { isPlatform } from './platform';

export interface DisplayWhen {
  config: Config;
  win: Window;
  mediaQuery?: string;
  modes?: string;
  or: boolean;
  orientation?: string;
  platform?: string;
  size?: string;
}

function isPlatformMatch(win: Window, multiPlatformString: string) {
  const platforms = split(multiPlatformString);
  return platforms.some(p => isPlatform(win, p as any));
}

function isModeMatch(config: Config, multiModeString: string) {
  const modes = split(multiModeString);
  const currentMode = config.get('mode');
  return modes.includes(currentMode);
}

function isSizeMatch(win: Window, multiSizeString: string) {
  const sizes = split(multiSizeString);
  return sizes.some(s => matchBreakpoint(win, s));
}

function split(multiOptions: string): string[] {
  return multiOptions.replace(/\s/g, '').split(',');
}

export function getTestResult(displayWhen: DisplayWhen) {
  const results: boolean[] = [];
  if (displayWhen.mediaQuery !== undefined) {
    results.push(matchMedia(displayWhen.win, displayWhen.mediaQuery));
  }
  if (displayWhen.size !== undefined) {
    results.push(isSizeMatch(displayWhen.win, displayWhen.size));
  }
  if (displayWhen.modes !== undefined) {
    results.push(isModeMatch(displayWhen.config, displayWhen.modes));
  }
  if (displayWhen.platform !== undefined) {
    results.push(isPlatformMatch(displayWhen.win, displayWhen.platform));
  }
  if (displayWhen.orientation !== undefined) {
    results.push(isOrientationMatch(displayWhen.win, displayWhen.orientation));
  }

  if (displayWhen.or) {
    return results.some(r => r);
  } else {
    return results.every(r => r);
  }
}

function isOrientationMatch(win: Window, orientation: string) {
  if (orientation === 'portrait') {
    return isPortrait(win);
  } else if (orientation === 'landscape') {
    return !isPortrait(win);
  }
  // it's an invalid orientation, so just return it
  return false;
}

function isPortrait(win: Window): boolean {
  return matchMedia(win, '(orientation: portrait)');
}

function matchMedia(win: Window, query: string): boolean {
  return win.matchMedia(query).matches;
}
