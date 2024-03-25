#!/bin/bash

# Ask user if they want to update their local ground truths

echo "Do you want to update your local ground truths? (y/n)"

read -n 1 updateTruths

# new line
echo ""

# If user wants to update their local ground truths, then ask for the base branch
if [ "$updateTruths" = "y" ]; then
  echo "Enter the base branch name (default: main):"
  read baseBranch

  # new line
  echo ""

  # keep track of whether there are uncommitted changes
  hasUncommittedChanges=false

  # check if there are any uncommitted changes
  if [ -n "$(git status --porcelain)" ]; then
    # there are uncommitted changes
    hasUncommittedChanges=true

    # inform the user that there are uncommitted changes
    echo "There are uncommitted changes in the current branch. Stashing the changes temporarily to avoid conflicts..."

    # new line
    echo ""

    # stash the local changes
    git stash
  fi

  # inform the user that the base branch is being updated
  echo "Updating the base branch..."

  # new line
  echo ""

  # user provided a base branch
  if [ -n "$baseBranch" ]; then
    # update the base branch without checking out the branch
    git pull origin $baseBranch
  else
    # update the default base branch without checking out the branch
    git pull origin main
  fi

  # new line
  echo ""

  # if there were uncommitted changes then pop the stash
  if [ "$hasUncommittedChanges" = true ]; then
    # inform the user that the local changes are being popped
    echo "Popping local changes..."

    # new line
    echo ""

    # pop the local changes
    git stash pop
  fi

  # inform the user that the core is being built
  echo "Building core..."

  # build core
  # otherwise, the uncommitted changes will not be reflected in the tests after popping the stash even if `npm start` is running
  npm run build
fi

# new line
echo ""

# Ask user for the component name they want to test

echo "Enter the component or path you want to test (e.g. chip, src/components/chip). Or leave empty to test all components:"

read componentValue

# new line
echo ""

# user wants to update their local ground truths
if [ "$updateTruths" = "y" ]; then

  # inform the user that the local ground truths are being updated
  echo "Updating local ground truths..."

  # the user provided a valid path as the component
  # ex: $componentValue = src/components/chip/test/basic/basic.e2e.ts
  if [ -f "$componentValue" ]; then
    # update the local ground truths for the provided path
    git checkout origin/$baseBranch -- $componentValue-snapshots/*-linux.png
  # the user provided a valid component folder as the component
  # ex: $componentValue = src/components/chip
  elif [ -d "$componentValue" ]; then
    # update the local ground truths for the provided folder
    git checkout origin/$baseBranch -- $componentValue/test/*/*.e2e.ts-snapshots/*-linux.png
  # the user provided a component name as the component
  # ex: $componentValue = chip
  elif [ -n "$componentValue" ]; then
    # update the local ground truths for the provided component
    git checkout origin/$baseBranch -- src/components/$componentValue/test/*/$componentValue.e2e.ts-snapshots/*-linux.png
  # the user did not provide a component name
  # run the e2e tests for all components
  else
    # update the local ground truths for all components
    git checkout origin/$baseBranch -- src/components/*/test/*/*.e2e.ts-snapshots/*-linux.png
  fi

fi

# new line
echo ""

# Inform the user that the e2e tests are about to run
echo "Running e2e tests..."

# Run the e2e tests

# user provided a component name
if [ -z "$componentValue" ]; then
  npm run test.e2e.docker
else
  npm run test.e2e.docker $componentValue
fi

# when updating the local ground truths, the user might have modified changes that Git registered
# this is because the ground truths are different in the base branch and the current branch
# if the user decides to reset the changes, then the user has to manually reset the changes
# it would be great if the script could reset the changes if the user breaks the script
# but this is not possible because the script is running in a subshell
