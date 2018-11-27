import { ProxyControllerInterface } from './interfaces';
export default class ProxyController implements ProxyControllerInterface {
    tag: string;
    constructor(tag: string);
    create(opts?: object): Promise<HTMLElement>;
    dismiss(): Promise<void>;
    getTop(): Promise<HTMLElement>;
}
//# sourceMappingURL=proxy-controller.d.ts.map