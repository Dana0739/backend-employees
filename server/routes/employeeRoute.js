const express = require('express')
const router = express.Router()
const db = require('../repository/rawQueries')
const repository = require('../repository/employeeRepository')
const schemas = require('../utils/schemas')


/* ------------ TEST SECTION ------------ */

/* GET time for testing connection. */
router.get('/database/time', async function (req, res) {
    const time = await db.getTime()
    res.status(time.status).send(time.value)
})

/* KNEX setup for create table. */
router.get('/database/setup', async function (req, res) {
    const result = await repository.setupTable()
    res.status(result.status).send(result.value)
})

/* KNEX add test employee in table. */
router.get('/database/add-test-user', async function (req, res) {
    const result = await repository.addTestEmployee()
    res.status(result.status).send(result.value)
})

/* KNEX drop for drop table. */
router.get('/database/drop', async function (req, res) {
    const result = await repository.dropTable()
    res.status(result.status).send(result.value)
})

/* ------------ TEST SECTION ended ------------ */


/* CRUD for employees */
router.route('/')
    .get(async (req, res) => {
        const request = schemas.schemas.filterSortGET.validate(req.query, {"convert": true})
        let employees
        if (request.error) {
            employees = {status: 422, value: request.error}
        } else {
            let {name, surname, sorted, order, page} = request.value
            if (name) name = name.toLowerCase()
            if (surname) surname = surname.toLowerCase()
            employees = await repository.getAllEmployeesFilterSort(name, surname, sorted, order, page)
        }
        res.status(employees.status).send(employees.value)
    })
    .post(async (req, res) => {
        const request = schemas.schemas.employeePOST.validate(req.body, {"convert": true})
        let employee
        if (request.error) {
            employee = {status: 422, value: request.error}
        } else {
            const {name, surname, position, date_of_birth, salary} = request.value
            employee = await repository.addEmployee(name, surname, position, date_of_birth, salary)
        }
        res.status(employee.status).send(employee.value)
    })

/* CRUD for employee by id */
router.route('/:id')
    .get(async (req, res) => {
        const id = schemas.schemas.byID.validate(req.params, {"convert": true})
        let employee
        if (id.error) {
            employee = {status: 422, value: id.error}
        } else {
            employee = await repository.getEmployeeById(parseInt(id.value.id))
        }
        res.status(employee.status).send(employee.value)
    })
    .post(async (req, res) => {
        const request = schemas.schemas.employeePOST.validate(req.body, {"convert": true})
        const id = schemas.schemas.byID.validate(req.params, {"convert": true})
        let employee
        if (request.error || id.error) {
            employee = {status: 422, value: request.error}
        } else {
            const {name, surname, position, date_of_birth, salary} = request.value
            employee = await repository.updateEmployee(id.value.id, name, surname, position, date_of_birth, salary)
        }
        res.status(employee.status).send(employee.value)
    })
    .delete(async (req, res) => {
        const id = schemas.schemas.byID.validate(req.params, {"convert": true})
        let result
        if (id.error) {
            result = {status: 422, value: id.error}
        } else {
            result = await repository.deleteEmployee(id.value.id)
        }
        res.status(result.status).send(result.value)
    })

module.exports = router
