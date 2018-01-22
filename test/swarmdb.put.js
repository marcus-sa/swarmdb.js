process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('write a row', function() {
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

    it('swarmdb.put', function (done) {
        swarmdb.put(tablename, tableowner, [{"Cells": { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" } }], function (err, result) {
            assert(result === "ok");
            done();
        });
    });
});