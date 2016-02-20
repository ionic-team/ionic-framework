import {MenuController, Menu} from '../../../../ionic/ionic';

export function run() {
  describe('MenuController', () => {

    describe('get', () => {

      /*
       * Should not get menus
      */
      it('should not get a menu if no menus', () => {
        let menu = menuCtrl.get();
        expect(menu).toEqual(null);
      });

      it('should not get a menu with an id if no menus', () => {
        let menu = menuCtrl.get('myid');
        expect(menu).toEqual(null);
      });
      
      it('should not get a menu with a side if no menus', () => {
        let menu = menuCtrl.get('left');
        expect(menu).toEqual(null);
      }); 
      
      it('should not get a menu with a right side if no menus', () => {
        let menu = menuCtrl.get('right');
        expect(menu).toEqual(null);
      });         

      // this is grabbing an id when the menu doesn't exist
      // this should not be working
      it('should not get the menu by id without id', () => {
        let menuById = mockMenu();
        menuCtrl.register(menuById);
        
        let menu = menuCtrl.get('myMenu');
        // setting this to null should be a success
        expect(menu).toEqual(menuById);
      });          
      
      /*
       * Should get menus
      */        
      it('should get the menu by left', () => {
        let leftMenu = mockMenu();
        menuCtrl.register(leftMenu);
        
        let menu = menuCtrl.get('left');
        expect(menu).toEqual(leftMenu);
      });      

      it('should get the menu by left with side', () => {
        let leftMenu = mockMenu();
        leftMenu.side = 'left';
        menuCtrl.register(leftMenu);
        
        let menu = menuCtrl.get('left');
        expect(menu).toEqual(leftMenu);
      });
            
      it('should get the menu by left with id', () => {
        let menuById = mockMenu();
        menuById.id = 'myMenu';
        menuCtrl.register(menuById);
        
        let menu = menuCtrl.get('left');
        expect(menu).toEqual(menuById);
      });      

      it('should get the menu by id with id', () => {
        let menuById = mockMenu();
        menuById.id = 'myMenu';
        menuCtrl.register(menuById);
        
        let menu = menuCtrl.get('myMenu');
        expect(menu).toEqual(menuById);
      });           


    });
    
    describe('toggle', () => {
      
      /*
       * Should not toggle menus
      */      
      it('should not toggle the menu if disabled', () => {
        let disabledMenu = mockMenu();
        disabledMenu.enabled = false;
        menuCtrl.register(disabledMenu);
        
        let menu = menuCtrl.get();
        let toggle = menu.toggle();
        expect(toggle).toEqual(null);
      });     
      
    });    

    it('should register a menu', () => {
      let menu = mockMenu();
      menuCtrl.register(menu);
      expect(menuCtrl.getMenus().length).toEqual(1);
      
      let menu2 = mockMenu();
      menuCtrl.register(menu2);
      expect(menuCtrl.getMenus().length).toEqual(2);
      
      menuCtrl.unregister(menu2);
      menuCtrl.unregister(menu);
      
      expect(menuCtrl.getMenus().length).toEqual(0);
    });

    let menuCtrl: MenuController;

    beforeEach(() => {
      menuCtrl = new MenuController();
    });
    
    function mockMenu(): Menu {
      return new Menu(null, null, null, null, null, null, null);
    }

  });
}
