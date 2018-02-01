import { Component, CssClassMap, Element, Prop, State } from '@stencil/core';
import { createThemedClasses, getElementClassObject } from '../../utils/theme';


@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab-button.ios.scss',
    md: 'fab-button.md.scss'
  }
})
export class FabButton {
  @Element() private el: HTMLElement;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"danger"`, `"light"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color: string;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode: 'ios' | 'md';

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href: string;

  /**
   * If true, adds transparency to the fab.
   * Only affects `ios` mode. Defaults to `false`.
   */
  @Prop() translucent = false;

  @Prop() activated = false;
  @Prop() toggleActive: Function;

  @Prop() show = false;

  @State() private inContainer = false;
  @State() private inList = false;

  /**
   * If true, sets the button into a disabled state.
   */
  @Prop() disabled = false;

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
   * Get the classes for fab buttons in lists
   */
  getFabListClassList() {
    if (!this.inList) {
      return [];
    }
    const listClasses = [
      `fab-button-in-list`,
      `fab-button-${this.mode}-in-list`
    ];

    if (this.translucent) {
      listClasses.push(`fab-button-translucent-${this.mode}-in-list`);
    }

    return listClasses;
  }

  /**
   * Get the close active class for fab buttons
   */
  getFabActiveClassList() {
    if (!this.activated) {
      return [];
    }
    return [
      `fab-button-close-active`
    ];
  }

  /**
   * Get the show class for fab buttons
   */
  getFabShowClassList() {
    if (!this.show) {
      return [];
    }
    return [
      `fab-button-show`
    ];
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'fab-button');
    const translucentClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'fab-button-translucent') : {};
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
      ...translucentClasses,
      ...hostClasses,
      ...elementClasses
    };

    return (
      <TagType
        class={fabClasses}
        disabled={this.disabled}
        href={this.href}
        onClick={this.clickedFab.bind(this)}>
        <ion-icon name='close' class='fab-button-close-icon'></ion-icon>
        <span class='button-inner'>
          <slot></slot>
        </span>
        { this.mode === 'md' && <ion-ripple-effect useTapClick={true} /> }
      </TagType>
    );
  }
}
