import {App} from 'ionic/ionic';


@App({
	templateUrl: 'main.html'
})

class DemoApp {
	constructor() {
		this.homeIcon = 'home';
		this.isActive = false;
	}
}