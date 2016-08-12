[![Build Status](https://travis-ci.org/gcba-odin/odin.svg?branch=dev)](https://travis-ci.org/gcba-odin/odin) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/a61e5f13c19c43c099202315ce753d71)](https://www.codacy.com/app/ODIN/odin?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gcba-odin/odin&amp;utm_campaign=Badge_Grade) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)

![ODIN](http://imgur.com/y0vcjnk.png)

# ODIN: Open Data INitiative

ODIN is an API first open source DMS (data management system) created to help governments publish and share their data.

It takes in CSV, XLS and XLSX files and exposes them in a paginated REST API. The associated metadata is also available, with search and filter capabilities.

The UI is kept in two separate projects (Angular.js 1.x clients):

1.  [Admin](https://github.com/gcba-odin/odin-admin)
2.  [Frontend](https://github.com/gcba-odin/odin-frontend)

The authentication, ACL, rate-limiting, CORS and related features must be handled by a [Kong](https://getkong.org/) instance.

**ODIN is currently under heavy development, and is not recommended for production use. You are welcome to contribute.**

## Requirements

ODIN is a Node.js app, built on top of the [Sails.js](http://sailsjs.org/) framework.

It uses two databases: a relational one for storing metadata, and a NoSQL database (MongoDB) for storing the file contents. As with any Sails app, you can use whatever relational database you wish, as long as there's a [Waterline](https://github.com/balderdashy/waterline) connector for it. The default is PostgreSQL, and its Waterline connector comes preinstalled.

Currently there's no support for other NoSQL databases.

So, all in all you'll need:

- Node.js 5.12
- A relational database (PostgreSQL 9.5)
- MongoDB 3.2.x

ODIN has not been tested with earlier versions of Node.js and MongoDB.

## How to install

1. Clone the repo

    ``` $ git clone https://github.com/gcba-odin/odin.git ```

2. Install the dependencies

    ```
    $ cd odin
    $ npm install
    ```
3. Start the app

    ``` $ npm start ```

## License

The MIT License (MIT)

Copyright (c) 2016 Buenos Aires City Government

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.