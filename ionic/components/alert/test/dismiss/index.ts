import { Alert, NavController, App, Page } from 'ionic-angular/index';
import { FORM_DIRECTIVES, FormBuilder, ControlGroup, Validators } from 'angular2/common';


@Page({
  templateUrl: 'main.html'
})
export class E2EPage {

  constructor(private nav: NavController) {}

	submit() {
    var alert = Alert.create({
      title: 'Not logged in',
      message: 'Sign in to continue.',
      buttons: [
        {
          text: 'Sign in',
          handler: () => {
            console.log('Sign in');
          }
        }
      ]
    });

    alert.onDismiss((asdf) => {
      console.log('dismiss');
      this.nav.push(AnotherPage);
    });

    this.nav.present(alert);
	}
}

@Page({
  template: `
    <ion-navbar *navbar>
      <ion-title>Another Page</ion-title>
    </ion-navbar>
    <ion-content padding>
      <form [ngFormModel]="form" (ngSubmit)="submit(form.value)">
    		<ion-list>
    			<ion-item [class.error]="!form.controls.name.valid && form.controls.name.touched">
    				<ion-label>Name</ion-label>
    				<ion-input type="text" [(ngFormControl)]="form.controls.name"></ion-input>
    			</ion-item>
  			</ion-list>
  			<div padding style="padding-top: 0 !important;">
    			<button list-item primary block>
      			Submit
      		</button>
    		</div>
			</form>
    </ion-content>
  `
})
class AnotherPage {
  form: ControlGroup;

	constructor(private nav: NavController, private builder: FormBuilder) {
		this.form = builder.group({
			name: builder.control('', Validators.compose([
			    Validators.required,
			    Validators.minLength(5)
			]))
		});
	}

	submit(value: any): void {
		if (this.form.valid) {
			console.log(value);
		} else {
			this.nav.present(Alert.create({
				title: 'Invalid input data',
				subTitle: "Please correct the errors and resubmit the data.",
				buttons: [ 'OK' ]
			}));
		}
	}

  onPageDidEnter() {
    this.showConfirm();
  }

  showConfirm() {
    const alert = Alert.create({
      title: `Hi there`,
      buttons: [
        {
          text: 'Go Back',
          role: 'cancel',
          handler: () => {
            alert.dismiss().then(() => {
              this.nav.pop();
            });
            return false;
          }
        },
        {
          text: 'Stay Here',
          handler: () => {
            console.log('Stay Here');
          }
        }
      ]
    });
    this.nav.present(alert);
  }

}


@App({
  template: '<ion-nav [root]="root"></ion-nav>'
})
class E2EApp {
  root;
  constructor() {
    this.root = E2EPage;
  }
}