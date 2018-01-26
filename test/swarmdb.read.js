process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('read a row', function() {
    var tablename = "contacts";
    var tableowner = "f407a6e06520eb9210d8a6a94c8bdf846b0e1c11";

    before(function(done) {
        var columns = [
            { "indextype": 2, "columnname": "email", "columntype": 2, "primary": 1 },
            { "indextype": 2, "columnname": "name", "columntype": 2, "primary": 0 },
            { "indextype": 2, "columnname": "age", "columntype": 1, "primary": 0 }
        ];
        swarmdb.createTable(tablename, columns, function () {
            done();
        });
    });

    before(function(done) {
        swarmdb.put(tablename, tableowner, [ { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" }, { "name": "Paul", "age": 8, "email": "paul@gmail.com" } ], function () {
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

    it('swarmdb.select', function (done) {
        var query = "select email, age, name from contacts where email = 'paul@gmail.com'";
        swarmdb.query(query, tableowner, function (err, result) {
            result = JSON.parse(result);
            assert(result.email === "paul@gmail.com");
            assert(result.name === "Paul");
            assert(result.age === 8);
            done();
        });
    });
});