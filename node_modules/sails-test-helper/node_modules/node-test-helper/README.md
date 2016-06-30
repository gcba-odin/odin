# node-test-helper
Test helper suite using Mocha test framework.


## Dependencies

* [mocha](https://github.com/mochajs/mocha)
* [chai](https://github.com/chaijs/chai)
* [sinon](https://github.com/cjohansen/Sinon.JS)
* [sinon-chai](https://github.com/domenic/sinon-chai)


## Installation

```sh
# Local install
$ npm install node-test-helper

# Global install
$ sudo npm install -g node-test-helper
```


## Initialization

Copy test suite template to current directory.

```sh
# Local install
$ node_modules/.bin/node-test-helper init

# Global install
$ node-test-helper init
```

The following will be copied to the current working directory:

```
Makefile
test/
  factories/
  fixtures/
  helpers/
  unit/
```


## Writing Tests

```javascript
//-- test/unit/sample.test.js
require("node-test-helper");

describe(TEST_NAME, function() {
  describe("without callback", function() {
    //-- sync
    it("should be successful", function() {
    });
  });

  describe("with callback", function() {
    //-- async
    it("should be successful", function(done) {
      done();
    });
  });
});
```

_Execute sample test_

```
$ make test

  sample
    without callback
      ✓ should be successful
    with callback
      ✓ should be successful

  2 passing
```


## Test Execution

Tests are executed using **_make_** command. The script will look for tests under **test/unit/** directory.

```sh
# Run all tests
$ make test

# Run tests under a specific directory
# This will run all tests under test/unit/controllers directory
$ make test controllers

# This will run tests under test/unit/controllers and test/unit/models directories
$ make test controllers models

# Run a specific test file
# This will run tests in test/unit/utils/sample.test.js file
$ make test utils/sample.test
```


### Mocha Options

Mocha options can be passed as parameter to **_make_**. By default, **_mocha_** is being executed using the ff. options:

```sh
# recursive with 30 second timeout using spec reporter
$ mocha --recursive -t 30000 -R spec
```

Use **MOCHA_OPTS** commandline variable to pass specific **_mocha_** options to **_make_**.

```sh
# Dot format without colors. Useful for test execution on CI servers such as Jenkins.
$ make MOCHA_OPTS='-C -R dot' test
```


## Helpers

* TEST_NAME
* TEST_ROOT_PATH
* TEST_HELPERS_PATH
* TEST_FACTORIES_PATH
* TEST_FIXTURES_PATH
* requireHelper()
* [sinon](https://github.com/cjohansen/Sinon.JS)
* [stub()](https://github.com/cjohansen/Sinon.JS)
* [mock()](https://github.com/cjohansen/Sinon.JS)
* [chai](https://github.com/chaijs/chai)
* [expect()](https://github.com/chaijs/chai)
* [should](https://github.com/chaijs/chai)


## Custom Helpers

You can write your own test helpers or node modules and save it under **test/helpers/** directory. Use the built-in **requireHelper()** function to load your custom helper.

```javascript
//-- test/unit/sample.test.js
require("node-test-helper");

describe(TEST_NAME, function() {
  it("should load my custom helper", function() {
    var my_helper = requireHelper("my_helper");
    expect(my_helper).to.exist;
  });
});
```

If you need to do some initialization prior to all your tests execution, you can put them inside **test/helpers/bootstrap.js** file. This file will be loaded automatically upon test execution.

```javascript
//-- test/helpers/bootstrap.js
//-- global variables can also be initialized here...

before(function(done) {
  //-- anything to run or initialize before running all tests...

  done();
});
```
