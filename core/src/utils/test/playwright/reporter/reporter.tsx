/**
 * Copyright (c) Microsoft Corporation.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type {
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
  TestError,
  Reporter,
} from '@playwright/test/reporter';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

class HtmlReporter implements Reporter {
  private config!: FullConfig;
  private suite!: Suite;
  private _topLevelErrors: TestError[] = [];
  private _reactAppDirectory = path.dirname(__filename);

  printsToStdio() {
    return false;
  }

  onBegin(config: FullConfig, suite: Suite) {
    this.config = config;
    this.suite = suite;
  }

  onError(error: TestError): void {
    this._topLevelErrors.push(error);
  }

  async onEnd(result: FullResult) {
    const projectSuites = this.suite.suites;

    const data = new Map<string, { testFile: any; testFileSummary: any }>();
    for (const projectSuite of projectSuites) {
      for (const fileSuite of projectSuite.suites) {
        const fileName = relativeLocation(fileSuite.location)!.file;
        const fileId = (fileSuite as any)._fileId!;
        let fileEntry = data.get(fileId);
        if (!fileEntry) {
          fileEntry = {
            testFile: { fileId, fileName, tests: [] },
            testFileSummary: { fileId, fileName, tests: [], stats: emptyStats() },
          };
          data.set(fileId, fileEntry);
        }
        const { testFile, testFileSummary } = fileEntry;
        const testEntries: any[] = [];
        this._processJsonSuite(
          fileSuite,
          fileId,
          projectSuite.project()!.name,
          projectSuite.project()!.metadata?.reportName,
          [],
          testEntries
        );

        for (const test of testEntries) {
          testFile.tests.push(test.testCase);
          testFileSummary.tests.push(test.testCaseSummary);
        }
      }
    }

    for (const [, { testFileSummary }] of data) {
      const stats = testFileSummary.stats;
      for (const test of testFileSummary.tests) {
        if (test.outcome === 'expected') ++stats.expected;
        if (test.outcome === 'skipped') ++stats.skipped;
        if (test.outcome === 'unexpected') ++stats.unexpected;
        if (test.outcome === 'flaky') ++stats.flaky;
        ++stats.total;
      }
      stats.ok = stats.unexpected + stats.flaky === 0;

      const testCaseSummaryComparator = (t1: any, t2: any) => {
        const w1 = (t1.outcome === 'unexpected' ? 1000 : 0) + (t1.outcome === 'flaky' ? 1 : 0);
        const w2 = (t2.outcome === 'unexpected' ? 1000 : 0) + (t2.outcome === 'flaky' ? 1 : 0);
        return w2 - w1;
      };
      testFileSummary.tests.sort(testCaseSummaryComparator);
    }

    const htmlReport: any = {
      metadata: this.config.metadata,
      startTime: result.startTime.getTime(),
      duration: result.duration,
      files: [...data.values()].map((e) => e.testFile),
      projectNames: projectSuites.map((r) => r.project()!.name),
      stats: { ...[...data.values()].reduce((a, e) => addStats(a, e.testFileSummary.stats), emptyStats()) },
      errors: this._topLevelErrors.map((error) => error.message),
    };

    htmlReport.files.sort((f1: any, f2: any) => {
      const w1 = f1.stats.unexpected * 1000 + f1.stats.flaky;
      const w2 = f2.stats.unexpected * 1000 + f2.stats.flaky;
      return w2 - w1;
    });

    const htmlReportJson = JSON.stringify(htmlReport, undefined, 2);
    fs.writeFileSync(`${this._reactAppDirectory}/src/htmlReport.json`, htmlReportJson);
  }

  async onExit() {
    const execPromise = util.promisify(exec);

    const reactAppDirectory = this._reactAppDirectory;

    const startCommand = 'npm start';
    const command = `cd ${reactAppDirectory} && ${startCommand}`;

    try {
      const { stdout, stderr } = await execPromise(command);
      console.log(stdout);
      console.log(stderr);
    } catch (error) {
      console.log(error);
    }
  }

  private _processJsonSuite = (
    suite: Suite,
    fileId: string,
    projectName: string,
    botName: string | undefined,
    path: string[],
    outTests: any[]
  ) => {
    const newPath = [...path, suite.title];
    suite.suites.forEach((s) => this._processJsonSuite(s, fileId, projectName, botName, newPath, outTests));
    suite.tests.forEach((t) => outTests.push(createTestEntry(t, projectName, botName, newPath)));
  };
}

const emptyStats = (): any => {
  return {
    total: 0,
    expected: 0,
    unexpected: 0,
    flaky: 0,
    skipped: 0,
    ok: true,
  };
};

const addStats = (stats: any, delta: any): any => {
  stats.total += delta.total;
  stats.skipped += delta.skipped;
  stats.expected += delta.expected;
  stats.unexpected += delta.unexpected;
  stats.flaky += delta.flaky;
  stats.ok = stats.ok && delta.ok;
  return stats;
};

const relativeLocation = (location: any): any => {
  if (!location) return undefined;

  const relativePath = path.relative(process.cwd(), location.file);
  return {
    file: relativePath,
    line: location.line,
    column: location.column,
  };
};

const createTestEntry = (test: TestCase, projectName: string, botName: string | undefined, path: string[]): any => {
  const duration = test.results.reduce((a, r) => a + r.duration, 0);
  const location = relativeLocation(test.location)!;
  path = path.slice(1);
  const results = test.results.map((r) => createTestResult(test, r));

  return {
    testCase: {
      testId: test.id,
      title: test.title,
      projectName,
      botName,
      location,
      duration,
      annotations: test.annotations,
      outcome: test.outcome(),
      path,
      results: results.map((r) => serializeTestResult(r, test)),
      ok: test.outcome() === 'expected' || test.outcome() === 'flaky',
    },
    testCaseSummary: {
      testId: test.id,
      title: test.title,
      projectName,
      botName,
      location,
      duration,
      annotations: test.annotations,
      outcome: test.outcome(),
      path,
      ok: test.outcome() === 'expected' || test.outcome() === 'flaky',
      // results: results.map(result => {
      //   return { attachments: result.attachments.map((a: any) => ({ name: a.name, contentType: a.contentType, path: a.path })) };
      // }),
    },
  };
};

const createTestResult = (_test: TestCase, result: TestResult): any => {
  return {
    duration: result.duration,
    startTime: result.startTime.toISOString(),
    retry: result.retry,
    steps: result.steps,
    errors: result.errors,
    status: result.status,
    // attachments: this._serializeAttachments([
    //   ...result.attachments,
    //   ...result.stdout.map(m => stdioAttachment(m, 'stdout')),
    //   ...result.stderr.map(m => stdioAttachment(m, 'stderr'))]),
  };
};

const serializeTestResult = (result: TestResult, _test: TestCase): any => {
  const jsonResult: any = {
    workerIndex: result.workerIndex,
    status: result.status,
    duration: result.duration,
    error: result.error,
    errors: result.errors,
    stdout: result?.stdout?.map((s) => stdioEntry(s)),
    stderr: result?.stderr?.map((s) => stdioEntry(s)),
    retry: result.retry,
    steps: result.steps.length ? result.steps.map((s) => createTestStep(s)) : undefined,
    startTime: result.startTime,
    // attachments: result.attachments.map(a => ({
    //   name: a.name,
    //   contentType: a.contentType,
    //   path: a.path,
    //   body: a.body?.toString('base64')
    // })),
  };
  // if (result.error?.stack)
  //   jsonResult.errorLocation = prepareErrorStack(result.error.stack).location;
  return jsonResult;
};

const createTestStep = (dedupedStep: any): any => {
  const result: any = {
    title: dedupedStep.title,
    startTime: dedupedStep.startTime.toISOString(),
    duration: dedupedStep.duration,
    steps: dedupedStep.steps.map((s: any) => createTestStep(s)),
    location: relativeLocation(dedupedStep.location),
    error: dedupedStep?.error?.message,
    // count
  };
  // if (result.location)
  //   this._stepsInFile.set(result.location.file, result);
  return result;
};

function stdioEntry(s: string | Buffer): any {
  if (typeof s === 'string') return { text: s };
  return { buffer: s.toString('base64') };
}

export default HtmlReporter;
