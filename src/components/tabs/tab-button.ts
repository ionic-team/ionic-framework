import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

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
  private layout: string;

  @Input() tab: Tab;

  @Output() ionSelect: EventEmitter<Tab> = new EventEmitter<Tab>();

  constructor(config: Config, elementRef: ElementRef) {
    super(elementRef);
    this.disHover = (config.get('hoverCSS') === false);
    this.layout = config.get('tabbarLayout');
  }

  ngOnInit() {
    this.tab.btn = this;
    this.layout = this.tab.parent.tabbarLayout || this.layout;

    this.hasTitle = !!this.tab.tabTitle;
    this.hasIcon = !!this.tab.tabIcon && this.layout !== 'icon-hide';
    this.hasTitleOnly = (this.hasTitle && !this.hasIcon);
    this.hasIconOnly = (this.hasIcon && !this.hasTitle);
    this.hasBadge = !!this.tab.tabBadge;
  }

  @HostListener('click', ['$event'])
  private onClick(ev: UIEvent) {
    this.ionSelect.emit(this.tab);
    ev.preventDefault();
  }
}
