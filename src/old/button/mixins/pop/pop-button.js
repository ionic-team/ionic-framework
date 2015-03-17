import { ButtonConfig } from '/components/button';

ButtonConfig.decorator('popButton')
  .mixin(popButtonMixin)
  .className('button-pop');

function popButtonMixin(buttonInstance) {
  return {
    onRelease() {
      alert('pop!');
    }
  };
}

/*
//instance config
<button [config]="{popButton: true}" />
<button config-pop-button />

import ButtonConfig
ButtonConfig.set({ popButton: true })
ButtonConfig.platform('lg').set({ popButton: true })


*/
