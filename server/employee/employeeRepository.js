const conf = require('./config').knexConfig;

const knex = require('knex')(conf);

// CREATE
// add employee
const addEmployee = (name, surname, position, date_of_birth, salary) => knex('employees').insert([
    {
        name,
        surname,
        position,
        date_of_birth,
        salary,
    },
])
    .then(rows => ({status: 200, value: rows}))
    .catch(error => ({status: 500, value: error}));

// add test employee
const addTestEmployee = () => knex('employees').insert([
    {
        name: 'A',
        surname: 'AA',
        position: 'Junior Software Engineer',
        date_of_birth: '1999-03-07',
        salary: 5_000_000,
    },
])
    .then(rows => ({status: 200, value: rows}))
    .catch(error => ({status: 500, value: error}));

// UPDATE
// update employee by id
const updateEmployee = (id, name, surname, position, date_of_birth, salary) => knex('employees').where('id', '=', id).update(
    {
        name,
        surname,
        position,
        date_of_birth,
        salary,
    })
    .then(rows => rows === 1 ? {status: 200, value: 200} : {status: 400, value: 400})
    .catch(error => ({status: 500, value: error}));

// READ
// get all employees
//  filter by: name, surname
//  sort by: salary, order - ASC or DESC
//  paging: 25 elements on page
const getAllEmployeesFilterSort = (name = null, surname = null, isSorted = false,
                                   sortOrder = 'ASC', pageNumber = null) => {
    const query = knex.from('employees').select('*');
    if (name) query.whereRaw(`LOWER(name) = '${name}'`);
    if (surname) query.whereRaw(`LOWER(surname) = '${surname}'`);
    if (isSorted) query.orderBy('salary', sortOrder);
    if (pageNumber === '0' || pageNumber) query.limit(25 * (pageNumber + 1));
    query.offset(pageNumber ? 25 * pageNumber : 0);
    return query.then(rows => ({status: 200, value: rows}))
        .catch(error => ({status: 500, value: error}));
};

// get employee by id
const getEmployeeById = id => knex.from('employees').select('*')
    .where('id', '=', id).first()
    .then(row => ({status: 200, value: row}))
    .catch(error => ({status: 500, value: error}));

// DELETE
// delete employee by id
const deleteEmployee = id => knex('employees').where('id', '=', id).del()
    .then(rows => {
        if (rows === 1) return {status: 200, value: 200};
        if (rows === 0) return {status: 400, value: 400};
        return {status: 500, value: 500};
    })
    .catch(error => ({status: 500, value: error}));

// INITIALISATION STEPS
// setup
const setupTable = () => knex.schema.createTableIfNotExists('employees', table => {
    table.increments(); // Integer id
    table.specificType('name', 'varchar(100) check(length(name) <= 100 and length(name) > 0)').notNullable();
    table.specificType('surname', 'varchar(100) check(length(surname) <= 100 and length(surname) > 0)').notNullable();
    table.enu('position', ['Junior Software Engineer', 'Software Engineer',
        'Senior Software Engineer', 'Lead Software Engineer']).notNullable();
    table.timestamp('date_of_birth').notNullable();
    table.specificType('salary', 'decimal check(salary > 0)').notNullable();
})
    .then(row => ({status: 200, value: row}))
    .catch(error => ({status: 500, value: error}));

// drop
const dropTable = () => knex.schema.dropTableIfExists('employees')
    .then(row => ({status: 200, value: row}))
    .catch(error => ({status: 500, value: error}));

module.exports = {
    setupTable,
    dropTable,
    addEmployee,
    addTestEmployee,
    updateEmployee,
    getEmployeeById,
    deleteEmployee,
    getAllEmployeesFilterSort,
};
