# SWARMDB JavaScript API

This is a client library for the SWARMDB API, implemented in JavaScript. It's available on npm as a node module.

You need to run a SWARMDB node to use this library.

*Please note* that the library is still under heavy development and it might not be stable.

## Install
```bash
> npm install swarmdb.js
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
    host: "localhost",
    port: 2000
});
```

## Create table
Create a table by specifying table name and column details
> `connection.createTable(table, columns, callback)`
```javascript
var columns = [
    { "indextype": 2, "columnname": "email", "columntype": 2, "primary": 1 },
    { "indextype": 2, "columnname": "name", "columntype": 2, "primary": 0 },
    { "indextype": 1, "columnname": "age", "columntype": 1, "primary": 0 }
];
connection.createTable("contacts", columns, function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Read / Get / Select
Read a row from SWARMDB
> `connection.get(table, key, callback)`
```javascript
connection.get("contacts", "bertie@gmail.com", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

> `connection.query(sqlQuery, callback)`
```javascript
connection.query("SELECT email, name, age FROM contacts WHERE email = 'bertie@gmail.com'", function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```

## Write / Put
Write a row to SWARMDB
> `connection.put(table, row, callback)`
```javascript
connection.put("contacts", { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" },  function (err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
});
```