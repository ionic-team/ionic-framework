import {Parent} from 'angular2/src/core/annotations_impl/visibility';
import {Directive, onInit} from 'angular2/src/core/annotations_impl/annotations';
import {View} from 'angular2/src/core/annotations_impl/view';

import {Tabs} from './tabs';


@Directive({
  selector: '.tab-button',
  properties: ['tab'],
  hostProperties: {
    'btnId': 'attr.id',
    'panelId': 'attr.aria-controls',
    'tab.isSelected': 'attr.aria-selected'
  },
  hostListeners: {
    '^click': 'onClick($event)'
  },
  lifecycle: [onInit]
})
export class TabButton {
  constructor(@Parent() tabs: Tabs) {
    this.tabs = tabs;
  }

  onInit() {
    let id = this.tab.item.id
    this.btnId = 'tab-button-' + id;
    this.panelId = 'tab-panel-' + id;
  }

  onClick(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    this.tabs.select(this.tab);
  }
}
