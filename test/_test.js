const SWARMDB = require('./index')
const swarmdb = new SWARMDB('localhost', 2001)

const owner = 'test.eth'
const dbname = 'testdb'
const tablename = 'contacts'

var connection = swarmdb.createConnection()

/* database */
connection
  .then(() => {
    return swarmdb.createDatabase(owner, dbname, 1)
  })
  .then(data => {
    console.log('create database response: ' + data)
    return swarmdb.listDatabases(owner)
  })
  .then(data => {
    console.log('list databases response: ' + data)
  })
  .catch(error => {
    console.log(error)
  })

/* table */
let columns = [
  { indextype: 'BPLUS', columnname: 'email', columntype: 'STRING', primary: 1 },
  { indextype: 'BPLUS', columnname: 'age', columntype: 'INTEGER', primary: 0 },
]

connection
  .then(() => {
    return swarmdb.createTable(owner, dbname, tablename, columns)
  })
  .then(data => {
    console.log('create contacts table response: ' + data)
    return swarmdb.describeTable(owner, dbname, tablename)
  })
  .then(data => {
    console.log('describe contacts table response: ' + data)
  })
  .catch(error => {
    console.log(error)
  })

/* read & write */
connection
  .then(() => {
    return swarmdb.put(owner, dbname, tablename, [
      { age: 1, email: 'test001@wolk.com' },
      { age: 2, email: 'test002@wolk.com' },
    ])
  })
  .then(data => {
    console.log('contacts put response: ' + data)
    return swarmdb.get(owner, dbname, tablename, 'test001@wolk.com')
  })
  .then(data => {
    console.log('contacts get response: ' + data)
    return swarmdb.query(
      owner,
      dbname,
      "select email, age from contacts where email = 'test002@wolk.com'"
    )
  })
  .then(data => {
    console.log('contacts query response: ' + data)
  })
  .catch(error => {
    console.log(error)
  })
