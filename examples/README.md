# SolidError Usage Examples

This folder contains a series of examples that show how to use and customize SolidError. 

Examples are available for both `ES5` and `ES6` syntax, so read and run the ones you are more comfortable with.

## Installation

The `example` folder is excluded from the distributed library. In order to try the examples on your system, you must clone the project locally.

To clone the project locally, run:

  git clone https://github.com/erremauro/soliderror

### ES6 Pre-requisites

In order to run examples from the `./es6` folder [Babel][1] must be installed on your system.

To install babel globally, run:

  npm install -g babel-cli


Then add the ES2015 preset to the current project:

  npm install babel-preset-es2015


Run the examples using `babel-node`:

  babel-node examples/es6/<example-folder>


[1]: https://babeljs.io/docs/usage/cli/ "Read Babel CLI usage"