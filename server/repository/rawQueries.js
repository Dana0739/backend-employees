const repository = require('../repository/employeeRepository')

const Pool = require('pg').Pool
const pool = new Pool({
    user: '',
    host: 'hattie.db.elephantsql.com',
    database: '',
    password: '',
    port: '',
})

const getTime = (request, response) => {
    pool.query('SELECT NOW() AS "theTime"', (error, result) => {
        if (error) {
            repository.logErr(error, response)
        } else {
            console.log(result.rows[0].theTime)
            response.status(200).json(result.rows[0].theTime)
        }
    })
}

module.exports = {
    getTime
}
