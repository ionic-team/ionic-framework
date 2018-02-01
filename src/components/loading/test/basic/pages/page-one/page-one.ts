import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController } from '../../../../../..';

@IonicPage()
@Component({
  templateUrl: 'page-one.html',
  styles: [
    `
    /* Fix the spinner used in e2e */
    .fixed-spinner svg {
      animation: none;
    }
    `,
    `
    .custom-spinner-container {
      position: relative;
      display: inline-block;
      box-sizing: border-box;
    }
    `,
    `
    .custom-spinner-box {
      position: relative;
      box-sizing: border-box;
      border: 4px solid #000;
      width: 60px;
      height: 60px;
      animation: spin 3s infinite linear;
    }
    `,
    `
    .custom-spinner-box:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      box-sizing: border-box;
      border: 4px solid #000;
      width: 40px;
      height: 40px;
      animation: pulse 1.5s infinite ease;
    }
    `,
    `
    .wp .custom-spinner-box,
    .wp .custom-spinner-box:before {
      border-color: #fff;
    }
    `
    ,
    `
    @-webkit-keyframes pulse {
      50% {
        border-width: 20px;
      }
    }
    `,
    `
    @keyframes pulse {
      50% {
        border-width: 20px;
      }
    }
    `,
    `
    @-webkit-keyframes spin {
      100% {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
      }
    }
    `,
    `@keyframes spin {
      100% {
        -webkit-transform: rotate(360deg);
                transform: rotate(360deg);
      }
    }`
  ]
})
export class PageOne {
  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController
  ) { }

  presentLoadingIos() {
    let loading = this.loadingCtrl.create({
      spinner: 'ios',
      duration: 1000,
      cssClass: 'my-custom-loader'
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }

  presentLoadingDots() {
    let loading = this.loadingCtrl.create({
      spinner: 'dots',
      content: 'Loading...',
      duration: 1000
    });

    loading.present();
  }

  presentLoadingBubbles() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Loading...',
      duration: 1000
    });

    loading.present();
  }

  presentLoadingCircles() {
    let loading = this.loadingCtrl.create({
      spinner: 'circles',
      content: 'Loading...',
      duration: 1000
    });

    loading.present();
  }

  presentLoadingCrescent() {
    this.loadingCtrl.create()
      .setSpinner('crescent')
      .setContent('Please wait...')
      .setDuration(1000)
      .present();
  }

  // Pass the fixed-spinner class so we can turn off
  // spinner animation for the e2e test
  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...',
      cssClass: 'fixed-spinner spinner-class'
    });

    loading.present();

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  presentLoadingCustom() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: `
        <div class="custom-spinner-container">
          <div class="custom-spinner-box"></div>
        </div>`
    });

    loading.present();
    setTimeout(() => {
      loading.setContent('Loaded!');
    }, 1000);
    setTimeout(() => {
      loading.dismiss();
    }, 2000);
  }

  presentLoadingText() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading Please Wait...'
    });

    loading.present();

    setTimeout(() => {
      this.navCtrl.push('PageTwo');
    }, 1000);

    setTimeout(() => {
      loading.dismiss();
    }, 5000);
  }

  goToPage2() {
    this.navCtrl.push('PageTwo');
  }

  presentLoadingMultiple() {
    let loading = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading 1 Please Wait...'
    });

    loading.present();

    let loading2 = this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading 2 Please Wait...'
    });

    setTimeout(() => {
      loading2.present();
    }, 1000);

    let loading3 = this.loadingCtrl.create()
      .setSpinner('hide')
      .setContent('Loading 3 Please Wait...');

    setTimeout(() => {

      loading3.present();

      loading3.dismiss();
      loading2.dismiss();
      loading.dismiss();
    }, 2000);

  }

  presentLoadingMultipleNav() {
    this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading 1 Please Wait...',
      dismissOnPageChange: true
    }).present();

    setTimeout(() => {

      this.loadingCtrl.create({
        spinner: 'hide',
        content: 'Loading 2 Please Wait...',
        dismissOnPageChange: true
      }).present();

      this.navCtrl.push('PageTwo');

    }, 500);
  }

  presentLoadingDismissNav() {
    this.loadingCtrl.create({
      spinner: 'hide',
      content: 'Loading 1 Please Wait...',
      dismissOnPageChange: true
    }).present();

    setTimeout(() => {
      this.navCtrl.push('PageTwo');
    }, 500);
  }

  presentLoadingOpenDismiss() {
    const loading = this.loadingCtrl.create({
      content: 'Loading 1'
    });
    loading.present();
    loading.dismiss();

    const loading2 = this.loadingCtrl.create({
      content: 'Loading 2'
    });
    loading2.present();
    loading2.dismiss();
  }

  presentLoadingBackdropDismiss() {
    const loading = this.loadingCtrl.create({
      content: 'Tap on backdrop to dismiss',
      enableBackdropDismiss: true
    });

    loading.onDidDismiss(() => {
      console.log('Dismissed loading');
    });

    loading.present();
  }
}
