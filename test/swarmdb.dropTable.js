process.env.NODE_ENV = "test";

require("./swarmdb.read.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

const { TABLE_NAME } = require('./helper/constants');

describe('drop a table', function() {
    it('swarmdb.dropTable', function (done) {
        swarmdb.dropTable(TABLE_NAME, function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });
});