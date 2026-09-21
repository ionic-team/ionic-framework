import type {
  ComponentClass,
  FC,
  ForwardRefExoticComponent,
  MemoExoticComponent,
  ReactElement,
  RefAttributes,
} from 'react';

import type { useIonModal } from '../useIonModal';
import type { useIonPopover } from '../useIonPopover';

// The hooks are type-only imports, re-declared here. `@ionic/core/components` is ESM
// and Jest runs these specs as CommonJS, so importing them for real fails to load.
declare const useIonModalSignature: typeof useIonModal;
declare const useIonPopoverSignature: typeof useIonPopover;

interface RequiredProps {
  title: string;
  count?: number;
}

interface OptionalProps {
  count?: number;
}

declare const RequiredFunctionComponent: FC<RequiredProps>;
declare const RequiredClassComponent: ComponentClass<RequiredProps>;
declare const RequiredMemoComponent: MemoExoticComponent<FC<RequiredProps>>;
declare const RequiredForwardRefComponent: ForwardRefExoticComponent<RequiredProps & RefAttributes<HTMLDivElement>>;
declare const OptionalPropsComponent: FC<OptionalProps>;
declare const NoPropsComponent: FC;
declare const DismissableComponent: FC<{ dismiss: (data: string, role: string) => void }>;
declare const UntypedComponent: FC<any>;
declare const overlayElement: ReactElement;

// None of these functions are invoked. They exist so `npm run typecheck` checks the
// calls inside them.
function componentPropsAreTypeChecked() {
  useIonModalSignature(RequiredFunctionComponent, { title: 'Modal', count: 1 });
  useIonModalSignature(RequiredClassComponent, { title: 'Modal' });
  useIonModalSignature(RequiredMemoComponent, { title: 'Modal' });
  useIonModalSignature(RequiredForwardRefComponent, { title: 'Modal' });
  useIonPopoverSignature(RequiredFunctionComponent, { title: 'Popover', count: 1 });
  useIonPopoverSignature(RequiredClassComponent, { title: 'Popover' });

  useIonPopoverSignature(RequiredMemoComponent, { title: 'Popover' });
  useIonPopoverSignature(RequiredForwardRefComponent, { title: 'Popover' });

  // @ts-expect-error a required prop may not be omitted
  useIonModalSignature(RequiredFunctionComponent, { count: 1 });
  // @ts-expect-error
  useIonPopoverSignature(RequiredClassComponent, { count: 1 });

  // @ts-expect-error unknown props are not accepted
  useIonModalSignature(RequiredFunctionComponent, { title: 'Modal', unknown: true });
  // @ts-expect-error
  useIonPopoverSignature(RequiredFunctionComponent, { title: 'Popover', unknown: true });

  // @ts-expect-error props must match the declared types
  useIonModalSignature(RequiredFunctionComponent, { title: 1 });
  // @ts-expect-error
  useIonPopoverSignature(RequiredFunctionComponent, { title: 1 });

  // @ts-expect-error a forwarded ref does not exempt a component from the check
  useIonModalSignature(RequiredForwardRefComponent, { title: 1 });
}

// A rest-tuple signature still accepts an explicit type argument, so apps can pin the
// props type instead of relying on inference.
function explicitTypeArgumentsAreSupported() {
  useIonModalSignature<RequiredProps>(RequiredFunctionComponent, { title: 'Modal' });
  useIonPopoverSignature<RequiredProps>(RequiredFunctionComponent, { title: 'Popover' });

  // @ts-expect-error an explicit type argument still checks the props
  useIonModalSignature<RequiredProps>(RequiredFunctionComponent, { count: 1 });
}

// Every call below omits `componentProps`, which `RequiredProps` does not allow.
function componentPropsAreRequiredWhenTheComponentRequiresThem() {
  // @ts-expect-error
  useIonModalSignature(RequiredFunctionComponent);
  // @ts-expect-error
  useIonModalSignature(RequiredClassComponent);
  // @ts-expect-error
  useIonModalSignature(RequiredMemoComponent);
  // @ts-expect-error
  useIonPopoverSignature(RequiredFunctionComponent);
  // @ts-expect-error
  useIonPopoverSignature(RequiredClassComponent);
  // @ts-expect-error
  useIonPopoverSignature(RequiredMemoComponent);
}

// Untyped components keep the pre-v9 behavior, so upgrading apps don't get a new
// build error out of this.
function untypedComponentsStayPermissive() {
  useIonModalSignature(UntypedComponent);
  useIonModalSignature(UntypedComponent, { anything: true });
  useIonPopoverSignature(UntypedComponent);
  useIonPopoverSignature(UntypedComponent, { anything: true });
}

function componentPropsAreOptionalWhenTheComponentHasNoRequiredProps() {
  useIonModalSignature(NoPropsComponent);
  useIonPopoverSignature(NoPropsComponent);

  useIonModalSignature(OptionalPropsComponent);
  useIonModalSignature(OptionalPropsComponent, { count: 1 });
  useIonPopoverSignature(OptionalPropsComponent);
  useIonPopoverSignature(OptionalPropsComponent, { count: 1 });
}

function jsxElementsRemainPermissive() {
  useIonModalSignature(overlayElement);
  useIonModalSignature(overlayElement, { anything: true });
  useIonPopoverSignature(overlayElement);
  useIonPopoverSignature(overlayElement, { anything: true });
}

// Inline components need their props annotated, since `Props` is inferred from the
// component rather than from `componentProps`. See the `NoInfer` note in `useIonModal`.
function inlineComponentsAnnotateTheirProps() {
  useIonModalSignature(({ name }: { name: string }) => <div>Hello {name}.</div>, { name: 'Dave' });
  useIonPopoverSignature(({ name }: { name: string }) => <div>Hello {name}.</div>, { name: 'Dave' });
}

// Overlays commonly pass `dismiss` back to the component through `componentProps`.
// That reads the binding the hook is still declaring, so it only compiles while
// `componentProps` stays out of inference.
function selfReferencingDismissCompiles() {
  const [, dismissModal] = useIonModalSignature(DismissableComponent, {
    dismiss: (data: string, role: string) => dismissModal(data, role),
  });

  const [, dismissPopover] = useIonPopoverSignature(DismissableComponent, {
    dismiss: (data: string, role: string) => dismissPopover(data, role),
  });
}

// Referenced so `noUnusedLocals` doesn't flag them. Keeping them unexported is what
// keeps the emitted declaration file empty.
void [
  componentPropsAreTypeChecked,
  explicitTypeArgumentsAreSupported,
  componentPropsAreRequiredWhenTheComponentRequiresThem,
  untypedComponentsStayPermissive,
  componentPropsAreOptionalWhenTheComponentHasNoRequiredProps,
  jsxElementsRemainPermissive,
  inlineComponentsAnnotateTheirProps,
  selfReferencingDismissCompiles,
];

describe('overlay hook types', () => {
  it('type checks component props at compile time', () => {
    // The assertions in this file are enforced by `npm run typecheck`, which CI runs
    // for this package. ts-jest sets `isolatedModules` in `tsconfig.spec.json` and so
    // doesn't type check, which leaves nothing to assert at runtime.
  });
});
