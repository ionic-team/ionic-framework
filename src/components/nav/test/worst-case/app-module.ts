import { Component, NgModule } from '@angular/core';
import { IonicApp, IonicModule, NavController, NavParams } from '../../../..';

let LOG = '';
function log(message: string) {
  console.log(message);
  LOG += message;
  LOG += '\n';
}

export class Base {
  constructor(private _name: string) { }
  ionViewWillLoad() {
    log(`${this._name} willLoad`);
  }
  ionViewDidLoad() {
    log(`${this._name} didLoad`);
  }
  ionViewWillEnter() {
    log(`${this._name} willEnter`);
  }
  ionViewDidEnter() {
    log(`${this._name} didEnter`);
  }
  ionViewWillLeave() {
    log(`${this._name} willLeave`);
  }
  ionViewDidLeave() {
    log(`${this._name} didLeave`);
  }
  ionViewWillUnload() {
    log(`${this._name} willUnload`);
  }
  ionViewCanLeave(): boolean|Promise<any> {
    log(`${this._name} canLeave`);
    return true;
  }
  ionViewCanEnter(): boolean|Promise<any> {
    log(`${this._name} canEnter`);
    return true;
  }
}

@Component({
  template: `<ion-content text-center><h1>Page 1</h1></ion-content>`
})
export class Page1 extends Base {
  constructor(private nav: NavController) {
    super('Page1');
  }
}

@Component({
  template: `<ion-content text-center><h1>Page 2</h1></ion-content>`
})
export class Page2 extends Base {
  counter = 5;
  constructor(private nav: NavController) {
    super('Page2');
  }

  ionViewWillEnter() {
    super.ionViewWillEnter();
    if (this.counter > 0) {
      this.nav.push(Page3);
    } else if (this.counter === 0) {
      this.nav.push(Page4);
    } else {
      throw new Error('should not be here!');
    }
    this.counter--;
  }
}

@Component({
  template: `<ion-content text-center><h1>Page 3</h1></ion-content>`
})
export class Page3 extends Base {
  constructor(private nav: NavController) {
    super('Page3');
  }
  ionViewDidEnter() {
    super.ionViewWillEnter();
    this.nav.pop();
  }
}

@Component({
  template: `<ion-content text-center><h1>Page 4</h1></ion-content>`
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
  template: `<ion-content text-center><h1>Page 5</h1></ion-content>`
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
  template: `<ion-content text-center><h1>Page 6</h1></ion-content>`
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
  template: `<ion-content text-center><h1>Page 7</h1></ion-content>`
})
export class Page7 extends Base {
  constructor(private nav: NavController) {
    super('Page7');
  }
  ionViewCanEnter() {
    super.ionViewCanEnter();
    this.nav.setRoot(Results);
    return true;
  }
}


@Component({
  template: `<ion-header><ion-navbar><ion-title>Results</ion-title></ion-navbar></ion-header>
  <ion-content padding><pre style="font-size: 0.72em; column-count: 3;">{{result}}</pre></ion-content>`
})
export class Results {
  result: string = 'Loading...';
  constructor(private nav: NavController) {
  }
  ionViewDidEnter() {
    this.result = LOG;
  }
}

@Component({
  template: `<ion-nav [root]="root"></ion-nav>`
})
export class E2EApp {
  root: any = Page1;
  constructor() {
    setTimeout(() => this.root = Page2, 100);
  }
}

@NgModule({
  declarations: [
    E2EApp,
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Results
  ],
  imports: [
    IonicModule.forRoot(E2EApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    E2EApp,
    Page1,
    Page2,
    Page3,
    Page4,
    Page5,
    Page6,
    Page7,
    Results
  ]
})
export class AppModule {}
