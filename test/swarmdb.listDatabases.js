process.env.NODE_ENV = "test";

require("./swarmdb.createDatabase.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('list existing databases', function() {
    it('swarmdb.listDatabases', function (done) {
        swarmdb.listDatabases(function (err, result) {
            // result: {"data":[{"database":"testdb"}]}
            result = JSON.parse(result);
            assert(result.data[0].database === "testdb");
            done();
        });
    });
});