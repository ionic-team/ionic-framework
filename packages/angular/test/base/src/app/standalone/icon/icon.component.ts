import { Component } from '@angular/core';
import { IonIcon } from '@ionic/angular/standalone';
import { logoIonic, logoIonitron, logoApple, logoAndroid } from 'ionicons/icons';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  standalone: true,
  imports: [IonIcon],
})
export class IconComponent {
  iconName: string = 'logo-ionic';
  iosIcon: string = 'logo-apple';
  mdIcon: string = 'logo-android';

  changeIcon() {
    this.iconName = this.iconName === 'logo-ionic' ? 'logo-apple' : 'logo-ionic';
  }

  changeModeIcon() {
    this.iosIcon = this.iosIcon === 'logo-apple' ? 'logo-ionic' : 'logo-apple';
    this.mdIcon = this.mdIcon === 'logo-android' ? 'logo-ionitron' : 'logo-android';
  }
}
