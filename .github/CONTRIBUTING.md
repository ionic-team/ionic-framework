# Contributing

Thanks for your interest in contributing to the Ionic Framework! :tada:


## Contributing Etiquette

Please see our [Contributor Code of Conduct](https://github.com/ionic-team/ionic/blob/master/CODE_OF_CONDUCT.md) for information on our rules of conduct.


## Creating an Issue

* If you have a question about using the framework, please ask on the [Ionic Forum](http://forum.ionicframework.com/) or in the [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/) group.

* It is required that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

* The issue list of this repository is exclusively for bug reports and feature requests. Non-conforming issues will be closed immediately.

* Issues with no clear steps to reproduce will not be triaged. If an issue is labeled with "needs reply" and receives no further replies from the author of the issue for more than 30 days, it will be closed.

* If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported](https://github.com/ionic-team/ionic/issues?utf8=%E2%9C%93&q=is%3Aissue). You can search through existing issues to see if there is a similar one reported. Include closed issues as it may have been closed with a solution.

* Next, [create a new issue](https://github.com/ionic-team/ionic/issues/new) that thoroughly explains the problem. Please fill out the populated issue form before submitting the issue.


## Creating a Pull Request

* We appreciate you taking the time to contribute! Before submitting a pull request, we ask that you please [create an issue](#creating-an-issue) that explains the bug or feature request and let us know that you plan on creating a pull request for it. If an issue already exists, please comment on that issue letting us know you would like to submit a pull request for it. This helps us to keep track of the pull request and make sure there isn't duplicated effort.

* Looking for an issue to fix? Make sure to look through our issues with the [type: bug](https://github.com/ionic-team/ionic/issues?q=is%3Aopen+is%3Aissue+label%3A%22type%3A+bug%22) label!

### Setup

1. Fork the repo.
2. Clone your fork.
3. Create a new branch from master for your change.
4. Run `npm install` (make sure you have [node](https://nodejs.org/en/) and [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) installed first)
5. Repeat step 4 for every package (core / angular / ...)


### Modifying Components

1. Components are inside `/core/src/components/`
2. Take a look at the [Stencil Documentation](https://stenciljs.com/docs/introduction/) and other components to understand the concept of these components.
3. Modify the component. Add comments, so we can understand your changes!
4. Best practice is to view your changes in realtime ([viewing changes](#viewing-changes))!
5. If you are ready, lint your changes! Switch to the `core` directory and run `npm run lint.ts` and manually fix the errors or `npm run lint.ts.fix` to autofix the errors
6. Now you are ready to [build and commit](#build)

#### Viewing Changes

1. Switch to the `core` directory and run `npm start`
2. Stencil dev mode will be started and now you can view the component. A browser should open at `http://localhost:3333/`. From here, navigate to the component you are changing.

#### Sass Changes

1. After changes to scss files, run [stylelint](https://stylelint.io/):
  - Switch to the `core` directory
  - Run `npm run lint.sass` and manually fix the errors or `npm run lint.sass.fix` to autofix the errors

#### Adding Documentation

1. To add or modify API Documentation for a component, it should be added/changed in the `readme.md` file in the component's directory. If the updates are to a specific `@Prop`, `@Event` or `@Method`, then please make the changes to the component's TypeScript (`*.tsx`). Properties, events and methods information within the `readme.md` file are auto generated directly from the JSDoc comments within the TypeScript file.

#### Adding Demos

1. Inside every component you find a `test` folder
2. This folder can contain one or more other folder with tests inside.
3. Edit one test by adding your use case or create a new folder. The easiest way is to copy the `index.html` from another folder to your folder and edit the content.

#### Build

1. If you are ready, run `npm run build` inside the root folder. Documentation, API and more will be updated (if you changed something there).
2. If your changes look good, you're ready to [commit](#commit-message-format)!
3. If you made changes to the documentation, added properties or anything like this, some files will be auto-genereated / updated. Do not forget to commit these files too!


## Commit Message Format

We have very precise rules over how our git commit messages should be formatted. This leads to readable messages that are easy to follow when looking through the project history. We also use the git commit messages to generate our [changelog](https://github.com/ionic-team/ionic/blob/master/CHANGELOG.md). (Ok you got us, it's basically Angular's commit message format).

`type(scope): subject`

#### Type
Must be one of the following:

* **feat**: A new feature
* **fix**: A bug fix
* **docs**: Documentation only changes
* **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
* **refactor**: A code change that neither fixes a bug nor adds a feature
* **perf**: A code change that improves performance
* **test**: Adding missing tests
* **chore**: Changes to the build process or auxiliary tools and libraries such as documentation generation

#### Scope
The scope can be anything specifying place of the commit change. For example `action-sheet`, `button`, `menu`, `nav`, etc. If you make multiple commits for the same component, please keep the naming of this component consistent. For example, if you make a change to navigation and the first commit is `fix(nav)`, you should continue to use `nav` for any more commits related to navigation.

#### Subject
The subject contains succinct description of the change:

* use the imperative, present tense: "change" not "changed" nor "changes"
* do not capitalize first letter
* do not place a period `.` at the end
* entire length of the commit message must not go over 50 characters
* describe what the commit does, not what issue it relates to or fixes
* **be brief, yet descriptive** - we should have a good understanding of what the commit does by reading the subject


## License

By contributing your code to the ionic-team/ionic GitHub Repository, you agree to license your contribution under the MIT license.
