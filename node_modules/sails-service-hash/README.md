# sails-service-hash

![Build Status](https://img.shields.io/travis/ghaiklor/sails-service-hash.svg)
![Coverage](https://img.shields.io/coveralls/ghaiklor/sails-service-hash.svg)

![Downloads](https://img.shields.io/npm/dm/sails-service-hash.svg)
![Downloads](https://img.shields.io/npm/dt/sails-service-hash.svg)
![npm version](https://img.shields.io/npm/v/sails-service-hash.svg)
![License](https://img.shields.io/npm/l/sails-service-hash.svg)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![dependencies](https://img.shields.io/david/ghaiklor/sails-service-hash.svg)
![dev dependencies](https://img.shields.io/david/dev/ghaiklor/sails-service-hash.svg)

Service for Sails framework with Hash features.

## List of supported hashes

- bcrypt

## Getting Started

Install this module.

```shell
npm install sails-service-hash
```

Then require it in your service and create Hash instance.

```javascript
// api/services/HashService.js
import HashService from 'sails-service-hash';

export default HashService('bcrypt');

// api/controllers/HashController.js
export default {
  compare: function(req, res) {
    let myPasswordInHash = HashService.hashSync('MY_PASSWORD');
    let isCorrectPassword = HashService.compareSync('MY_PASSWORD', myPasswordInHash);
    res.ok(isCorrectPassword);
  }
};
```

## API

Each of Hash instances has 4 methods:

### hash(data, config)

`data` - Plain data that you want to hash.

`config` - Additional configuration for override pre-defined config.

Hash your data and returns Promise.

### hashSync(data, config)

`data` - Plain data that you want to hash.

`config` - Additional configuration for override pre-defined config.

Hash your data in sync mode and returns hash.

### compare(plainData, hash, config)

`plainData` - Plain data that you want to compare with.

`hash` - Hash that was got from hash methods.

`config` - Additional configuration for override pre-defined config.

Compare `plainData` with `hash` and returns Promise.

### compareSync(plainData, hash, config)

`plainData` - Plain data that you want to compare with.

`hash` - Hash that was got from hash methods.

`config` - Additional configuration for override pre-defined config.

Compare `plainData` with `hash` and returns Boolean.

## Examples

### BCryptHash

```javascript
let bcrypt = HashService('bcrypt', {
  saltLength: 10 // Optional argument if you want to specify rounds for of auto-generated salt
});

bcrypt.hash('MY_PASSWORD').then(hash => {
  bcrypt.compare('MY_PASSWORD', hash).then(console.log.bind(console));
});

let hash = bcrypt.hashSync('MY_PASSWORD');
let isEqual = bcrypt.compareSync('MY_PASSWORD', hash);
```

## How to add another hash?

- You MUST inherits from `BaseHash`.

- Your class MUST implement all the methods described above in API section.

## License

The MIT License (MIT)

Copyright (c) 2015 Eugene Obrezkov

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
