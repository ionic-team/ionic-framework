# Process

This document is to describe the internal process that the Ionic team uses for issue management and project planning.

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
