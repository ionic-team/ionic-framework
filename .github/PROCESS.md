# Process

This document is to describe the internal process that the Ionic team uses for issue management, project planning and the development workflow.

## Table of contents
 * [Project Boards](#project-boards)
 * [Managing Issues](#managing-issues)
 * [Workflow](#workflow)
 * [Releasing](#releasing)

## Project Boards

The project boards are located under the `Projects` tab in GitHub: https://github.com/ionic-team/ionic/projects/

### Core Project Board

The `Core` project board contains issues related to the `@ionic/core` package. A description of each column is below.

#### Backlog :robot:

Contains up to 20 issues that are important to work on soon but we don't think we can fit in the current sprint. If we finish everything we planned for the week we can pull from this column. Issues will automatically move to this column when they are added to the project board.

#### On Deck :baseball:

Contains issues that we believe we can accomplish in the current sprint. Issues should be manually moved to this column when we have our sprint planning meeting.

#### In Progress :person_fencing:

Issues and pull requests that are currently being worked on. Issues should be manually moved to this column and assigned to yourself when you begin working on them. Pull requests are automatically added to this column when added to the project board.

#### Needs Review :thinking:

Issues and pull requests that need review. Pull requests will automatically move here when a reviewer requests changes, or it no longer meets the minimum number of required approving reviews.

#### Done :tada:

Issues and pull requests that are completed. Issues will automatically move here when they are closed. Pull requests will automatically moved here when they are merged or closed with unmerged commits.


## Managing Issues

### Issues to Triage

The issues that need to be triaged all have the `triage` label. In many cases the issue can be automatically processed by the Ionic Issue Bot by applying a specific label.

Once another label is applied to the issue, the `triage` label is automatically removed by the bot.

### Wrong Repository

If an issue does not pertain to the Ionic Framework but does pertain to another repository, it should be moved to that repository. The bot has been set up to automatically create the issue in other repositories while closing and locking the issue in this repository. Use one of the following labels to perform that action:

- ionitron: cli
- ionitron: docs
- ionitron: stencil
- ionitron: native

### Ionic Appflow Issues

If the issue is associated with Ionic Appflow the submitter should be told to use the [Ionic Appflow Support Forum](https://ionic.zendesk.com/hc/en-us/requests/new). The issue should be closed and locked. Use the `ionitron: ionic appflow` label to accomplish this.

### Support Questions

If the issue is a support question, the submitter should be redirected to our [forum](https://forum.ionicframework.com) or [slack channel](https://ionicworldwide.herokuapp.com/). The issue should be closed and locked. Use the `ionitron: support` label to accomplish this.

### Incomplete Template

If the issue template has not been filled out completely, the issue should be closed and locked. The submitter should be informed top re-submit the issue making sure they fill the form out completely. Use the `ionitron: missing template` label to accomplish this.

### Issues with Open Questions

In many cases, the template is mostly filled out but just missing a thing or two or you may have a question or need clarification. In such a case, the submitter should be asked to supply that information.

1. add a comment requesting the additional information or clarification
1. add the `needs: reply` label to the task

NOTE: be sure to perform those actions in the order stated. If you add the comment second it will trigger the removal of the label.

If there is a response to the question, the bot will remove the `needs: reply` and apply the `triage` label. The issue will then go through the triage handling again.

if there is no response within 30 days, the issue will be closed and locked.

## Workflow

### Overview

![](https://user-images.githubusercontent.com/6577830/53817482-80e6c480-3f33-11e9-9e09-be8dcf840ef8.png)

We have two long-living branches:

- `master`: completed features, bug fixes, refactors, chores
- `stable`: the latest release

The overall flow:

1. Feature, refactor, and bug fix branches are created from `master`
1. When a feature, refactor, or fix is complete it is merged into `master`
1. A release branch is created from `master`
1. When the release branch is done it is merged into `master` and `stable`
1. If an issue in `stable` is detected a hotfix branch is created from `stable`
1. Once the hotfix is complete it is merged to both `master` and `stable`
1. All branches should follow the syntax of `{type}-{details}` where `{type}` is the type of branch (`hotfix`, `release`, or one of the [commit types](https://github.com/ionic-team/ionic/blob/master/.github/CONTRIBUTING.md#commit-message-format)) and `{details}` is a few hyphen separated words explaining the branch

### Stable and Master Branches

#### Stable Branch

Branches created from `stable`:

The following branch should be merged back to **both** `master` and `stable`:

- A `hotfix` branch (e.g. `hotfix-missing-export`): a bug fix that is fixing a regression or issue with a published release

A `hotfix` branch should be the **only** branch that is created from stable.

#### Master Branch

Branches created from `master`:

The following branches should be merged back to `master` via a pull request:

1. A feature branch (e.g. `feat-desktop-support`): an addition to the API that is not a bug fix or regression fix
1. A bug fix branch (e.g. `fix-tab-color`): a bug fix that is not fixing a regression or issue with a published release
1. All other types listed in the [commit message types](https://github.com/ionic-team/ionic/blob/master/.github/CONTRIBUTING.md#commit-message-format): `docs`, `style`, `refactor`, `perf`, `test`, `chore`

The following branch should be merged back to **both** `master` and `stable`:

1. A `release` branch (e.g. `release-4.1.x`): contains all fixes and (optionally) features that are tested and should go into the release


### Feature Branches

Each new feature should reside in its own branch, based on the `master` branch. When a feature is complete, it should go into a pull request that gets merged back into `master`. A pull request adding a feature should be approved by two team members. Features should never interact directly with `stable`.


### Release Branches

Once `master` has acquired enough features for a release (or a predetermined release date is approaching), fork a release branch off of `master`. Creating this branch starts the next release cycle, so no new features can be added after this point - only bug fixes, documentation generation, and other release-oriented tasks should go in this branch.

Once the release is ready to ship, it will get merged into `stable` and `master`, then the release branch will be deleted. It’s important to merge back into `master` because critical updates may have been added to the release branch and they need to be accessible to new features. This should be done in a pull request after review.

See the [steps for releasing](#releasing) below for detailed information on how to publish a release.

### Version Branches

Once a release has shipped and the release branch has been merged into `stable` and `master` it should also be merged into its corrsponding version branch. These version branches allow us to ship updates for specific versions of the framework (i.e. Lets us ship a bug fix that only affects 4.2.x).

Patch releases should be merged into their corresponding version branches. For example, a `release-4.1.1` branch should be merged into the `4.1.x` version branch and a `release-5.0.1` branch should be merged into the `5.0.x` version branch.

When releasing a major version such as `5.0.0 ` or a minor version such as `4.1.0` , the version branch will not exist. The version branch should be created once the release branch has been merged into `stable` and `master`. For example, when releasing `4.1.0`, the `release-4.1.0` release branch should be merged into `stable` and `master` and then the `4.1.x` version branch should be created off the latest `stable`.


### Hotfix Branches

Maintenance or “hotfix” branches are used to quickly patch production releases. This is the only branch that should fork directly off of `stable`. As soon as the fix is complete, it should be merged into both `stable` and `master` (or the current release branch).


### Examples

#### Making a Change

1. Create a branch from `master`.
1. Make changes. Limit your changes to a "unit of work", meaning don't include irrelevant changes that may confuse and delay the change.
1. Push changes.
1. Create a PR with the base of `master`.
1. Have someone approve your change (optional right now--at your discretion).

    <img width="236" alt="image" src="https://user-images.githubusercontent.com/236501/47031893-913e0480-d136-11e8-9d9a-4b6297a4d7ba.png">

1. Wait for status checks to succeed. Fix errors if any occur.

    <img width="223" alt="All checks have passed" src="https://user-images.githubusercontent.com/236501/47031830-62c02980-d136-11e8-9055-08af1b717304.png">

1. Click **Squash and merge**. Use the dropdown to select this option if necessary.

    <img width="192" alt="Squash and merge button" src="https://user-images.githubusercontent.com/236501/47031620-da418900-d135-11e8-91ff-e84f2478b2b3.png">

1. During confirmation, rewrite the commit message using our [Commit Message Format guidelines](https://github.com/ionic-team/ionic/blob/master/.github/CONTRIBUTING.md#commit-message-format). Keep the `(#1234)` at the end; it will create a link to the PR in the commit history and `CHANGELOG.md`. This is where commits on `master` become permanent.

    <img width="672" alt="Squash and merge confirmation" src="https://user-images.githubusercontent.com/236501/47031753-31dff480-d136-11e8-9116-03934961bdc2.png">

1. Confirm squash and merge into `master`.

#### Updating from `master`

1. Pull the latest changes locally.
1. Merge the changes, fixing any conflicts.
1. Push the merged changes.

OR

1. Click **Update branch** on the PR:

    <img width="672" alt="Update branch button" src="https://user-images.githubusercontent.com/236501/47032205-66a07b80-d137-11e8-8c9b-ee37d2d147c9.png">

1. Pull the merged changes locally.

#### Hotfixes

Hotfixes bypass `master` and should only be used for urgent fixes that can't wait for the next release to be ready.

1. Create a branch from `stable`.
1. Make changes.
1. Run `npm run release.prepare`.
1. Push changes.
1. Create a PR, making sure the PR will merge into `stable`.
1. Click **Squash and merge**. Use the dropdown to select this option if necessary.

    <img width="192" alt="Squash and merge button" src="https://user-images.githubusercontent.com/236501/47031620-da418900-d135-11e8-91ff-e84f2478b2b3.png">

1. During confirmation, rewrite the commit message using our [Commit Message Format guidelines](https://github.com/ionic-team/ionic/blob/master/.github/CONTRIBUTING.md#commit-message-format). Keep the `(#1234)` at the end; it will create a link to the PR in the commit history and `CHANGELOG.md`. This is where commits on `master` become permanent.

    <img width="672" alt="Squash and merge confirmation" src="https://user-images.githubusercontent.com/236501/47031753-31dff480-d136-11e8-9116-03934961bdc2.png">

1. Confirm squash and merge into `stable`.
1. CI builds `stable`, performing the release.
1. Create a PR to merge `stable` into `master`.
1. Click **Merge pull request**. Use the dropdown to select this option if necessary.

    <img width="191" alt="Merge pull request button" src="https://user-images.githubusercontent.com/236501/47032669-8be1b980-d138-11e8-9a90-d1518c223184.png">


## Releasing

1. Create the release branch from `master`, for example: `release-4.5.0`.

1. For major or minor releases, create a version branch based off the latest version branch. For example, if releasing 4.5.0, create a branch called `4.5.x` based off `4.4.x`.

1. Submit a pull request from the release branch into the version branch. Do not merge this pull request yet.

1. Verify all tests are passing, fix any bugs if needed and make sure no undesired commits are in.

1. Navigate to the root of the repository while on the release branch.

1. Run `npm i` if it hasn't already been done.

1. Run `npm run release.prepare`
    - Select the version based on the type of commits and the [Ionic Versioning](https://ionicframework.com/docs/intro/versioning)
    - After the process completes, verify the version number in all packages (`core`, `docs`, `angular`)
    - Verify the changelog commits are accurate and follow the [proper format]((https://github.com/ionic-team/ionic/blob/master/.github/CONTRIBUTING.md#commit-message-format))
    - For major or minor releases, ensure that the version number has an associated title (for example: `4.5.0 Boron`)
    - Commit these changes with the version number as the message, e.g. `git commit -m "4.5.0"`

1. Run `npm run release`

1. Click **Merge pull request**. Use the dropdown to select this option if necessary.

    <img width="191" alt="Merge pull request button" src="https://user-images.githubusercontent.com/236501/47032669-8be1b980-d138-11e8-9a90-d1518c223184.png">

1. Rewrite the commit message to `merge release-[VERSION]` with the proper release branch. For example, if this release is for `4.5.0`, the message would be `merge release-4.5.0`.

1. Submit a pull request from the release branch into `master`. Merge this pull request using the same commit format in the last step, to ensure any changes made on the release branch get added to future releases.