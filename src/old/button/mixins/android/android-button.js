import { ButtonConfig } from '/components/button';

ButtonConfig.platform('android')
  .mixin(androidButtonMixin)
  .className('button-android'); // This is the default

export default function androidButtonMixin(buttonInstance) {
  Pannable(buttonInstance);
  return {
    onPanStart() {},
    onPan() {},
    onPanEnd() {}
  };
}
