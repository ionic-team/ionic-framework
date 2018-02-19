import { Component, CssClassMap, Element, Prop, State } from '@stencil/core';
import { createThemedClasses, getElementClassMap } from '../../utils/theme';


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
   * If true, the fab button will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  @Prop() activated = false;
  @Prop() toggleActive: Function;

  @Prop() show = false;

  @State() private inContainer = false;
  @State() private inList = false;

  /**
   * If true, the user cannot interact with the fab button. Defaults to `false`.
   */
  @Prop() disabled = false;

  componentDidLoad() {
    const parentNode = this.el.parentNode;
    const parentTag = parentNode ? parentNode.nodeName : null;

    this.inList = (parentTag === 'ION-FAB-LIST');
    this.inContainer = (parentTag === 'ION-FAB');
  }


  clickedFab() {
    if (this.inContainer) {
      this.toggleActive();
    }
  }

  /**
   * Get the classes for fab buttons in lists
   */
  getFabClassMap(): CssClassMap {
    return {
      'fab-button-in-list': this.inList,
      [`fab-button-${this.mode}-in-list`]: this.inList,
      [`fab-button-translucent-${this.mode}-in-list`]: (this.inList && this.translucent),

      'fab-button-close-active': this.activated,
      'fab-button-show': this.show,
    };
  }

  render() {
    const themedClasses = createThemedClasses(this.mode, this.color, 'fab-button');
    const translucentClasses = this.translucent ? createThemedClasses(this.mode, this.color, 'fab-button-translucent') : {};
    const hostClasses = getElementClassMap(this.el.classList);


    const TagType = this.href ? 'a' : 'button';

    const fabClasses = {
      ...this.getFabClassMap(),
      ...themedClasses,
      ...translucentClasses,
      ...hostClasses,
    };

    return (
      <TagType
        class={fabClasses}
        disabled={this.disabled}
        href={this.href}
        onClick={this.clickedFab.bind(this)}>
        <ion-icon name='close' class='fab-button-close-icon'></ion-icon>
        <span class='fab-button-inner'>
          <slot></slot>
        </span>
        { this.mode === 'md' && <ion-ripple-effect/> }
      </TagType>
    );
  }
}
