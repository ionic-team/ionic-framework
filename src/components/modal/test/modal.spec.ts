import { mockApp, mockConfig, mockDeepLinker } from '../../../util/mock-providers';
import { Component } from '@angular/core';
import { ModalController } from '../modal-controller';

describe('Modal', () => {

  describe('create', () => {

    it('should have the correct properties on modal view controller proxy instance', () => {
      let modalCtrl = new ModalController(mockApp(), mockConfig(), mockDeepLinker());
      let modalViewControllerProxy = modalCtrl.create(ComponentToPresent);
      expect(modalViewControllerProxy._component).toEqual(ComponentToPresent);
    });
  });

});

@Component({
  template: `<div class="myComponent"></div>`
})
class ComponentToPresent {}
