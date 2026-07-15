import { raf } from '@ionic/angular/common';
import { setupConfig } from '@ionic/core';
import { defineCustomElements } from '@ionic/core/loader';
// TODO(FW-2827): types
export const appInitialize = (config, doc, zone) => {
    return () => {
        const win = doc.defaultView;
        if (win && typeof window !== 'undefined') {
            setupConfig(Object.assign(Object.assign({}, config), { _zoneGate: (h) => zone.run(h) }));
            const aelFn = '__zone_symbol__addEventListener' in doc.body ? '__zone_symbol__addEventListener' : 'addEventListener';
            return defineCustomElements(win, {
                exclude: ['ion-tabs'],
                syncQueue: true,
                raf,
                jmp: (h) => zone.runOutsideAngular(h),
                ael(elm, eventName, cb, opts) {
                    elm[aelFn](eventName, cb, opts);
                },
                rel(elm, eventName, cb, opts) {
                    elm.removeEventListener(eventName, cb, opts);
                },
            });
        }
    };
};
