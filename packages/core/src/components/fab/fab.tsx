import { Component, Element, CssClassMap, Method, Prop, State } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';


/**
  * @name FabButton
  * @module ionic
  *
  * @description
  * FABs (Floating Action Buttons) are standard material design components. They are shaped as a circle that represents a promoted action. When pressed, it may contain more related actions.
  * FABs as its name suggests are floating over the content in a fixed position. This is not achieved exclusively with `<button ion-fab>Button</button>` but it has to wrapped with the `<ion-fab>` component, like this:
  *
  * ```html
  * <ion-content>
  *  <!-- Real floating action button, fixed. It will not scroll with the content -->
  *  <ion-fab>
  *    <button ion-fab>Button</button>
  *  </ion-fab>
  *
  *  <!-- Button shaped as a circle that just like a normal button scrolls with the content -->
  *  <button ion-fab>Button</button>
  * </ion-content>
  *
  * ```
  *
  * In case the button is not wrapped with `<ion-fab>`, the fab button will behave like a normal button, scrolling with the content.
  *
  * See [ion-fab] to learn more information about how to position the fab button.
  *
  * @property [mini] - Makes a fab button with a reduced size.
  *
  * @usage
  *
  * ```html
  *
  * <!-- Colors -->
  * <ion-fab>
  *   <button ion-fab color="primary">Button</button>
  * </ion-fab>
  *
  * <!-- Mini -->
  * <ion-fab>
  *   <button ion-fab mini>Small</button>
  * </ion-fab>
  * ```
  *
  * @demo /docs/demos/src/fab/
  * @see {@link /docs/components#fabs FAB Component Docs}
 */
@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab.ios.scss',
    md: 'fab.md.scss',
    wp: 'fab.wp.scss'
  }
})
export class FabButton {
  @Element() private el: HTMLElement;
  private mode: string;
  private color: string;

  @Prop() href: string;

  @State() private activated: boolean = false;
  @State() private show: boolean = false;
  @State() private inContainer: boolean = false;
  @State() private inList: boolean = false;

  /**
   * @Prop {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  ionViewDidLoad() {
    const parentNode = this.el.parentNode.nodeName;

    this.inList = (parentNode === 'ION-FAB-LIST');
    this.inContainer = (parentNode === 'ION-FAB');
  }

  clickedFab() {
    if (this.inContainer) {
      const activated = !this.activated;
      this.setActiveLists(activated);
    }
  }

  /**
   * @hidden
   */
  setActiveLists(activated: boolean) {
    const lists = this.el.parentElement.querySelectorAll('ion-fab-list') as NodeListOf<any>;

    if (lists.length > 0) {
      this.activated = activated;
    }

    for (var i = 0; i < lists.length; i++) {
      const list = lists[i].$instance;
      list.activated = activated;
    }
  }

  /**
   * Close an active FAB list container
   */
  @Method()
  close() {
    this.setActiveLists(false);
  }

  /**
   * @hidden
   * Get the element classes to add to the child element
   */
  getElementClassList() {
    let classList = [].concat(
      this.el.className.length ? this.el.className.split(' ') : []
    );

    return classList;
  }

  /**
   * @hidden
   * Get the classes for fab buttons in lists
   */
  getFabListClassList() {
    if (!this.inList) {
      return [];
    }
    return [
      `fab-in-list`,
      `fab-${this.mode}-in-list`
    ];
  }

  /**
   * @hidden
   * Get the close active class for fab buttons
   */
  getFabActiveClassList() {
    if (!this.activated) {
      return [];
    }
    return [
      `fab-close-active`
    ];
  }

  /**
   * @hidden
   * Get the show class for fab buttons
   */
  getFabShowClassList() {
    if (!this.show) {
      return [];
    }
    return [
      `show`
    ];
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'fab');

    var fabClasses: CssClassMap = []
      .concat(
        this.getElementClassList(),
        this.getFabListClassList(),
        this.getFabActiveClassList(),
        this.getFabShowClassList()
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    const TagType = this.href ? 'a' : 'button';

    fabClasses = Object.assign(fabClasses, themedClasses);

    return (
      <TagType class={fabClasses} onClick={this.clickedFab.bind(this)} disabled={this.disabled}>
        <ion-icon name="close" class="fab-close-icon"></ion-icon>
        <span class='button-inner'>
          <slot></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }
}
