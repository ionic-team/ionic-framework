import {Compiler, NgElement, Component, Template} from 'angular2/angular2';

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
class ModalWrapper {
  constructor(@NgElement() el : NgElement) {
    this.element = el
    console.log('element', el)
  }
  show() {
    //this.element.domElement.classList.add('active')
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
export class Modal {
  //compiler: Compiler;

  constructor(compiler: Compiler, @NgElement() el : NgElement) {
    this.element = el
    this.compiler = compiler
    console.log('Got compiler', Modal.annotations)
  }

  static create() {
    var m = new Modal()
    return m
  }

  show() {
    console.log('Modal show')
  }

  static show() {
    console.log('Showing modal')

    var newModal = Modal.create()
    newModal.show()
    return newModal
  }
}
