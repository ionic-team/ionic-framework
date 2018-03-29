import { Directive, ElementRef, Input } from '@angular/core';
import { inputs } from './proxies';


@Directive({ selector: 'ion-icon' })
export class Icon {

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Input() color: string;

  /**
   * Specifies the label to use for accessibility. Defaults to the icon name.
   */
  @Input() ariaLabel = '';

  /**
   * Specifies which icon to use on `ios` mode.
   */
  @Input() ios = '';

  /**
   * Specifies which icon to use on `md` mode.
   */
  @Input() md = '';

  /**
   * Specifies which icon to use. The appropriate icon will be used based on the mode.
   * For more information, see [Ionicons](/docs/ionicons/).
   */
  @Input() name = '';

  /**
   * The size of the icon.
   * Available options are: `"small"` and `"large"`.
   */
  @Input() size: string;

  constructor(el: ElementRef) {
    inputs(this, el, ['color', 'ariaLabel', 'ios', 'md', 'name', 'size']);
  }
}
