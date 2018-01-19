# SWARMDB JavaScript API

[![Join the chat at https://gitter.im/wolktoken/swarmdb.js](https://badges.gitter.im/wolktoken/swarmdb.js.svg)](https://gitter.im/wolktoken/swarmdb.js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

This is a client library for the SWARMDB API, implemented in JavaScript. It's available on npm as a node module.

You need to run a [SWARMDB node](https://github.com/wolktoken/swarm.wolk.com) (which will be released soon) with local Ethereum environment to use this library.

*Please note* that the library is still under heavy development and it might not be stable.

## Install
```bash
> npm install swarmdb.js
```

## Configure
Set the private key as an environment variable. Private key must start with "0x".
```bash
> export PRIVATE_KEY=0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

## Import module
```javascript
var swarmdbAPI = require("swarmdb.js");
```

## Open connection
Open a connection by specifying configuration options like host and port
> `swarmdbAPI.createConnection(options)`
```javascript
var swarmdb = swarmdbAPI.createConnection({
    host: SWARMDB_HOST, //e.g. "localhost"
    port: SWARMDB_PORT  //e.g. 2000
});
```

## Create table
Create a table by specifying table name, table owner and column details.
Table owner is usually an account address.
> `swarmdb.createTable(table, tableowner, columns, callback)`
```javascript
var tableowner = "0x1234567890123456789012345678901234567890";
var columns = [
    { "indextype": 2, "columnname": "email", "columntype": 2, "primary": 1 },
    { "indextype": 2, "columnname": "name", "columntype": 2, "primary": 0 },
    { "indextype": 1, "columnname": "age", "columntype": 1, "primary": 0 }
];
swarmdb.createTable("contacts", tableowner, columns, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Read / Get / Select
Read a row from SWARMDB
> `swarmdb.get(table, tableowner, key, callback)`
```javascript
var tableowner = "0x1234567890123456789012345678901234567890";
swarmdb.get("contacts", tableowner, "bertie@gmail.com", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

> `swarmdb.query(sqlQuery, tableowner, callback)`
```javascript
var tableowner = "0x1234567890123456789012345678901234567890";
swarmdb.query("SELECT email, name, age FROM contacts WHERE email = 'bertie@gmail.com'", tableowner, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Write / Put
Write a row to SWARMDB
> `swarmdb.put(table, tableowner, row, callback)`
```javascript
var tableowner = "0x1234567890123456789012345678901234567890";
swarmdb.put("contacts", tableowner, [{"Cells": { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" }}],  function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Run tests
Make sure the private key is configured before running the tests
```bash
> npm test
```

## Feedback / Question
Email us at [support@wolk.com](mailto:support@wolk.com)