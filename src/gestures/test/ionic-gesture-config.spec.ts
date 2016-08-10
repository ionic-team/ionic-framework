import { IonicGestureConfig } from '../../../src/gestures/ionic-gesture-config';

export function run() {

  describe('IonicGestureConfig', () => {
    it('should create a new instance of hammer', () => {
      // arrange
      let instance = new IonicGestureConfig();
      let expectedParam = { name: "expectedParam"};
      let expectedHammerInstance = { name: "hammer"};
      
      let actualParam : any = null;
      let callCount = 0;

      (<any> window).Hammer = (param: any) => {
        callCount++;
        actualParam = param;
        return expectedHammerInstance;
      };
      
      // act
      let returnValue = instance.buildHammer( <HTMLElement> <any> expectedParam);

      // assert
      expect(returnValue.name).toEqual(expectedHammerInstance.name);
      expect(callCount).toEqual(1);
      expect(actualParam.name).toEqual(expectedParam.name);
    });
  })

}