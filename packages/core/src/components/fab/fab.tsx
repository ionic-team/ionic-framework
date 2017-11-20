import { Component, CssClassMap, Element, Prop, State } from '@stencil/core';
import { createThemedClasses, getElementClassObject } from '../../utils/theme';


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
    md: 'fab.md.scss'
  }
})
export class FabButton {
  @Element() private el: HTMLElement;

  /**
   * @input {string} The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * @input {string} The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * @input {string} Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  @Prop() activated: boolean = false;
  @Prop() toggleActive: Function = () => {};

  @Prop() show: boolean = false;

  @State() private inContainer: boolean = false;
  @State() private inList: boolean = false;

  /**
   * @input {boolean} If true, sets the button into a disabled state.
   */
  @Prop() disabled: boolean = false;

  componentDidLoad() {
    const parentNode = this.el.parentNode.nodeName;

    this.inList = (parentNode === 'ION-FAB-LIST');
    this.inContainer = (parentNode === 'ION-FAB');
  }


  clickedFab() {
    if (this.inContainer) {
      this.toggleActive();
    }
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
    const hostClasses = getElementClassObject(this.el.classList);

    const elementClasses: CssClassMap = []
      .concat(
        this.getFabListClassList(),
        this.getFabActiveClassList(),
        this.getFabShowClassList()
      )
      .reduce((prevValue, cssClass) => {
        prevValue[cssClass] = true;
        return prevValue;
      }, {});

    const TagType = this.href ? 'a' : 'button';

    const fabClasses = {
      ...themedClasses,
      ...hostClasses,
      ...elementClasses
    };

    return (
      <TagType class={fabClasses} onClick={this.clickedFab.bind(this)} disabled={this.disabled}>
        <ion-icon name='close' class='fab-close-icon'></ion-icon>
        <span class='button-inner'>
          <slot></slot>
        </span>
        <div class='button-effect'></div>
      </TagType>
    );
  }
}
