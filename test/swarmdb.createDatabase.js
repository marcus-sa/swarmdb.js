process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

const { OWNER, DB_NAME } = require('./helper/constants');

describe('create a database', function() {
    it('swarmdb.createDatabase', function (done) {
        swarmdb.createDatabase(OWNER, DB_NAME, 1, function (err, result) {
            // result: {"affectedrowcount":1}
            result = JSON.parse(result);
            assert(result.affectedrowcount === 1);
            done();
        });
    });
});