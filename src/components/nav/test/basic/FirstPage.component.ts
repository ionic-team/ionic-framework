
@Component({
  template: `
    <ion-header>
      <ion-navbar>
        <ion-title>{{title}}</ion-title>
        <ion-buttons start>
          <button><ion-icon name="star"></ion-icon></button>
        </ion-buttons>
        <ion-buttons end>
          <button>S1g</button>
        </ion-buttons>
      </ion-navbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-list-header>
          {{title}}
        </ion-list-header>

        <button ion-item class="e2eFrom1To2" (click)="pushFullPage()">Push to FullPage</button>
        <button ion-item (click)="pushPrimaryHeaderPage()">Push to PrimaryHeaderPage</button>
        <button ion-item (click)="pushAnother()">Push to AnotherPage</button>

        <ion-item>
          <ion-label>Text Input</ion-label>
          <ion-textarea></ion-textarea>
        </ion-item>

        <button ion-item [navPush]="[pushPage, {id: 42}]">Push FullPage w/ [navPush] array</button>
        <button ion-item [navPush]="pushPage" [navParams]="{id:40}">Push w/ [navPush] and [navParams]</button>
        <button ion-item [navPush]="[\'FirstPage\', {id: 22}]">Push w/ [navPush] array and string view name</button>
        <button ion-item [navPush]="FirstPage" [navParams]="{id: 23}">Push w/ [navPush] and [navParams]</button>
        <button ion-item (click)="setPages()">setPages() (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="setRoot()">setRoot(PrimaryHeaderPage) (Go to PrimaryHeaderPage)</button>
        <button ion-item (click)="nav.pop()">Pop</button>
        <button ion-item (click)="viewDismiss()">View Dismiss</button>
        <button ion-item (click)="quickPush()">New push during transition</button>
        <button ion-item (click)="quickPop()">New pop during transition</button>
        <button ion-item (click)="reload()">Reload</button>
        <button ion-item (click)="scrollToBottom()">Scroll to bottom</button>
        <button *ngFor="let i of pages" ion-item (click)="pushPrimaryHeaderPage()">Page {{i}}</button>
        <button ion-item (click)="content.scrollToTop()">Scroll to top</button>
      </ion-list>
      <my-cmp></my-cmp>
    </ion-content>`,
  directives: [MyCmpTest]
})
export class FirstPage {
  pushPage = FullPage;
  title = 'First Page';
  pages: Array<number> = [];
  @ViewChild(Content) content: Content;

  constructor(
    private nav: NavController,
    private view: ViewController
  ) {
    for (var i = 1; i <= 50; i++) {
      this.pages.push(i);
    }
  }

  setPages() {
    let items = [
      { page: PrimaryHeaderPage }
    ];

    this.nav.setPages(items);
  }

  setRoot() {
    this.nav.setRoot(PrimaryHeaderPage);
  }

  pushPrimaryHeaderPage() {
    this.nav.push(PrimaryHeaderPage);
  }

  pushFullPage() {
    this.nav.push(FullPage, { id: 8675309, myData: [1, 2, 3, 4] });
  }

  pushAnother() {
    this.nav.push(AnotherPage);
  }

  quickPush() {
    this.nav.push(AnotherPage);
    setTimeout(() => {
      this.nav.push(PrimaryHeaderPage);
    }, 150);
  }

  quickPop() {
    this.nav.push(AnotherPage);
    setTimeout(() => {
      this.nav.remove(1, 1);
    }, 250);
  }

  viewDismiss() {
    this.view.dismiss();
  }

  reload() {
    window.location.reload();
  }

  scrollToTop() {
    this.content.scrollToTop();
  }

  scrollToBottom() {
    this.content.scrollToBottom(1000);
  }
}
