const mysql = require('mysql2');
require('dotenv').config(); 

//* connecting with mySQL
const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    password: process.env.MYSQL_PASSWORD
});

const promisePool = pool.promise();

const isArrayEmpty = (array) => {
    if(Array.isArray(array) && array.length === 0) {
        return true;
    } else {
        return false;
    }
}

// Экспорт пула и функции закрытия
module.exports = { pool, promisePool, isArrayEmpty };