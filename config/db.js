const sql = require('mssql');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,  
    server: process.env.DB_SERVER,               
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,                      
    options: {
      encrypt: false,               
      trustServerCertificate: true,
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
