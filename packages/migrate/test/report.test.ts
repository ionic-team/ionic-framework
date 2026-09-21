import { describe, expect, it } from 'vitest';

import { buildReport } from '../src/report.js';
import type { RunResult } from '../src/runner.js';
import type { Finding, Migration } from '../src/types.js';

/** A migration stub; `fix` presence is what buckets it as auto vs manual. */
function migration(id: string, opts: { auto: boolean } = { auto: true }): Migration {
  return {
    id,
    framework: 'core',
    fromMajor: 8,
    toMajor: 9,
    status: 'stable',
    docsUrl: `https://ionicframework.com/docs/updating/9-0#${id}`,
    detect: () => [],
    ...(opts.auto ? { fix: () => {} } : {}),
  };
}

const finding = (detail: string): Finding => ({ filePath: 'src/app.ts', line: 7, detail });

// Color is off outside a TTY (vitest), so these assertions are on plain text.
describe('buildReport', () => {
  it('says there is nothing to do for an empty result', () => {
    expect(buildReport({ entries: [] })).toBe('No applicable Ionic migrations found. Nothing to do.');
  });

  it('lists each auto-fix finding detail, not just a count', () => {
    const result: RunResult = {
      entries: [
        {
          migration: migration('angular-zoneless'),
          findings: [finding('add provideZoneChangeDetection() to preserve Zone.js change detection')],
          applied: true,
        },
      ],
    };

    const out = buildReport(result);

    expect(out).toContain('Applied 1 automatic migration(s):');
    expect(out).toContain('[fixed] angular-zoneless (1 change(s))');
    expect(out).toContain('src/app.ts:7 - add provideZoneChangeDetection() to preserve Zone.js change detection');
  });

  it('links the docs for auto-fix migrations, not just manual ones', () => {
    const result: RunResult = {
      entries: [
        { migration: migration('angular-standalone-imports'), findings: [finding("'@ionic/angular' -> '@ionic/angular/lazy'")], applied: true },
      ],
    };

    expect(buildReport(result)).toContain(
      'docs https://ionicframework.com/docs/updating/9-0#angular-standalone-imports'
    );
  });

  it('links a finding to its own docs section when it overrides the migration', () => {
    // react-router-6-routes shape: one migration, two distinct breaking changes.
    const result: RunResult = {
      entries: [
        {
          migration: migration('react-router-6-routes'),
          findings: [
            { ...finding('remove `exact`'), docsUrl: 'https://docs.test/#exact-prop-removed' },
            { ...finding('component={Home} -> element={<Home />}'), docsUrl: 'https://docs.test/#route-definition-changes' },
          ],
          applied: true,
        },
      ],
    };

    const out = buildReport(result);

    expect(out).toBe(
      [
        'Applied 1 automatic migration(s):',
        '  [fixed] react-router-6-routes (2 change(s))',
        '            src/app.ts:7 - remove `exact`',
        '            docs https://docs.test/#exact-prop-removed',
        '            src/app.ts:7 - component={Home} -> element={<Home />}',
        '            docs https://docs.test/#route-definition-changes',
      ].join('\n')
    );
  });

  it('groups findings that share a docs section under one link', () => {
    const shared = 'https://docs.test/#path-regex-constraints-removed';
    const result: RunResult = {
      entries: [
        {
          migration: migration('react-router-6-code', { auto: false }),
          findings: [
            { ...finding('regex path constraints removed'), docsUrl: shared },
            { ...finding('regex path constraints removed'), line: 9, docsUrl: shared },
          ],
          applied: false,
        },
      ],
    };

    const out = buildReport(result);

    expect(out.match(/review /g)).toHaveLength(1);
    expect(out).toContain('src/app.ts:7 - regex path constraints removed');
    expect(out).toContain('src/app.ts:9 - regex path constraints removed');
  });

  it('marks a dry run as would-fix rather than fixed', () => {
    const result: RunResult = {
      entries: [{ migration: migration('core-autocorrect'), findings: [finding('remove autocorrect="off"')], applied: false }],
    };

    const out = buildReport(result);

    expect(out).toContain('can be auto-fixed (dry run - nothing written):');
    expect(out).toContain('[would-fix] core-autocorrect');
  });

  it('reports manual migrations with their locations and docs link', () => {
    const result: RunResult = {
      entries: [
        {
          migration: migration('core-ion-img', { auto: false }),
          findings: [finding('replace ion-img with a native img')],
          applied: false,
        },
      ],
    };

    const out = buildReport(result);

    expect(out).toContain('1 migration(s) need manual review:');
    expect(out).toContain('[todo]  core-ion-img (1 location(s))');
    expect(out).toContain('src/app.ts:7 - replace ion-img with a native img');
    expect(out).toContain('review https://ionicframework.com/docs/updating/9-0#core-ion-img');
  });

  it('uses a different link label per bucket, the only plain-text cue when piped', () => {
    const result: RunResult = {
      entries: [
        { migration: migration('core-autocorrect'), findings: [finding('remove autocorrect="off"')], applied: true },
        {
          migration: migration('core-ion-img', { auto: false }),
          findings: [finding('replace ion-img with a native img')],
          applied: false,
        },
      ],
    };

    const out = buildReport(result);

    expect(out).toContain('docs https://ionicframework.com/docs/updating/9-0#core-autocorrect');
    expect(out).toContain('review https://ionicframework.com/docs/updating/9-0#core-ion-img');
    expect(out.match(/ docs /g)).toHaveLength(1);
    expect(out.match(/ review /g)).toHaveLength(1);
  });
});
