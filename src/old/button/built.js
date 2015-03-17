import {ButtonConfig} from './button-config';
import {AndroidButton} from './mixins/android/android-button';
import {LargeButton} from './mixins/android-button';

ButtonConfig.platform('android').mixin(AndroidButton);

ButtonConfig.media('lg').mixin(DesktopButton);

ButtonConfig.when('popBehavior').mixin(PopButton);
