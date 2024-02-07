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
import crypto from 'crypto';

class HtmlReporter implements Reporter {
  private config!: FullConfig;
  private suite!: Suite;
  private _topLevelErrors: TestError[] = [];
  private _reactAppDirectory = path.dirname(__filename);
  private _hasTraces = false;
  private _attachmentsBaseURL: string = '';
  private _reportFolder: string = '';

  constructor(options: any) {
    this._attachmentsBaseURL = options.attachmentsBaseURL || 'data/';
    // get the public folder within the react app
    const publicFolder = path.join(this._reactAppDirectory, 'public');
    // the report folder needs to be within the public folder of the react app so the images can be
    this._reportFolder = this._resolveReporterOutputPath(
      `${publicFolder}/playwright-report`,
      options.configDir,
      options.outputFolder
    );
  }

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
        const fileName = this._relativeLocation(fileSuite.location)!.file;
        const fileId = (fileSuite as any)._fileId!;
        let fileEntry = data.get(fileId);
        if (!fileEntry) {
          fileEntry = {
            testFile: { fileId, fileName, tests: [] },
            testFileSummary: { fileId, fileName, tests: [], stats: this._emptyStats() },
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
      files: [...data.values()].map((e) => e.testFileSummary),
      projectNames: projectSuites.map((r) => r.project()!.name),
      stats: { ...[...data.values()].reduce((a, e) => this._addStats(a, e.testFileSummary.stats), this._emptyStats()) },
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
    suite.tests.forEach((t) => outTests.push(this._createTestEntry(t, projectName, botName, newPath)));
  };

  private _emptyStats = (): any => {
    return {
      total: 0,
      expected: 0,
      unexpected: 0,
      flaky: 0,
      skipped: 0,
      ok: true,
    };
  };

  private _addStats = (stats: any, delta: any): any => {
    stats.total += delta.total;
    stats.skipped += delta.skipped;
    stats.expected += delta.expected;
    stats.unexpected += delta.unexpected;
    stats.flaky += delta.flaky;
    stats.ok = stats.ok && delta.ok;
    return stats;
  };

  private _relativeLocation = (location: any): any => {
    if (!location) return undefined;

    const relativePath = path.relative(process.cwd(), location.file);
    return {
      file: relativePath,
      line: location.line,
      column: location.column,
    };
  };

  private _createTestEntry = (
    test: TestCase,
    projectName: string,
    botName: string | undefined,
    path: string[]
  ): any => {
    const duration = test.results.reduce((a, r) => a + r.duration, 0);
    const location = this._relativeLocation(test.location)!;
    path = path.slice(1);
    const results = test.results.map((r) => this._createTestResult(test, r));

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
        results: results.map((r) => this._serializeTestResult(r, test)),
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
        results: results.map((result) => {
          return {
            attachments: result.attachments.map((a: any) => ({
              name: a.name,
              contentType: a.contentType,
              path: a.path,
              body: a.body,
            })),
          };
        }),
      },
    };
  };

  private _createTestResult = (_test: TestCase, result: TestResult): any => {
    return {
      duration: result.duration,
      startTime: result.startTime.toISOString(),
      retry: result.retry,
      steps: result.steps,
      errors: result.errors,
      status: result.status,
      attachments: this._serializeAttachments([
        ...result.attachments,
        ...result.stdout.map((m) => this._stdioAttachment(m, 'stdout')),
        ...result.stderr.map((m) => this._stdioAttachment(m, 'stderr')),
      ]),
    };
  };

  private _serializeTestResult = (result: TestResult, _test: TestCase): any => {
    const jsonResult: any = {
      workerIndex: result.workerIndex,
      status: result.status,
      duration: result.duration,
      error: result.error,
      errors: result.errors,
      stdout: result?.stdout?.map((s) => this._stdioEntry(s)),
      stderr: result?.stderr?.map((s) => this._stdioEntry(s)),
      retry: result.retry,
      steps: result.steps.length ? result.steps.map((s) => this._createTestStep(s)) : undefined,
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

  // playwright-report/data
  // playwright-report/trace
  private _serializeAttachments = (attachments: any[]) => {
    let lastAttachment: any | undefined;
    return attachments
      .map((a) => {
        if (a.name === 'trace') this._hasTraces = true;

        if ((a.name === 'stdout' || a.name === 'stderr') && a.contentType === 'text/plain') {
          if (lastAttachment && lastAttachment.name === a.name && lastAttachment.contentType === a.contentType) {
            lastAttachment.body += this._stripAnsiEscapes(a.body as string);
            return null;
          }
          a.body = this._stripAnsiEscapes(a.body as string);
          lastAttachment = a as any;
          return a;
        }

        if (a.path) {
          let fileName = a.path;
          try {
            const buffer = fs.readFileSync(a.path);
            const sha1 = this._calculateSha1(buffer) + path.extname(a.path);
            fileName = this._attachmentsBaseURL + sha1;
            fs.mkdirSync(path.join(this._reportFolder, 'data'), { recursive: true });
            fs.writeFileSync(path.join(this._reportFolder, 'data', sha1), buffer);
          } catch (e) {}
          return {
            name: a.name,
            contentType: a.contentType,
            path: fileName,
            body: a.body,
          };
        }

        if (a.body instanceof Buffer) {
          if (this._isTextContentType(a.contentType)) {
            // Content type is like this: "text/html; charset=UTF-8"
            const charset = a.contentType.match(/charset=(.*)/)?.[1];
            try {
              const body = a.body.toString((charset as any) || 'utf-8');
              return {
                name: a.name,
                contentType: a.contentType,
                body,
              };
            } catch (e) {
              // Invalid encoding, fall through and save to file.
            }
          }

          fs.mkdirSync(path.join(this._reportFolder, 'data'), { recursive: true });
          const extension =
            this._sanitizeForFilePath(path.extname(a.name).replace(/^\./, '')) ||
            this._getMimeExtension(a.contentType) ||
            'dat';
          const sha1 = this._calculateSha1(a.body) + '.' + extension;
          fs.writeFileSync(path.join(this._reportFolder, 'data', sha1), a.body);
          return {
            name: a.name,
            contentType: a.contentType,
            path: this._attachmentsBaseURL + sha1,
          };
        }

        // string
        return {
          name: a.name,
          contentType: a.contentType,
          body: a.body,
        };
      })
      .filter(Boolean) as any[];
  };

  private _createTestStep = (dedupedStep: any): any => {
    const result: any = {
      title: dedupedStep.title,
      startTime: dedupedStep.startTime.toISOString(),
      duration: dedupedStep.duration,
      steps: dedupedStep.steps.map((s: any) => this._createTestStep(s)),
      location: this._relativeLocation(dedupedStep.location),
      error: dedupedStep?.error?.message,
      // count
    };
    // if (result.location)
    //   this._stepsInFile.set(result.location.file, result);
    return result;
  };

  private _stdioEntry = (s: string | Buffer): any => {
    if (typeof s === 'string') return { text: s };
    return { buffer: s.toString('base64') };
  };

  private ansiRegex = new RegExp(
    '([\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~])))',
    'g'
  );
  private _stripAnsiEscapes(str: string): string {
    return str.replace(this.ansiRegex, '');
  }

  private _resolveReporterOutputPath = (defaultValue: string, configDir: string, configValue: string | undefined) => {
    if (configValue) return path.resolve(configDir, configValue);
    let basePath = this._getPackageJsonPath(configDir);
    basePath = basePath ? path.dirname(basePath) : process.cwd();
    return path.resolve(basePath, defaultValue);
  };

  private _getPackageJsonPath(folderPath: string): string {
    const folderToPackageJsonPath = new Map<string, string>();

    const cached = folderToPackageJsonPath.get(folderPath);
    if (cached !== undefined) return cached;

    const packageJsonPath = path.join(folderPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      folderToPackageJsonPath.set(folderPath, packageJsonPath);
      return packageJsonPath;
    }

    const parentFolder = path.dirname(folderPath);
    if (folderPath === parentFolder) {
      folderToPackageJsonPath.set(folderPath, '');
      return '';
    }

    const result = this._getPackageJsonPath(parentFolder);
    folderToPackageJsonPath.set(folderPath, result);
    return result;
  }

  private _calculateSha1(buffer: Buffer): string {
    const hash = crypto.createHash('sha1');
    hash.update(buffer);
    return hash.digest('hex');
  }

  private _isTextContentType(contentType: string) {
    return contentType.startsWith('text/') || contentType.startsWith('application/json');
  }

  private _sanitizeForFilePath(s: string) {
    return s.replace(/[\x00-\x2C\x2E-\x2F\x3A-\x40\x5B-\x60\x7B-\x7F]+/g, '-');
  }

  private _getMimeExtension(extension: string): string | undefined {
    switch (extension) {
      case 'css':
        return 'text/css';
      case 'html':
        return 'text/html';
      case 'js':
        return 'application/javascript';
      case 'json':
        return 'application/json';
      case 'png':
        return 'image/png';
      case 'svg':
        return 'image/svg+xml';
      case 'txt':
        return 'text/plain';
      case 'xml':
        return 'application/xml';
      default:
        return undefined;
    }
  }

  private _stdioAttachment(chunk: Buffer | string, type: 'stdout' | 'stderr'): any {
    if (typeof chunk === 'string') {
      return {
        name: type,
        contentType: 'text/plain',
        body: chunk,
      };
    }
    return {
      name: type,
      contentType: 'application/octet-stream',
      body: chunk,
    };
  }
}

export default HtmlReporter;
