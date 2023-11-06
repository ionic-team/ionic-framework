import type { ActionSheetOptions } from '@ionic/core/components';

import type { ControllerShape } from '../utils/overlay';
import { OverlayBaseController } from '../utils/overlay';

export class ActionSheetController extends OverlayBaseController<ActionSheetOptions, HTMLIonActionSheetElement> {
  constructor(protected actionSheetController: ControllerShape<ActionSheetOptions, HTMLIonActionSheetElement>) {
    super(actionSheetController);
  }
}
