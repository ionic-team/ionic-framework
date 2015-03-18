import {Component, Template} from 'angular2/angular2';
import {Ion} from '../ion';

@Component({
  selector: 'ion-modal-wrapper'
})
@Template({
  inline: `
    <div class="modal-backdrop active">
      <div class="modal-backdrop-bg"></div>
      <div class="modal-wrapper"><content></content></div>
    </div>`
})
class ModalWrapper extends Ion {
  constructor() {
  }
  show() {
  }
  hide() {
  }
}

@Component({
  selector: 'ion-modal'
})
@Template({
  directives: [ModalWrapper],
  inline: `
    <ion-modal-wrapper>
      <div class="modal">
        <content></content>
      </div>
    </ion-modal-wrapper>`
})
export class Modal extends Ion {
  constructor() {}
}
