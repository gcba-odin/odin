var _expect = require("chai").expect;
var _beforeAll = {};
var _afterAll = {};
var _before = {};
var _after = {};

HELPER_BOOTSTRAP = true;

//------------------------------------------------------------------------------

before(function(done) {
  _expect(_before.one).to.not.exist;
  _expect(_before.two).to.not.exist;
  _expect(_before.three).to.not.exist;
  _before.one = true;

  _expect(_beforeAll.one).to.exist;
  _expect(_beforeAll.two).to.exist;
  _expect(_beforeAll.three).to.exist;
  done();
});

before(function(done) {
  _expect(_before.one).to.exist;
  _expect(_before.two).to.not.exist;
  _expect(_before.three).to.not.exist;
  _before.two = true;

  _expect(_beforeAll.one).to.exist;
  _expect(_beforeAll.two).to.exist;
  _expect(_beforeAll.three).to.exist;
  done();
});

before(function(done) {
  _expect(_before.one).to.exist;
  _expect(_before.two).to.exist;
  _expect(_before.three).to.not.exist;
  _before.three = true;

  _expect(_beforeAll.one).to.exist;
  _expect(_beforeAll.two).to.exist;
  _expect(_beforeAll.three).to.exist;
  done();
});

before(function(done) {
  _expect(_before.one).to.exist;
  _expect(_before.two).to.exist;
  _expect(_before.three).to.exist;

  _expect(_beforeAll.one).to.exist;
  _expect(_beforeAll.two).to.exist;
  _expect(_beforeAll.three).to.exist;
  done();
});

//------------------------------------------------------------------------------
//-- before all is FIFO

beforeAll(function(done) {
  _expect(_before.one).to.not.exist;
  _expect(_before.two).to.not.exist;
  _expect(_before.three).to.not.exist;

  _expect(_beforeAll.one).to.not.exist;
  _expect(_beforeAll.two).to.not.exist;
  _expect(_beforeAll.three).to.not.exist;
  _beforeAll.one = true;
  done();
});

beforeAll(function(done) {
  _expect(_before.one).to.not.exist;
  _expect(_before.two).to.not.exist;
  _expect(_before.three).to.not.exist;

  _expect(_beforeAll.one).to.exist;
  _expect(_beforeAll.two).to.not.exist;
  _expect(_beforeAll.three).to.not.exist;
  _beforeAll.two = true;
  done();
});

beforeAll(function(done) {
  _expect(_before.one).to.not.exist;
  _expect(_before.two).to.not.exist;
  _expect(_before.three).to.not.exist;

  _expect(_beforeAll.one).to.exist;
  _expect(_beforeAll.two).to.exist;
  _expect(_beforeAll.three).to.not.exist;
  _beforeAll.three = true;
  done();
});

beforeAll(function(done) {
  _expect(_before.one).to.not.exist;
  _expect(_before.two).to.not.exist;
  _expect(_before.three).to.not.exist;

  _expect(_beforeAll.one).to.exist;
  _expect(_beforeAll.two).to.exist;
  _expect(_beforeAll.three).to.exist;
  done();
});

//------------------------------------------------------------------------------
//-- after all is LIFO

afterAll(function(done) {
  _expect(_after.one).to.exist;
  _expect(_after.two).to.exist;
  _expect(_after.three).to.exist;

  _expect(_afterAll.one).to.exist;
  _expect(_afterAll.two).to.exist;
  _expect(_afterAll.three).to.exist;
  done();
});

afterAll(function(done) {
  _expect(_after.one).to.exist;
  _expect(_after.two).to.exist;
  _expect(_after.three).to.exist;

  _expect(_afterAll.one).to.exist;
  _expect(_afterAll.two).to.exist;
  _expect(_afterAll.three).to.not.exist;
  _afterAll.three = true;
  done();
});

afterAll(function(done) {
  _expect(_after.one).to.exist;
  _expect(_after.two).to.exist;
  _expect(_after.three).to.exist;

  _expect(_afterAll.one).to.exist;
  _expect(_afterAll.two).to.not.exist;
  _expect(_afterAll.three).to.not.exist;
  _afterAll.two = true;
  done();
});

afterAll(function(done) {
  _expect(_after.one).to.exist;
  _expect(_after.two).to.exist;
  _expect(_after.three).to.exist;

  _expect(_afterAll.one).to.not.exist;
  _expect(_afterAll.two).to.not.exist;
  _expect(_afterAll.three).to.not.exist;
  _afterAll.one = true;
  done();
});

//------------------------------------------------------------------------------

after(function(done) {
  _expect(_after.one).to.not.exist;
  _expect(_after.two).to.not.exist;
  _expect(_after.three).to.not.exist;
  _after.one = true;

  _expect(_afterAll.one).to.not.exist;
  _expect(_afterAll.two).to.not.exist;
  _expect(_afterAll.three).to.not.exist;
  done();
});

after(function(done) {
  _expect(_after.one).to.exist;
  _expect(_after.two).to.not.exist;
  _expect(_after.three).to.not.exist;
  _after.two = true;

  _expect(_afterAll.one).to.not.exist;
  _expect(_afterAll.two).to.not.exist;
  _expect(_afterAll.three).to.not.exist;
  done();
});

after(function(done) {
  _expect(_after.one).to.exist;
  _expect(_after.two).to.exist;
  _expect(_after.three).to.not.exist;
  _after.three = true;

  _expect(_afterAll.one).to.not.exist;
  _expect(_afterAll.two).to.not.exist;
  _expect(_afterAll.three).to.not.exist;
  done();
});

after(function(done) {
  _expect(_after.one).to.exist;
  _expect(_after.two).to.exist;
  _expect(_after.three).to.exist;

  _expect(_afterAll.one).to.not.exist;
  _expect(_afterAll.two).to.not.exist;
  _expect(_afterAll.three).to.not.exist;
  done();
});
