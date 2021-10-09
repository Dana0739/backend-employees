const knex = require('knex')({
    client: 'pg',
    connection: '',
})

const logErr = (err, res) => {
    if (err.detail && err.detail.startsWith('Failing row contains')) {
        res.status(422).send(err)
    } else {
        res.status(500).send(err)
    }
}

//CREATE
//add employee
const addEmployee = (name, surname, position, date_of_birth, salary, res) => {
    knex('employees').insert([
        {
            name: name,
            surname: surname,
            position: position,
            date_of_birth: date_of_birth,
            salary: salary
        },
    ]).then((rows) => {
        res.send(rows)
    }).catch((err) => {
        logErr(err, res)
    })
}

//add test employee
const addTestEmployee = (req, res) => {
    knex('employees').insert([
        {
            name: 'A',
            surname: 'AA',
            position: 'Junior Software Engineer',
            date_of_birth: '1999-03-07',
            salary: 5000000
        },
    ]).then((rows) => {
        res.send(rows)
    }).catch((err) => {
        logErr(err, res)
    })
}

//UPDATE
//update employee by id
const updateEmployee = (id, name, surname, position, date_of_birth, salary, res) => {
    knex('employees').where('id', '=', id).update(
        {
            name: name,
            surname: surname,
            position: position,
            date_of_birth: date_of_birth,
            salary: salary
        }).then((rows) => {
            rows === 1 ? res.status(200).send() : res.status(500).send
        }).catch((err) => {
            logErr(err, res)
        })
}

//READ
//get all employees
const getAllEmployees = (req, res) => {
    knex('employees')
        .then((rows) => {
            res.send(rows)
        }).catch((err) => {
            logErr(err, res)
        })
}

//get all employees
//  filter by: name, surname
//  sort by: salary, order - ASC or DESC
//  paging: 25 elements on page
const getAllEmployeesFilterSort = (req, res, name = null, surname = null,
                                   isSorted = false, sortOrder = 'ASC', pageNumber = null) => {
    let query = knex.from('employees').select("*")
    if (name) query.where('name', '=', name)
    if (surname) query.where('surname', '=', surname)
    if (isSorted) query.orderBy('salary', sortOrder)
    if (pageNumber === '0' || pageNumber) query.limit(25 * (pageNumber + 1))
    query.offset(pageNumber ? 25 * pageNumber : 0)
    return query.then((rows) => {
            res.send(rows)
        }).catch((err) => {
            logErr(err, res)
        })
}

//get employee by id
const getEmployeeById = (req, res, id) => {
    knex.from('employees').select("*").where('id', '=', id)
        .then((rows) => {
            res.send(rows)
        }).catch((err) => {
            logErr(err, res)
        })
}

//DELETE
//delete employee by id
const deleteEmployee = (req, res, id) => {
    knex('employees').where('id', '=', id).del()
        .then((rows) => {
            rows === 1 ? res.status(200).send() : res.status(500).send
        })
        .catch((err) => {
            logErr(err, res)
        })
}

//INITIALISATION STEPS
//setup
const setupTable = (req, res) => {
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
            res.send(rows)
        }).catch((err) => {
            logErr(err, res)
        })
}

//drop
const dropTable = (req, res) => {
    knex.schema.dropTableIfExists("employees")
        .then((rows) => {
            res.send(rows)
        }).catch((err) => {
            logErr(err, res)
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
    getAllEmployeesFilterSort,
    logErr
}
