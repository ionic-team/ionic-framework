import { glob } from 'glob';
import * as fs from 'fs/promises';
import { Octokit } from 'octokit';
import type { PlaywrightTest, PlaywrightSpec, PlaywrightSuite, PlaywrightResults, FlakySuite, FlakySpec } from './types';

const { REPO, ISSUE_NUMBER, GITHUB_TOKEN } = process.env;

const REPO_SPLIT = REPO.split('/');
const REPO_OWNER = REPO_SPLIT[0];
const REPO_NAME = REPO_SPLIT[1];

const octokit = new Octokit({ auth: GITHUB_TOKEN });

/**
 * Find all of the flaky files within a
 * single Playwright report.
 */
const findFlakySpecs = (results: PlaywrightResults): FlakySuite[] => {
  return results.suites.map(suite => findFlakySpecsInFile(suite));
}

/**
 * Find all of the flaky specs for a single file
 * across all suites within the file
 */
const findFlakySpecsInFile = (suite: PlaywrightSuite) => {
  return {
    title: suite.title,
    specs: findFlakySpecsInSuite(suite),
  }
}

/**
 * Find all of the flaky specs for a single suite.
 */
const findFlakySpecsInSuite = (suite: PlaywrightSuite, suiteTitle?: string) => {
  let titleToPass = undefined;

  if (suiteTitle === undefined) {
    titleToPass = '';
  } else {
    if (suiteTitle === '') {
      titleToPass = suite.title;
    } else {
      titleToPass = `${titleToPass} > ${suite.title}`
    }
  }
  let flakySpecs = suite.specs ? suite.specs.map(spec => findFlakyTestsInSpec(spec, titleToPass)) : [];
  const flakySpecsFromSuites = suite.suites ? suite.suites.map(suite => findFlakySpecsInSuite(suite, titleToPass)) : [];

  flakySpecsFromSuites.forEach(specs => {
    flakySpecs = [...flakySpecs, ...specs]
  });
  return flakySpecs;
}

/**
 * Find all of the flaky test runs for a single spec.
 */
const findFlakyTestsInSpec = (spec: PlaywrightSpec, title: string): FlakySpec => {
  const flakyTests = spec.tests.filter(test => test.status === 'flaky');

  return {
    title: `${title} > ${spec.title}`,
    tests: flakyTests
  }
}

const generateReport = async () => {
  const files = await glob(__dirname + '/' + process.argv[2]);

  const flakyDict = {}

  let flakyFiles = [];

  for (const file of files) {
    const result = await fs.readFile(file, 'utf8');

    // TODO stream json since this can tie up the main thread
    const json = JSON.parse(result);

    const flakyFiles = findFlakySpecs(json);

    flakyFiles.forEach(flakyFile => {
      mergeFlakyFile(flakyDict, flakyFile);
    });
  }

  const table = generateTable(flakyDict);

  await octokit.request(`POST /repos/${REPO_OWNER}/${REPO_NAME}/issues/${ISSUE_NUMBER}/comments`, {
    owner: REPO_OWNER,
    repo: REPO_NAME,
    issue_number: ISSUE_NUMBER,
    body: table,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
}


const mergeFlakyFile = (dict: any, suite: FlakySuite) => {
  const dictSuite = dict[suite.title];

  if (dictSuite === undefined) {
    dict[suite.title] = {}

    suite.specs.forEach(spec => {
      dict[suite.title][spec.title] = spec.tests;
    });
  } else {

    suite.specs.forEach(spec => {
      const dictSpec = dict[suite.title][spec.title];

      if (dictSpec === undefined) {
        dict[suite.title][spec.title] = spec.tests;
      } else {
        dict[suite.title][spec.title] = [
          ...dictSpec,
          ...spec.tests
        ]
      }
    });
  }
}

const generateTable = (dict: any) => {
  let template = '';
  for (const file in dict) {
    template += `
<details>

<summary>${file}</summary>

| Test | Browser |
| ---- | ------- |
${generateRows(dict[file])}

</details>`
  }

  return template;
}

const generateRows = (specs: any) => {
  let template = '';

  for (const specName in specs) {
    const spec = specs[specName];
    for (const test of spec) {
      template += `| ${specName} | ${test.projectName} |\n`;
    }
  }
  return template;
}

generateReport();
