import {App, Page, Toast, NavController} from 'ionic-angular';

@Page({
  templateUrl: 'main.html'
})
class ApiPage {
  constructor(private nav: NavController) { }

  showToast() {
    const toast = Toast.create({
      message: 'User was created successfully',
    });

    toast.onDismiss(this.dismissHandler);
    this.nav.present(toast);
  }

  showLongToast() {
    const toast = Toast.create({
      message: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ea voluptatibus quibusdam eum nihil optio, ullam accusamus magni, nobis suscipit reprehenderit, sequi quam amet impedit. Accusamus dolorem voluptates laborum dolor obcaecati.',
    });

    toast.onDismiss(this.dismissHandler);
    this.nav.present(toast);
  }

  showDismissDurationToast() {
    const toast = Toast.create({
      message: 'I am dismissed after 1.5 seconds',
      duration: 1500
    });
    toast.onDismiss(this.dismissHandler);
    this.nav.present(toast);
  }

  showToastWithCloseButton() {
    const toast = Toast.create({
      message: 'Your internet connection appears to be offline. Data integrity is not guaranteed.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.onDismiss(this.dismissHandler);
    this.nav.present(toast);
  }

  private dismissHandler(toast: Toast) {
    console.info('Toast onDismiss()');
  }

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class ApiDemoApp {
  root = ApiPage;
  constructor() { }
}
