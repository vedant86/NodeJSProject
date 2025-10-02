const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,  // must match SQL login password
    server: process.env.DB_SERVER,               // or IP/hostname
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,                      // fixed TCP port for SQLEXPRESS
    options: {
      encrypt: false,               // for local dev
      trustServerCertificate: true, // allow self-signed cert
      instance: 'NODEPROJECT'
    }
  };

const poolPromise = new sql.ConnectionPool(config)
.connect()
.then(pool=>{
    console.log('Connected to MSSQL');
    return pool;
})
.catch(err=>{
    console.error('Databse connection failure: ',err);
    throw err;
})

module.exports = {
    sql,
    poolPromise
};