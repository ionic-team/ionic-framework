import {
  NavController,
  IonicConfig,
  ViewController
} from 'ionic/ionic';

export function run() {
  describe("NavController", function(){
    beforeEach( function(){
      this.nav = new NavController(null, null, new IonicConfig(), null, null, null, null, null);
    });

    it('should exist', function(){
      expect(this.nav).not.toBeUndefined();
    });

    describe("getActive", function(){
      it('should return null if there is no active view', function(){
        var active = this.nav.getActive();
        expect(active).toBe(null);
      });

      it('should return the first active page', function(){
        let activeView = new ViewController();
        activeView.state = 1; // ACTIVE_STATE

        this.nav.add(activeView);
        var active = this.nav.getActive();

        expect(active).toBe(activeView);
      });
    });

    describe("push", function(){
      it('should return a rejected Promise if componentType is falsy', function(done){
        let s = jasmine.createSpy('success');
        let f = jasmine.createSpy('fail');

        let promise = this.nav.push(undefined, {}, {});

        promise.then(s, f).then(() => {
          expect(s).not.toHaveBeenCalled();
          expect(f).toHaveBeenCalled();
          done();
        });
      });

      it('should throw an error if componentType truthy, but is not a function', function(){
        let push = () => this.nav.push({}, {}, {});
        expect(push).toThrow();

        push = () => this.nav.push("string", {}, {});
        expect(push).toThrow();

        push = () => this.nav.push(42, {}, {});
        expect(push).toThrow();

        push = () => this.nav.push(true, {}, {});
        expect(push).toThrow();
      });

    })
  });

}
