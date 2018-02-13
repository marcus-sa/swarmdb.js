var swarmdbAPI = require("swarmdb.js");
// var swarmdbAPI = require("../index.js");

var swarmdb = new swarmdbAPI.createConnection({
    host: "localhost",
    port: 2001
});

var owner = "test.eth";
var dbname = "testdb";
var tablename1 = "contacts";
var tablename2 = "addresses";

// create database
console.time('createDatabase took');
swarmdb.createDatabase(owner, dbname, 1, function (err, result) {
    err ? console.log("create database error: " + err) : console.log("create database response: " + result);    
    console.timeEnd('createDatabase took');
    console.log("\n");
});


// list databases
console.time('listDatabases took');
swarmdb.listDatabases(function (err, result) {
    err ? console.log("list database error: " + err) : console.log("list database response: " + result);
    console.timeEnd('listDatabases took');
    console.log("\n");
});

// create contacts table
var columns = [
    { "indextype": "BPLUS", "columnname": "email", "columntype": "STRING", "primary": 1 },
    { "indextype": "BPLUS", "columnname": "age", "columntype": "INTEGER", "primary": 0 }
];
console.time('contacts createTable took');
swarmdb.createTable(tablename1, columns, function (err, result) {
    err ? console.log("create contacts table error: " + err) : console.log("create contacts table response: " + result);
    console.timeEnd('contacts createTable took');
    console.log("\n");
});

// describe contacts table
console.time('contacts describeTable took');
swarmdb.describeTable(tablename1, function (err, result) {
    err ? console.log("describe contacts table error: " + err) : console.log("describe contacts table response: " + result);
    console.timeEnd('contacts describeTable took');
    console.log("\n");
});

// contacts put 1
console.time('contacts put 1 took');
swarmdb.put( [ {"age":1,"email":"test001@wolk.com"}, {"age":2,"email":"test002@wolk.com"} ], function (err, result) {
    err ? console.log("contacts put 1 error: " + err) : console.log("contacts put 1 response: " + result);
    console.timeEnd('contacts put 1 took');
    console.log("\n");
});

// contacts insert
console.time('contacts insert query took');
swarmdb.query("insert into contacts (email, age) values ('test004@wolk.com', 4)", function (err, result) {
    err ? console.log("contacts insert error: " + err) : console.log("contacts insert response: " + result);
    console.timeEnd('contacts insert query took');
    console.log("\n");
});

// contacts update
console.time('contacts update query took');
swarmdb.query("update contacts set age=8 where email='test001@wolk.com'", function (err, result) {
    err ? console.log("contacts update error: " + err) : console.log("contacts update response: " + result);
    console.timeEnd('contacts update query took');
    console.log("\n");
});

// contacts get 1
console.time('contacts get 1 took');
swarmdb.get( "test001@wolk.com", function (err, result) {
    err ? console.log("contacts get 1 error: " + err) : console.log("contacts get 1 response: " + result);
    console.timeEnd('contacts get 1 took');
    console.log("\n");
});

// create addresses table
columns = [
    { "indextype": "BPLUS", "columnname": "email", "columntype": "STRING", "primary": 1 },
    { "indextype": "BPLUS", "columnname": "address", "columntype": "STRING", "primary": 0 }
];
console.time('addresses createTable took');
swarmdb.createTable(tablename2, columns, function (err, result) {
    err ? console.log("create addresses table error: " + err) : console.log("create addresses table response: " + result);
    console.timeEnd('addresses createTable took');
    console.log("\n");
});

// addresses put
console.time('addresses put took');
swarmdb.put( [ {"email":"test1@wolk.com", "address":"San Mateo, CA"} ], function (err, result) {
    err ? console.log("addresses put error: " + err) : console.log("addresses put response: " + result);
    console.timeEnd('addresses put took');
    console.log("\n");
});

// addresses get
console.time('addresses get took');
swarmdb.get("test1@wolk.com", function (err, result) {
    if (err) throw err;
    err ? console.log("addresses get error: " + err) : console.log("addresses get response: " + result);
    console.timeEnd('addresses get took');
    console.log("\n");
});

// switch table back to contacts
swarmdb.openTable(tablename1);

// contacts put 2
console.time('contacts put 2 took');
swarmdb.put( [ {"age":3,"email":"test003@wolk.com"} ], function (err, result) {
    err ? console.log("contacts put 2 error: " + err) : console.log("contacts put 2 response: " + result);
    console.timeEnd('contacts put 2 took');
    console.log("\n");
});

// contacts get 2
console.time('contacts get 2 took');
swarmdb.get("test003@wolk.com", function (err, result) {
    err ? console.log("contacts get 2 error: " + err) : console.log("contacts get 2 response: " + result);
    console.timeEnd('contacts get 2 took');
    console.log("\n");
});

// contacts select
console.time('contacts select query 1 took');
swarmdb.query("select email, age from contacts where email = 'test002@wolk.com'", function (err, result) {
    err ? console.log("contacts select 1 error: " + err) : console.log("contacts select 1 response: " + result);
    console.timeEnd('contacts select query 1 took');
    console.log("\n");
});

console.time('contacts select query 2 took');
swarmdb.query("select email, age from contacts where age >= 2", function (err, result) {
    err ? console.log("contacts select 2 error: " + err) : console.log("contacts select 2 response: " + result);
    console.timeEnd('contacts select query 2 took');
    console.log("\n");
});

// list tables
console.time('listTables took');
swarmdb.listTables(function (err, result) {
    err ? console.log("list tables error: " + err) : console.log("list tables response: " + result);
    console.timeEnd('listTables took');
    console.log("\n");
});

// drop table
console.time('dropTable took');
swarmdb.dropTable(tablename1, function (err, result) {
    err ? console.log("drop contacts table error: " + err) : console.log("dtop contacts table response: " + result);
    console.timeEnd('dropTable took');
    console.log("\n");
});

// drop database
console.time('dropDatabase took');
swarmdb.dropDatabase(owner, dbname, function (err, result) {
    err ? console.log("drop testdb database error: " + err) : console.log("drop testdb database response: " + result);
    console.timeEnd('dropDatabase took');
});