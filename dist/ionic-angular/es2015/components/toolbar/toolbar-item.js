import { ContentChildren, Directive, ElementRef, Inject, Optional, Renderer, forwardRef } from '@angular/core';
import { Button } from '../button/button';
import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Navbar } from './navbar';
import { Toolbar } from './toolbar';
/**
 * @hidden
 */
export class ToolbarItem extends Ion {
    /**
     * @param {?} config
     * @param {?} elementRef
     * @param {?} renderer
     * @param {?} toolbar
     * @param {?} navbar
     */
    constructor(config, elementRef, renderer, toolbar, navbar) {
        super(config, elementRef, renderer, 'bar-buttons');
        this.inToolbar = !!(toolbar || navbar);
    }
    /**
     * @param {?} buttons
     * @return {?}
     */
    set _buttons(buttons) {
        if (this.inToolbar) {
            buttons.forEach((button) => {
                button.setRole('bar-button');
            });
        }
    }
}
ToolbarItem.decorators = [
    { type: Directive, args: [{
                selector: 'ion-buttons,[menuToggle]'
            },] },
];
/**
 * @nocollapse
 */
ToolbarItem.ctorParameters = () => [
    { type: Config, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: Toolbar, decorators: [{ type: Optional },] },
    { type: Navbar, decorators: [{ type: Optional }, { type: Inject, args: [forwardRef(() => Navbar),] },] },
];
ToolbarItem.propDecorators = {
    '_buttons': [{ type: ContentChildren, args: [Button,] },],
};
function ToolbarItem_tsickle_Closure_declarations() {
    /** @type {?} */
    ToolbarItem.decorators;
    /**
     * @nocollapse
     * @type {?}
     */
    ToolbarItem.ctorParameters;
    /** @type {?} */
    ToolbarItem.propDecorators;
    /** @type {?} */
    ToolbarItem.prototype.inToolbar;
}
//# sourceMappingURL=toolbar-item.js.map