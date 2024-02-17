import type { ComponentInterface, EventEmitter } from '@stencil/core';
import { Build, Component, Element, Event, Host, Prop, State, Watch, h } from '@stencil/core';

import { getIonTheme } from '../../global/ionic-global';

// TODO(FW-2832): types

const SPLIT_PANE_MAIN = 'split-pane-main';
const SPLIT_PANE_SIDE = 'split-pane-side';
const QUERY: { [key: string]: string } = {
  xs: '(min-width: 0px)',
  sm: '(min-width: 576px)',
  md: '(min-width: 768px)',
  lg: '(min-width: 992px)',
  xl: '(min-width: 1200px)',
  never: '',
};

@Component({
  tag: 'ion-split-pane',
  styleUrls: {
    ios: 'split-pane.ios.scss',
    md: 'split-pane.md.scss',
    ionic: 'split-pane.md.scss',
  },
  shadow: true,
})
export class SplitPane implements ComponentInterface {
  private rmL?: () => void;

  @Element() el!: HTMLElement;
  @State() visible = false;

  /**
   * The `id` of the main content. When using
   * a router this is typically `ion-router-outlet`.
   * When not using a router, this is typically
   * your main view's `ion-content`. This is not the
   * id of the `ion-content` inside of your `ion-menu`.
   */
  @Prop({ reflect: true }) contentId?: string;

  /**
   * If `true`, the split pane will be hidden.
   */
  @Prop() disabled = false;

  /**
   * When the split-pane should be shown.
   * Can be a CSS media query expression, or a shortcut expression.
   * Can also be a boolean expression.
   */
  @Prop() when: string | boolean = QUERY['lg'];

  /**
   * Expression to be called when the split-pane visibility has changed
   */
  @Event() ionSplitPaneVisible!: EventEmitter<{ visible: boolean }>;

  @Watch('visible')
  visibleChanged(visible: boolean) {
    const detail = { visible, isPane: this.isPane.bind(this) };
    this.ionSplitPaneVisible.emit(detail);
  }

  async connectedCallback() {
    // TODO: connectedCallback is fired in CE build
    // before WC is defined. This needs to be fixed in Stencil.
    if (typeof customElements !== 'undefined' && customElements != null) {
      await customElements.whenDefined('ion-split-pane');
    }
    this.styleChildren();
    this.updateState();
  }

  disconnectedCallback() {
    if (this.rmL) {
      this.rmL();
      this.rmL = undefined;
    }
  }

  @Watch('disabled')
  @Watch('when')
  protected updateState() {
    if (!Build.isBrowser) {
      return;
    }
    if (this.rmL) {
      this.rmL();
      this.rmL = undefined;
    }

    // Check if the split-pane is disabled
    if (this.disabled) {
      this.visible = false;
      return;
    }

    // When query is a boolean
    const query = this.when;
    if (typeof query === 'boolean') {
      this.visible = query;
      return;
    }

    // When query is a string, let's find first if it is a shortcut
    const mediaQuery = QUERY[query] || query;

    // Media query is empty or null, we hide it
    if (mediaQuery.length === 0) {
      this.visible = false;
      return;
    }

    // Listen on media query
    const callback = (q: MediaQueryList) => {
      this.visible = q.matches;
    };

    const mediaList = window.matchMedia(mediaQuery);
    // TODO FW-5869
    mediaList.addListener(callback as any);
    this.rmL = () => mediaList.removeListener(callback as any);
    this.visible = mediaList.matches;
  }

  private isPane(element: HTMLElement): boolean {
    if (!this.visible) {
      return false;
    }
    return element.parentElement === this.el && element.classList.contains(SPLIT_PANE_SIDE);
  }

  private styleChildren() {
    if (!Build.isBrowser) {
      return;
    }
    const contentId = this.contentId;
    const children = this.el.children;
    const nu = this.el.childElementCount;
    let foundMain = false;
    for (let i = 0; i < nu; i++) {
      const child = children[i] as HTMLElement;
      const isMain = contentId !== undefined && child.id === contentId;
      if (isMain) {
        if (foundMain) {
          console.warn('split pane cannot have more than one main node');
          return;
        }
        foundMain = true;
      }
      setPaneClass(child, isMain);
    }
    if (!foundMain) {
      console.warn('split pane does not have a specified main node');
    }
  }

  render() {
    const theme = getIonTheme(this);
    return (
      <Host
        class={{
          [theme]: true,

          // Used internally for styling
          [`split-pane-${theme}`]: true,

          'split-pane-visible': this.visible,
        }}
      >
        <slot></slot>
      </Host>
    );
  }
}

const setPaneClass = (el: HTMLElement, isMain: boolean) => {
  let toAdd;
  let toRemove;
  if (isMain) {
    toAdd = SPLIT_PANE_MAIN;
    toRemove = SPLIT_PANE_SIDE;
  } else {
    toAdd = SPLIT_PANE_SIDE;
    toRemove = SPLIT_PANE_MAIN;
  }
  const classList = el.classList;
  classList.add(toAdd);
  classList.remove(toRemove);
};
