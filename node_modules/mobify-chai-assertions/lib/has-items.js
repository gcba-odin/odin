define(function () {

    return function (assert, Assertion) {

        Assertion.addMethod('items', function (msg) {
            var exp = this._obj;

            new Assertion(exp, msg).to.not.be.empty;
        });
        assert.hasItems = function (exp, msg) {
            new Assertion(exp, msg).to.have.items;
        };
    };
    
});
