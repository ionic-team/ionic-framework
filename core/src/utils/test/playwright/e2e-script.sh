#!/bin/bash

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

  # Keep track of whether there are uncommitted changes
  hasUncommittedChanges=false

  # check if there are any uncommitted changes
  if [ -n "$(git status --porcelain)" ]; then
    # There are uncommitted changes
    hasUncommittedChanges=true

    # Inform the user that there are uncommitted changes
    echo "There are uncommitted changes in the current branch. Stashing the changes temporarily to avoid conflicts..."

    # New line
    echo ""

    # Stash the local changes
    git stash
  fi

  # Inform the user that the base branch is being updated
  echo "Updating the base branch..."

  # New line
  echo ""

  # User provided a base branch
  if [ -n "$baseBranch" ]; then
    # Update the base branch without checking out the branch
    git pull origin $baseBranch
  else
    # Update the default base branch without checking out the branch
    git pull origin main
  fi

  # New line
  echo ""

  # If there were uncommitted changes then pop the stash
  if [ "$hasUncommittedChanges" = true ]; then
    # Inform the user that the local changes are being popped
    echo "Popping local changes..."

    # New line
    echo ""

    # Pop the local changes
    git stash pop
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
  npm run test.e2e.docker.ci
else
  npm run test.e2e.docker.ci $componentValue
fi

# New line
echo ""

# Ask user if they want to view the Playwright report
echo "Do you want to view the Playwright report? (y/n)"
read -n 1 viewReport

# If user wants to view the Playwright report, then open the report
if [ "$viewReport" = "y" ]; then
  npm run test.report
fi
