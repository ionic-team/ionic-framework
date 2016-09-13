import { App } from '../../app/app';
import { Config } from '../../../config/config';
import { Platform } from '../../../platform/platform';
import { ToastController } from '../../toast/toast';

describe('Toast', () => {

  describe('create', () => {

    it('should create toast with close button', () => {
      let toast = toastCtrl.create({
        message: 'Please Wait...',
        showCloseButton: true
      });

      expect(toast.data.position).toEqual('bottom');
      expect(toast.data.message).toEqual('Please Wait...');
      expect(toast.data.showCloseButton).toEqual(true);
    });

    it('should create toast with position top', () => {
      let toast = toastCtrl.create({
        message: 'Please Wait...',
        position: 'top'
      });

      expect(toast.data.position).toEqual('top');
    });

    it('should create toast with position middle', () => {
      let toast = toastCtrl.create({
        message: 'Please Wait...',
        position: 'middle'
      });

      expect(toast.data.position).toEqual('middle');
    });

    it('should create toast with position bottom', () => {
      let toast = toastCtrl.create({
        message: 'Please Wait...',
        position: 'bottom'
      });

      expect(toast.data.position).toEqual('bottom');
    });

    it('should set a duration', () => {
      let toast = toastCtrl.create({
        message: 'Please Wait...',
        duration: 3000
      });

      expect(toast.data.duration).toEqual(3000);
    });
  });

  let toastCtrl: ToastController;
  beforeEach(() => {
    let config = new Config();
    let platform = new Platform();
    let app = new App(config, platform);
    toastCtrl = new ToastController(app);
  });

});
