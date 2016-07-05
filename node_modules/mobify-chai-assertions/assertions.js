define(function (require) {

    return function (chai, utils) {
        var assert       = chai.assert;
        var Assertion    = chai.Assertion;

        // Add our assertions
        require('./lib/elements')(assert, Assertion, utils);
        require('./lib/properties')(assert, Assertion);
        require('./lib/has-items')(assert, Assertion);
    };

    // TODO: implement better 'expect' style
    // expect(foo).to.have.elements.with.length
    // expect(foo).to.have.elements.not.with.length
    // expect(foo).to.have.properties
});
