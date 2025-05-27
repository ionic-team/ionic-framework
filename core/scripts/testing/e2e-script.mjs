// The purpose of this script is to provide a way run the E2E tests
// without having the developer to manually run multiple commands based
// on the desired end result.
// E.g. update the local ground truths for a specific component or
// open the Playwright report after running the E2E tests.

import {
  intro,
  outro,
  confirm,
  spinner,
  isCancel,
  cancel,
  text,
  log,
} from '@clack/prompts';
import { exec, spawn } from 'child_process';
import fs from 'node:fs';
import { setTimeout as sleep } from 'node:timers/promises';
import util from 'node:util';
import color from 'picocolors';

async function main() {
  const execAsync = util.promisify(exec);
  const cleanUpFiles = async () => {
    // Clean up the local ground truths.
    const cleanUp = spinner();
  
    // Inform the user that the local ground truths are being cleaned up.
    cleanUp.start('Restoring local ground truths');
  
    // Reset the local ground truths.
    await execAsync('git reset -- src/**/*-linux.png').catch((error) => {
      cleanUp.stop('Failed to reset local ground truths');
      console.error(error);
      return process.exit(0);
    });
  
    // Restore the local ground truths.
    await execAsync('git restore -- src/**/*-linux.png').catch((error) => {
      cleanUp.stop('Failed to restore local ground truths');
      console.error(error);
      return process.exit(0);
    });
  
    // Inform the user that the local ground truths have been cleaned up.
    cleanUp.stop('Local ground truths have been restored to their original state in order to avoid committing them.');
  };

  intro(color.inverse(' Update Local Ground Truths'));

  // Ask user for the component name they want to test.
  const componentValue = await text({
    message: 'Enter the component or path you want to test (e.g. chip, src/components/chip)',
    placeholder: 'Empty for all components',
  });

  // User cancelled the operation with `Ctrl+C` or `CMD+C`.
  if (isCancel(componentValue)) {
    cancel('Operation cancelled');
    return process.exit(0);
  }

  // Ask user if they want to update their local ground truths.
  const shouldUpdateTruths = await confirm({
    message: 'Do you want to update your local ground truths?',
  });

  // User cancelled the operation with `Ctrl+C` or `CMD+C`.
  if (isCancel(shouldUpdateTruths)) {
    cancel('Operation cancelled');
    return process.exit(0);
  }

  if (shouldUpdateTruths) {
    const defaultBaseBranch = 'main';

    // Ask user for the base branch.
    let baseBranch = await text({
      message: 'Enter the base branch name:',
      placeholder: `default: ${defaultBaseBranch}`,
    })

    // User cancelled the operation with `Ctrl+C` or `CMD+C`.
    if (isCancel(baseBranch)) {
      cancel('Operation cancelled');
      return process.exit(0);
    }

    // User didn't provide a base branch.
    if (!baseBranch) {
      baseBranch = defaultBaseBranch;
    }

    /**
     * The provided base branch needs to be fetched.
     * This ensures that the local base branch is up-to-date with the 
     * remote base branch. Otherwise, there might be errors stating that
     * certain files don't exist in the local base branch.
     */
    const fetchBaseBranch = spinner();

    // Inform the user that the base branch is being fetched.
    fetchBaseBranch.start(`Fetching "${baseBranch}" to have the latest changes`);

    // Fetch the base branch.
    await execAsync(`git fetch origin ${baseBranch}`).catch((error) => {
      fetchBaseBranch.stop(`Failed to fetch "${baseBranch}"`);
      console.error(error);
      return process.exit(0);
    });

    // Inform the user that the base branch has been fetched.
    fetchBaseBranch.stop(`Fetched "${baseBranch}"`);


    const updateGroundTruth = spinner();

    // Inform the user that the local ground truths are being updated.
    updateGroundTruth.start('Updating local ground truths');

    // Check if user provided an existing file or directory.
    const isValidLocation = fs.existsSync(componentValue);

    // User provided an existing file or directory.
    if (isValidLocation) {
      const stats = fs.statSync(componentValue);

      // User provided a file as the component.
      // ex: `componentValue` = `src/components/chip/test/basic/chip.e2e.ts`
      if (stats.isFile()) {
        // Update the local ground truths for the provided path.
        await execAsync(`git checkout origin/${baseBranch} -- ${componentValue}-snapshots/*-linux.png`).catch((error) => {
          updateGroundTruth.stop('Failed to update local ground truths');
          console.error(error);
          return process.exit(0);
        });
      }

      // User provided a directory as the component.
      // ex: `componentValue` = `src/components/chip`
      if (stats.isDirectory()) {
        // Update the local ground truths for the provided directory.
        await execAsync(`git checkout origin/${baseBranch} -- ${componentValue}/test/*/*.e2e.ts-snapshots/*-linux.png`).catch((error) => {
          updateGroundTruth.stop('Failed to update local ground truths');
          console.error(error);
          return process.exit(0);
        });
      }
    }
    // User provided a component name as the component.
    // ex: `componentValue` = `chip`
    else if (componentValue) {
      // Update the local ground truths for the provided component.
      await execAsync(`git checkout origin/${baseBranch} -- src/components/${componentValue}/test/*/${componentValue}.e2e.ts-snapshots/*-linux.png`).catch((error) => {
        updateGroundTruth.stop('Failed to update local ground truths');
        console.error(error);
        return process.exit(0);
      });
    }
    // User provided an empty string.
    else {
      // Update the local ground truths for all components.
      await execAsync(`git checkout origin/${baseBranch} -- src/components/*/test/*/*.e2e.ts-snapshots/*-linux.png`).catch((error) => {
        updateGroundTruth.stop('Failed to update local ground truths');
        console.error(error);
        return process.exit(0);
      });
    }

    // Inform the user that the local ground truths have been updated.
    updateGroundTruth.stop('Updated local ground truths');
  }

  const buildCore = spinner();

  // Inform the user that the core is being built.
  buildCore.start('Building core');

  /**
   * Build core
   * Otherwise, the uncommitted changes will not be reflected in the tests because:
   * - popping the stash doesn't trigger a re-render even if `npm start` is running
   * - app is not running the `npm start` command
   */
  await execAsync('npm run build').catch((error) => {
    // Clean up the local ground truths.
    cleanUpFiles();

    buildCore.stop('Failed to build core');
    console.error(error);
    return process.exit(0);
  });

  buildCore.stop('Built core');

  const runE2ETests = spinner();

  // Inform the user that the E2E tests are being run.
  runE2ETests.start('Running E2E tests');

  // User provided a component value.
  if (componentValue) {
    await execAsync(`npm run test.e2e.docker.ci ${componentValue}`).catch((error) => {
      // Clean up the local ground truths.
      cleanUpFiles();

      runE2ETests.stop('Failed to run E2E tests');
      console.error(error);
      return process.exit(0);
    });
  } else {
    await execAsync('npm run test.e2e.docker.ci').catch((error) => {
      // Clean up the local ground truths.
      cleanUpFiles();

      runE2ETests.stop('Failed to run E2E tests');
      console.error(error);
      return process.exit(0);
    });
  }

  runE2ETests.stop('Ran E2E tests');

  // Clean up the local ground truths.
  await cleanUpFiles();

  // Ask user if they want to open the Playwright report.
  const shouldOpenReport = await confirm({
    message: 'Do you want to open the Playwright report?',
  });

  // User cancelled the operation with `Ctrl+C` or `CMD+C`.
  if (isCancel(shouldOpenReport)) {
    cancel('Operation cancelled');
    return process.exit(0);
  }

  // User chose to open the Playwright report.
  if (shouldOpenReport) {
    // Use spawn to display the server information and the key to quit the server.
    spawn('npx', ['playwright', 'show-report'], {
      stdio: 'inherit',
    });
  } else {
    // Inform the user that the Playwright report can be opened by running the following command.
    log.info('If you change your mind, you can open the Playwright report by running the following command:');
    log.info(color.bold('npx playwright show-report'));
  }

  if (shouldOpenReport) {
    outro("You're all set! Don't forget to quit serving the Playwright report when you're done.");
  } else {
    outro("You're all set!");
  }

  await sleep(1000);
}

main().catch(console.error);
