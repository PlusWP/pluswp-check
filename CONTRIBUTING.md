#Contribute

Community made patches, localisations, bug reports and contributions are always welcome.

When contributing please ensure you follow the guidelines below.

## Getting Started

* Submit a ticket for your issue, assuming one does not already exist.
  * Raise it on our [Issue Tracker](https://github.com/knitkode/knitkode-check/issues)
  * Clearly describe the issue including steps to reproduce the bug.
  * Make sure you fill in the earliest version that you know has the issue as well as the version of WordPress you're using.

## Making Changes

* Fork the repository on GitHub
* Make the changes to your forked repository
  * Ensure you stick to the [WordPress Coding Standards](https://codex.wordpress.org/WordPress_Coding_Standards)
* When committing, reference your issue (if present) and include a note about the fix
* If possible, and if applicable, please also add/update unit tests for your changes
* Push the changes to your fork and submit a pull request to the 'master' branch of this repository

## Code Documentation

* We ensure that every class and function is documented well and follows the standards set by phpDoc
* An example function can be found [here](https://gist.github.com/sunnyratilal/5308969)
* Please make sure that every function is documented so that when we update our API Documentation things will be fine.
	* If you're adding/editing a function in a class, make sure to specify its `@access {private|public|protected}`
* Finally, please use tabs and not spaces. The tab indent size should be 4.

At this point you're waiting on us to merge your pull request. We'll review all pull requests, and make suggestions and changes if necessary.

# Additional Resources
* [General GitHub Documentation](https://help.github.com/)
* [GitHub Pull Request documentation](https://help.github.com/send-pull-requests/)
* [PHPUnit Tests Guide](https://phpunit.de/manual/current/en/writing-tests-for-phpunit.html)
