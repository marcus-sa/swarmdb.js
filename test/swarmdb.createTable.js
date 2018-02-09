process.env.NODE_ENV = "test";

require("./swarmdb.listDatabases.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

const { TABLE_NAME } = require('./helper/constants');

describe('create a table', function() {
    it('swarmdb.createTable', function (done) {
        var columns = [
            { "indextype": "BPLUS", "columnname": "email", "columntype": "STRING",  "primary": 1 },
            { "indextype": "HASH",  "columnname": "name",  "columntype": "STRING",  "primary": 0 },
            { "indextype": "BPLUS", "columnname": "age",   "columntype": "INTEGER", "primary": 0 }
        ];
        swarmdb.createTable(TABLE_NAME, columns, function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });
});