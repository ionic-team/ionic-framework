import { Directive, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Tab } from './tab';

/**
 * @private
 */
@Directive({
  selector: '.tab-button',
  host: {
    '[attr.id]': 'tab._btnId',
    '[attr.aria-controls]': 'tab._tabId',
    '[attr.aria-selected]': 'tab.isSelected',
    '[class.has-title]': 'hasTitle',
    '[class.has-icon]': 'hasIcon',
    '[class.has-title-only]': 'hasTitleOnly',
    '[class.icon-only]': 'hasIconOnly',
    '[class.has-badge]': 'hasBadge',
    '[class.disable-hover]': 'disHover'
  }
})
export class TabButton extends Ion implements OnInit {
  disHover: boolean;
  hasTitle: boolean;
  hasIcon: boolean;
  hasTitleOnly: boolean;
  hasIconOnly: boolean;
  hasBadge: boolean;
  layout: string;

  @Input() tab: Tab;

  @Output() ionSelect: EventEmitter<Tab> = new EventEmitter<Tab>();

  constructor(config: Config, elementRef: ElementRef, renderer: Renderer) {
    super(config, elementRef, renderer);

    this.disHover = (config.get('hoverCSS') === false);
    this.layout = config.get('tabsLayout');

    // TODO deprecated 07-07-2016 beta.11
    if (config.get('tabbarLayout') !== undefined) {
      this.layout = config.get('tabbarLayout');
    }
  }

  ngOnInit() {
    this.tab.btn = this;
    this.layout = this.tab.parent.tabsLayout || this.layout;

    this.hasTitle = !!this.tab.tabTitle;
    this.hasIcon = !!this.tab.tabIcon && this.layout !== 'icon-hide';
    this.hasTitleOnly = (this.hasTitle && !this.hasIcon);
    this.hasIconOnly = (this.hasIcon && !this.hasTitle);
    this.hasBadge = !!this.tab.tabBadge;
  }

  @HostListener('click')
  onClick(): boolean {
    this.ionSelect.emit(this.tab);
    return false;
  }

  updateHref(href: string) {
    this.setElementAttribute('href', href);
  }

}
