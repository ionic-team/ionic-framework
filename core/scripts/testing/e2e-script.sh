#!/bin/bash

# The purpose of this script is to provide a way run the E2E tests
# without having the developer to manually run multiple commands based
# on the desired end result.
# E.g. update the local ground truths for a specific component or
# open the Playwright report after running the E2E tests.

# Ask user if they want to update their local ground truths
echo "Do you want to update your local ground truths? (y/n)"
read -n 1 updateTruths

# New line
echo ""

# If user wants to update their local ground truths, then ask for the base branch
if [ "$updateTruths" = "y" ]; then
  echo "Enter the base branch name (default: main):"
  read baseBranch

  # New line
  echo ""

  # Check if the user provided a base branch
  if [ -z "$baseBranch" ]; then
    # Default base branch is main
    baseBranch="main"
  fi
fi

# inform the user that the core is being built
echo "Building core..."

# Build core
# Otherwise, the uncommitted changes will not be reflected in the tests because:
# - popping the stash doesn't trigger a re-render even if `npm start` is running
# - app is not running the `npm start` command
npm run build

# New line
echo ""

# Ask user for the component name they want to test

echo "Enter the component or path you want to test (e.g. chip, src/components/chip). Or leave empty to test all components:"

read componentValue

# New line
echo ""

# User wants to update their local ground truths
if [ "$updateTruths" = "y" ]; then

  # Inform the user that the local ground truths are being updated
  echo "Updating local ground truths..."

  # The user provided a valid path as the component
  # ex: $componentValue = src/components/chip/test/basic/basic.e2e.ts
  if [ -f "$componentValue" ]; then
    # Update the local ground truths for the provided path
    git checkout origin/$baseBranch -- $componentValue-snapshots/*-linux.png
  # The user provided a valid component folder as the component
  # ex: $componentValue = src/components/chip
  elif [ -d "$componentValue" ]; then
    # Update the local ground truths for the provided folder
    git checkout origin/$baseBranch -- $componentValue/test/*/*.e2e.ts-snapshots/*-linux.png
  # The user provided a component name as the component
  # ex: $componentValue = chip
  elif [ -n "$componentValue" ]; then
    # Update the local ground truths for the provided component
    git checkout origin/$baseBranch -- src/components/$componentValue/test/*/$componentValue.e2e.ts-snapshots/*-linux.png
  # The user did not provide a component name
  # Run the e2e tests for all components
  else
    # Update the local ground truths for all components
    git checkout origin/$baseBranch -- src/components/*/test/*/*.e2e.ts-snapshots/*-linux.png
  fi

fi

# New line
echo ""

# Inform the user that the e2e tests are about to run
echo "Running e2e tests..."

# Run the e2e tests

# User provided a component name
if [ -z "$componentValue" ]; then
  npm run test.e2e.docker
else
  npm run test.e2e.docker $componentValue
fi

# New line
echo ""

# Ask user if they want to view the Playwright report
echo "Do you want to view the Playwright report? (y/n)"
read -n 1 viewReport

# If user wants to view the Playwright report, then open the report
if [ "$viewReport" = "y" ]; then
  npx playwright show-report
fi

# Clean up the local ground truths
git reset -- src/**/*-linux.png
git restore -- src/**/*-linux.png

# New line
echo ""

# Inform the user that the script has finished running
echo "Script has finished running. Local ground truths have been restored to their original state in order to avoid committing them."
