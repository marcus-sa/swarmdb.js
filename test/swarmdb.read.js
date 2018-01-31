process.env.NODE_ENV = "test";

require("./swarmdb.write.js");

var assert = require('assert');
var swarmdb = require('./helper/client');

describe('read a row', function() {
    var dbname = "testdb21";
    var tablename = "contacts";
    var owner = "test21.eth";

    it('swarmdb.get', function (done) {
        swarmdb.get(dbname, tablename, owner, "bertie@gmail.com", function (err, result) {
            result = JSON.parse(result);
            assert(result.email === "bertie@gmail.com");
            assert(result.name === "Bertie Basset");
            assert(result.age === 7);
            done();
        });
    });

    /*
    it('swarmdb.select', function (done) {
        var query = "select email, age, name from contacts where email = 'paul@gmail.com'";
        swarmdb.query(query, dbname, owner, function (err, result) {
            result = JSON.parse(result);
            assert(result.email === "paul@gmail.com");
            assert(result.name === "Paul");
            assert(result.age === 8);
            done();
        });
    });
    */
});