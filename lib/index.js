import net from 'net'
import Web3EthAccounts from 'web3-eth-accounts'

let PRIVATE_KEY = process.env.PRIVATE_KEY

class SWARMDB {
  constructor(address, port) {
    this.socket = new net.Socket()
    this.address = address
    this.port = port

    this.init()
  }

  init() {
    this.socket.connect(this.port, this.address, () => {
      console.log(`Connected to: ${this.address} :  ${this.port}`)
    })

    this.socket.on('close', () => {
      console.log('Connection closed')
    })
  }

  createConnection() {
    const that = this
    let flag = false
    const account = new Web3EthAccounts('http://localhost:8545')

    if (!PRIVATE_KEY) {
      throw 'PRIVATE_KEY is empty! Please set PRIVATE_KEY in terminal'
    }

    if (PRIVATE_KEY.length !== 64 && PRIVATE_KEY.length !== 66) {
      throw 'PRIVATE_KEY length is NOT Valid! Please set correct PRIVATE_KEY'
    }

    if (PRIVATE_KEY.length === 64) PRIVATE_KEY = '0x' + PRIVATE_KEY

    return new Promise((resolve, reject) => {
      that.socket.once('data', data => {
        if (!flag) {
          flag = true
          const challengePair = JSON.parse(
            data.toString().replace(/\n|\r/g, '')
          )
          const challenge = challengePair.challenge

          const sig = account.sign(challenge, PRIVATE_KEY)

          const challengeResponse = {
            clientname: 'swarmdb.js',
            clientversion: '0.1.0',
            response: sig.signature.slice(2),
          }

          // console.log(challengeResponse);
          that.socket.write(JSON.stringify(challengeResponse) + '\n')

          resolve()
        }
      })

      that.socket.on('error', err => {
        reject(err)
      })
    })
  }

  sendMessage(message) {
    const that = this

    return new Promise((resolve, reject) => {
      that.socket.write(message)

      that.socket.once('data', data => {
        if (that.parseJSON(data)) {
          const dataJSON = JSON.parse(data)

          if (dataJSON.errorcode) {
            reject(dataJSON)
          } else {
            resolve(data.toString().trim())
          }
        } else {
          resolve(data.toString().trim())
        }
      })

      that.socket.on('error', err => {
        reject(err)
      })
    })
  }

  createDatabase(owner, database, encrypted) {
    const msg =
      JSON.stringify({
        database: database,
        encrypted: encrypted,
        owner: owner,
        requesttype: 'CreateDatabase',
      }) + '\n'

    return this.sendMessage(msg)
  }

  listDatabases(owner) {
    const msg =
      JSON.stringify({
        owner: owner,
        requesttype: 'ListDatabases',
      }) + '\n'

    return this.sendMessage(msg)
  }

  dropDatabase(owner, database) {
    const msg =
      JSON.stringify({
        database: database,
        owner: owner,
        requesttype: 'DropDatabase',
      }) + '\n'

    return this.sendMessage(msg)
  }

  createTable(owner, database, table, columns) {
    const msg =
      JSON.stringify({
        columns: columns,
        database: database,
        owner: owner,
        requesttype: 'CreateTable',
        table: table,
      }) + '\n'

    return this.sendMessage(msg)
  }

  describeTable(owner, database, table) {
    const msg =
      JSON.stringify({
        database: database,
        owner: owner,
        requesttype: 'DescribeTable',
        table: table,
      }) + '\n'

    return this.sendMessage(msg)
  }

  listTables(owner, database) {
    const msg =
      JSON.stringify({
        database: database,
        owner: owner,
        requesttype: 'ListTables',
      }) + '\n'

    return this.sendMessage(msg)
  }

  dropTable(owner, database, table) {
    const msg =
      JSON.stringify({
        database: database,
        owner: owner,
        requesttype: 'DropTable',
        table: table,
      }) + '\n'

    return this.sendMessage(msg)
  }

  get(owner, database, table, key) {
    const msg =
      JSON.stringify({
        columns: null,
        database: database,
        key: key,
        owner: owner,
        requesttype: 'Get',
        table: table,
      }) + '\n'

    return this.sendMessage(msg)
  }

  put(owner, database, table, rows) {
    const msg =
      JSON.stringify({
        columns: null,
        database: database,
        owner: owner,
        requesttype: 'Put',
        rows: rows,
        table: table,
      }) + '\n'

    return this.sendMessage(msg)
  }

  query(owner, database, queryStatement) {
    const msg =
      JSON.stringify({
        Query: queryStatement,
        database: database,
        owner: owner,
        requesttype: 'Query',
      }) + '\n'

    return this.sendMessage(msg)
  }

  parseJSON(jsonString) {
    try {
      const o = JSON.parse(jsonString)

      if (o && typeof o === 'object') {
        return true
      }
    } catch (e) {
      console.error(e)
    }

    return false
  }
}

export default SWARMDB
