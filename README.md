# SWARMDB JavaScript API

This is a client library for the SWARMDB API, implemented in JavaScript. It's available on npm as a node module.

You need to run a SWARMDB node with local Ethereum environment to use this library.

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
var swarmdb = require("swarmdb.js");
```

## Open connection
Open a connection by specifying configuration options like host and port
> `swarmdb.createConnection(options)`
```javascript
var connection = swarmdb.createConnection({
    host: SWARMDB_HOST, //e.g. "localhost"
    port: SWARMDB_PORT  //e.g. 2000
});
```

## Create table
Create a table by specifying table name, table owner and column details.
Table owner is usually an account address.
> `connection.createTable(table, tableowner, columns, callback)`
```javascript
var tableowner = "0x1234567890123456789012345678901234567890";
var columns = [
    { "indextype": 2, "columnname": "email", "columntype": 2, "primary": 1 },
    { "indextype": 2, "columnname": "name", "columntype": 2, "primary": 0 },
    { "indextype": 1, "columnname": "age", "columntype": 1, "primary": 0 }
];
connection.createTable("contacts", tableowner, columns, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Read / Get / Select
Read a row from SWARMDB
> `connection.get(table, tableowner, key, callback)`
```javascript
var tableowner = "0x1234567890123456789012345678901234567890";
connection.get("contacts", tableowner, "bertie@gmail.com", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

> `connection.query(sqlQuery, tableowner, callback)`
```javascript
var tableowner = "0x1234567890123456789012345678901234567890";
connection.query("SELECT email, name, age FROM contacts WHERE email = 'bertie@gmail.com'", tableowner, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Write / Put
Write a row to SWARMDB
> `connection.put(table, tableowner, row, callback)`
```javascript
var tableowner = "0x1234567890123456789012345678901234567890";
connection.put("contacts", tableowner, [{"Cells": { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" }}],  function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```