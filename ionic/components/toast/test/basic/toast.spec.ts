import {Toast} from '../../../../ionic';

export function run() {

describe('Toast', () => {

  describe('create', () => {

    it('should create toast with close button', () => {
      let toast = Toast.create({
        message: 'Please Wait...',
        showCloseButton: true
      });

      expect(toast.message).toEqual('Please Wait...');
      expect(toast.showCloseButton).toEqual(true);
      expect(toast.closeButtonText).toEqual('Close');
    });

  });
});

}
