// import { Alert } from '../alert';
import { AlertController } from '../alert-controller';
// import { AlertCmp } from '../alert-component';
// import { NavParams } from '../../../navigation/nav-params';
// import { FormBuilder } from '@angular/forms';
// import { mockApp, mockConfig, mockElementRef, mockGestureController, mockPlatform, mockRenderer, mockView } from '../../../util/mock-providers';
import { mockApp, mockConfig } from '../../../util/mock-providers';


describe('Alert', () => {

  it('should pass common test', async (done) => {
    const alertController = createAlertController();
    const alert = alertController.create();
    alert.onDidDismiss(() => done());
    await alert.present();
    await alert.dismiss();
  });

  describe('with validated inputs', () => {

    it('should dismiss with valid data', async (done) => {
      const alertController = createAlertController();
      const alert = alertController.create({
        inputs: [
          {
            name: 'name1',
            type: 'number',
            min: -5,
            max: 10,
            value: 5
          },
          {
            name: 'name2',
            type: 'text'
          }
        ],
        buttons: ['OK']
      });
      alert.onDidDismiss((value) => {
        expect(value).not.toBeUndefined;
        expect(value.name1).toBe(5);
        done();
      });
      await alert.present();
      await alert.dismiss();
    });

  });

});


function createAlertController(): AlertController {
  return new AlertController(mockApp(), mockConfig());
}

// function createAlertCmp(): AlertCmp {
//   return new AlertCmp(mockView(), mockElementRef(), mockConfig(), mockGestureController(), new NavParams({}), mockRenderer(), mockPlatform(), new FormBuilder());
// }
