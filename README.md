# ![ODIN](http://imgur.com/y0vcjnk.png)

# ODIN: Open Data INitiative
[![Build Status](https://travis-ci.org/gcba-odin/odin.svg?branch=dev)](https://travis-ci.org/gcba-odin/odin)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/a61e5f13c19c43c099202315ce753d71)](https://www.codacy.com/app/ODIN/odin?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=gcba-odin/odin&amp;utm_campaign=Badge_Grade)
[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://img.shields.io/badge/License-GPL%20v3-blue.svg)
[![Docs](https://img.shields.io/badge/docs-latest-brightgreen.svg?style=flat)](https://gcba-odin.github.io/odin-tech-docs)


Documentación en [Español](#Español)
[Inglés](#Inglés) Documentation

## Inglés

ODIN is an API first open source DMS (data management system) created to help governments publish and share their data.

It takes in CSV, XLS and XLSX files and exposes them in a paginated REST API. The associated metadata is also available, with search and filter capabilities.

The UI is kept in two separate projects (Angular.js 1.x clients):

1.  [Admin](https://github.com/gcba-odin/odin-admin)
2.  [Frontend](https://github.com/gcba-odin/odin-frontend)

The authentication, ACL, rate-limiting, CORS and related features must be handled by a [Kong](https://getkong.org/) instance.


## Requirements

ODIN is a Node.js app, built on top of the [Sails.js](http://sailsjs.org/) framework.

It uses two databases: a relational one for storing metadata, and a NoSQL database (MongoDB) for storing the file contents. As with any Sails app, you can use whatever relational database you wish, as long as there's a [Waterline](https://github.com/balderdashy/waterline) connector for it. The default is PostgreSQL, and its Waterline connector comes preinstalled.

Currently there's no support for other NoSQL databases.

So, all in all you'll need:

- Node.js >= 4.5.x
- Npm >= 3.10.x
- A relational database (PostgreSQL 9.5)
- MongoDB >= 3.2.x

ODIN has not been tested with earlier versions of Node.js and MongoDB.

## How to install
## Kong
1. Install kong according their [web page](https://getkong.org/) instructions (depending on OS)
 Note: **Use 0.8.x version**

 Ubuntu instructions:

```bash
        1. Download the package from https://github.com/Mashape/kong/releases/tag/0.8.3
        2. sudo apt-get update
        3. sudo apt-get install netcat openssl libpcre3 dnsmasq procps
        4. sudo dpkg -i kong-0.8.3.*.deb
```

Redhat instructions:
```bash
        1. Download the package from https://github.com/Mashape/kong/releases/tag/0.8.3
        2. Execute the following command: ``EL_VERSION=`cat /etc/redhat-release | grep -oE '[0-9]+\.[0-9]+'` && \ sudo yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-${EL_VERSION%.*}.noarch.rpm``
        3. Install Kong `sudo yum install kong-0.8.3.el7.noarch.rpm --nogpgcheck`
```

2. Create the postgres database: db name: `kong`
3. Move the configuration file `odin/etc/kong.yml` on `/etc/kong`

4. Modify `kong.yml` configurations according needs
  - Line 102 to line 113, with kong database parameters
  - Line 244 with the path to mime.types file(odin/etc/mime.types)
  - Line 313 with odin-frontend path (odin-frontend/dist)
  - Line 387 with odin-admin path (odin-admin/dist)

5. Open the file `/usr/local/share/lua/5.1/kong/plugins/jwt/handler.lua` and modify line 61, replace the content with `ngx.redirect("/")`; line 60 to 62 should look like:
```
  if not token then
      ngx.redirect("/")
   end
```

6. Load the database dump `odin/etc/kong_9.4.sql`
7. Start Kong
```bash
    $ sudo kong start
```

## Odin
1. Clone the repo

``` bash
      $ git clone https://github.com/gcba-odin/odin.git
```

2. Install dependencies.  **npm >= 3.10.x**

```bash
      $ cd odin
      $ npm install
```

3. Create Odin postgres database.

4. Create the file `config/local.js` with the corresponding `config/odin.js` configurations according your needs

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
};
module.exports.email = {
  service: 'Gmail',
  auth: {user: 'account@gmail.com', pass: 'accountpassword'},
  alwaysSendTo: 'account@gmail.com',
  testMode: false,
  templateDir: 'api/views'
};

module.exports.connections = {
    postgres: {
        adapter: 'sails-postgresql',
        database: 'odin',
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        port: 5432,
        pool: false,
        ssl: false
    }
};
```

5. Start the app
``` bash
      npm start
```

6. Install sails-migrations `sudo npm install -g sails-migrations`
7. Migrate databse `sails-migrations migrate`
8. To make sure your app server will start back up if it crashes use pm2 `npm install -g pm2`
9. Start the app with `pm2 start process.json`. For more information read pm2 [docs](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)
10. Execute `pm2 save` and `pm2 startup` to generate the startup script

## Troubleshooting
- `sh: 1: node: not found nodejs`: Link node to nodejs. First `whereis nodejs` Then soft link node to nodejs `ln -s [the path of nodejs] /usr/bin/node `
- `fatal error: gssapi/gssapi.h: No such file or directory`: Try installing the Kerberos Development Package: `apt-get install libkrb5-dev`
- If g++ compiler is not installed, execute the following command: `yum groupinstall 'Development Tools'`
```bash
  $ cd /tmp && wget http://unicode.org/Public/UNIDATA/UnicodeData.txt
   $ export NODE_UNICODETABLE_UNICODEDATA_TXT=/tmp/UnicodeData.txt
   $ cd asi-75-odin-api/source
   $ npm install
```

## Español

ODIN is an API first open source DMS (data management system) created to help governments publish and share their data.

It takes in CSV, XLS and XLSX files and exposes them in a paginated REST API. The associated metadata is also available, with search and filter capabilities.

The UI is kept in two separate projects (Angular.js 1.x clients):

1.  [Admin](https://github.com/gcba-odin/odin-admin)
2.  [Frontend](https://github.com/gcba-odin/odin-frontend)

The authentication, ACL, rate-limiting, CORS and related features must be handled by a [Kong](https://getkong.org/) instance.


## Requerimientos

ODIN es una aplicación creada en Node.js, sobre el framework [Sails.js](http://sailsjs.org/).

Usa dos bases de datos: Una base de datos relacional para guardar metadata, y una base de datos NoSQL para almacenar el contenido de los archivos. Como en cualquier aplicación Sails, es posible usar cualquier base de datos relacional, siempre y cuando exista un conector [Waterline](https://github.com/balderdashy/waterline) para dicha base.

Actualmente no se cuenta con soporte para otra base de datos NoSQL.

Todo lo que se necesita:

- Node.js >= 4.5.x
- Npm >= 3.10.x
- Base de datos relacional (PostgreSQL 9.5)
- MongoDB >= 3.2.x

ODIN no fue probada con versiones anteriores de Node.js y MongoDB

## Como instalar
## Kong
1. Instalar [kong](https://getkong.org/) siguiendo sus instrucciones (dependiendo del SO)
 Note: **Use 0.8.x version**

 Instrucciones para Ubuntu:

```bash
        1. Descargar el paquete desde https://github.com/Mashape/kong/releases/tag/0.8.3
        2. sudo apt-get update
        3. sudo apt-get install netcat openssl libpcre3 dnsmasq procps
        4. sudo dpkg -i kong-0.8.3.*.deb
```

Instrucciones para Redhat:
```bash
        1. Descargar el paquete desde https://github.com/Mashape/kong/releases/tag/0.8.3
        2. Ejecutar el siguiente comando: ``EL_VERSION=`cat /etc/redhat-release | grep -oE '[0-9]+\.[0-9]+'` && \ sudo yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-${EL_VERSION%.*}.noarch.rpm``
        3. Instalar Kong `sudo yum install kong-0.8.3.el7.noarch.rpm --nogpgcheck`
```

2. Crear la base de datos en postgres: db name: `kong`
3. Mover el archivo de configuración `odin/etc/kong.yml` a `/etc/kong`

4. Modificar las configuraciones del archivo `kong.yml`
  - Linea 102 a linea 113, con los parametros de la base de datos de kong
  - Linea 244 con la ruta al archivo mime.types (odin/etc/mime.types)
  - Linea 313 con la ruta al repositorio del frontend (odin-frontend/dist)
  - Linea 387 con la ruta al repositorio del admin (odin-admin/dist)

5. Modificar la linea 61 del archivo `/usr/local/share/lua/5.1/kong/plugins/jwt/handler.lua` reemplazando su contenido con `ngx.redirect("/")`; lineas 60 a 62 deberían verse de la siguiente manera:
```
  if not token then
      ngx.redirect("/")
   end
```

6. Cargar el dump de la base de datos de kong `odin/etc/kong_9.4.sql`
7. Iniciar Kong
```bash
    $ sudo kong start
```

## Odin
1. Clonar el repositorio

``` bash
      $ git clone https://github.com/gcba-odin/odin.git
```

2. Instalar las dependencias.  **npm >= 3.10.x**

```bash
      $ cd odin
      $ npm install
```

3. Crear una base de datos relacional de ODIN (postgres).

4. Crear el archivo `odin/config/local.js` con las configuraciones correspondientes de `config/odin.js` basado en sus necesidades

```javascript
module.exports.odin = {
    baseUrl: 'http://localhost:3000', // --> Url donde la api esta hosteada
    kongHost: 'http://kongexample.com', // --> Url donde kong esta hosteado (no modificar si está en el mismo servidor)
    kongAdmin: 'http://kongexample.com:8001', // --> Puerto para acceder a las configuracioens de kong (no modificar si está en el mismo servidor)

    recaptchaSecret: 'GoogleRecaptchaSecretForTheAdminHere',

    uploadFolder: 'files', // --> Ruta donde se guardaran los archivos de los datasets
    datasetZipFolder: 'datasets', // --> Ruta donde se guardaran los zip de los datasets

    defaultEncoding: 'utf8',
    dataStorage: {  //--> Configuracion de MongoDB
        host: 'localhost',  //--> en caso de tener un usuario y contraseña, ingrasar 'username:password@localhost'
        port: '27017'
    },
    logFile: 'sailsApp.log', // --> Nombre del archivo de logs
    logFolder: 'logs', // --> Carpeta donde los logs se guardaran
    logLevel: 'error', // --> Nivel de logeo
    statisticsPath: 'stats', // -->Ruta donde las estadisticas de la api se guardaran cada mes
    backupFolder: 'backups' // --> Ruta donde se guardaran los backups
};
module.exports.email = { // --> Configuraciones para el envío de mail
  service: 'Gmail',
  auth: {user: 'account@gmail.com', pass: 'accountpassword'}, // --> Nombre de usuario y contraseña
  alwaysSendTo: 'account@gmail.com',
  testMode: false,
  templateDir: 'api/views'
};

module.exports.connections = { // --> Configuraciones de la base de datos postgres
    postgres: {
        adapter: 'sails-postgresql',
        database: 'odin',
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        port: 5432,
        pool: false,
        ssl: false
    }
};
```

5. Inicia la aplicacion
``` bash
      npm start
```

6. Instalar sails-migrations `sudo npm install -g sails-migrations`
7. Migrar la base de datos `sails-migrations migrate`
8. Para asegurarse de que la aplicacion reinicie en caso de algún problema usaremos pm2 `npm install -g pm2`
9. Iniciar la aplicación con el comando `pm2 start process.json`. Para mas información leer la documentación de [pm2](http://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)
10. Ejecutar `pm2 save` y `pm2 startup` para generar el script de inicio

## Troubleshooting
- `sh: 1: node: not found nodejs`: Linkear node a nodejs. Primero ejecutar `whereis nodejs` luego linkear node a nodejs `ln -s [la ruta de nodejs] /usr/bin/node `
- `fatal error: gssapi/gssapi.h: No such file or directory`: Instalar Kerberos Development Package: `apt-get install libkrb5-dev`
- Si el compilador g++ no está instalado, ejecutar el siguiente comando: `yum groupinstall 'Development Tools'`
```bash
  $ cd /tmp && wget http://unicode.org/Public/UNIDATA/UnicodeData.txt
   $ export NODE_UNICODETABLE_UNICODEDATA_TXT=/tmp/UnicodeData.txt
   $ cd asi-75-odin-api/source
   $ npm install
```
