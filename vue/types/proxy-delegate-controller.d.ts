import ProxyController from './proxy-controller';
import { FrameworkDelegate, ProxyDelegateOptions } from './interfaces';
export default class ProxyDelegateController extends ProxyController {
    tag: string;
    static delegate: FrameworkDelegate;
    constructor(tag: string, delegate: FrameworkDelegate);
    create(opts?: ProxyDelegateOptions): Promise<HTMLElement>;
}
//# sourceMappingURL=proxy-delegate-controller.d.ts.map