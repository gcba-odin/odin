define(function () {

    return function (assert, Assertion) {
        Assertion.addMethod('properties', function () {
            var properties = arguments;
            var exp = this._obj;

            for (var i = 0; i < properties.length; i++) {
                var msg = 'Expected property ' + properties[i] + ' is not present';
                new Assertion(exp, msg).to.have.property(properties[i]);
            }
        });
        assert.properties = function (exp) {
            var properties = Array.prototype.slice.call(arguments, 1);

            var assertion = new Assertion(exp);
            assertion.to.have.properties.apply(assertion, properties);
        };
    };

});
