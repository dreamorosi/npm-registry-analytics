# Contributing Guidelines

Thank you for your interest in contributing to my project! Before you get started, I would like you to read the following guidelines.

## Code of Conduct

This project and everyone participating in it is governed by the [Code of Conduct present in the repository](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior directly at the email address indicated in [this GitHub profile](https://github.com/dreamorosi).

## Reporting Bugs/Feature Requests

We welcome you to use the GitHub issue tracker to report bugs or suggest features.

When filing an issue, please check existing open, or recently closed, issues to make sure somebody else hasn't already
reported the issue. Please try to include as much information as you can. Details like these are incredibly useful:

- A reproducible test case or series of steps
- The version of our code being used
- Any modifications you've made relevant to the bug
- Anything unusual about your environment or deployment

## Contributing via Pull Requests

Contributions via pull requests are much appreciated. Before sending us a pull request, please ensure that:

1. You are working against the latest source on the _main_ branch.
2. You check existing open, and recently merged, pull requests to make sure someone else hasn't addressed the problem already.
3. You open an issue to discuss any significant work - we would hate for your time to be wasted.

> **Warning**
> Please avoid opening a PR before having discussed your change, and having reached an agreement on it, with a maintainer. PRs that don't have an issue or that were not agreed upon will not be reviewed.

To send us a pull request, please:

1. Fork the repository.
2. Modify the source; please focus on the specific change you are contributing. If you also reformat all the code, it will be hard for us to focus on your change.
3. Ensure local tests pass.
4. Commit to your fork using clear commit messages.
5. Send us a pull request, answering any default questions in the pull request interface.
6. Pay attention to any automated CI failures reported in the pull request, and stay involved in the conversation.

GitHub provides additional document on [forking a repository](https://help.github.com/articles/fork-a-repo/) and
[creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## Finding contributions to work on

Looking at the existing issues is a great way to find something to contribute on. As our projects, by default, use the default GitHub issue labels (enhancement/bug/duplicate/help wanted/invalid/question/wontfix), looking at any 'help wanted' issues is a great place to start.

## Setup

### Prerequisites

In order to contribute to this project you will need Node.js 18.x or later - install [here](https://nodejs.org/en/download/) or via [nvm](<[http](https://github.com/nvm-sh/nvm)>)/[fnm](https://github.com/Schniz/fnm)

Clone the repository and install dependencies:

```bash
git clone git@github.com:dreamorosi/npm-download-count-client.git
cd npm-download-count-client
npm ci
npm run init-environment
```

### Running tests

Tests are written using [Vitest](http://vitest.dev) which has a similar API to [Jest](https://jestjs.io/). You can run them with:

```bash
npm test
```

We strive to have 100% test coverage, so please make sure to add tests for any new code you write.

### Running the linter

The project uses [ESLint](https://eslint.org/) to enforce code style and conventions and [Prettier](https://prettier.io/) to format code.

In most cases you will not need to run the linter manually, as it will be run automatically either by your IDE or by the CI pipeline.

However, if you want to run it manually, you can do so with:

```bash
npm run lint
```

You can also automatically fix most issues with:

```bash
npm run lint-fix
```

### Building the project

The project is built using [tsup](https://tsup.egoist.dev) and configured to output CommonJS and ES modules.

```bash
npm run build
```
