### Creating an Issue

If you have a question on how something works, or its expected functionality, you might want to visit the [Ionic Forum](http://forum.ionicframework.com/) first.

If you think you have found a bug, or have a new feature idea, please start by making sure it hasn't already been [reported](https://github.com/driftyco/ionic/issues?state=open). You can search through existing issues to see if someone's reported one similar to yours.

Next [create a new issue](https://github.com/driftyco/ionic/issues/new) that thoroughly explains the problem, how to reproduce the issue, and provide any additional information such as code examples and error logs.

### Issue Etiquette Guidelines

Poor  attitude, ranting, name-calling, bullying, being a jerk, complaining, or spamming are fruitless and unacceptable. Issues that violate the open source spirit of this community, or  any of the guidelines listed here, may result in your Issue being deleted or reposted to our Forum, a better place for debate and discussion. If you wish to contribute, either make your response respectful or do not bother to respond. You’ll find it’s pretty ineffective.

Simply put: be respectful and act like an adult. Critiques are better made on the Forum. If you can’t do that, this isn’t a community for you.

See our [Code of Conduct](./CODE_OF_CONDUCT.md) for more info.


### Pull Request Guidelines

Please use [Commitizen](https://github.com/commitizen/cz-cli#installing-the-command-line-tool) to commit to this repository. This ensures your commits will match our git conventions. It can be installed by running the following command (add sudo if on OSX/Linux):

```
npm install -g commitizen
```

Then, when you want to commit, instead of writing `git commit` you will write:

```
git cz
```

This will prompt you with some questions.

When in doubt, keep your pull requests small. To give a PR the best chance of getting accepted, do not bundle more than one "feature" or bug fix per PR. Doing so makes it very hard to accept it if one of the fixes has issues.

It's always best to create two smaller PRs than one big one.

### Style

Always use two spaces, no tabs. This goes for any HTML, CSS, or Javascript.

#### Sass Guidelines

##### Sass Linter

Run [Sass Linter](https://github.com/brigade/scss-lint) to ensure the css/sass matches our conventions (requires Ruby)

1. Install the linter: `gem install scss_lint`
2. Make sure to run the linter at the root of the repository where the `.scss-lint.yml` file is located
3. For all component Sass files: `scss-lint ionic/**/**/*.scss`
4. For a specific Sass file: `scss-lint ionic/components/toolbar/toolbar.ios.scss`


##### Variable Naming Conventions

The Sass variable should start with the component name:

```
$alert
$action-sheet
$badge
$toolbar
```

Then it should use the mode abbreviation (ios, md, wp):

```
$alert-md
$action-sheet-ios
$badge-md
$toolbar-wp
```

Next should be the css property it is affecting, for example:

```
$alert-md-max-width
$action-sheet-ios-background
$badge-md-border-radius
$toolbar-wp-padding
```

If it is affecting a component inside of the top level component, that should come next instead of the css property:

```
$alert-md-title
$alert-md-sub-title
$alert-md-message
$action-sheet-ios-title
$action-sheet-ios-button
```

Followed by the css property of that component:

```
$alert-md-title-font-size
$alert-md-sub-title-font-size
$alert-md-message-padding
$action-sheet-ios-title-color
$action-sheet-ios-button-background
```

If the variable only applies to a specific state, that should come last (hover, focused, activated, etc):

```
$action-sheet-ios-button-background-activated
$alert-md-input-border-width-focused
```

**Should I use `background` or `bg`?**
`background`

**Should I use `background` or `background-color`?**
`background` so users can override backgrounds in Sass variables using images and etc

### License

By contributing your code to the driftyco/ionic GitHub Repository, you agree to license your contribution under the MIT license.
