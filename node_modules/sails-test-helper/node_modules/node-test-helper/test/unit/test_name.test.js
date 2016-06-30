var cwd = process.cwd();
var index = require(cwd);
var _expect = require("chai").expect;
var testName = TEST_NAME;

describe("TEST_NAME with .test.js extension", function() {

  it("should return name without extension", function() {
    _expect(testName).to.equal("test_name");
  });

});
