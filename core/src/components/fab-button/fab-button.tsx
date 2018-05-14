import { Component, Element, Prop } from '@stencil/core';
import { Color, CssClassMap, Mode } from '../../interface';
import { createThemedClasses, getElementClassMap } from '../../utils/theme';


@Component({
  tag: 'ion-fab-button',
  styleUrls: {
    ios: 'fab-button.ios.scss',
    md: 'fab-button.md.scss'
  }
})
export class FabButton {

  private inList = false;

  @Element() el!: HTMLElement;

  /**
   * The color to use from your Sass `$colors` map.
   * Default options are: `"primary"`, `"secondary"`, `"tertiary"`, `"success"`, `"warning"`, `"danger"`, `"light"`, `"medium"`, and `"dark"`.
   * For more information, see [Theming your App](/docs/theming/theming-your-app).
   */
  @Prop() color?: Color;

  /**
   * The mode determines which platform styles to use.
   * Possible values are: `"ios"` or `"md"`.
   * For more information, see [Platform Styles](/docs/theming/platform-specific-styles).
   */
  @Prop() mode!: Mode;

  /**
   * If true, the fab button will be show a close icon. Defaults to `false`.
   */
  @Prop() activated = false;

  /**
   * If true, the user cannot interact with the fab button. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * Contains a URL or a URL fragment that the hyperlink points to.
   * If this property is set, an anchor tag will be rendered.
   */
  @Prop() href?: string;

  /**
   * If true, the fab button will be translucent. Defaults to `false`.
   */
  @Prop() translucent = false;

  @Prop() show = false;

  componentWillLoad() {
    const parentNode = this.el.parentNode;
    const parentTag = parentNode ? parentNode.nodeName : null;

    this.inList = (parentTag === 'ION-FAB-LIST');
  }

  /**
   * Get the classes for fab buttons in lists
   */
  private getFabClassMap(): CssClassMap {
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
        href={this.href}>
        <ion-icon name="close" class="fab-button-close-icon"></ion-icon>
        <span class="fab-button-inner">
          <slot></slot>
        </span>
        { this.mode === 'md' && <ion-ripple-effect tapClick={true}/> }
      </TagType>
    );
  }
}
