import { createInMemoryContext } from '../../src/context.js';
import type { MigrationContext } from '../../src/context.js';

/**
 * A minimal stand-in for `@types/react`, holding the component shapes the overlay
 * hook analysis reads: the `FunctionComponent` call signature, `Component`'s
 * `props` member, and `memo`'s identity return. Written into the in-memory
 * project so a fixture's `React.FC<Props>` resolves to a real props type instead
 * of `any` - the same thing an installed `@types/react` gives the disk context.
 *
 * Declaring it as `export =` is what makes `esModuleInterop` load-bearing here,
 * as it is in the published types.
 */
export const REACT_TYPES = `
declare namespace React {
  type ReactNode = any;
  interface FunctionComponent<P = {}> {
    (props: P): ReactNode;
  }
  type FC<P = {}> = FunctionComponent<P>;
  class Component<P = {}, S = {}> {
    props: Readonly<P>;
    state: Readonly<S>;
    render(): ReactNode;
  }
  interface NamedExoticComponent<P = {}> {
    (props: P): ReactNode;
    displayName?: string;
  }
  function memo<P>(component: FunctionComponent<P>): NamedExoticComponent<P>;
}
export = React;
export as namespace React;
`;

/** A stand-in for `@ionic/react`, so a fixture's hook import resolves. */
const IONIC_REACT_TYPES = `
export declare function useIonModal(component: any, componentProps?: any): [(opts?: any) => void, (data?: any, role?: string) => void];
export declare function useIonPopover(component: any, componentProps?: any): [(opts?: any) => void, (data?: any, role?: string) => void];
`;

/**
 * An in-memory React project with `react` and `@ionic/react` types installed.
 * Entries in `files` are written as given, so a test can lay out components
 * across files the way an app does.
 */
export function reactProject(files: Record<string, string>): MigrationContext {
  return createInMemoryContext({
    'package.json': JSON.stringify({ dependencies: { '@ionic/react': '^8.0.0', react: '^18.0.0' } }, null, 2),
    'node_modules/@types/react/package.json': JSON.stringify({ name: '@types/react', types: 'index.d.ts' }),
    'node_modules/@types/react/index.d.ts': REACT_TYPES,
    'node_modules/@ionic/react/package.json': JSON.stringify({ name: '@ionic/react', types: 'index.d.ts' }),
    'node_modules/@ionic/react/index.d.ts': IONIC_REACT_TYPES,
    ...files,
  });
}

/** The current text of a file in a {@link reactProject}, after a fix has run. */
export function readSource(ctx: MigrationContext, relPath: string): string {
  return ctx.project.getSourceFileOrThrow(`${ctx.rootDir}/${relPath}`).getFullText();
}
