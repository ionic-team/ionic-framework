import {Toast, ToastPosition} from '../../../../src';

export function run() {

describe('Toast', () => {

  describe('create', () => {

    it('should create toast with close button', () => {
      let toast = Toast.create({
        message: 'Please Wait...',
        showCloseButton: true
      });

      expect(toast.data.position).toEqual(ToastPosition.Bottom);
      expect(toast.data.message).toEqual('Please Wait...');
      expect(toast.data.showCloseButton).toEqual(true);
    });

    it('should create toast with position top', () => {
      let toast = Toast.create({
        message: 'Please Wait...',
        position: ToastPosition.Top
      });

      expect(toast.data.position).toEqual(ToastPosition.Top);
    });

    it('should create toast with position middle', () => {
      let toast = Toast.create({
        message: 'Please Wait...',
        position: ToastPosition.Middle
      });

      expect(toast.data.position).toEqual(ToastPosition.Middle);
    });

    it('should create toast with position bottom', () => {
      let toast = Toast.create({
        message: 'Please Wait...',
        position: ToastPosition.Bottom
      });

      expect(toast.data.position).toEqual(ToastPosition.Bottom);
    });

    it('should set a duration', () => {
      let toast = Toast.create({
        message: 'Please Wait...',
        duration: 3000
      });

      expect(toast.data.duration).toEqual(3000);
    });
  });
});

}
