import { mockApp, mockConfig } from '../../../util/mock-providers';
import { ToastController } from '../toast-controller';


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

    it('should create toast with close button when closeButtonText is defined', () => {
      let toast = toastCtrl.create({
        message: 'Please Wait...',
        closeButtonText: 'OK'
      });

      expect(toast.data.closeButtonText).toEqual('OK');
    });

    it('should create toast with close button when closeButton.show or closeButton.text is defined', () => {
      let toast = toastCtrl.create({
        message: 'Please Wait...',
        closeButton: {
          text: 'OK'
        }
      });

      expect(toast.data.closeButton.text).toEqual('OK');
    });

    it('should create toast with custom html message', () => {
      const html = 'A <b>html</b> custom message';
      let toast = toastCtrl.create({
        messageHtml: html
      });

      expect(toast.data.messageHtml).toEqual(html);
    });

    it('should create toast without close button focus', () => {
      let toast = toastCtrl.create({
        autoFocus: false,
        message: 'This is a toast '
      });

      expect(toast.data.autoFocus).toBeFalsy();
    });

    it('should create toast with close button custom click callback', () => {
      let toast = toastCtrl.create({
        message: 'Please Wait...',
        showCloseButton: true,
        closeClick: () => {
          console.log('My custom click!');
        }
      });

      expect(toast.data.closeClick).toBeDefined();
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
    toastCtrl = new ToastController(mockApp(), mockConfig());
  });

});
