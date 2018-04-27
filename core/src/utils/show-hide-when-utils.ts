import { Config, Mode } from '../interface';
import { isAndroid, isCordova, isElectron, isIOS, isIpad, isIphone, isPhablet, isTablet, matchMedia } from './platform';

export function updateTestResults(displayWhen: DisplayWhen) {
  displayWhen.passesTest = getTestResult(displayWhen);
}

export function isPlatformMatch(platforms: string[], multiPlatformString: string) {
  const userProvidedPlatforms = multiPlatformString.replace(/\s/g, '').split(',');
  for (const userProvidedPlatform of userProvidedPlatforms) {
    for (const platform of platforms) {
      if (userProvidedPlatform === platform) {
        return true;
      }
    }
  }
  return false;
}

export function isModeMatch(config: Config, multiModeString: string) {
  // you can only ever be in one mode, so if an entry from the list matches, return true
  const modes = multiModeString.replace(/\s/g, '').split(',');
  const currentMode = config.get('mode');
  return modes.indexOf(currentMode) >= 0;
}


export function isSizeMatch(win: Window, multiSizeString: string) {
  const sizes = multiSizeString.replace(/\s/g, '').split(',');
  for (const size of sizes) {
    const mediaQuery = SIZE_TO_MEDIA[size];
    if (mediaQuery && matchMedia(win, mediaQuery)) {
      return true;
    }
  }
  return false;
}

export function getTestResult(displayWhen: DisplayWhen) {
  const resultsToConsider: boolean[] = [];
  if (displayWhen.mediaQuery) {
    resultsToConsider.push(matchMedia(displayWhen.win, displayWhen.mediaQuery));
  }
  if (displayWhen.size) {
    resultsToConsider.push(isSizeMatch(displayWhen.win, displayWhen.size));
  }
  if (displayWhen.mode) {
    resultsToConsider.push(isModeMatch(displayWhen.config, displayWhen.mode));
  }
  if (displayWhen.platform) {
    const platformNames = displayWhen.calculatedPlatforms.map(platformConfig => platformConfig.name);
    resultsToConsider.push(isPlatformMatch(platformNames, displayWhen.platform));
  }
  if (displayWhen.orientation) {
    resultsToConsider.push(isOrientationMatch(displayWhen.win, displayWhen.orientation));
  }

  if (!resultsToConsider.length) {
    return true;
  }
  if (resultsToConsider.length === 1) {
    return resultsToConsider[0];
  }
  return resultsToConsider.reduce((prev: boolean, current: boolean) => {
    if (displayWhen.or) {
      return prev || current;
    }
    return prev && current;
  });
}

export function isOrientationMatch(win: Window, orientation: string) {
  if (orientation === 'portrait') {
    return isPortrait(win);
  } else if (orientation === 'landscape') {
    return !isPortrait(win);
  }
  // it's an invalid orientation, so just return it
  return false;
}

export function isPortrait(win: Window): boolean {
  return matchMedia(win, '(orientation: portrait)');
}


const SIZE_TO_MEDIA: any = {
  'xs': '(min-width: 0px)',
  'sm': '(min-width: 576px)',
  'md': '(min-width: 768px)',
  'lg': '(min-width: 992px)',
  'xl': '(min-width: 1200px)',
};

// order from most specifc to least specific
export const PLATFORM_CONFIGS: PlatformConfig[] = [

  {
    name: 'ipad',
    isMatch: isIpad
  },
  {
    name: 'iphone',
    isMatch: isIphone
  },
  {
    name: 'ios',
    isMatch: isIOS
  },
  {
    name: 'android',
    isMatch: isAndroid
  },
  {
    name: 'phablet',
    isMatch: isPhablet
  },
  {
    name: 'tablet',
    isMatch: isTablet
  },
  {
    name: 'cordova',
    isMatch: isCordova
  },
  {
    name: 'electron',
    isMatch: isElectron
  }

];

export interface PlatformConfig {
  name: string;
  isMatch: (win: Window) => boolean;
}

export function detectPlatforms(win: Window, platforms: PlatformConfig[]) {
  // bracket notation to ensure they're not property renamed
  return platforms.filter(p => p.isMatch(win));
}

export interface DisplayWhen {
  calculatedPlatforms: PlatformConfig[];
  config: Config;
  win: Window;
  mediaQuery?: string;
  mode: Mode;
  or: boolean;
  orientation?: string;
  passesTest: boolean;
  platform?: string;
  size?: string;
}

