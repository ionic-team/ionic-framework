import { MenuController } from '../../app/menu-controller';
import { mockMenu, mockPlatform } from '../../../util/mock-providers';

describe('MenuController', () => {

  describe('get() without menuId', () => {

    it('should not get a menu if no menus', () => {
      let menu = menuCtrl.get();
      expect(menu).toEqual(null);
    });

    it('should get the only menu', () => {
      let someMenu = mockMenu();
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get();
      expect(menu).toEqual(someMenu);
    });

    it('should get the only menu if menuId === ""', () => {
      let someMenu = mockMenu();
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('');
      expect(menu).toEqual(someMenu);
    });

    it('should get the enabled menu when multiple menus', () => {
      let someMenu1 = mockMenu();
      someMenu1.enabled = false;
      menuCtrl._register(someMenu1);

      let someMenu2 = mockMenu();
      someMenu2.enabled = true;
      menuCtrl._register(someMenu2);

      let menu = menuCtrl.get();
      expect(menu).toEqual(someMenu2);
    });

  });

  describe('get() by id', () => {

    it('should be null if no menus', () => {
      let menu = menuCtrl.get('myid');
      expect(menu).toEqual(null);
    });

    it('should be null if no matching menus with id', () => {
      let someMenu = mockMenu();
      someMenu.id = 'whatever';
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('myMenu');
      expect(menu).toEqual(null);
    });

    it('should get the menu by id with matching id', () => {
      let someMenu = mockMenu();
      someMenu.id = 'myMenu';
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('myMenu');
      expect(menu).toEqual(someMenu);
    });

    it('should get the menu by id with left', () => {
      let someMenu = mockMenu();
      someMenu.id = 'myMenu';
      someMenu.side = 'left';
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('myMenu');
      expect(menu).toEqual(someMenu);
    });

    it('should get the menu by id with matching id when multiple menus', () => {
      let someMenu1 = mockMenu();
      someMenu1.id = 'myMenu1';
      menuCtrl._register(someMenu1);

      let someMenu2 = mockMenu();
      someMenu2.id = 'myMenu2';
      menuCtrl._register(someMenu2);

      let menu = menuCtrl.get('myMenu1');
      expect(menu).toEqual(someMenu1);

      menu = menuCtrl.get('myMenu2');
      expect(menu).toEqual(someMenu2);
    });

  });

  describe('get() by side', () => {

    it('should not get a menu with a left side if no menus', () => {
      let menu = menuCtrl.get('left');
      expect(menu).toEqual(null);
    });

    it('should not get a menu with a right side if no menus', () => {
      let menu = menuCtrl.get('right');
      expect(menu).toEqual(null);
    });

    it('should get the only left menu', () => {
      let someMenu = mockMenu();
      someMenu.side = 'left';
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('left');
      expect(menu).toEqual(someMenu);
    });

    it('should get the only left menu on start ltr', () => {
      let someMenu = mockMenu();
      someMenu.side = 'start';
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('left');
      expect(menu).toEqual(someMenu);
    });

    it('should get the only left menu on end rtl', () => {
      let platform = mockPlatform();
      platform.setDir('rtl', true);
      expect(platform.dir()).toEqual('rtl');

      let someMenu = mockMenu(platform);
      someMenu.side = 'end';
      menuCtrl._register(someMenu);

      expect(someMenu.side).toEqual('left');

      let menu = menuCtrl.get('left');
      expect(menu).toEqual(someMenu);
    });

    it('should get the enabled left menu', () => {
      let someMenu1 = mockMenu();
      someMenu1.side = 'left';
      someMenu1.enabled = false;
      menuCtrl._register(someMenu1);

      let someMenu2 = mockMenu();
      someMenu2.side = 'left';
      someMenu2.enabled = true;
      menuCtrl._register(someMenu2);

      let menu = menuCtrl.get('left');
      expect(menu).toEqual(someMenu2);
    });

    it('should get the first left menu when all are disabled', () => {
      let someMenu1 = mockMenu();
      someMenu1.side = 'left';
      someMenu1.enabled = false;
      menuCtrl._register(someMenu1);

      let someMenu2 = mockMenu();
      someMenu2.side = 'left';
      someMenu2.enabled = false;
      menuCtrl._register(someMenu2);

      let menu = menuCtrl.get('left');
      expect(menu).toEqual(someMenu1);
    });

    it('should get the only right menu', () => {
      let someMenu = mockMenu();
      someMenu.side = 'right';
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('right');
      expect(menu).toEqual(someMenu);
    });

    it('should get the only right menu on end ltr', () => {
      let someMenu = mockMenu();
      someMenu.side = 'end';
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('right');
      expect(menu).toEqual(someMenu);
    });

    it('should get the only right menu on start rtl', () => {
      let platform = mockPlatform();
      platform.setDir('rtl', true);
      expect(platform.dir()).toEqual('rtl');

      let someMenu = mockMenu(platform);
      someMenu.side = 'start';
      menuCtrl._register(someMenu);

      expect(someMenu.side).toEqual('right');

      let menu = menuCtrl.get('right');
      expect(menu).toEqual(someMenu);
    });

    it('should get the menu by left with id', () => {
      let someMenu = mockMenu();
      someMenu.id = 'myMenu';
      someMenu.side = 'left';
      menuCtrl._register(someMenu);

      let menu = menuCtrl.get('left');
      expect(menu).toEqual(someMenu);
    });

    it('should switch menu side in runtime', () => {
      let someMenu = mockMenu();
      menuCtrl._register(someMenu);

      ['left', 'right'].forEach((side: any) => {
        someMenu.side = side;
        expect(someMenu.side).toEqual(side);

        let menu = menuCtrl.get(side);
        expect(menu).toEqual(someMenu);
      });
    });

  });

  describe('enable()', () => {

    it('should enable a menu', () => {
      let someMenu = mockMenu();
      someMenu.enabled = true;
      menuCtrl._register(someMenu);
      someMenu._menuCtrl = menuCtrl;

      let menu = menuCtrl.enable(true);
      expect(menu.enabled).toEqual(true);

      menu = menuCtrl.enable(false);
      expect(menu.enabled).toEqual(false);
    });

    it('should be only one enabled menu on the same side', () => {
      let someMenu1 = mockMenu();
      someMenu1.enabled = true;
      someMenu1.side = 'left';
      someMenu1.id = 'menu1';
      someMenu1._menuCtrl = menuCtrl;
      menuCtrl._register(someMenu1);

      let someMenu2 = mockMenu();
      someMenu2.enabled = false;
      someMenu2.side = 'left';
      someMenu2.id = 'menu2';
      someMenu2._menuCtrl = menuCtrl;
      menuCtrl._register(someMenu2);

      let someMenu3 = mockMenu();
      someMenu3.enabled = true;
      someMenu3.side = 'right';
      someMenu3.id = 'menu2';
      someMenu3._menuCtrl = menuCtrl;
      menuCtrl._register(someMenu3);

      menuCtrl.enable(true, 'menu1');
      expect(someMenu1.enabled).toEqual(true);
      expect(someMenu2.enabled).toEqual(false);
      expect(someMenu3.enabled).toEqual(true);

      menuCtrl.enable(true, 'menu2');
      expect(someMenu1.enabled).toEqual(false);
      expect(someMenu2.enabled).toEqual(true);
      expect(someMenu3.enabled).toEqual(true);

      menuCtrl.enable(true, 'menu1');
      expect(someMenu1.enabled).toEqual(true);
      expect(someMenu2.enabled).toEqual(false);
      expect(someMenu3.enabled).toEqual(true);
    });

  });

  it('should register a menu', () => {
    let menu = mockMenu();
    menuCtrl._register(menu);
    expect(menuCtrl.getMenus().length).toEqual(1);

    let menu2 = mockMenu();
    menuCtrl._register(menu2);
    expect(menuCtrl.getMenus().length).toEqual(2);

    menuCtrl._unregister(menu2);
    menuCtrl._unregister(menu);

    expect(menuCtrl.getMenus().length).toEqual(0);
  });

  let menuCtrl: MenuController;

  beforeEach(() => {
    menuCtrl = new MenuController();
  });

});
