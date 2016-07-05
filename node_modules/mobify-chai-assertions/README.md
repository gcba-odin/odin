# Custom Assertions For Chai

For our integration testing, we have made our own Chai's custom assertions. This is where we define, collect, and present them in a plugin form.

https://www.npmjs.com/package/mobify-chai-assertions


## How To Use the Plugin

To use the plugin, simply call Chai's `use()` function:

```javascript
var chai = require('node_modules/chai/chai');
var customAssertions = require('node_modules/mobify-chai-assertions/assertions');
chai.use(customAssertions);
```


## New Assertion Methods

The plugin extends Chai by adding the following methods. Feel free to use either the `assert` or `expect` styles. They work with any of the chains listed in the [Chai API documentation](http://chaijs.com/api/bdd/).

(Note: since Chai's API supports only the `expect` style, we implemented these methods for the `expect` style first and then the `assert` style as a wrapper)

### Elements

All of these assertions can take an optional `msg` parameter to output a custom error message on test failure. 

[ ] syntax denotes an optional parameter. 

`element([msg]) / elements([msg])`

```javascript
// Asserts that it is a Zepto/jQuery element.
expect($paymentOptions).to.be.an.element;

// Takes an optional error message that is displayed on failure.
// Default error message is "Must be a Zepto/jQuery object"
expect($paymentOptions).to.be.elements('failure: it is not a Zepto/jQuery object');

//Can be chained with .present and .count (see below)
```

`present([num], [msg])`

```javascript
// Asserts that the length is at least (>=) than num.
// Default is 1. 
// Can be used with all types of expressions.
expect($paymentOptions).to.be.present;

var items = [1, 2, 3];
expect(items).to.be.present;
expect(items).to.be.present(3);
expect(items).to.be.present(4, 'my custom failure message');

// Can be used in a chain:
// Zepto/jQuery object has length at least 1
expect($paymentOptions).to.have.elements.present;

// Can be negated
// Length is 0
expect($paymentOptions).to.have.elements.not.present;
```

`count(num, [msg])`

```javascript
// Asserts that it has a specified length
var items = [1, 2, 3];
expect(items).to.have.count(3);
expect(items).to.have.count(5, 'my custom failure message');

// Asserts that a jQuery/Zepto object has a specified length
var $images = $('img');
expect($images).to.have.elements.count(24);
```

**Deprecated** `elementsPresent`, `elementsNotPresent` use `elements.present` and `elements.not.present` instead:

```javascript
// Asserts that there exists such element on page
assert.elementsPresent($emailForm)
expect($emailForm).to.have.elementsPresent()

// Asserts that there are 4 or more such elements
assert.elementsPresent($links, 3)
expect($links).to.have.elementsPresent(3)

// The negation
assert.elementsNotPresent($emailForm)
expect($emailForm).to.not.have.elementsPresent()
```

**Deprecated** `elementsEqual`, `elementsNotEqual` use `elements.count` instead:

```javascript
// Asserts that there are exactly 3 of such elements
assert.elementsEqual($images, 3)
expect($images).to.have.elementsEqual(3)

// The negation
assert.elementsNotEqual($images, 3)
expect($images).to.not.have.elementsEqual(3)
```

### Properties

Works with javascript objects.

`properties`

```javascript
// Asserts that this object has the keys 'apple' and 'google'
assert.properties(apps, 'apple', 'google')
expect(apps).to.have.properties('apple', 'google')
```

### Items

Works with a collection of things.

`items([msg])`

```javascript
// Asserts that this collection (e.g. an array) has at least 1 item in it
expect(lists).to.have.items;
expect(lists).to.have.items('my custom failure message');
```

**Deprecated** `hasItems` use `have.items` instead:

```javascript
// Asserts that this collection (e.g. an array) has at least 1 item in it
assert.hasItems(lists)
expect(lists).to.not.be.empty
```
