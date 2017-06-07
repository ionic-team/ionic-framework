import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer } from '@angular/core';

import { Config } from '../../config/config';
import { Ion } from '../ion';
import { Tab } from './tab';

/**
 * @hidden
 */
@Component({
  selector: '.tab-button',
  template:
    '<ion-icon *ngIf="tab.tabIcon" [name]="tab.tabIcon" [isActive]="tab.isSelected" class="tab-button-icon"></ion-icon>' +
    '<span *ngIf="tab.tabTitle" class="tab-button-text">{{tab.tabTitle}}</span>' +
    '<ion-badge *ngIf="tab.tabBadge" class="tab-badge" [color]="tab.tabBadgeStyle">{{tab.tabBadge}}</ion-badge>' +
    '<div class="button-effect"></div>',
  host: {
    '[attr.id]': 'tab._btnId',
    '[attr.aria-controls]': 'tab._tabId',
    '[attr.aria-selected]': 'tab.isSelected',
    '[class.has-title]': 'hasTitle',
    '[class.has-icon]': 'hasIcon',
    '[class.has-title-only]': 'hasTitleOnly',
    '[class.icon-only]': 'hasIconOnly',
    '[class.has-badge]': 'hasBadge',
    '[class.disable-hover]': 'disHover',
    '[class.tab-disabled]': '!tab.enabled',
    '[class.tab-hidden]': '!tab.show',
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
