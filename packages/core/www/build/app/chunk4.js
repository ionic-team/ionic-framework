/*! Built with http://stenciljs.com */
const { h, Context } = window.App;

let CSS_PROP = function (docEle) {
    // transform
    const transformProp = [
        'webkitTransform',
        '-webkit-transform',
        'webkit-transform',
        'transform'
    ].find(key => docEle.style[key] !== undefined) || 'transform';
    const transitionProp = [
        'webkitTransition',
        'transition'
    ].find(key => docEle.style[key] !== undefined) || 'transition';
    // The only prefix we care about is webkit for transitions.
    const prefix = transitionProp.indexOf('webkit') > -1 ? '-webkit-' : '';
    return {
        transitionDurationProp: prefix + 'transition-duration',
        transitionTimingFnProp: prefix + 'transition-timing-function',
        transformProp,
        transitionProp
    };
}(document.documentElement);
let TRANSFORM_PROPS = {
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
let CSS_VALUE_REGEX = /(^-?\d*\.?\d*)(.*)/;
let DURATION_MIN = 32;
let TRANSITION_END_FALLBACK_PADDING_MS = 400;

export { CSS_PROP, CSS_VALUE_REGEX, DURATION_MIN, TRANSFORM_PROPS, TRANSITION_END_FALLBACK_PADDING_MS };
