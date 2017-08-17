import { PointerEvents, PointerEventsConfig } from './pointer-events';
import { EventListenerOptions, Platform } from '../platform/platform';
/**
 * @hidden
 */
export declare class UIEventManager {
    plt: Platform;
    private evts;
    constructor(plt: Platform);
    pointerEvents(config: PointerEventsConfig): PointerEvents;
    listen(ele: any, eventName: string, callback: any, opts: EventListenerOptions): Function;
    unlistenAll(): void;
    destroy(): void;
}
