import { ComponentFactoryResolver } from '@angular/core';

declare const __zone_symbol__requestAnimationFrame: any;
declare const requestAnimationFrame: any;

export const raf = (h: any): any => {
  if (typeof __zone_symbol__requestAnimationFrame === 'function') {
    return __zone_symbol__requestAnimationFrame(h);
  }
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(h);
  }
  return setTimeout(h);
};

export const isComponentFactoryResolver = (item: any): item is ComponentFactoryResolver => {
  return !!item.resolveComponentFactory;
};
