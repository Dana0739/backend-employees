const Pool = require('pg').Pool
const pool = new Pool({
    user: '',
    host: 'hattie.db.elephantsql.com',
    database: '',
    password: '',
    port: '',
})

const getTime = () => {
    return new Promise(function (resolve, reject) {
        pool.query('SELECT NOW() AS "theTime"').then((result, error) => {
            console.log(error ? error : result.rows[0].theTime)
            result ? resolve(result.rows[0].theTime) : reject(error)
        }).catch((error) => {
            console.log(error)
        })
    })
}

const getTimeCallback = callback => {
    pool.query('SELECT NOW() AS "theTime"').then((result, error) => {
        console.log(error ? error : result.rows[0].theTime)
        callback(error ? error : result.rows[0].theTime)
    }).catch((error) => {
        console.log(error)
        callback(error)
    })
}

module.exports = {
    getTime,
    getTimeCallback
}
