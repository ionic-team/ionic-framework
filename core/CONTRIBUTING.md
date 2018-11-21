# Contribution guide

## Contribute to Ionic Core

Ionic Core is the fundation of Ionic v4. It's based in [Stencil](https://stenciljs.com) and consist in a set of web components a long of JS and CSS utils.


### Installing dependencies

Before you can build ionic, we assume the following list of software is already installed in your system

- Git
- Node 8 or higher
- Npm 6.0 or higher


### Fork repository

In order to contributo to Ionic, you must have a github account so you can push code and create a new Pull Request (PR).

Once you are all setup, following the Github's guide of how to fork a repository: https://guides.github.com/activities/forking/


### Build Ionic Core

```bash
# Clone your Github repository:
git clone https://github.com/<github username>/ionic.git

# Go to the core directory:
cd ionic/core

# Install npm dependencies
npm install

# Run Ionic dev server
npm start
```

### Development Workflow

#### 1. Run Dev Server

```bash
# Move to the core folder
cd core

# Run dev server
npm start
```

You should be able to navigate to `http://localhost:3333` which will look like a file browser.

E2E tests are located inside the `src/component` folder, in the following way: `http://localhost:3333/src/components/{COMPONENT}/test/`


**Path examples:**

- ActionSheet basic test: http://localhost:3333/src/components/action-sheet/test/basic
- Nav basic test: http://localhost:3333/src/components/nav/test/basic
- Button basic test:
http://localhost:3333/src/components/button/test/basic


**IMPORTANT**

Leave the dev server running in the background while you make changes. The dev server listen for changes and automatically recompile Ionic for you.



#### 2. Open `core` folder in your IDE

Components implementations live inside the `core/src/components` folder.

You can find each ionic component inside their directory.


#### 3. Run test suite

Before commiting your changes make sure tests are passing:

```
npm run validate
```

#### 4. Create a branch and commit

```bash
# Create a git branch
git checkout -b my-improvement

# Add changes
git add .

# Create commit
git commit -m "fix(component): message"
```

Create a PR:
https://guides.github.com/activities/forking/


### Summary

```bash
# Clone repo
git clone git@github.com:ionic-team/ionic.git

# Move to ionic/core folder
cd ionic/core

# Install npm dependencies
npm i

# Run dev server
npm start

# Run test suite
npm run validate
```

