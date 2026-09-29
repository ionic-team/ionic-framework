import { Node, SyntaxKind } from 'ts-morph';
import type { CallExpression, ParameterDeclaration, SourceFile, Type, ts } from 'ts-morph';

/** The `@ionic/react` hooks that type `componentProps` against their component. */
const HOOK_NAMES = new Set(['useIonModal', 'useIonPopover']);
const IONIC_REACT = '@ionic/react';

export interface OverlayHookCall {
  call: CallExpression;
  component: Node;
  /** The component's name, when the argument is one a finding can name. */
  componentName?: string;
  /** The `componentProps` argument, absent when the call omits it. */
  componentProps?: Node;
  /** 1-based line of the call. */
  line: number;
}

export interface DeclaredProp {
  name: string;
  required: boolean;
}

/**
 * What a component declares it accepts. A component with no props parameter has
 * an empty {@link props} list, which is different from a type out of reach
 * (`undefined`) and is reported differently.
 */
export interface PropsShape {
  props: DeclaredProp[];
  /** The props type, when the component declares a parameter for it. */
  type?: Type;
  /**
   * Whether the type accepts keys it does not name, via an index signature. An
   * open type can't produce an unknown-prop finding.
   */
  open: boolean;
  /**
   * Whether the component is generic, so its prop types still hold unbound type
   * parameters. Which props exist is still worth reading, but their types are not
   * comparable until the hook instantiates them.
   */
  generic: boolean;
}

/**
 * Expressions the file calls the overlay hooks by, covering both the named import
 * (`useIonModal`, or whatever it was renamed to) and a namespace import's
 * qualified form (`Ionic.useIonModal`).
 *
 * Read from the import rather than matched on the callee text, so an app's own
 * function of the same name is not mistaken for the hook.
 */
function importedHookNames(file: SourceFile): Set<string> {
  const names = new Set<string>();
  for (const imp of file.getImportDeclarations()) {
    if (imp.getModuleSpecifierValue() !== IONIC_REACT) continue;
    for (const named of imp.getNamedImports()) {
      if (HOOK_NAMES.has(named.getName())) names.add(named.getAliasNode()?.getText() ?? named.getName());
    }
    const namespace = imp.getNamespaceImport();
    if (namespace) {
      for (const hook of HOOK_NAMES) names.add(`${namespace.getText()}.${hook}`);
    }
  }
  return names;
}

/** Every overlay hook call in `file`, in source order. */
export function overlayHookCalls(file: SourceFile): OverlayHookCall[] {
  const hooks = importedHookNames(file);
  if (hooks.size === 0) return [];

  const calls: OverlayHookCall[] = [];
  for (const call of file.getDescendantsOfKind(SyntaxKind.CallExpression)) {
    if (!hooks.has(call.getExpression().getText())) continue;
    const [component, componentProps] = call.getArguments();
    if (component === undefined) continue;
    const named = Node.isIdentifier(component) || Node.isPropertyAccessExpression(component);
    calls.push({
      call,
      component,
      ...(named ? { componentName: component.getText() } : {}),
      ...(componentProps ? { componentProps } : {}),
      line: call.getStartLineNumber(),
    });
  }
  return calls;
}

function isElementArgument(component: Node): boolean {
  return Node.isJsxElement(component) || Node.isJsxSelfClosingElement(component) || Node.isJsxFragment(component);
}

/** An inline component reading props off a parameter that resolves to `{}`. */
export interface UnannotatedInlineProps {
  parameter: ParameterDeclaration;
  /** Prop names the component body reads, in the order they are read. */
  reads: string[];
}

/**
 * A component written inline at the call whose props parameter carries no type
 * annotation, along with what it reads off that parameter.
 *
 * On its own `({ name }) => ...` infers `{ name: any }`, but at the hook it
 * resolves to `{}`: `Props` is inferred from the component while `NoInfer` holds
 * `componentProps` out of inference, and an unannotated parameter contributes
 * nothing to infer from. The error is therefore in the component body, whatever
 * `componentProps` holds. A parameter nothing is read from compiles, so an empty
 * {@link reads} means there is nothing to report.
 */
export function unannotatedInlineProps(component: Node): UnannotatedInlineProps | undefined {
  if (!Node.isArrowFunction(component) && !Node.isFunctionExpression(component)) return undefined;
  const [parameter] = component.getParameters();
  if (parameter === undefined || parameter.getTypeNode() !== undefined) return undefined;
  return { parameter, reads: propsRead(parameter, component) };
}

/** A property name, with the quotes off a string-literal key. */
function propertyName(node: Node): string {
  return Node.isStringLiteral(node) || Node.isNumericLiteral(node) ? String(node.getLiteralValue()) : node.getText();
}

function propsRead(parameter: ParameterDeclaration, component: Node): string[] {
  const name = parameter.getNameNode();

  // Destructured in the parameter list. A rest element names nothing.
  if (Node.isObjectBindingPattern(name)) {
    return name
      .getElements()
      .filter((element) => element.getDotDotDotToken() === undefined)
      .map((element) => propertyName(element.getPropertyNameNode() ?? element.getNameNode()));
  }
  if (!Node.isIdentifier(name)) return [];

  // Read through the parameter's own name, either as `props.x` or by
  // destructuring it in the body. Matched on the symbol rather than the text, so
  // a nested function that shadows the name is not mistaken for a read of it.
  // Without a symbol there is nothing to match references against, and comparing
  // two undefined symbols would match every identifier in the body.
  const parameterSymbol = name.getSymbol();
  if (parameterSymbol === undefined) return [];

  const reads: string[] = [];
  for (const reference of component.getDescendantsOfKind(SyntaxKind.Identifier)) {
    if (reference === name || reference.getSymbol() !== parameterSymbol) continue;
    const parent = reference.getParent();
    if (Node.isPropertyAccessExpression(parent) && parent.getExpression() === reference) {
      reads.push(parent.getName());
    } else if (Node.isVariableDeclaration(parent) && parent.getInitializer() === reference) {
      const bound = parent.getNameNode();
      if (Node.isObjectBindingPattern(bound)) {
        for (const element of bound.getElements()) {
          if (element.getDotDotDotToken() === undefined) {
            reads.push(propertyName(element.getPropertyNameNode() ?? element.getNameNode()));
          }
        }
      }
    }
  }
  return reads;
}

/**
 * What the hook signature checks `componentProps` against, or `undefined` when
 * the call is outside what it checks or the answer is out of reach.
 *
 * Returning `undefined` means say nothing, which covers a JSX element (the
 * permissive overload), a props type of `any` (permissive too), and a component
 * type that never resolved, usually a `paths` alias or a package that isn't
 * installed.
 */
export function declaredProps(hookCall: OverlayHookCall): PropsShape | undefined {
  const { call, component } = hookCall;
  if (isElementArgument(component)) return undefined;

  // An explicit type argument pins `Props`, so the component is not consulted.
  const [typeArg] = call.getTypeArguments();
  if (typeArg) return shapeOf(typeArg.getType());

  const componentType = component.getType();
  const [callSignature] = componentType.getCallSignatures();
  if (callSignature) {
    const generic = callSignature.getTypeParameters().length > 0;
    const [propsParam] = callSignature.getParameters();
    // No parameter means the component accepts no props at all.
    if (propsParam === undefined) return { props: [], open: false, generic };
    const declaration = propsParam.getDeclarations()[0];
    return declaration ? shapeOf(propsParam.getTypeAtLocation(declaration), generic) : undefined;
  }

  const [constructSignature] = componentType.getConstructSignatures();
  if (constructSignature) {
    const props = constructSignature.getReturnType().getProperty('props');
    const declaration = props?.getDeclarations()[0];
    return declaration
      ? shapeOf(props!.getTypeAtLocation(declaration), constructSignature.getTypeParameters().length > 0)
      : undefined;
  }
  return undefined;
}

/** Read a resolved props type into a {@link PropsShape}. */
function shapeOf(type: Type, generic = false): PropsShape | undefined {
  // Like `any`, these mean the type resolved to nothing usable.
  if (type.isAny() || type.isUnknown() || type.isNever()) return undefined;
  return {
    type,
    props: type.getProperties().map((prop) => ({
      name: prop.getName(),
      required: !prop.isOptional(),
    })),
    open: type.getStringIndexType() !== undefined || type.getNumberIndexType() !== undefined,
    generic,
  };
}

/**
 * Property names of the type passed as `componentProps`, or `undefined` when the
 * type says nothing about them.
 *
 * The case that matters is `any`: it satisfies the signature whatever the
 * component declares, so the call still compiles, and reading no properties off
 * it would look like a call passing nothing at all.
 */
export function passedPropNames(componentProps: Node): string[] | undefined {
  const type = componentProps.getType();
  if (type.isAny() || type.isUnknown() || type.isTypeParameter()) return undefined;
  return type.getProperties().map((prop) => prop.getName());
}

/**
 * Prop names written directly in a fresh object literal at the call, or
 * `undefined` when `componentProps` isn't one.
 *
 * The only input an unknown-prop finding may be drawn from, since excess-property
 * checking only applies to a fresh literal and to the members spelled out in it.
 * A variable passed by name and a key arriving through a spread are both accepted
 * however little they match. A key written alongside that spread is still checked.
 */
export function writtenPropNames(componentProps: Node): string[] | undefined {
  if (!Node.isObjectLiteralExpression(componentProps)) return undefined;
  const names: string[] = [];
  for (const prop of componentProps.getProperties()) {
    // A spread contributes keys from a type, not from this literal, and they are
    // not excess-property checked.
    if (Node.isSpreadAssignment(prop)) continue;
    const nameNode = Node.isPropertyAssignment(prop) ||
      Node.isShorthandPropertyAssignment(prop) ||
      Node.isMethodDeclaration(prop) ||
      Node.isGetAccessorDeclaration(prop) ||
      Node.isSetAccessorDeclaration(prop)
      ? prop.getNameNode()
      : undefined;
    if (nameNode === undefined) continue;
    // A computed key isn't a known name to check against.
    if (Node.isComputedPropertyName(nameNode)) continue;
    names.push(propertyName(nameNode));
  }
  return names;
}

/** A prop passed with a type the component does not accept. */
export interface PropMismatch {
  name: string;
  /** The type the component declares, as source text. */
  declared: string;
  /** The type `componentProps` passes, as source text. */
  passed: string;
}

/**
 * Props present on both sides whose passed type the declared type does not
 * accept. Empty when the comparison can't be made.
 *
 * The checker is asked directly rather than the type texts compared, since only
 * it knows about widening, unions, and variance. It runs with the compiler
 * defaults from `context.ts`, not the app's `tsconfig.json`, so a mismatch that
 * only exists under `strict` compares as assignable and goes unreported. That
 * direction is deliberate: anything reported here fails under any setting.
 */
export function propMismatches(declared: PropsShape, componentProps: Node): PropMismatch[] {
  const declaredType = declared.type;
  // A generic component's prop types still hold unbound type parameters, and
  // nothing is assignable to a bare `T`. The hook instantiates them at the call,
  // so comparing here reports calls that compile.
  if (declaredType === undefined || declared.generic) return [];

  // The checker's `isTypeAssignableTo` is internal rather than part of ts-morph's
  // surface, so a release that drops it degrades to reporting nothing here rather
  // than throwing mid-run.
  const checker = componentProps.getProject().getTypeChecker().compilerObject as ts.TypeChecker & {
    isTypeAssignableTo?: (source: ts.Type, target: ts.Type) => boolean;
  };
  if (typeof checker.isTypeAssignableTo !== 'function') return [];

  const passedType = componentProps.getType();
  const mismatches: PropMismatch[] = [];
  for (const passedProp of passedType.getProperties()) {
    const declaredProp = declaredType.getProperty(passedProp.getName());
    if (declaredProp === undefined) continue;

    const passedDeclaration = passedProp.getDeclarations()[0];
    const declaredDeclaration = declaredProp.getDeclarations()[0];
    if (passedDeclaration === undefined || declaredDeclaration === undefined) continue;

    const passed = passedProp.getTypeAtLocation(passedDeclaration);
    const target = declaredProp.getTypeAtLocation(declaredDeclaration);
    if (checker.isTypeAssignableTo(passed.compilerType, target.compilerType)) continue;
    mismatches.push({
      name: passedProp.getName(),
      declared: target.getText(declaredDeclaration),
      passed: passed.getText(passedDeclaration),
    });
  }
  return mismatches;
}

/**
 * A prop name as it has to be written in a type literal, or `undefined` when it
 * can't be written safely. Anything that isn't a plain identifier (`data-test`,
 * `aria-label`) needs quoting to parse, and a name carrying a quote of its own
 * declines instead.
 */
function memberName(name: string): string | undefined {
  if (/^[A-Za-z_$][\w$]*$/.test(name)) return name;
  return /['\\\r\n]/.test(name) ? undefined : `'${name}'`;
}

export interface PropsAnnotation {
  /** The type literal to write, e.g. `{ name: string }`. */
  text: string;
  names: string[];
}

/**
 * A props annotation written from the `componentProps` passed at a call, or
 * `undefined` when one can't be printed.
 *
 * Only an object literal qualifies. A variable or a spread would need the type it
 * resolves to, and printing that names types the file may not have imported, so
 * those calls are left to be reported instead. A member whose own type prints as
 * a module path (`import("/path").Foo`) or as `typeof` a binding the file may not
 * have is unusable as source text for the same reason, and declines the whole
 * annotation rather than half of one.
 */
export function annotationFor(componentProps: Node): PropsAnnotation | undefined {
  if (!Node.isObjectLiteralExpression(componentProps)) return undefined;
  // Only plain `name: value` and shorthand `name` members carry a name and a type
  // this can read. A spread contributes keys from somewhere else entirely.
  const named = componentProps.getProperties().every((prop) => {
    if (!Node.isPropertyAssignment(prop) && !Node.isShorthandPropertyAssignment(prop)) return false;
    return !Node.isComputedPropertyName(prop.getNameNode());
  });
  if (!named) return undefined;

  const members: string[] = [];
  const names: string[] = [];
  for (const prop of componentProps.getType().getProperties()) {
    const declaration = prop.getDeclarations()[0];
    if (declaration === undefined) return undefined;
    const name = memberName(prop.getName());
    if (name === undefined) return undefined;
    const text = prop.getTypeAtLocation(declaration).getText(declaration);
    if (/\bimport\(|\btypeof\b/.test(text)) return undefined;
    members.push(`${name}${prop.isOptional() ? '?' : ''}: ${text}`);
    names.push(prop.getName());
  }
  return members.length > 0 ? { text: `{ ${members.join('; ')} }`, names } : undefined;
}

/**
 * The name in `candidates` closest to `name`, when one is close enough to be
 * worth suggesting. Only a single best match within two edits qualifies, so a
 * prop that isn't declared reads as undeclared rather than as a typo.
 */
export function closestName(name: string, candidates: string[]): string | undefined {
  let best: string | undefined;
  let bestDistance = Infinity;
  let tied = false;
  for (const candidate of candidates) {
    const distance = editDistance(name.toLowerCase(), candidate.toLowerCase());
    if (distance < bestDistance) {
      best = candidate;
      bestDistance = distance;
      tied = false;
    } else if (distance === bestDistance) {
      tied = true;
    }
  }
  return best !== undefined && bestDistance <= 2 && !tied ? best : undefined;
}

/** Levenshtein distance, for {@link closestName}. */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const current = [i];
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[b.length];
}
