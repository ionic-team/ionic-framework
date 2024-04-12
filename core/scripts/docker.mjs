import { exec, spawn } from 'child_process';
import { execa } from 'execa';
import * as fs from 'fs';

const removeNewline = (string) => {
  return string.replace(/(\r\n|\n|\r)/gm, "");
}

const { stdout: display } = await execa('cat', { inputFile: 'docker-display.txt' });
const { stdout: displayVolume } = await execa('cat', { inputFile: 'docker-display-volume.txt' });

// Using --mount requires an absolute path which is what this gives us.
const { stdout: pwd } = await execa('pwd');

/**
 * -it will let the user gracefully kill the process using Ctrl+C (or equivalent)
 * -e DISPLAY and -v handle configuration for headed mode
 * --ipc=host is recommended when using Chromium to avoid out of memory crashes: https://playwright.dev/docs/ci#docker
 * --init is recommended to avoid zombie processes: https://playwright.dev/docs/ci#docker
 * --mount allow us to mount the local Ionic project inside of the Docker container so devs do not need to re-build the project in Docker.
 */
const args = ['run', '--rm', '-it', '--init', `-e DISPLAY=${display}`, `-v '${displayVolume}'`, '--ipc=host', `--mount=type=bind,source=${pwd},target=/ionic`, 'ionic-playwright', 'npm run test.e2e --', ...process.argv.slice(2)];

execa('docker', args, { shell: true, stdio: 'inherit' });
