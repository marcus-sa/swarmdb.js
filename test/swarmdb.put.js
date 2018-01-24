process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('write a row', function() {
    var tablename = "contacts";
    var tableowner = "f407a6e06520eb9210d8a6a94c8bdf846b0e1c11";

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
        swarmdb.put(tablename, tableowner, [ { "name": "Bertie Basset", "age": 7, "email": "bertie@gmail.com" } ], function (err, result) {
            assert(result === "ok");
            done();
        });
    });
});