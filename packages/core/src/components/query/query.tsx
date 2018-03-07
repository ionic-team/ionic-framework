import { Component, Element, Listen, Method, Prop, State } from '@stencil/core';
import { Config, PlatformConfig } from '../../index';

@Component({
  tag: 'ion-query',
  styleUrl: './query.scss'
})
export class Query {
  or = false;
  @Element() element: HTMLElement;
  @Prop({ context: 'config' })
  config: Config;
  @Prop({ context: 'platforms' })
  calculatedPlatforms: PlatformConfig[];

  /**
   * When the device's orientation matches the value, the element will show
   */
  @Prop() orientation: string;

  /**
   * When the device OS matches the value, the element will show. Examples are
   * "ios" or "android"
   */
  @Prop() platform: string;
  /**
   * When the app's mode matches the value, the element will show. This differs
   * from `platform` as you could be on iOS, but use the `md` mode.
   */
  @Prop() mode: string;

  /**
   * Shorthand method for showing an element based on preset sizes.
   * Valid sizes are `xs`, `sm`, `md`, `lg`, or `xl`.
   */
  @Prop() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';

  /**
   * Bind the elements visibility to any valid CSS media query.
   * This uses `matchMedia` under the hood.
   */
  @Prop() mediaQuery: string;

  @State() queryMatches = false;

  @Listen('window:resize')
  componentWillLoad() {
    return updateTestResults(this);
  }

  /**
   * Method to check if the element currently matches the specific queries.
   */
  @Method()
  doesMatch(): boolean {
    return this.queryMatches;
  }

  hostData() {
    return {
      class: {
        'show-content': this.queryMatches,
        'hide-content': !this.queryMatches
      }
    };
  }
}

export function updateTestResults(displayWhen: Query) {
  displayWhen.queryMatches = getTestResult(displayWhen);
}

export function isPlatformMatch(platforms: string[], multiPlatformString: string) {
  const userProvidedPlatforms = multiPlatformString
    .replace(/\s/g, '')
    .split(',');
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

export function isMediaQueryMatch(mediaQuery: string) {
  return window.matchMedia(mediaQuery).matches;
}

export function isSizeMatch(multiSizeString: string) {
  const sizes = multiSizeString.replace(/\s+/g, '').split(',');
  for (const size of sizes) {
    const mediaQuery = SIZE_TO_MEDIA[size] ? SIZE_TO_MEDIA[size] : size;
    if (isMediaQueryMatch(mediaQuery)) {
      return true;
    }
  }
  return false;
}

export function getTestResult(displayWhen: Query) {
  const resultsToConsider: boolean[] = [];
  if (displayWhen.mediaQuery) {
    console.log(displayWhen.mediaQuery);
    resultsToConsider.push(isMediaQueryMatch(displayWhen.mediaQuery));
  }
  if (displayWhen.size) {
    resultsToConsider.push(isSizeMatch(displayWhen.size));
  }
  if (displayWhen.mode) {
    resultsToConsider.push(isModeMatch(displayWhen.config, displayWhen.mode));
  }
  if (displayWhen.platform) {
    const platformNames = displayWhen.calculatedPlatforms.map(
      platformConfig => platformConfig.name
    );
    resultsToConsider.push(
      isPlatformMatch(platformNames, displayWhen.platform)
    );
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
  if (orientation === 'portrait') {
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

const SIZE_TO_MEDIA: any = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)'
};
