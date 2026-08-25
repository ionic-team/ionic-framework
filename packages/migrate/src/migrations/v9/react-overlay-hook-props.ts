import type { ParameterDeclaration } from 'ts-morph';

import { annotationFor, overlayHookCalls, unannotatedInlineProps } from '../../ast/react-overlay-hooks.js';
import type { MigrationContext } from '../../context.js';
import type { Migration } from '../../types.js';

interface Annotation {
  filePath: string;
  line: number;
  parameter: ParameterDeclaration;
  text: string;
}

/**
 * Every inline component this migration can annotate. Shared by detect and fix so
 * the report and the edit can't disagree about which calls are covered.
 */
function annotations(ctx: MigrationContext): Annotation[] {
  const found: Annotation[] = [];
  for (const file of ctx.project.getSourceFiles()) {
    const filePath = ctx.relative(file.getFilePath());
    for (const { call, component, componentProps, line } of overlayHookCalls(file)) {
      if (componentProps === undefined) continue;
      // An explicit type argument pins `Props`, so an annotation derived from
      // `componentProps` could contradict what the hook actually checks against.
      if (call.getTypeArguments().length > 0) continue;
      const inline = unannotatedInlineProps(component);
      // Nothing is read off the parameter, so there is no error to annotate away.
      if (inline === undefined || inline.reads.length === 0) continue;
      const annotation = annotationFor(componentProps);
      if (annotation === undefined) continue;
      // Annotating from props that don't cover every name the component reads
      // would trade one compile error for another, and silence the report that
      // would have described it.
      if (inline.reads.some((name) => !annotation.names.includes(name))) continue;
      found.push({ filePath, line, parameter: inline.parameter, text: annotation.text });
    }
  }
  return found;
}

/**
 * Annotates the props parameter of a component written inline at a
 * `useIonModal`/`useIonPopover` call, from the `componentProps` it is passed.
 *
 * Experimental because the annotation is derived from values rather than read
 * from a declaration: `{ name: 'Dave' }` gives `{ name: string }`, which is often
 * but not always what was wanted. Anything it can't be printed from is left to
 * `react-overlay-hook-props-manual` to report.
 *
 * Runs before that migration, which reports the same calls: migrations are
 * selected in id order, so the report re-reads an annotated parameter and stays
 * quiet. Renaming either id breaks that.
 *
 * Refer to https://ionicframework.com/docs/updating/9-0#typed-overlay-hook-props
 */
export const reactOverlayHookProps: Migration = {
  id: 'react-overlay-hook-props',
  framework: 'react',
  fromMajor: 8,
  toMajor: 9,
  status: 'experimental',
  docsUrl: 'https://ionicframework.com/docs/updating/9-0#typed-overlay-hook-props',

  detect(ctx) {
    return annotations(ctx).map(({ filePath, line, text }) => ({
      filePath,
      line,
      detail: `annotate the inline component's props parameter as ${text}`,
    }));
  },

  fix(ctx) {
    // Bottom-up, so annotating one call can't move the positions of the calls
    // still to be visited.
    for (const { parameter, text } of annotations(ctx).reverse()) {
      parameter.setType(text);
    }
  },
};
