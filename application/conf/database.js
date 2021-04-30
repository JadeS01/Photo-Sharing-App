const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "SOmething44school?#",
    database: "csc317db",
    connectionLimit: 50,
    waitForConnections: true,
    debug: false,
});

// module.exports = pool;
// need these bottom two for login redirect
const promisePool = pool.promise();
module.exports = promisePool;