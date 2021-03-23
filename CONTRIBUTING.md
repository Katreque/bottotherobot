# Contributing Guide

## Open Development

All work on Botto happens directly on GitHub. Both core team members and external contributors send pull requests which go through the same review process.

## Semantic Versioning

We follow [semantic versioning](https://semver.org/). We release patch versions for critical bugfixes, minor versions for new features or non-essential changes, and major versions for any breaking changes. Every significant change is documented in the [changelog file](https://github.com/Katreque/bottotherobot/blob/master/CHANGELOG.md).

## Development Workflow

After cloning Botto, run _npm i_ to fetch its dependencies. Then, you can run several commands:

-   _npm test_ runs all tests.
-   _npm run lint_ checks your code.
-   _npm run build_ creates a build with the productions files.

## Your First Pull Request

Working on your first Pull Request? You can learn how from this free video series:

[How to Contribute to an Open Source Project on GitHub.](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

If you decide to fix an issue, please be sure to check the comment thread in case somebody is already working on a fix. If nobody is working on it at the moment, please leave a comment stating that you intend to work on it so other people don’t accidentally duplicate your effort.

If somebody claims an issue but doesn’t follow up for more than two weeks, it’s fine to take it over but you should still leave a comment.

## Sending a Pull Request

**Before submitting a pull request**, please make sure the following is done:

1. Fork the repository and create your branch from master.
2. Run _npm i_ in the repository root.
3. If you’ve fixed a bug or added code that should be tested. **Add tests!**
4. Ensure the test suite passes with _npm test_.
5. Check your code with _npm run lint_.
6. Make sure everything is right with _npm run build_. If no error messages are thrown, you should send your pull request. :3

## Bugs

### Known Issues

We are using [GitHub Issues](https://github.com/Katreque/bottotherobot/issues) for our public bugs. We keep a close eye on this and try to make it clear when we have an internal fix in progress. Before filing a new task, try to make sure your problem doesn’t already exist.

### Reporting New Issues

The best way to get your bug fixed is to provide a reduced test case. Use any code playground you like to reproduce the bug and use it on your Issue.

## Style Guide

Our litn is based on the [Airbnb’s Style Guide.](https://github.com/airbnb/javascript) It will guide you in the right direction.

## How to Get in Touch

Join [Terê AWS User Group](https://discord.gg/SD3FtBy) on Discord! :3
