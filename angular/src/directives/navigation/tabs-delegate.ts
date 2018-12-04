import { ContentChildren, Directive, ElementRef, HostListener, Optional, QueryList } from '@angular/core';
import { TabDelegate } from './tab-delegate';
import { TabButtonClickDetail } from '@ionic/core';
import { NavController } from '../../providers';

@Directive({
  selector: 'ion-tabs'
})
export class TabsDelegate {

  @ContentChildren(TabDelegate) tabs!: QueryList<TabDelegate>;

  constructor(
    @Optional() private navCtrl: NavController,
    elementRef: ElementRef
  ) {
    const nativeEl = elementRef.nativeElement as HTMLIonTabsElement;
    nativeEl.useRouter = true;
  }

  urlForTab(tab: string) {
    const tabDelegate = this.tabs.find(item => item.tab === tab);
    return tabDelegate ? tabDelegate.getLastUrl() : undefined;
  }

  @HostListener('ionTabButtonClick', ['$event.detail'])
  onTabbarClick(detail: TabButtonClickDetail) {
    const { tab, href, selected } = detail;
    if (tab && href) {
      const url = selected
        ? href
        : this.urlForTab(tab) || href;

      this.navCtrl.navigateBack(url, true);
    }
  }
}
