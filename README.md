![ODIN](http://imgur.com/y0vcjnk.png)

# ODIN: Open Data INitiative
[![Build Status](https://travis-ci.org/gcba-odin/odin.svg?branch=dev)](https://travis-ci.org/gcba-odin/odin)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a61e5f13c19c43c099202315ce753d71)](https://www.codacy.com/app/ODIN/odin?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gcba-odin/odin&amp;utm_campaign=Badge_Grade)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://img.shields.io/badge/License-GPL%20v3-blue.svg)
[![Docs](https://img.shields.io/badge/docs-latest-brightgreen.svg?style=flat)](https://gcba-odin.github.io/odin-tech-docs)


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

- Node.js
- A relational database (PostgreSQL 9.5)
- MongoDB 3.2.x

ODIN has not been tested with earlier versions of Node.js and MongoDB.

## How to install

1. Clone the repo

    ``` bash
      $ git clone https://github.com/gcba-odin/odin.git
    ```

2. Install dependencies

    ```bash
      $ cd odin
      $ npm install
    ```

3. Create postgres database. dbname: `odin`, owner: `postgres`, owner password `postgres`

4. Create the file `config/local.js` with the corresponding `config/odin.js` configurations according your needs

5. Start the app

    ``` bash
      $ npm start
    ```

6. To make sure your app server will start back up if it crashes use pm2 `npm install -g pm2`

7. Start the app with `pm2 start app.js -i 0 -- --prod`, where `-i` indicates how many CPUs will use.
For more information read pm2 [docs](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

8. Execute `pm2 startup` to generate the startup script

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

   Note: **Use 0.8.x version**

    ```bash
        1. Download the package from https://github.com/Mashape/kong/releases/tag/0.8.3
        2. sudo apt-get update
        3. sudo apt-get install netcat openssl libpcre3 dnsmasq procps
        4. sudo dpkg -i kong-0.8.3.*.deb
    ```

2. Create the postgres database: db name: `kong`, password `postgres`

3. Move the configuration file `kong.yml` on `/etc/kong`

4. Modify `kong.yml` configurations according needs

5. Load the database dump `sudo -u postgres psql < kong.sql`

6. Start Kong

   ```bash
    $ sudo kong start
   ```

## Troubleshooting

- `sh: 1: node: not found nodejs`: Link node to nodejs. First `whereis nodejs` Then soft link node to nodejs `ln -s [the path of nodejs] /usr/bin/node `
- `fatal error: gssapi/gssapi.h: No such file or directory`: Try installing the Kerberos Development Package: `apt-get install libkrb5-dev`

## Configuration

```javascript
module.exports.odin = {
    baseUrl: 'http://localhost:3000', // --> Url where the api is hosted
    kongHost: 'http://kongexample.com', // --> Url where kong is hosted
    kongAdmin: 'http://kongexample.com:8001', // --> Kong port to acces configurations

    recaptchaSecret: 'GoogleRecaptchaSecretForTheAdminHere',

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
    statisticsPath: 'stats', // -->Path where the statistics will be saved each month
    backupFolder: 'backups' // --> Folder where the backups will be saved
}
```
