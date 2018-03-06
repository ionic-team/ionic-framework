import { Component, Element, Event, EventEmitter, Method, Prop, State, Watch } from '@stencil/core';
import { asyncRaf } from '../../utils/helpers';


@Component({
  tag: 'ion-tab',
  styleUrl: 'tab.scss'
})
export class Tab {

  private loaded = false;
  @Element() el: HTMLIonTabElement;

  @State() init = false;

  @Prop({ mutable: true }) active = false;

  @Prop() btnId: string;

  /**
   * The title of the tab.
   */
  @Prop() title: string;

  /**
   * The icon for the tab.
   */
  @Prop() icon: string;

  /**
   * The badge for the tab.
   */
  @Prop() badge: string;

  /**
   * The badge color for the tab button.
   */
  @Prop() badgeStyle = 'default';

  /**
   * The component to display inside of the tab.
   */
  @Prop() component: any;

  /**
   * The name of the tab.
   */
  @Prop() name: string;

  /**
   * If true, the user cannot interact with the tab. Defaults to `false`.
   */
  @Prop() disabled = false;

  /**
   * If true, the tab will be selected. Defaults to `false`.
   */
  @Prop({ mutable: true }) selected = false;

  @Watch('selected')
  selectedChanged(selected: boolean) {
    if (selected) {
      this.ionSelect.emit();
    }
  }

  /**
   * If true, the tab button is visible within the tabbar. Defaults to `true`.
   */
  @Prop() show = true;

  /**
   * If true, hide the tabs on child pages.
   */
  @Prop() tabsHideOnSubPages = false;


  /**
   * Emitted when the current tab is selected.
   */
  @Event() ionSelect: EventEmitter<void>;

  @Method()
  getRouteId(): string|null {
    if (this.name) {
      return this.name;
    }
    if (typeof this.component === 'string') {
      return this.component;
    }
    return null;
  }

  @Method()
  setActive(): Promise<HTMLIonTabElement> {
    return this.prepareLazyLoaded().then(() => this.showTab());
  }

  private prepareLazyLoaded(): Promise<any> {
    if (!this.loaded && this.component) {
      this.loaded = true;
      return attachViewToDom(this.el, this.component).then(() => asyncRaf());
    }
    return Promise.resolve();
  }

  private showTab(): Promise<HTMLIonTabElement> {
    this.active = true;
    return Promise.resolve(this.el);
  }

  hostData() {
    return {
      'aria-labelledby': this.btnId,
      'role': 'tabpanel',
      'hidden': !this.active,
      'class': {
        'ion-page': !this.component
      }
    };
  }

  render() {
    return <slot/>;
  }
}

function attachViewToDom(container: HTMLElement, cmp: string): Promise<any> {
  const el = document.createElement(cmp) as HTMLStencilElement;
  el.classList.add('ion-page');
  container.appendChild(el);
  if (el.componentOnReady) {
    return el.componentOnReady();
  }
  return Promise.resolve();
}
