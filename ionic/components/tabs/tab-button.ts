import {Component, Directive, ElementRef, Optional, Host, forwardRef, ViewContainerRef, HostListener, EventEmitter, Output, Input, Renderer} from 'angular2/core';

import {Tab} from './tab';
import {Ion} from '../ion';
import {Config} from '../../config/config';


/**
 * @private
 */
@Directive({
  selector: '.tab-button',
  host: {
    '[attr.id]': 'tab._btnId',
    '[attr.aria-controls]': 'tab._panelId',
    '[attr.aria-selected]': 'tab.isSelected',
    '[class.has-title]': 'hasTitle',
    '[class.has-icon]': 'hasIcon',
    '[class.has-title-only]': 'hasTitleOnly',
    '[class.icon-only]': 'hasIconOnly',
    '[class.has-badge]': 'hasBadge',
    '[class.disable-hover]': 'disHover'
  }
})
export class TabButton extends Ion {
  private disHover: boolean;
  private hasTitle: boolean;
  private hasIcon: boolean;
  private hasTitleOnly: boolean;
  private hasIconOnly: boolean;
  private hasBadge: boolean;
  private _layout: string;

  @Input() tab: Tab;
  @Output() select: EventEmitter<Tab> = new EventEmitter();

  constructor(config: Config, elementRef: ElementRef) {
    super(elementRef);
    this.disHover = (config.get('hoverCSS') === false);
    this._layout = config.get('tabbarLayout');
  }

  ngOnInit() {
    this.tab.btn = this;
    this._layout = this.tab.parent.tabbarLayout || this._layout;

    this.hasTitle = !!this.tab.tabTitle;
    this.hasIcon = !!this.tab.tabIcon && this._layout !== 'icon-hide';
    this.hasTitleOnly = (this.hasTitle && !this.hasIcon);
    this.hasIconOnly = (this.hasIcon && !this.hasTitle);
    this.hasBadge = !!this.tab.tabBadge;
  }

  @HostListener('click')
  private onClick() {
    this.select.emit(this.tab);
  }
}
