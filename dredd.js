var hooks = require('hooks');
var before = hooks.before;
var after = hooks.after;
var responseStash = {};

before("Users > Users > Create a User", function(transaction, done) {
    transaction.fullPath.slice(0, -3) += "/" + 'dogPzIz9';
    console.log('Entro al hook!!!!!!!!!!!!!!!!!');
    console.dir(transaction);
    done();
});