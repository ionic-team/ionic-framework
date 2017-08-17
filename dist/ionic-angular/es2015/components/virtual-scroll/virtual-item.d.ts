import { TemplateRef, ViewContainerRef } from '@angular/core';
import { VirtualContext } from './virtual-util';
/**
 * @hidden
 */
export declare class VirtualItem {
    templateRef: TemplateRef<VirtualContext>;
    viewContainer: ViewContainerRef;
    constructor(templateRef: TemplateRef<VirtualContext>, viewContainer: ViewContainerRef);
}
