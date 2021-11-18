const Pool = require('pg').Pool
const pool = new Pool({
    user: 'aqjztqzq',
    host: 'hattie.db.elephantsql.com',
    database: 'aqjztqzq',
    password: 'rllzXLIuLPaw7G9tXU7_BzLW4MmwN9_U',
    port: '',
})

const getTime = () => {
    return pool.query('SELECT NOW() AS "theTime"').then((result, error) => {
        return result ? {status: 200, value: result.rows[0].theTime} : {status: 200, value: error}
    }).catch((error) => {
        return {status: 200, value: error}
    })
}

module.exports = { getTime }
