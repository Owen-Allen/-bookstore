const { Pool, Client } = require('pg')
//we define the db to connect to here, i set it up for the one on my comp
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'a2_db',
    password: 'asylumofpandas',
    port: 5432,
})
/*
pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})*/
//define the client in the same way
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'a2_db',
    password: 'asylumofpandas',
    port: 5432,
})
//connect with client in same way
client.connect()
//sample query
client.query('select * from student', (err, res) => {
  console.log(res)
  client.end()
})