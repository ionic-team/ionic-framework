import {
  closestName,
  declaredProps,
  writtenPropNames,
  overlayHookCalls,
  passedPropNames,
  propMismatches,
  unannotatedInlineProps,
} from '../../ast/react-overlay-hooks.js';
import type { OverlayHookCall } from '../../ast/react-overlay-hooks.js';
import type { Finding, Migration } from '../../types.js';

/**
 * Quote and join prop names for a sentence. No article, since `a`/`an` picked
 * from the first letter gets names like `url` and `user` wrong.
 */
function propList(names: string[]): string {
  const quoted = names.map((name) => `"${name}"`);
  if (quoted.length === 1) return quoted[0];
  const last = quoted.pop();
  return `${quoted.join(', ')} and ${last}`;
}

/**
 * What stops one call from compiling, as report details. Empty when the call is
 * fine or when the answer is out of reach.
 *
 * Derived here rather than in `detect` so the checks read in the order they
 * interact: a suggestion for a misspelled prop suppresses the missing-prop
 * finding it would otherwise duplicate.
 */
function callProblems(hookCall: OverlayHookCall): string[] {
  const { component, componentProps } = hookCall;
  // A call expression or a conditional has no name to quote, so the wording falls
  // back to naming it by role.
  const componentName = hookCall.componentName ?? 'The component';

  // Checked before the component's type, which is misleading for this shape: the
  // break is in the component body (see `unannotatedInlineProps`). Once
  // `--experimental` has annotated the parameter, a later run says nothing here.
  const inline = unannotatedInlineProps(component);
  if (inline !== undefined) {
    return inline.reads.length > 0
      ? [
          `The inline component reads ${propList([...new Set(inline.reads)])} off an unannotated ` +
            `props parameter, which resolves to {}`,
        ]
      : [];
  }

  const declared = declaredProps(hookCall);
  if (declared === undefined) return [];
  const declaredNames = declared.props.map((prop) => prop.name);
  const required = declared.props.filter((prop) => prop.required).map((prop) => prop.name);

  // The signature makes `componentProps` an argument the caller can't drop once
  // the component declares a prop it can't do without.
  if (componentProps === undefined) {
    return required.length > 0
      ? [`${componentName} requires ${propList(required)}, so componentProps can no longer be omitted`]
      : [];
  }

  // Nothing readable was passed (`props as any`), and the signature accepts it.
  const passed = passedPropNames(componentProps);
  if (passed === undefined) return [];

  const problems: string[] = [];
  // A misspelled prop also leaves the prop it meant to pass missing. Reporting
  // both halves describes one mistake twice, so a name a suggestion accounts for
  // is held back from the missing-prop check below.
  const suggested = new Set<string>();
  // Excess-property checking only fires on keys written in a fresh object literal
  // (see `writtenPropNames`), against a target that names at least one property.
  // A component declaring none accepts anything, and an open type names keys it
  // doesn't list.
  const written = writtenPropNames(componentProps);
  if (written !== undefined && declaredNames.length > 0 && !declared.open) {
    for (const name of written) {
      if (declaredNames.includes(name)) continue;
      const suggestion = closestName(name, declaredNames);
      if (suggestion) suggested.add(suggestion);
      problems.push(
        `${componentName} has no "${name}" prop` + (suggestion ? `. Did you mean "${suggestion}"?` : '')
      );
    }
  }

  // One finding for the whole set. A call missing three props is one thing to
  // fix, and three lines pointing at the same line read as three.
  const missing = required.filter((name) => !passed.includes(name) && !suggested.has(name));
  if (missing.length > 0) {
    problems.push(`${componentName} requires ${propList(missing)}, which componentProps does not pass`);
  }

  for (const mismatch of propMismatches(declared, componentProps)) {
    problems.push(
      `${componentName}'s "${mismatch.name}" prop is ${mismatch.declared}, ` +
        `and componentProps passes ${mismatch.passed}`
    );
  }
  return problems;
}

/**
 * Reports `useIonModal`/`useIonPopover` calls that stop compiling now that the
 * hooks type `componentProps` against the component they are given instead of
 * accepting `any`.
 *
 * Report-only, because every case turns on what the developer meant. A prop the
 * component doesn't declare is either a typo or a prop the component should have
 * declared, a missing required prop has no value to supply for it, and nothing
 * here can tell those apart.
 *
 * It stays quiet, deliberately, about a component whose type doesn't resolve (a
 * `paths` alias, a package without types installed), a props type of `any`, the
 * JSX element form, and a mismatch that only exists under `strict` (see
 * `propMismatches`). A false finding sends someone editing code that compiles.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#typed-overlay-hook-props
 */
export const reactOverlayHookPropsManual: Migration = {
  id: 'react-overlay-hook-props-manual',
  framework: 'react',
  fromMajor: 8,
  toMajor: 9,
  status: 'stable',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#typed-overlay-hook-props',

  detect(ctx) {
    const findings: Finding[] = [];
    for (const file of ctx.project.getSourceFiles()) {
      const filePath = ctx.relative(file.getFilePath());
      for (const hookCall of overlayHookCalls(file)) {
        for (const detail of callProblems(hookCall)) {
          findings.push({ filePath, line: hookCall.line, detail });
        }
      }
    }
    return findings;
  },
};
