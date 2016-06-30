/*
 * global
 *
 */

//==============================================================================

var nodepath = require("path");
var async = require("async");
var _ = require("lodash");

var sinon = require("sinon");
var chai = require("chai");

//==============================================================================
//-- global properties

Object.defineProperty(global, "TEST_ROOT_PATH", {
  get: function() {
    return nodepath.join(process.cwd(), "test");
  }
});

//------------------------------------------------------------------------------

Object.defineProperty(global, "TEST_HELPERS_PATH", {
  get: function() {
    return nodepath.join(TEST_ROOT_PATH, "helpers");
  }
});

//------------------------------------------------------------------------------

Object.defineProperty(global, "TEST_FACTORIES_PATH", {
  get: function() {
    return nodepath.join(TEST_ROOT_PATH, "factories");
  }
});

//------------------------------------------------------------------------------

Object.defineProperty(global, "TEST_FIXTURES_PATH", {
  get: function() {
    return nodepath.join(TEST_ROOT_PATH, "fixtures");
  }
});

//------------------------------------------------------------------------------

Object.defineProperty(global, "TEST_NAME", {
  get: function() {
    var name = "Anonymous";
    var caller = arguments.callee.caller.toString();
    var args = arguments.callee.caller.arguments;
    var match = caller.match(/exports, *require, *module, *__filename, *__dirname/);

    if (match) {
      var filename = args[3] || name;
      name = filename.replace(TEST_ROOT_PATH, "")
                .replace(/^.?unit(\\|\/)?/, "")
                .replace(/(\.(test|spec))?\.js$/, "");
    }
    return name;
  }
});

//==============================================================================

Object.defineProperty(global, "sinon", {
  get: function() { return sinon; }
});

Object.defineProperty(global, "chai", {
  get: function() { return chai; }
});

Object.defineProperty(global, "stub", {
  get: function() { return sinon.stub; }
});

Object.defineProperty(global, "mock", {
  get: function() { return sinon.mock; }
});

Object.defineProperty(global, "expect", {
  get: function() { return chai.expect; }
});

Object.defineProperty(global, "requireHelper", {
  get: function() { return requireHelper; }
});

Object.defineProperty(global, "beforeAll", {
  get: function() { return beforeAll; }
});

Object.defineProperty(global, "afterAll", {
  get: function() { return afterAll; }
});

//==============================================================================
//-- locals

function requireHelper(module) {
  var _module = nodepath.join(TEST_HELPERS_PATH, module);
  return require(_module);
}

//------------------------------------------------------------------------------

var _beforeAll = [];
function beforeAll(callback) {
  _beforeAll.push(callback);
}

beforeAll.exec = function(done) {
  async.eachSeries(_beforeAll, function(item, next) {
    if (item.length > 0) {
      item(next);
    } else {
      item();
      next();
    }
  }, function(err) {
    done && done(err);
  });
};

//------------------------------------------------------------------------------

var _afterAll = [];
function afterAll(callback) {
  _afterAll.unshift(callback);
}

afterAll.exec = function(done) {
  async.eachSeries(_afterAll, function(item, next) {
    if (item.length > 0) {
      item(next);
    } else {
      item();
      next();
    }
  }, function(err) {
    done && done(err);
  });
};

//==============================================================================
//-- initializers...

chai.use(require("sinon-chai"));
chai.should();

//==============================================================================
