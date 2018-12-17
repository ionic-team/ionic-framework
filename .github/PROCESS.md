# Process

This document is to describe the internal process that the Ionic team uses for issue management and project planning.

## Table of contents
 * [Project Boards](#project-boards)
 * [Managing Issues](#managing-issues)
 * [Workflow](#workflow)

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

Once another label is applied to the issue, the `triage` label is automatically be removed by the bot.

### Wrong Repo

If an issue does not pertain to the Ionic Framework but does pertain to another repo, it should be moved to that repo. The bot has been set up to automatically create the issue in other repositories while closing and locking the issue in this repository. Use one of the following labels to perform that action:

- ionitron: cli
- ionitron: docs
- ionitron: stencil
- ionitron: native

### Ionic Pro Issues

If the issue is associated with Ionic Pro the submitter should be told to use the [Ionic Pro Support Forum](https://ionic.zendesk.com/hc/en-us/requests/new). The issue should be closed and locked. Use the `ionitron: ionic pro` label to accomplish this.

### Support Questions

If the issue is a support question, the submitter should be redirected to our [forum](https://forum.ionicframework.com) or [slack channel](https://ionicworldwide.herokuapp.com/). The issue should be closed and locked. Use the `ionitron: support` label to accomplish this.

### Incomplete Template

If the issue template has not been filled out completely, the issue should be closed and locked. The submitter should be informed top re-submit the issue making sure they fill the form out completely. Use the `ionitron: missing template` label to accomplish this.

### Issues with Open Questions

In many cases, the template is mostly filled out but just missing a thing or two or you may have a question or need clarification. In such a case, the submitter should be asked to supply that information.

1. create a comment requesting the additional information or clarification
1. add the `needs reply` label to the task

NOTE: be sure to perform those actions in the order stated. If you add the comment second it will trigger the removal of the label.

If there is a response to the question, the bot will remove the `needs reply` and apply the `triage` label. The issue will then go through the triage handling again.

if there is no response within 30 days, the issue will be closed and locked.

## Workflow

We have two long-living branches:

- `master`: completed features, bug fixes, refactors, chores
- `stable`: the latest release

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

#### Merging Changes from `master` into your Branch

1. Pull the latest changes locally.
1. Merge the changes, fixing any conflicts.
1. Push the merged changes.

OR

1. Click **Update branch** on the PR:

    <img width="672" alt="Update branch button" src="https://user-images.githubusercontent.com/236501/47032205-66a07b80-d137-11e8-8c9b-ee37d2d147c9.png">

1. Pull the merged changes locally.

#### Making a Release

1. Freeze `master`. Only the person doing the release should be modifying `master`.
1. Follow the [Making a Change](#making-a-change) steps to prepare the release.

    - Run `npm run release.prepare`
    - Version changes
    - `CHANGELOG.MD` tweaks

1. Create a PR to merge `master` into `stable`.
1. Click **Merge pull request**. Use the dropdown to select this option if necessary. This will preserve the commit history from `master` by creating a merge commit.

    <img width="191" alt="Merge pull request button" src="https://user-images.githubusercontent.com/236501/47032669-8be1b980-d138-11e8-9a90-d1518c223184.png">

1. CI builds `stable`, performing the release.
1. Unfreeze `master`.

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
