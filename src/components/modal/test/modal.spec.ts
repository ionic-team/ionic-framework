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

    describe('loaded', () => {
      it('should call done after loading component and call original ngAfterViewInit method', (done) => {
        // arrange
        let modal = new Modal({}, {});
        let mockInstance = {
          ngAfterViewInit: () => {},
          loadComponent: () => {}
        };
        let mockComponentRef = {
          instance: "someData"
        };
        modal.instance = mockInstance;

        let ngAfterViewInitSpy = spyOn(mockInstance, "ngAfterViewInit");
        spyOn(mockInstance, "loadComponent").and.returnValue(Promise.resolve(mockComponentRef));

        let doneCallback = () => {
          // assert
          expect(ngAfterViewInitSpy).toHaveBeenCalled();
          expect(modal.instance).toEqual("someData");
          done();
        };

        // act
        modal.loaded(doneCallback);
        // (angular calls ngAfterViewInit, we're not testing angular so manually call it)
        mockInstance.ngAfterViewInit();

      }, 5000);
    });
  });

  describe('ModalCmp', () => {

    it('should return a componentRef object after loading component', (done) => {
      // arrange
      let mockLoader: any = {
        loadNextToLocation: () => {}
      };
      let mockNavParams: any = {
        data: {
          componentType: function mockComponentType(){}
        }
      };
      let mockComponentRef = {};

      spyOn(mockLoader, "loadNextToLocation").and.returnValue(Promise.resolve(mockComponentRef));
      let modalCmp = new ModalCmp(mockLoader, mockNavParams);
      modalCmp.viewport = <any>"mockViewport";

      // act
      modalCmp.loadComponent().then(loadedComponentRef => {
        // assert
        expect(loadedComponentRef).toEqual(mockComponentRef);
        expect(mockLoader.loadNextToLocation).toHaveBeenCalledWith(mockNavParams.data.componentType, modalCmp.viewport);
        done();
      });
    }, 5000);
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
