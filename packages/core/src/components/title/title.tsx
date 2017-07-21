import { Component } from '@stencil/core';
import { createThemedClasses } from '../../utils/theme';


/**
 * @name Title
 * @description
 * `ion-title` is a component that sets the title of the `Toolbar` or `Navbar`.
 *
 * @usage
 *
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <ion-title>Settings</ion-title>
 *   </ion-navbar>
 *
 * </ion-header>
 * ```
 *
 * Or to create a navbar with a toolbar as a subheader:
 *
 * ```html
 * <ion-header>
 *
 *   <ion-navbar>
 *     <ion-title>Main Header</ion-title>
 *   </ion-navbar>
 *
 *   <ion-toolbar>
 *     <ion-title>Subheader</ion-title>
 *   </ion-toolbar>
 *
 * </ion-header>
 * ```
 *
 * @demo /docs/demos/src/title/
 */
@Component({
  tag: 'ion-title',
  styleUrls: {
    ios: 'title.ios.scss',
    md: 'title.md.scss',
    wp: 'title.wp.scss'
  },
  host: {
    theme: 'title'
  }
})
export class ToolbarTitle {
  mode: string;
  color: string;

  render() {
    const titleClasses = createThemedClasses(this.mode, this.color, 'toolbar-title');

    return [
      <div class={titleClasses}>
        <slot></slot>
      </div>
    ];
  }
}
