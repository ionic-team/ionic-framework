import {Modal, ModalCmp, Page, NavController, ViewController} from '../../../../src';

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

  describe('ModalCmp', () => {

    it('should resolve a promise after loading the component', (done) => {
      // arrange
      let mockComponentRef = {
        instance: "myInstance"
      };
      let mockLoader = {
        loadNextToLocation : () => {}
      };
      let mockViewController = {
        setInstance: instance => {}
      };
      let mockNavParams = {
        data: {
          componentType: "MyComponent"
        }
      }
      let mockViewPort = "testValue";
      spyOn(mockLoader, 'loadNextToLocation').and.returnValue(Promise.resolve(mockComponentRef));
      spyOn(mockViewController, 'setInstance');
      let modalCmp = new ModalCmp({}, mockLoader, mockNavParams, mockViewController);
      modalCmp.viewport = mockViewPort;
      // act

      // get the promise from the private ionic project content method
      let promise = modalCmp._ionicProjectContent();
      // then call the angular life cycle method manually since we're unit testing
      modalCmp.ngAfterViewInit();

      // assert
      promise.then( () => {
        expect(mockLoader.loadNextToLocation).toHaveBeenCalledWith(mockNavParams.data.componentType, mockViewPort);
        expect(mockViewController.setInstance).toHaveBeenCalledWith(mockComponentRef.instance);
        done();
      }).catch( err => {
        done(err);
      })
    }, 10000);
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

@Page({
  template: `<div class="myComponent"></div>`
})
class ComponentToPresent{
  constructor(){
  }
}
