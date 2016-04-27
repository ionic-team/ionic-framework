import {App, IonicApp} from 'ionic-angular';


@App({
  templateUrl: 'main.html'
})
class E2EApp {
  isDestructive: boolean;
  isSecondary: boolean;
  isCustom: boolean;
  isSolid: boolean;
  isOutline: boolean;
  isClear: boolean;
  isClicked: boolean;
  myColor1: string;
  myColor2: string;
  multiColor: Array<string>;

  constructor() {
		this.reset();
	}

	unify() {
	  this.isDestructive = false;
	  this.isSecondary = false;
	  this.isCustom = false;
	  this.isSolid = false;
	  this.isOutline = false;
	  this.isClear = false;
	  this.isClicked = false;
	  this.myColor1 = 'primary';
	  this.myColor2 = 'primary';
	  this.multiColor = ['primary'];
	}

	reset() {
	  this.isDestructive = true;
	  this.isSecondary = true;
	  this.isCustom = true;
	  this.isSolid = true;
	  this.isOutline = true;
	  this.isClear = true;
	  this.isClicked = false;
	  this.myColor1 = 'custom1';
	  this.myColor2 = 'custom2';
	  this.multiColor = ['primary','secondary'];
	}

	toggle() {
	  this.isClicked = !this.isClicked;
	}
}
