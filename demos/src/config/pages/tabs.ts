import { Component } from '@angular/core';
import { ApiDemoPage } from './demo-page';

@Component({
  templateUrl: 'tabs.html'
})
export class TabPage {
  tabOne = ApiDemoPage;
}