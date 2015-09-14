import {Directive} from 'angular2/angular2';


/**
 * TODO
 */
@Directive({
  selector: 'button,[button]',
  host: {
    '[class.icon-left]': 'iconLeft',
    '[class.icon-right]': 'iconRight',
    '[class.icon-only]': 'iconOnly'
  }
})
export class Button {

  constructor() {
    this.iconLeft = this.iconRight = this.iconOnly = false;
  }

  /**
   * TODO
   * @param {TODO} icon  TODO
   */
  registerIcon(icon) {
    this.iconLeft = icon.iconLeft;
    this.iconRight = icon.iconRight;
    this.iconOnly = icon.iconOnly;
  }
}
