define(function () {

    return function (assert, Assertion, utils) {

        /*
            .elements checks that the given expression is a Zepto/jQuery object
            Can be chained with .present and .count
        */

        function assertElement (msg) {
            var exp = this._obj;

            if (!msg) {
                msg = 'Must be a Zepto/jQuery object';
            }

            new Assertion(exp.hasOwnProperty('selector'), msg).to.be.true;
        }

        function assertElementChain () {
            utils.flag(this, 'elements', true);
        }

        Assertion.addChainableMethod('elements', assertElement, assertElementChain);
        Assertion.addChainableMethod('element', assertElement, assertElementChain);

        assert.elements = function (exp, msg) {
            new Assertion(exp).to.be.elements(msg);
        };
        assert.element = function (exp, msg) {
            new Assertion(exp).to.be.elements(msg);
        };

        /*
            .present checks for length at least 1
            Works for all types of expressions.
        */
        Assertion.addMethod('present', function (num, msg) {
            var exp = this._obj;

            if (typeof num === 'string') {
                msg = num;
                num = 0;
            }

            if (utils.flag(this, 'elements')) {
                if (!exp.hasOwnProperty('selector')) throw new Error('exp must be a Zepto object');
            }
            if (utils.flag(this, 'negate')) {
                new Assertion(exp, msg).to.not.have.length.at.least(num || 1);
            }

            new Assertion(exp, msg).to.have.length.at.least(num || 1);
        });
        assert.present = function (exp, num, msg) {
            new Assertion(exp).to.be.present(num, msg);
        };

        /*
            .elementsPresent checks that the given Zepto/jQuery object
            has a length at least 1.
            .elementsPresent is here for backwards compatibility.
            Use elements.present instead.
        */
        Assertion.addMethod('elementsPresent', function (num, msg) {
            var exp = this._obj;
            if (!exp.hasOwnProperty('selector')) throw new Error('exp must be a Zepto object');
            new Assertion(exp).to.be.present(num, msg);
        });
        assert.elementsPresent = function (exp, num, msg) {
            new Assertion(exp).to.be.present(num, msg);
        };

        /*
            .elementsNotPresent checks that the given Zepto/jQuery object
            has a length of 0.
            .elementsNotPresent is here for backwards compatibility.
            Use elements.not.present instead.
        */
        Assertion.addMethod('elementsNotPresent', function (msg) {
            var exp = this._obj;
            if (!exp.hasOwnProperty('selector')) throw new Error('exp must be a Zepto object');

            new Assertion(exp, msg).to.have.length(0);
        });
        assert.elementsNotPresent = function (exp, msg) {
            new Assertion(exp).to.have.elementsNotPresent(msg);
        };


        Assertion.addMethod('elementsEqual', function (num, msg) {
            if (!num) throw new Error('Specify a count.');

            var exp = this._obj;
            if (!exp.hasOwnProperty('selector')) throw new Error('exp must be a Zepto object');

            if (typeof num === 'string') {
                msg = num;
                num = 0;
            }

            new Assertion(exp, msg).to.have.length(num);
        });
        assert.elementsEqual = function(exp, num, msg) {
            new Assertion(exp).to.have.elementsEqual(num, msg);
        };


        /*
            .elementsCount checks that the given jQuery/Zepto object
            has a length of num.
            It is better to use .elements.count.
        */
        Assertion.addMethod('elementsCount', function (num, msg) {
            var exp = this._obj;
            if (!exp.hasOwnProperty('selector')) throw new Error('exp must be a Zepto object');
            new Assertion(exp).to.have.elementsEqual(num, msg);
        });
        assert.elementsEqual = function (exp, num, msg) {
            new Assertion(exp).to.have.elementsEqual(num, msg);
        };
        assert.elementsCount = function (exp, num, msg) {
            new Assertion(exp).to.have.elementsEqual(num, msg);
        };


        /*
            A custom check for length.
            When used in conjunction with .elements, expects the
            given expression to be a Zepto/jQuery object.
        */
        Assertion.addMethod('count', function (num, msg) {
            if (!num) throw new Error('Specify a count.');

            var exp = this._obj;

            if (utils.flag(this, 'elements')) {
                if (!exp.hasOwnProperty('selector')) throw new Error('exp must be a Zepto object');
            }

            new Assertion(exp, msg).to.have.length(num);
        });
        assert.count = function (exp, num, msg) {
            new Assertion(exp).to.have.count(num, msg);
        };


        Assertion.addMethod('elementsNotEqual', function (num, msg) {
            var exp = this._obj;
            if (!exp.hasOwnProperty('selector')) throw new Error('exp must be a Zepto object');

            if (typeof num === 'string') {
                msg = num;
                num = 0;
            }

            new Assertion(exp, msg).to.not.have.length(num || 0);
        });
        assert.elementsNotEqual = function (exp, num, msg) {
            new Assertion(exp).to.have.elementsNotEqual(num, msg);
        };
    };

});
