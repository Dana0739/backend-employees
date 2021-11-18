const knex = require('knex')({
    client: 'pg',
    connection: 'postgres://aqjztqzq:rllzXLIuLPaw7G9tXU7_BzLW4MmwN9_U@hattie.db.elephantsql.com/aqjztqzq',
})

//CREATE
//add employee
const addEmployee = (name, surname, position, date_of_birth, salary) => {
    return knex('employees').insert([
        {
            name: name,
            surname: surname,
            position: position,
            date_of_birth: date_of_birth,
            salary: salary
        },
    ])
        .then((rows) => {
            return {status: 200, value: rows}
        })
        .catch((error) => {
            return {status: 500, value: error}
        })
}

//add test employee
const addTestEmployee = () => {
    return knex('employees').insert([
        {
            name: 'A',
            surname: 'AA',
            position: 'Junior Software Engineer',
            date_of_birth: '1999-03-07',
            salary: 5000000
        },
    ])
        .then((rows) => {
            return {status: 200, value: rows}
        })
        .catch((error) => {
            return {status: 500, value: error}
        })
}

//UPDATE
//update employee by id
const updateEmployee = (id, name, surname, position, date_of_birth, salary) => {
    return knex('employees').where('id', '=', id).update(
        {
            name: name,
            surname: surname,
            position: position,
            date_of_birth: date_of_birth,
            salary: salary
        })
        .then((rows) => {
            return rows === 1 ? {status: 200, value: 200} : {status: 400, value: 400}
        })
        .catch((error) => {
            return {status: 500, value: error}
        })
}

//READ
//get all employees
//  filter by: name, surname
//  sort by: salary, order - ASC or DESC
//  paging: 25 elements on page
const getAllEmployeesFilterSort = (name = null, surname = null, isSorted = false,
                                   sortOrder = 'ASC', pageNumber = null) => {
    let query = knex.from('employees').select("*")
    if (name) query.whereRaw(`LOWER(name) = '${name}'`)
    if (surname) query.whereRaw(`LOWER(surname) = '${surname}'`)
    if (isSorted) query.orderBy('salary', sortOrder)
    if (pageNumber === '0' || pageNumber) query.limit(25 * (pageNumber + 1))
    query.offset(pageNumber ? 25 * pageNumber : 0)
    return query.then((rows) => {
        return {status: 200, value: rows}
    })
        .catch((error) => {
            return {status: 500, value: error}
        })
}

//get employee by id
const getEmployeeById = (id) => {
    return knex.from('employees').select("*")
        .where('id', '=', id).first()
        .then((row) => {
            return {status: 200, value: row}
        })
        .catch((error) => {
            return {status: 500, value: error}
        })
}

//DELETE
//delete employee by id
const deleteEmployee = (id) => {
    return knex('employees').where('id', '=', id).del()
        .then((rows) => {
            if (rows === 1) {
                return {status: 200, value: 200}
            } else if (rows === 0) {
                return {status: 400, value: 400}
            } else {
                return {status: 500, value: 500}
            }
        })
        .catch((error) => {
            return {status: 500, value: error}
        })
}

//INITIALISATION STEPS
//setup
const setupTable = () => {
    return knex.schema.createTableIfNotExists('employees', function (table) {
        table.increments() // integer id
        table.specificType('name', 'varchar(100) check(length(name) <= 100 and length(name) > 0)').notNullable()
        table.specificType('surname', 'varchar(100) check(length(surname) <= 100 and length(surname) > 0)').notNullable()
        table.enu('position', ['Junior Software Engineer', 'Software Engineer',
            'Senior Software Engineer', 'Lead Software Engineer']).notNullable()
        table.timestamp('date_of_birth').notNullable()
        table.specificType('salary', 'decimal check(salary > 0)').notNullable()
    })
        .then((row) => {
            return {status: 200, value: row}
        })
        .catch((error) => {
            return {status: 500, value: error}
        })
}

//drop
const dropTable = () => {
    return knex.schema.dropTableIfExists("employees")
        .then((row) => {
            return {status: 200, value: row}
        })
        .catch((error) => {
            return {status: 500, value: error}
        })
}

module.exports = {
    setupTable,
    dropTable,
    addEmployee,
    addTestEmployee,
    updateEmployee,
    getEmployeeById,
    deleteEmployee,
    getAllEmployeesFilterSort
}
