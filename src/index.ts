
export { ionicBootstrap, ionicPostBootstrap } from './config/bootstrap';
export { Config } from './config/config';
export { IONIC_DIRECTIVES } from './config/directives';
export { ionicProviders } from './config/providers';

export * from './decorators/page';

export * from './components';

export * from './gestures/drag-gesture';
export * from './gestures/gesture';
export * from './gestures/slide-edge-gesture';
export * from './gestures/slide-gesture';
export * from './gestures/gesture-controller';

export * from './gestures/hammer/gesture-direction';
export * from './gestures/hammer/pan-gesture';
export * from './gestures/hammer/pinch-gesture';
export * from './gestures/hammer/press-gesture';
export * from './gestures/hammer/rotate-gesture';
export * from './gestures/hammer/swipe-gesture';
export * from './gestures/hammer/tap-gesture';

export * from './platform/platform';
export * from './platform/storage';

export * from './util/click-block';
export * from './util/events';
export * from './util/keyboard';
export * from './util/form';
export { reorderArray } from './util/util';

export * from './animations/animation';
export * from './transitions/page-transition';
export * from './transitions/transition';

export * from './translation/translate';
export * from './translation/translate_pipe';

// these modules don't export anything
import './config/modes';
import './platform/registry';
import './animations/builtins';
import './transitions/transition-ios';
import './transitions/transition-md';
import './transitions/transition-wp';
