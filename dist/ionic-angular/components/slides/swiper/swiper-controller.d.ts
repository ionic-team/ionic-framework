import { Slides } from '../slides';
import { Platform } from '../../../platform/platform';
export declare const SWIPER_CONTROLLER: {
    LinearSpline: (_s: Slides, _platform: Platform, x: any, y: any) => void;
    getInterpolateFunction: (s: Slides, plt: Platform, c: Slides) => void;
    setTranslate: (s: Slides, plt: Platform, translate: number, byController: Slides, setWrapperTranslate: any) => void;
    setTransition: (s: Slides, plt: Platform, duration: number, byController: Slides, setWrapperTransition: any) => void;
};
