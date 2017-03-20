import { Component, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, NavController, NavParams } from '../../../..';
import { DomSanitizer } from '@angular/platform-browser';


let LOG = '';
function log(page: string, message: string, color: string) {
  console.log(`${page}: ${message}`);
  LOG += `${page}:<span style="background:${color};">${message}</span>`;
  LOG += '\n';
}

const TEMPLATE: string = `
  <ion-header>
    <ion-navbar>
      <ion-title>{{_name}}</ion-title>
    </ion-navbar>
  </ion-header>

  <ion-content text-center>
    <p>This is the {{_name}}</p>
    <div f></div>
    <div f></div>
  </ion-content>
  `;

export class Base {
  constructor(public _name: string) { }
  ionViewWillLoad() {
    log(this._name, 'willLoad', 'green');
  }
  ionViewDidLoad() {
    log(this._name, 'didLoad', 'green');
  }
  ionViewWillEnter() {
    log(this._name, 'willEnter', 'greenyellow');
  }
  ionViewDidEnter() {
    log(this._name, 'didEnter', 'cyan');
  }
  ionViewWillLeave() {
    log(this._name, 'willLeave', 'greenyellow');
  }
  ionViewDidLeave() {
    log(this._name, 'didLeave', 'cyan');
  }
  ionViewWillUnload() {
    log(this._name, 'willUnload', 'lightgray');
  }
  ionViewCanLeave(): boolean|Promise<any> {
    log(this._name, 'canLeave', 'deeppink');
    return true;
  }
  ionViewCanEnter(): boolean|Promise<any> {
    log(this._name, 'canEnter', '#ff78c1');
    return true;
  }
}

@Component({
  template: TEMPLATE
})
export class Page1 extends Base {
  constructor(private nav: NavController) {
    super('Page1');
  }
}

@Component({
  template: TEMPLATE
})
export class Page2 extends Base {
  counter = 4;
  constructor(private nav: NavController) {
    super('Page2');
  }

  ionViewWillEnter() {
    super.ionViewWillEnter();
    if (this.counter > 0) {
      this.nav.push(Page3, { animated: (this.counter !== 2)});
    } else if (this.counter === 0) {
      this.nav.push(Page4, {animate: false});
    } else {
      throw new Error('should not be here!');
    }
    this.counter--;
  }
}

@Component({
  template: TEMPLATE
})
export class Page3 extends Base {
  animated: boolean;
  constructor(private nav: NavController, params: NavParams) {
    super('Page3');
    this.animated = params.get('animated');
  }

  ionViewDidEnter() {
    super.ionViewDidEnter();
    this.nav.pop({animate: this.animated});
  }
}

@Component({
  template: TEMPLATE
})
export class Page4 extends Base {
  constructor(private nav: NavController) {
    super('Page4');
  }

  doSomethingSync() {
		// this is a long running synchronous task
    // (imagine that a huge data must be transformed here recuresively or something similar)
    console.log('START DOING SOMETHING');
    console.time('DO SOMETHING EXPENSIVE SYNCHRONOUSLY');
    let e = 0;
    for (let i = 0; i < 8000000; i++) {
      e += Math.sqrt(i) / Math.log(i) / Math.cos(i);
    }
    console.timeEnd('DO SOMETHING EXPENSIVE SYNCHRONOUSLY');
    return e;
  }

  ngOnInit() {
    this.doSomethingSync();
    // once it has finished trigger another asynchronously
    setTimeout(() => {
      this.doSomethingSync();
      setTimeout(() => {
        this.nav.push(Page5).catch(() => {
          this.nav.push(Page6, { continue: false });
          setTimeout(() => this.nav.push(Page6, { continue: true }), 510);
        });
      }, 2000);
    }, 0);
  }
}

@Component({
  template: TEMPLATE
})
export class Page5 extends Base {
  constructor(private nav: NavController) {
    super('Page5');
  }

  ionViewCanEnter() {
    super.ionViewCanEnter();
    return new Promise((resolve) => {
      setTimeout(() => resolve(false), 8000);
    });
  }
}

@Component({
  template: TEMPLATE
})
export class Page6 extends Base {
  continue: boolean = false;
  counter = 3;
  counterLeave = 3;
  constructor(private nav: NavController, params: NavParams) {
    super('Page6');
    this.continue = params.get('continue');
    console.log(this.continue);
  }

  ionViewCanLeave() {
    super.ionViewCanLeave();
    if (this.continue === true) {
      this.counter--;
      if (this.counter > 0) {
        return false;
      } else if (this.counter === 0) {
        return true;
      } else {
        throw new Error('invalid');
      }
    }
    return true;
  }

  ionViewDidEnter() {
    if (this.continue === true) {
      setTimeout(() => this.pop(), 2000 + 3000);
    }
  }

  ionViewWillLeave() {
    super.ionViewWillLeave();
    this.pushPage7();
  }

  ionViewWillUnload() {
    super.ionViewWillUnload();
    this.pushPage7();
  }

  pop() {
    this.nav.pop().then(() => {
      this.pushPage7();
    }).catch(() => {
      this.pop();
    });
  }

  pushPage7() {
    if (this.continue) {
      this.counterLeave--;
      if (this.counterLeave === 0) {
          this.nav.push(Page7);
      } else if (this.counterLeave < 0) {
        throw new Error('invalid');
      }
    }
  }

}

@Component({
  template: TEMPLATE
})
export class Page7 extends Base {
  constructor(private nav: NavController) {
    super('Page7');
  }
  ionViewCanEnter() {
    super.ionViewCanEnter();
    this.nav.setRoot(Page8);
    this.nav.setRoot(Page8, {animate: false});
    this.nav.setRoot(Page8).then(() => {
      this.nav.setRoot(Results);
    });
    this.nav.push(Page8);
    this.nav.push(Page8);
    setTimeout(() => {
      this.nav.pop({ animate: false });
    }, Math.random() * 100);

    setTimeout(() => {
      this.nav.pop();
    }, Math.random() * 100);

    return true;
  }
}

@Component({
  template: TEMPLATE
})
export class Page8 extends Base {
  constructor(private nav: NavController) {
    super('Page8');
  }
}


@Component({
  template: `
  <ion-header>
    <ion-navbar>
      <ion-title>Results</ion-title>
    </ion-navbar>
  </ion-header>
  <ion-content padding>
    <pre style="font-size: 0.72em; column-count: 3;" [innerHTML]="result"></pre>
  </ion-content>
`
})
export class Results {
  result: any;
  constructor(private nav: NavController, private sanitizer: DomSanitizer) {
  }
  ionViewDidEnter() {
    this.result = this.sanitizer.bypassSecurityTrustHtml(LOG);
  }
}

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class AppComponent {
  root: any = Page1;
  constructor() {
    setTimeout(() => this.root = Page2, 100);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Page8,
    Results
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(AppComponent)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AppComponent,
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Page8,
    Results
  ]
})
export class AppModule {}
