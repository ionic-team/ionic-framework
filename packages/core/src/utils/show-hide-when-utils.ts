import { Config, PlatformConfig } from '../index';

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
  for (const mode of modes) {
    if (config.get('mode') === mode) {
      return true;
    }
  }
  return false;
}


export function isMediaQueryMatch(mediaQuery: string) {
  return window.matchMedia(mediaQuery).matches;
}

export function isSizeMatch(multiSizeString: string) {
  const sizes = multiSizeString.replace(/\s/g, '').split(',');

  const booleans = sizes.map(size => {
    const mediaQuery = sizeToMediaQueryMap.get(size);
    if (!mediaQuery) {
      return false;
    }

    return window.matchMedia(mediaQuery).matches;
  });
  return booleans.reduce((prev, current) => prev || current);
}

export function getTestResult(displayWhen: DisplayWhen) {
  const resultsToConsider: boolean[] = [];
  if (displayWhen.mediaQuery) {
    resultsToConsider.push(isMediaQueryMatch(displayWhen.mediaQuery));
  }
  if (displayWhen.size) {
    resultsToConsider.push(isSizeMatch(displayWhen.size));
  }
  if (displayWhen.mode) {
    resultsToConsider.push(isModeMatch(displayWhen.config, displayWhen.mode));
  }
  if (displayWhen.platform) {
    const platformNames = displayWhen.calculatedPlatforms.map(platformConfig => platformConfig.name);
    resultsToConsider.push(isPlatformMatch(platformNames, displayWhen.platform));
  }
  if (displayWhen.orientation) {
    resultsToConsider.push(isOrientationMatch(displayWhen.orientation));
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

export function isOrientationMatch(orientation: string) {
  if (orientation == 'portrait') {
    return isPortrait();
  } else if (orientation === 'landscape') {
    return !isPortrait();
  }
  // it's an invalid orientation, so just return it
  return false;
}

export function isPortrait(): boolean {
  return window.matchMedia('(orientation: portrait)').matches;
}

const sizeToMediaQueryMap = new Map<string, string>();
sizeToMediaQueryMap.set('xs', '(min-width: 0px)');
sizeToMediaQueryMap.set('sm', '(min-width: 576px)');
sizeToMediaQueryMap.set('md', '(min-width: 768px)');
sizeToMediaQueryMap.set('lg', '(min-width: 992px)');
sizeToMediaQueryMap.set('xl', '(min-width: 1200px)');

export interface DisplayWhen {
  calculatedPlatforms: PlatformConfig[];
  config: Config;
  mediaQuery: string;
  mode: string;
  or: boolean;
  orientation: string;
  passesTest: boolean;
  platform: string;
  size: string;
}