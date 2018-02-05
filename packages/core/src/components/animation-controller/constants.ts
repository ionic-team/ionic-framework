
export let CSS_PROP = function(docEle: HTMLElement) {
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


export let TRANSFORM_PROPS: {[key: string]: number} = {
  'translateX': 1,
  'translateY': 1,
  'translateZ': 1,

  'scale': 1,
  'scaleX': 1,
  'scaleY': 1,
  'scaleZ': 1,

  'rotate': 1,
  'rotateX': 1,
  'rotateY': 1,
  'rotateZ': 1,

  'skewX': 1,
  'skewY': 1,
  'perspective': 1
};

export let CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
export let DURATION_MIN = 32;
export let TRANSITION_END_FALLBACK_PADDING_MS = 400;
