
export const CSS_PROP = function(docEle: HTMLElement) {
  // transform
  const transformProp = [
    'webkitTransform',
    '-webkit-transform',
    'webkit-transform',
    'transform'
  ].find(key => (docEle.style as any)[key] !== undefined) || 'transform';

  const transitionProp = [
    'webkitTransition',
    'transition'
  ].find(key => (docEle.style as any)[key] !== undefined) || 'transition';

  // The only prefix we care about is webkit for transitions.
  const prefix = transitionProp.indexOf('webkit') > -1 ? '-webkit-' : '';

  return {
    transitionDurationProp: prefix + 'transition-duration',
    transitionTimingFnProp: prefix + 'transition-timing-function',
    transformProp,
    transitionProp
  };

}(document.documentElement);

export const CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
export const DURATION_MIN = 32;
export const TRANSITION_END_FALLBACK_PADDING_MS = 400;
