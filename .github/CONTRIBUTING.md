# Contributing

Thanks for your interest in contributing to the Ionic Framework! :tada:


## Contributing Etiquette

Please see our [Contributor Code of Conduct](https://github.com/ionic-team/ionic/blob/master/CODE_OF_CONDUCT.md) for information on our rules of conduct.


## Creating an Issue

* If you have a question about using the framework, please ask on the [Ionic Forum](http://forum.ionicframework.com/) or in the [Ionic Worldwide Slack](http://ionicworldwide.herokuapp.com/) group.

* It is required that you clearly describe the steps necessary to reproduce the issue you are running into. Although we would love to help our users as much as possible, diagnosing issues without clear reproduction steps is extremely time-consuming and simply not sustainable.

* The issue list of this repository is exclusively for bug reports and feature requests. Non-conforming issues will be closed immediately.

* Issues with no clear steps to reproduce will not be triaged. If an issue is labeled with "needs reply" and receives no further replies from the author of the issue for more than 5 days, it will be closed.

* If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported](https://github.com/ionic-team/ionic/issues?utf8=%E2%9C%93&q=is%3Aissue). You can search through existing issues to see if there is a similar one reported. Include closed issues as it may have been closed with a solution.

* Next, [create a new issue](https://github.com/ionic-team/ionic/issues/new) that thoroughly explains the problem. Please fill out the populated issue form before submitting the issue.


## Creating a Pull Request

* We appreciate you taking the time to contribute! Before submitting a pull request, we ask that you please [create an issue](#creating-an-issue) that explains the bug or feature request and let us know that you plan on creating a pull request for it. If an issue already exists, please comment on that issue letting us know you would like to submit a pull request for it. This helps us to keep track of the pull request and make sure there isn't duplicated effort.

* Looking for an issue to fix? Make sure to look through our issues with the [help wanted](https://github.com/ionic-team/ionic/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) label!

### Setup

1. Fork the repo.
2. Clone your fork.
3. Make a branch for your change.
4. Run `npm install` (make sure you have [node](https://nodejs.org/en/) and [npm](http://blog.npmjs.org/post/85484771375/how-to-install-npm) installed first)


### Modifying Components

1. Make any changes to the component.
2. Modify the e2e test in the `test/` directory under the component directory, if possible. If the test does not exist and it is possible to show the change, please create a new test in a directory called `basic/`.


#### TypeScript Changes

1. If there is a `*.spec.ts` file located in the `test/` folder, update it to include a karma test for your change, if needed. If this file doesn't exist, please notify us.
2. Run `gulp test` to make sure all tests are working, regardless if a test was added.
3. Run `gulp lint.ts` and fix any linter errors.


#### Sass Changes

1. If the css property is something that the user may want to override and it won't break the component layout, it should be given a Sass variable. See our [doc on naming Sass variables](https://docs.google.com/document/d/1OyOyrRE5lpB_9mdkF0HWVQLV97fHma450N8XqE4mjZQ/edit?usp=sharing).
2. After any changes to the Sass files run the [Sass Linter](https://github.com/brigade/scss-lint):
 - Requires [Ruby](https://www.ruby-lang.org/en/documentation/installation/). **Skip this step entirely if you are unable to install Ruby.**
 - Install the linter: `gem install scss_lint`
 - Make sure to run the linter at the root of the repository.
 - Run `gulp lint.sass` and fix any linter errors.


#### Viewing Changes

1. Run the gulp e2e task to build all tests: `gulp e2e`
2. Run the gulp e2e.watch task to watch your specific test (replace `button` with the component you are modifying and `basic` with the test folder): `gulp e2e.watch --f=button/basic`
3. A browser should open at `http://localhost:8080/dist/e2e`. From here, navigate to the component you are changing.
4. If your changes look good, you're ready to [commit](#committing)!


#### Adding Documentation

1. To add or modify API Documentation for a component, it should be added/changed in the component's TypeScript (`*.ts`) file, prior to the Class definition. For example, `Badge` looks similar to this:

  ```
  /**
    * @name Badge
    * @module ionic
    * @description
    * Badges are simple components in Ionic containing numbers or text.
    *
    * @see {@link /docs/v2/components/#badges Badges Component Docs}
    * @demo /docs/v2/demos/badge/
  **/
  ```

  where `@name` is the Class name, `@description` is the description displayed on the documentation page, `@see` links to any related pages, and `@demo` links to the API demo located in the `demos` folder.
2. In order to run API documentation locally, you will need to clone the `ionic-site` repo as a sibling to the `ionic` repo and then run it: https://github.com/ionic-team/ionic-site#local-build
3. Then, run `gulp docs` in the `ionic` repo every time you make a change and the site will update.
4. If the change affects the component documentation, create an issue on the `ionic-site` repo: https://github.com/ionic-team/ionic-site/issues


#### Adding Demos

1. Create or modify the demo in the `demos/` folder.
2. If it is new, link to the demo in the component's TypeScript (`*.ts`) file (under `src/components`) by adding a link to it in the documentation using `@demo`, for example:

  ```
  /**
    * @name Badge
    *
    * ...
    *
    * @demo /docs/v2/demos/src/badge/
  **/
  ```
3. Run `gulp watch.demos` to watch for changes to the demo
4. Navigate to `http://localhost:8000/dist/demos/` and then to your component's demo to view it.
5. If the change affects the component demos, create an issue on the `ionic-site` repo: https://github.com/ionic-team/ionic-site/issues


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
