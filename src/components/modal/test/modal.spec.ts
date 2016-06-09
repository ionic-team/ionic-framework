import {Component} from '@angular/core';
import {Modal, ModalCmp, NavController, ViewController} from '../../../../src';

export function run() {
  describe('Modal', () => {

    describe('create', () => {

      it('should have the correct properties on modal view controller instance', () => {
        let modalViewController = Modal.create(ComponentToPresent);
        expect(modalViewController.modalViewType).toEqual("ComponentToPresent");
        expect(modalViewController.componentType).toEqual(ModalCmp);
        expect(modalViewController.viewType).toEqual("modal");
        expect(modalViewController.isOverlay).toEqual(true);
        expect(modalViewController instanceof ViewController).toEqual(true);
      });
    });

  });

}

const STATE_ACTIVE = 'active';
const STATE_INACTIVE = 'inactive';
const STATE_INIT_ENTER = 'init_enter';
const STATE_INIT_LEAVE = 'init_leave';
const STATE_TRANS_ENTER = 'trans_enter';
const STATE_TRANS_LEAVE = 'trans_leave';
const STATE_REMOVE = 'remove';
const STATE_REMOVE_AFTER_TRANS = 'remove_after_trans';
const STATE_FORCE_ACTIVE = 'force_active';


let componentToPresentSpy = {
  _ionicProjectContent: () => {},
};

@Component({
  template: `<div class="myComponent"></div>`
})
class ComponentToPresent{
  constructor(){
  }
}
