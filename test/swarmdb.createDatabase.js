process.env.NODE_ENV = "test";

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('create a database', function() {
    it('swarmdb.createDatabase', function (done) {
        var dbname = "testdb21";
        var owner = "test21.eth";

        swarmdb.createDatabase(dbname, owner, 1, function (err, result) {
            assert(result === "ok");
            done();
        });
    });
});