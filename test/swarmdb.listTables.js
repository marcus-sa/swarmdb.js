process.env.NODE_ENV = "test";

require("./swarmdb.createTable.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

const { DB_NAME, TABLE_NAME, OWNER } = require('./helper/constants');

describe('list existing tables', function() {
    it('swarmdb.listTables', function (done) {
        swarmdb.listTables(DB_NAME, OWNER, function (err, result) {
            // result: {"data":[{"database":"contacts"}]}
            result = JSON.parse(result);
            assert(result.data[0].database === "contacts");
            done();
        });
    });
});