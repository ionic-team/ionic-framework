import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';

const SPLIT_PANE_MAIN = 'split-pane-main';
const SPLIT_PANE_SIDE = 'split-pane-side';
const QUERY: { [key: string]: string }  = {
  'xs': '(min-width: 0px)',
  'sm': '(min-width: 576px)',
  'md': '(min-width: 768px)',
  'lg': '(min-width: 992px)',
  'xl': '(min-width: 1200px)',
  'never': ''
};


@Component({
  tag: 'ion-split-pane',
  styleUrls: {
    ios: 'split-pane.ios.scss',
    md: 'split-pane.md.scss'
  },
  host: {
    theme: 'split-pane'
  }
})
export class SplitPane {

  private rmL: any;

  @Element() el!: HTMLElement;
  @State() visible = false;

  @Prop({context: 'isServer'}) isServer!: boolean;
  @Prop({ context: 'window' }) win!: Window;

  /**
   * If true, the split pane will be hidden. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * When the split-pane should be shown.
   * Can be a CSS media query expression, or a shortcut expression.
   * Can also be a boolean expression.
   */
  @Prop() when: string | boolean = QUERY['md'];

  /**
   * Emitted when the split pane is visible.
   */
  @Event() ionChange!: EventEmitter<{visible: boolean}>;

  /**
   * Expression to be called when the split-pane visibility has changed
   */
  @Event() protected ionSplitPaneVisible!: EventEmitter;

  @Watch('visible')
  visibleChanged(visible: boolean) {
    const detail = { visible };
    this.ionChange.emit(detail);
    this.ionSplitPaneVisible.emit(detail);
  }

  componentDidLoad() {
    this._styleChildren();
    this.whenChanged();
  }

  componentDidUnload() {
    this.rmL && this.rmL();
    this.rmL = null;
  }

  @Watch('when')
  protected whenChanged() {
    if (this.isServer) {
      return;
    }
    this.rmL && this.rmL();
    this.rmL = null;

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
    const defaultQuery = QUERY[query];
    const mediaQuery = (defaultQuery)
      ? defaultQuery
      : query;

    // Media query is empty or null, we hide it
    if (!mediaQuery || mediaQuery.length === 0) {
      this.visible = false;
      return;
    }

    // Listen on media query
    const callback = (q: MediaQueryList) => this.visible = q.matches;
    const mediaList = this.win.matchMedia(mediaQuery);
    mediaList.addListener(callback);
    this.rmL = () => mediaList.removeListener(callback);
    this.visible = mediaList.matches;
  }

  @Method()
  isVisible(): boolean {
    return this.visible;
  }

  @Method()
  isPane(element: HTMLElement): boolean {
    if (!this.visible) {
      return false;
    }
    return element.parentElement === this.el
      && element.classList.contains(SPLIT_PANE_SIDE);
  }

  private _styleChildren() {
    if (this.isServer) {
      return;
    }
    const children = this.el.children;
    const nu = this.el.childElementCount;
    let foundMain = false;
    for (let i = 0; i < nu; i++) {
      const child = children[i] as HTMLElement;
      const isMain = child.hasAttribute('main');
      if (isMain) {
        if (foundMain) {
          console.warn('split pane can not have more than one main node');
          return;
        }
        foundMain = true;
      }
      setPaneClass(child, isMain);
    }
    if (!foundMain) {
      console.warn('split pane could not found any main node');
    }
  }

  hostData() {
    return {
      class: {
        'split-pane-visible': this.visible
      }
    };
  }

}


function setPaneClass(el: HTMLElement, isMain: boolean) {
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
}
