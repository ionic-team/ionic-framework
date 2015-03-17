import { Component } from 'angular';
import { ButtonGroup } from '../components/button-group';
import { androidButton} from './platforms/android/android-button';
import { blockButton } from './block-button';

@Component({
  selector: 'ion-button',
  bind: {
    isBlockButton: 'isBlockButton'
  }
})
export class Button extends IonicComponent {
  /* A button checks for a parent buttonGroup */
  constructor(@Parent(ButtonGroup) buttonGroup) {
    this.buttonGroup = buttonGroup;
    super();
  }
  onPress() {
  }
}
export var ButtonConfig = new IonicConfig('button');

