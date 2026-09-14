# Usage Instructions

E2E tests verify Ionic components in a real browser. This is useful for testing user interaction and catching visual regressions. We use Playwright as it allows us to test in multiple browsers. Tests can be written and run using Playwright's public API.

## Table of Contents

- [Installing Dependencies](#installing-dependencies)
- [Configuring Docker](#configuring-docker)
- [Running Tests](#running-tests)
- [Managing Screenshots](#managing-screenshots)
- [Further Reading](#further-reading)

## Installing Dependencies

Follow these steps to install Playwright dependencies. These steps must also be run whenever the installed version of Playwright changes to ensure that you are testing with the correct browser binaries.

1. Install the Playwright dependency in the `core` directory: `npm ci`
2. Download the correct browsers: `npx playwright install`

## Configuring Docker

Ionic's test environment uses [Docker](https://www.docker.com) to ensure consistent testing conditions between local development and continuous integration (CI). While you can run tests directly on your local machine, using Docker through [Rancher Desktop](https://rancherdesktop.io) offers several benefits:

1. **Consistent Testing Environment** - Run screenshot tests in the same environment as CI, eliminating environment-specific differences and false positives.
2. **Fast Ground Truth Updates** - Generate and update screenshot ground truths locally in minutes instead of waiting for CI GitHub Actions.
3. **Universal Contributor Access** - Enable all developers, including community contributors, to work with ground truths without requiring GitHub Action access.
4. **CI Environment Replication** - Debug Linux-specific issues and reproduce CI-only problems locally in a controlled environment.
5. **Workflow Consistency** - Ensure tests behave identically across all development machines, reducing environment-specific issues.

Rancher Desktop provides the Docker engine functionality needed to run our containerized tests. It's a free, open-source alternative to Docker Desktop that we use to ensure a consistent testing environment. The following sections on [Running Tests](#running-tests) and [Managing Screenshots](#managing-screenshots) will show you how to use Playwright with Docker through Rancher Desktop. First, let's get your environment set up with Rancher Desktop.

### Installing Rancher Desktop

Install Rancher Desktop by following the instructions on the [Rancher Desktop website](https://rancherdesktop.io/).

After launching Rancher Desktop, open **Preferences** and configure the following settings:

- **Container Engine → General**
  - Enable Kubernetes: Unchecked
  - Container Engine: `dockerd`

- **Application**
  - Configure PATH: Automatic

- **Virtual Machine**
  - Emulation: `VZ`
  - Volumes: `virtiofs`

The **Virtual Machine** settings above are required for Docker to execute binaries correctly within mounted volumes during E2E tests.

Once Rancher Desktop is configured, you can use Docker commands just as you would with Docker Desktop.

### Docker and Windows Development

Developers using Windows who wish to run tests using Docker must use the [Windows Subsystem for Linux v2 (WSL 2)](https://learn.microsoft.com/en-us/windows/wsl/about). Developers who wish to run headed tests will also need to use WSLg.

The following steps show how to verify that WSL and WSLg are installed. If either of the below verification checks fail, then developers should [download the latest version of WSL](https://apps.microsoft.com/store/detail/9P9TQF7MRM4R?hl=en-us&gl=US).

1. To verify WSL is installed, launch "WSL" from the start menu. If "WSL" does not show up in the start menu then you do not have WSL installed.
2. With WSL open, verify that WSLg is installed: `ls -a -w 1 /mnt/wslg`. If the command fails with `No such file or directory` then your system is either missing WSLg or running an old version.
3. Verify that you have a Linux subsystem installed (such as Ubuntu) by running `wsl --list --verbose`. If you do not see a Linux subsystem in the list, run `wsl --install` to install it. Once installed, it's recommended to set this subsystem as the default Linux subsystem using `wsl --set-default [subsystem]`. Example: `wsl --set-default Ubuntu`.
4. Verify that your local version of Ubuntu (or other Linux subsystem) is using WSL 2 by running `wsl --list --verbose`. If your subsystem has a `1` under the "VERSION" heading, then that means it is using WSL 1, not WSL 2. To correct this, run `wsl --set-version [subsystem] 2`. Example: `wsl --set-version Ubuntu 2`.

If you are using VSCode, the WSL terminal can be accessed by selecting "Ubuntu (WSL)" from the terminal dropdown menu:

<img src="./assets/vscode-wsl.png" />

### Configuring Docker for Headed Tests (Optional)

Additional software is needed to run headed tests inside of Docker. The Docker-specific test commands such as `npm run test.e2e.docker` are configured to use this additional software, but it is up to the developer to ensure that the software is installed and running.

Playwright relies on [XServer](https://www.x.org/wiki/XServer/), a windowing system used to draw and move windows on a display, in order to run tests in headed mode. Follow the steps below to install XServer on your computer.

> [!NOTE]
> The following instructions are based off https://www.oddbird.net/2022/11/30/headed-playwright-in-docker/

#### macOS

macOS uses [XQuartz](https://www.xquartz.org) to use XServer on macOS.

1. Install [Homebrew](https://brew.sh) if not already installed. You can run `brew --version` to check if Homebrew is installed.
2. Install XQuartz: `brew install --cask xquartz`
3. Open XQuartz, go to `Settings → Security`, and check "Allow connections from network clients".
4. Restart your computer.
5. Start XQuartz from the command line: `xhost +localhost`
6. In the `core` directory run `echo host.docker.internal:0 > docker-display.txt`. This information is used to set the `DISPLAY` environment variable which tells Playwright how to render a headed UI from the Docker container.
7. In the `core` directory run `echo /tmp/.X11-unix:/tmp/.X11-unix > docker-display-volume.txt`. This information is used to make XServer available inside of the Docker container.

> [!NOTE]
> Unlike Docker Desktop, Rancher Desktop needs no file sharing configuration for this. It shares `/private/tmp` by default, which is where `/tmp` points on macOS.

#### Windows

Windows has a native XServer called [WSLg](https://github.com/microsoft/wslg#readme) that is included as part of the [Windows Subsystem for Linux (WSL)](https://learn.microsoft.com/en-us/windows/wsl/about). See [Docker and Windows Development](#docker-and-windows-development) for information on how to ensure both WSL and WSLg are installed. Once completed, follow the steps below to configure headed tests to use XServer.

> [!NOTE]
> The following steps should be done in WSL, not PowerShell. Running the commands in PowerShell may result in extra hidden characters being added.

1. In the `core` directory run `echo :0 > docker-display.txt`. This information is used to set the `DISPLAY` environment variable which tells Playwright how to render a headed UI from the Docker container.
2. In the `core` directory run `echo /tmp/.X11-unix:/tmp/.X11-unix > docker-display-volume.txt`. This information is used to make XServer available inside of the Docker container.

## Running Tests

Tests are run from the `core` directory with `npm run test.e2e.docker`, which runs them inside the Docker environment provided by the Ionic team through [Rancher Desktop](#installing-rancher-desktop). Any test that takes a screenshot must be run this way so that it compares against the ground truths committed to the repository. See [Managing Screenshots](#managing-screenshots) for more information.

This command builds a Docker image before tests run. It will also re-build the Docker image in the event that a Playwright update was merged into the repo.

Note that the Playwright report will not automatically open in your web browser when tests are complete because the tests were run in Docker. Run `npx playwright show-report` outside of Docker to open the most recent test report.

> [!NOTE]
> Additional setup is needed to run Playwright tests with headed mode in Docker. See [Configuring Docker for Headed Tests](#configuring-docker-for-headed-tests-optional) for more information.

### Running Specific Test Files

Scope each run to the tests you are working on by passing file paths, a directory that contains multiple test files, or a component name.

**Specific Test Files**

```shell
npm run test.e2e.docker src/components/button/test/basic/button.e2e.ts src/components/button/test/a11y/button.e2e.ts
```

**Test Directory with Multiple Files**

```shell
# Will run all the test files in the `test` directory
npm run test.e2e.docker src/components/button/test
```

**Component Names**

The argument is a Playwright filter, so a bare component name matches every test file whose path contains it.

```shell
npm run test.e2e.docker checkbox radio toggle
```

### Running All Test Files

Omitting the filter runs every E2E test file:

```shell
npm run test.e2e.docker
```

There are over 400 E2E test files, which CI runs in parallel across 20 shards. A single machine runs them one shard at a time, so prefer scoping a local run to the component you changed and let CI cover the rest.

### Running Tests Outside of Docker

`npm run test.e2e` runs the tests directly in the environment you are developing in. It accepts all of the same arguments as `npm run test.e2e.docker`.

> [!NOTE]
> This command is a wrapper for `npx playwright test`. All data passed to `npm run test.e2e` can also be passed to `npx playwright test`.

Use this only for tests that take no screenshots. Because screenshots are resolved per platform, a screenshot test run outside of Docker compares against a ground truth that is not in the repository. See [Managing Screenshots](#managing-screenshots) for why this passes locally and fails on CI.

### Headed vs. Headless Tests

Playwright tests in Ionic are run in headless mode by default. This means that a visual representation of the browser does not appear on your computer while running.

No additional steps are needed in order to run the tests in headless mode:

```shell
# Will run tests in headless mode
npm run test.e2e.docker src/components/chip
```

 Playwright supports the `--headed` flag to run in headed mode which causes the visual representation of the browser to appear:

 ```shell
 # Will run tests in headed mode
 npm run test.e2e.docker src/components/chip -- --headed
 ```

### Debugging Tests

Playwright offers several ways to efficiently isolate and debug specific issues, helping to quickly identify and resolve problems within your test suite.

#### 1. Running Only Individual Tests

The `.only` suffix can be added to individual tests to limit execution to just those tests during debugging. If you add `.only` to a specific test, only that test will be executed, and all other tests in the test suite will be skipped.

**Example:**

```ts
test.only('should do something', async ({ page }) => {
  // test code here
});
```

> [!IMPORTANT]
> After debugging, make sure to remove the `.only` suffix to ensure all tests run again during normal execution.

#### 2. Running Only a Test Suite

Similarly, you can focus on an entire test suite by adding `.only` to a `describe` block. This ensures that only the tests within that suite will be executed, while others will be skipped.

**Example:**

```ts
test.describe.only('group of tests', () => {
  test('test 1', async ({ page }) => {
    // test 1 code here
  });

  test('test 2', async ({ page }) => {
    // test 2 code here
  });
});
```

> [!IMPORTANT]
> After debugging, make sure to remove the `.only` suffix to ensure all tests run again during normal execution.

#### 3. Repeating Tests to Reproduce Flaky Failures

Flaky tests may not fail consistently. To help reproduce intermittent failures locally, you can use Playwright's `--repeat-each` flag to run the same test multiple times in a row.

This is especially useful when CI reports a failure you cannot reproduce on your first local run.

**Example:**

```shell
npm run test.e2e.docker src/components/radio/test/a11y/radio.e2e.ts -- --repeat-each=10
```

This runs the test 10 times, increasing the chance of catching the flaky behavior.

> [!WARNING]
> Reproduce a flaky failure with `test.e2e.docker`, not
> `test.e2e.docker.update-snapshots`. On a mismatch the update variant overwrites
> the ground truth and reports the test as **passing**, so the run goes green with
> no diff images and the flaky screenshot is left in your working tree. Check
> `git status` if you suspect this happened.

#### 4. Pausing Test Execution

Additionally, you can pause execution of a test by using the `page.pause()` method. This pauses the script execution and allows you to manually inspect the page in the browser.

**Example:**

```ts
const { test, expect } = require('@playwright/test');

test('example test', async ({ page }) => {
  await page.goto('https://example.com');

  // Pausing the page to inspect manually
  await page.pause();

  // Further actions will resume after unpausing
  const title = await page.title();
  expect(title).toBe('Example Domain');
});
```

> [!IMPORTANT]
> After debugging, make sure to remove the `page.pause()` call to restore normal test execution.

## Managing Screenshots

If you are running a test that takes a screenshot, you must first generate the reference screenshot from your reference branch. This is known as generating a "ground truth screenshot". All other screenshots will be compared to this ground truth.

Playwright appends the browser and platform to every screenshot name, so the same test resolves a different file per operating system. Example: `button-expand-md-ltr-Mobile-Chrome-linux.png`. The ground truths committed to the repository are the `-linux.png` files generated in Docker, and `.gitignore` excludes every other platform's.

This is why screenshot tests should be run with `npm run test.e2e.docker`. Running them natively on macOS or Windows looks for a `-darwin.png` or `-win32.png` ground truth that is not in the repository. Playwright writes that file, fails the test once, and passes on every run afterward against a baseline that git ignores and CI never sees. The result is a test that passes locally and fails on CI.

### Generating or Updating Ground Truths With Docker (Local Development)

We recommend generating ground truths inside of [Docker](https://www.docker.com) using [Rancher Desktop](#installing-rancher-desktop). This allows anyone contributing to Ionic Framework to create or update ground truths in a consistent environment.

To create or update ground truths, run the following command:

```shell
npm run test.e2e.docker.update-snapshots
```

Optionally, you can pass a directory to only update the ground truths for that directory & subdirectories. This is useful when working on a specific component.

```shell
npm run test.e2e.docker.update-snapshots src/components/alert/
```

The resulting screenshots should be committed and pushed to your branch.

### Generating or Updating Ground Truths Without Docker (Local Development)

While we recommend generating ground truths inside of Docker it is possible to generate ground truths without it. Note that these generated ground truths can only be used for local testing and will not update the ground truths stored in the repo.

If the reference branch has changed since the last time you generated ground truths you may need to update your local ground truths.

For most types of work the reference branch is typically `main`. Features are merged into a different branch, so developers should use that as the reference branch. For example, if branch `foo` will be merged into `bar`, then the reference branch is `bar`.

The examples provided in the [Running Tests](#running-tests) section also apply here, allowing you to update screenshots for a specific test file.

Note that since you are generating the reference branch ground truth screenshots, you must be on the reference branch locally. Don't forget to pull the latest reference branch changes and then re-build using `npm run build`.

```shell
npm run test.e2e.update-snapshots
```

Optionally, you can pass a directory to only update the ground truths for that directory & subdirectories. This is useful when working on a specific component.

```shell
npm run test.e2e.update-snapshots src/components/alert/
```

From here, you can switch back to your branch and run the tests.

> [!NOTE]
> Locally generated ground truths should not be committed to the repo. The `.gitignore` file prevents this from accidentally happening.

### Generating or Updating Ground Truths (CI)

> [!IMPORTANT]
> Only Ionic Team members can update ground truths on the main repo. Ground truths cannot be updated on forked versions of the repo. Instead, we recommend generating ground truths in Docker.

When making an intentional visual change, you will need to update the ground truth screenshots or add new ones. It is important that the ground truth and comparison screenshots are taken in the same environment, so do not update the ground truth screenshots locally and commit them to the repo.

Instead, use the [Update Reference Screenshots GitHub Action](https://github.com/ionic-team/ionic-framework/actions/workflows/update-screenshots.yml).

1. Click the **Run workflow** dropdown.
2. Select your branch.
3. Leave the input field blank.
4. Click **Run workflow**.

This workflow will re-run all of the screenshot tests. Instead of failing any tests with mismatched screenshots, it will take new ground truth screenshots. These ground truth screenshots will be pushed as a single commit to your branch once the workflow is completed.

If you want to update ground truths for a specific test, you can pass the test file path as an input to the workflow. This is useful when working on a specific component.

1. Click the **Run workflow** dropdown.
2. Select your branch.
3. Enter the file path in the input field. Example: `src/components/alert/test/basic/`
4. Click **Run workflow**.

The input field also accepts component names, such as `alert`. You can enter multiple components by separating them with spaces, for example, `alert button`. For a full list of options, refer to Playwright's [Command Line page](https://playwright.dev/docs/test-cli).

### Verifying Screenshot Differences

When any of the screenshot tests fail, it means a potential regression was caught. Developers must manually verify the difference in the Playwright test report.

If the screenshots fail on CI then developers must download the build artifact. On the **Summary** page for a particular workflow, find the **Artifacts** section. Screenshot tests are currently parallelized across several test runners, and the results from each of those runners is included in an artifact with the following naming scheme:

```
test-results-[current shard]-[total shards]

Example:

test-results-2-5 -→ Test results from job runner 2 out of 5.
```

Download the appropriate artifact and unzip the file.

In the newly created directory, open the `playwright-report/index.html` in your browser. From here, you will be able to see the tests that failed as well as the expected screenshot, the actual screenshot, and the pixel differences.

> [!WARNING]
> It is recommended to verify the screenshot difference within the Playwright test report first. If you choose to try and reproduce the difference in a browser manually, make sure you are using the **exact** same browser version that Playwright is using.

## Further Reading

For more info on how to use Playwright, please see the [Playwright documentation](https://playwright.dev/docs/intro).
