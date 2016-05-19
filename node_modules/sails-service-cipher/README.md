# sails-service-cipher

![Build Status](https://img.shields.io/travis/ghaiklor/sails-service-cipher.svg)
![Coverage](https://img.shields.io/coveralls/ghaiklor/sails-service-cipher.svg)

![Downloads](https://img.shields.io/npm/dm/sails-service-cipher.svg)
![Downloads](https://img.shields.io/npm/dt/sails-service-cipher.svg)
![npm version](https://img.shields.io/npm/v/sails-service-cipher.svg)
![License](https://img.shields.io/npm/l/sails-service-cipher.svg)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![dependencies](https://img.shields.io/david/ghaiklor/sails-service-cipher.svg)
![dev dependencies](https://img.shields.io/david/dev/ghaiklor/sails-service-cipher.svg)

Service for Sails framework with Cipher features.

## List of supported ciphers

- JSON Web Token

## Getting Started

Install this module.

```shell
npm install sails-service-cipher
```

Then require it in your service and create cipher instance.

```javascript
// api/services/CipherService.js
import CipherService from 'sails-service-cipher';

export default CipherService('jwt');

// api/controllers/CipherController.js
export default {
  cipher: function(req, res) {
    res.ok(CipherService.encodeSync('DATA_HERE'));
  }
};
```

## API

Each of Cipher instances has 4 methods:

### encode(data, config)

`data` - Can be any type of data that you need to encode.

`config` - Additional configuration that will mix up to pre-defined config.

Returns Promise.

### encodeSync(data, config)

`data` - Can be any type of data that you need to encode.

`config` - Additional configuration that will mix up to pre-defined config.

Works in sync mode, so it returns encoded data.

### decode(data, config)

`data` - Can be only data that you receive after `encode` or `encodeSync`. Cipher will try to decode this to original state.

`config` - Additional configuration that will mix up to pre-defined config.

Returns Promise.

### decodeSync(data, config)

`data` - Can be only data that you receive after `encode` or `encodeSync`. Cipher will try to decode this to original state.

`config` - Additional configuration that will mix up to pre-defined config.

Works in sync mode, so it returns decoded data.

## Examples

### JwtCipher

```javascript
let jwt = CipherService('jwt', {
  secretKey: '<SECRET_KEY>', // Secret key for signing token
  algorithm: 'HS512', // Algorithm for signing
  expiresInMinutes: 60 * 24 // When this token will be expired
});

jwt.encode('SOME_DATA').then(console.log.bind(console)); // Encode SOME_DATA and print to console
jwt.decode('SOME_JWT_TOKEN').then(console.log.bind(console)); // Decode some token and print to console
console.log(jwt.encodeSync({foo: 'bar'})); // Encode object in sync mode and print to console JWT
console.log(jwt.decodeSync('SOME_JWT_TOKEN')); // Decode JWT and print to console result
```

## How to add another cipher?

- First of all you need to inherits from `BaseCipher`.

- Your class should have 4 methods described above in API section.

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
