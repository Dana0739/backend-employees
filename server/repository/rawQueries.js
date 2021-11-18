const Pool = require('pg').Pool;
const options = require('./config').poolOptions;

const pool = new Pool(options);

const getTime = () => pool.query('SELECT NOW() AS "theTime"')
    .then((result, error) => {
        return result ? {status: 200, value: result.rows[0].theTime} : {status: 500, value: error}
    }).catch((error) => {
        return {status: 200, value: error}
    });

module.exports = {getTime};
