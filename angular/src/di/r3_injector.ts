/**
 * This class is taken directly from Angular's codebase. It can be removed once
 * we remove support for < Angular 14. The replacement class will come from @angular/core.
 *
 * TODO: FW-1641: Remove this class once Angular 13 support is dropped.
 *
 */
import { Injector, ProviderToken, InjectFlags } from '@angular/core';
/**
 * An `Injector` that's part of the environment injector hierarchy, which exists outside of the
 * component tree.
 *
 * @developerPreview
 */
export abstract class EnvironmentInjector implements Injector {
  /**
   * Retrieves an instance from the injector based on the provided token.
   * @returns The instance from the injector if defined, otherwise the `notFoundValue`.
   * @throws When the `notFoundValue` is `undefined` or `Injector.THROW_IF_NOT_FOUND`.
   */
  abstract get<T>(token: ProviderToken<T>, notFoundValue?: T, flags?: InjectFlags): T;
  /**
   * @deprecated from v4.0.0 use ProviderToken<T>
   * @suppress {duplicate}
   */
  abstract get(token: any, notFoundValue?: any): any;

  abstract destroy(): void;

  /**
   * @internal
   */
  abstract onDestroy(callback: () => void): void;
}
