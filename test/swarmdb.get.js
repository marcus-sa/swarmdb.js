process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('read a row', function() {
    var tablename = "contacts";
    var tableowner = "9982ad7bfbe62567287dafec879d20687e4b76f5";

    before(function(done) {
        var columns = [
            { "indextype": 2, "columnname": "email", "columntype": 2, "primary": 1 },
            { "indextype": 2, "columnname": "name", "columntype": 2, "primary": 0 },
            { "indextype": 1, "columnname": "age", "columntype": 1, "primary": 0 }
        ];
        swarmdb.createTable(tablename, columns, function () {
            done();
        });
    });

    before(function(done) {
        swarmdb.put(tablename, tableowner, [{"Cells": { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" } }], function () {
            done();
        });
    });

    it('swarmdb.get', function (done) {
        swarmdb.get(tablename, tableowner, "bertie@gmail.com", function (err, result) {
            result = JSON.parse(result);
            assert(result.email === "bertie@gmail.com");
            assert(result.name === "Bertie Basset");
            assert(result.age === 7);
            done();
        });
    });

    it('swarmdb.query', function (done) {
        var query = "select email, age, name from contacts where email = 'bertie@gmail.com'";
        swarmdb.query(query, tableowner, function (err, result) {
            result = JSON.parse(result);
            assert(result.email === "bertie@gmail.com");
            assert(result.name === "Bertie Basset");
            assert(result.age === 7);
            done();
        });
    });
});