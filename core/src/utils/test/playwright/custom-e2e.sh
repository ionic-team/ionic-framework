#!/bin/bash

# Ask user if they want to update their local reference screenshots

echo "Do you want to update your local reference screenshots? (y/n)"

# the default value is "n"
read -n 1 updateScreenshots

# new line
echo ""

# If user wants to update their local reference screenshots, then ask for the base branch

if [ "$updateScreenshots" = "y" ]; then
  echo "Enter the base branch name (e.g. main, develop):"
  read baseBranch

  # new line
  echo ""

  # the base branch needs to be up to date
  # should we ask the user if they want to update the base branch?

  # stash the local changes to avoid conflicts

  # inform the user that the local changes are being stashed
  echo "Stashing local changes..."

  # new line
  echo ""

  # stash the local changes
  git stash

  # new line
  echo ""

  # inform the user that the base branch is being updated
  echo "Updating the base branch..."

  # new line
  echo ""

  # update the base branch without checking out the branch
  git pull origin $baseBranch

  # new line
  echo ""

  # inform the user that the local changes are being popped
  echo "Popping local changes..."

  # new line
  echo ""

  # pop the local changes
  git stash pop
fi

# new line
echo ""

# Ask user for the component name they want to test

echo "Enter the component name you want to test (e.g. button, input). Or leave empty to test all components:"

read componentName

# new line
echo ""

# user wants to update their local reference screenshots
if [ "$updateScreenshots" = "y" ]; then
  if [ -z "$componentName" ]; then
    # This can be removed when using the Linux images
    # It's needed now because I'm testing with Darwin images, and those
    # images are not stored in GitHub by default
    # Find all PNG files matching the pattern
    png_files=$(find src/components -name "*.e2e.ts-snapshots" -type d -exec sh -c "ls {}/*.png 2>/dev/null" \;)

    if [ -n "$png_files" ]; then
      # If there are matching PNG files, check them out from the specified branch
      for file in $png_files; do
          git checkout origin/$baseBranch -- "$file"
      done
    fi

    # This can be uncommented when using the Linux images
    # git checkout origin/$baseBranch -- src/components/*/test/*/*.e2e.ts-snapshots/*.png
  else

    # This can be removed when using the Linux images
    # It's needed now because I'm testing with Darwin images, and those
    # images are not stored in GitHub by default
    # Find all PNG files matching the pattern
    png_files=$(find src/components/$componentName -name "$componentName.e2e.ts-snapshots" -type d -exec sh -c "ls {}/*.png 2>/dev/null" \;)
    if [ -n "$png_files" ]; then
      # If there are matching PNG files, check them out from the specified branch
      for file in $png_files; do
          git checkout origin/$baseBranch -- "$file"
      done
    fi

    # This can be uncommented when using the Linux images
    # git checkout origin/$baseBranch -- src/components/$componentName/test/*/$componentName.e2e.ts-snapshots/*.png
  fi
fi

# new line
echo ""

# check that the React app has dependencies installed
if [ ! -d "src/utils/test/playwright/reporter/node_modules" ]; then
  # inform the user that the dependencies are being installed
  echo "Installing dependencies for the reporter app..."

  # new line
  echo ""

  # install the dependencies
  npm --prefix src/utils/test/playwright/reporter install
fi

# Inform the user that the e2e tests are about to run

echo "Running e2e tests..."

# Run the e2e tests

# user provided a component name
if [ -z "$componentName" ]; then
  npm run test.e2e
else
  npm run test.e2e $componentName
fi

# when updating the local reference screenshots, the user might have modified changes that Git registered
# this is because the reference screenshots are different in the base branch and the current branch
# if the user decides to reset the changes, then the user has to manually reset the changes
# it would be great if the script could reset the changes if the user breaks the script
# but this is not possible because the script is running in a subshell

