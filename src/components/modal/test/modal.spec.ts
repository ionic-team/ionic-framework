import { Component } from '@angular/core';
import { ModalController, ViewController } from '../../../../src';
import { ModalCmp } from '../../../../src/components/modal/modal-component';

export function run() {
  describe('Modal', () => {

    describe('create', () => {

      it('should have the correct properties on modal view controller instance', () => {
        let modalCtrl = new ModalController(null);
        let modalViewController = modalCtrl.create(ComponentToPresent);
        expect(modalViewController.componentType).toEqual(ModalCmp);
        expect(modalViewController.isOverlay).toEqual(true);
        expect(modalViewController instanceof ViewController).toEqual(true);
      });
    });

  });

}

@Component({
  template: `<div class="myComponent"></div>`
})
class ComponentToPresent{}
