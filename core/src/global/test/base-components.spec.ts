import { isBaseComponent, resetBaseComponentsCache } from '../base-components';
import { Config } from '../config';

describe('isBaseComponent()', () => {
  beforeEach(() => {
    resetBaseComponentsCache();
  });
  describe('global config', () => {
    it('should return true when baseComponents has been enabled globally', () => {
      const config = new Config();
      config.reset({ baseComponents: true });
      const el = document.createElement('ion-badge');

      expect(isBaseComponent(el, config)).toBe(true);
    });
    it('should return false when baseComponents has not been enabled globally', () => {
      const config = new Config();
      config.reset({});
      const el = document.createElement('ion-badge');

      expect(isBaseComponent(el, config)).toBe(false);
    });
    it('should return false when baseComponents has been disabled globally', () => {
      const config = new Config();
      config.reset({ baseComponents: false });
      const el = document.createElement('ion-badge');

      expect(isBaseComponent(el, config)).toBe(false);
    });
    it('should return true when component is included in includeComponents', () => {
      const config = new Config();
      config.reset({ baseComponents: { includeComponents: ['ion-badge'] } });
      const el = document.createElement('ion-badge');

      expect(isBaseComponent(el, config)).toBe(true);
    });
    it('should return false when component is not included in includeComponents', () => {
      const config = new Config();
      config.reset({ baseComponents: { includeComponents: ['ion-button'] } });
      const el = document.createElement('ion-badge');

      expect(isBaseComponent(el, config)).toBe(false);
    });
    it('should return false when component is included in excludeComponents', () => {
      const config = new Config();
      config.reset({ baseComponents: { excludeComponents: ['ion-badge'] } });
      const el = document.createElement('ion-badge');

      expect(isBaseComponent(el, config)).toBe(false);
    });
    it('should return true when component is not included in excludeComponents', () => {
      const config = new Config();
      config.reset({ baseComponents: { excludeComponents: ['ion-button'] } });
      const el = document.createElement('ion-badge');

      expect(isBaseComponent(el, config)).toBe(true);
    });
  });
  describe('component instance', () => {
    it('should return true when use-base attribute is set to "true" on the component instance', () => {
      const config = new Config();
      config.reset({});

      const el = document.createElement('ion-badge');
      el.setAttribute('use-base', 'true');

      expect(isBaseComponent(el, config)).toBe(true);
    });
    it('should return false when use-base attribute is set to "false" on the component instance', () => {
      const config = new Config();
      config.reset({});

      const el = document.createElement('ion-badge');
      el.setAttribute('use-base', 'false');

      expect(isBaseComponent(el, config)).toBe(false);
    });
  });
});
