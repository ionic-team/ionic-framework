#!/usr/bin/env node
import { main } from './main.js';

// Thin wrapper so `main` stays testable. `process.exitCode` rather than
// `process.exit` lets Node flush stdout first, which matters when piped.
try {
  process.exitCode = main(process.argv.slice(2));
} catch (e) {
  console.error(e instanceof Error ? e.message : String(e));
  process.exitCode = 1;
}
