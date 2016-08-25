![ODIN](http://imgur.com/y0vcjnk.png)

# ODIN: Open Data INitiative
[![Build Status](https://travis-ci.org/gcba-odin/odin.svg?branch=dev)](https://travis-ci.org/gcba-odin/odin) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/a61e5f13c19c43c099202315ce753d71)](https://www.codacy.com/app/ODIN/odin?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gcba-odin/odin&amp;utm_campaign=Badge_Grade) [![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)


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

``` bash
  $ git clone https://github.com/gcba-odin/odin.git
```

2. Instalar las dependencias

```bash
  $ cd odin
  $ npm install
```

3. Crear la base de datos en postgres: nombre de la db `odin`, password `postgres`

4. Ajustar las configuraciones de `config/odin.js` según gusto y necesidad

5. Iniciar la app

``` bash
  $ npm start
```

## PostgreSQL
Ubuntu instructions:
```bash
    sudo apt-get update
    sudo apt-get install postgresql postgresql-contrib
```

For more information visit the PostgreSQL [oficial page](https://www.postgresql.org/).

## Kong

1. Install kong according their [web page](https://getkong.org/) instructions (depending on OS)

   Ubuntu instructions:

```bash
    1. Download the package from https://getkong.org/install/ubuntu/#packages
    2. sudo apt-get update
    3. sudo apt-get install netcat openssl libpcre3 dnsmasq procps
    4. sudo dpkg -i kong-0.8.3.*.deb
```

2. Create the postgres database: db name: `kong`, password `postgres`

3. Load the database dump

4. Move the configuration file `kong.yml` on `/etc/kong`

5. Modify `kong.yml` configurations according needs

6. Start  Kong

   ```bash
    $ sudo kong start
   ```

## Configuration

You should override the corresponding settings in the 'local.js' file
```javascript
module.exports.odin = {
    baseUrl: 'http://localhost:3000', // --> Url where the api is hosted
    kongHost: 'http://kongexample.com', // --> Url where kong is hosted
    kongAdmin: 'http://kongexample.com:8001', // --> Kong port to acces configurations

    uploadFolder: 'files', // --> Path to the folder where the datasets files will be stored
    datasetZipFolder: 'datasets', // --> Path where the datasets zips will be stored

    defaultEncoding: 'utf8',
    dataStorage: {  //--> NoSql database host and port
        host: 'localhost',
        port: '27017'
    },
    logFile: 'sailsApp.log', // --> File name and path of the log file
    logFolder: 'logs', // --> Folder where the logs will be saved
    logLevel: 'error', // --> Log level
    statisticsPath: 'stats' // -->Path where the statistics will be saved each month
```

## License

The MIT License (MIT)

Copyright (c) 2016 Buenos Aires City Government

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
