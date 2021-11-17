const knex = require('knex')({
    client: 'pg',
    connection: '',
})

//CREATE
//add employee
const addEmployee = (name, surname, position, date_of_birth, salary) => {
    return new Promise(function (resolve, reject) {
        knex('employees').insert([
            {
                name: name,
                surname: surname,
                position: position,
                date_of_birth: date_of_birth,
                salary: salary
            },
        ])
            .then((rows) => {
                resolve(rows)
            })
            .catch((error) => {
                reject(500, error)
            })
    })
}

//add test employee
const addTestEmployee = () => {
    return new Promise(function (resolve, reject) {
        knex('employees').insert([
            {
                name: 'A',
                surname: 'AA',
                position: 'Junior Software Engineer',
                date_of_birth: '1999-03-07',
                salary: 5000000
            },
        ])
            .then((rows) => {
                resolve(rows)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//UPDATE
//update employee by id
const updateEmployee = (id, name, surname, position, date_of_birth, salary) => {
    return new Promise(function (resolve, reject) {
        knex('employees').where('id', '=', id).update(
            {
                name: name,
                surname: surname,
                position: position,
                date_of_birth: date_of_birth,
                salary: salary
            })
            .then((rows) => {
                rows === 1 ? resolve(200) : reject(500)
            })
            .catch((error) => {
                reject(500, error)
            })
    })
}

//READ
//get all employees
const getAllEmployees = () => {
    return new Promise(function (resolve, reject) {
        knex('employees')
            .then((rows) => {
                resolve(rows)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//get all employees
//  filter by: name, surname
//  sort by: salary, order - ASC or DESC
//  paging: 25 elements on page
const getAllEmployeesFilterSort = (req, name = null, surname = null, isSorted = false,
                                   sortOrder = 'ASC', pageNumber = null) => {
    return new Promise(function (resolve, reject) {
        let query = knex.from('employees').select("*")
        if (name) query.whereRaw(`LOWER(name) = '${name}'`)
        if (surname) query.whereRaw(`LOWER(surname) = '${surname}'`)
        if (isSorted) query.orderBy('salary', sortOrder)
        if (pageNumber === '0' || pageNumber) query.limit(25 * (pageNumber + 1))
        query.offset(pageNumber ? 25 * pageNumber : 0)
        query.then((rows) => {
            resolve(rows)
        })
            .catch((error) => {
                reject(error)
            })
    })
}

//get employee by id
const getEmployeeById = (req, id) => {
    return new Promise(function (resolve, reject) {
        knex.from('employees').select("*").where('id', '=', id)
            .then((rows) => {
                resolve(rows)
            })
            .catch((error) => {
                reject(error)
            })
    })
}

//DELETE
//delete employee by id
const deleteEmployee = (id) => {
    return new Promise(function (resolve, reject) {
        knex('employees').where('id', '=', id).del()
            .then((rows) => {
                if (rows === 1) {
                    resolve(200)
                } else if (rows === 0) {
                    reject(400)
                } else {
                    reject(500)
                }
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            })
    })
}

//INITIALISATION STEPS
//setup
const setupTable = () => {
    return new Promise(function (resolve, reject) {
        knex.schema.createTableIfNotExists('employees', function (table) {
            table.increments() // integer id
            table.specificType('name', 'varchar(100) check(length(name) <= 100 and length(name) > 0)').notNullable()
            table.specificType('surname', 'varchar(100) check(length(surname) <= 100 and length(surname) > 0)').notNullable()
            table.enu('position', ['Junior Software Engineer', 'Software Engineer',
                'Senior Software Engineer', 'Lead Software Engineer']).notNullable()
            table.timestamp('date_of_birth').notNullable()
            table.specificType('salary', 'decimal check(salary > 0)').notNullable()
        })
            .then((rows) => {
                resolve(rows)
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            })
    })
}

//drop
const dropTable = () => {
    return new Promise(function (resolve, reject) {
        knex.schema.dropTableIfExists("employees")
            .then((rows) => {
                resolve(rows)
            })
            .catch((error) => {
                console.log(error)
                reject(error)
            })
    })
}

module.exports = {
    getAllEmployees,
    setupTable,
    dropTable,
    addEmployee,
    addTestEmployee,
    updateEmployee,
    getEmployeeById,
    deleteEmployee,
    getAllEmployeesFilterSort
}
