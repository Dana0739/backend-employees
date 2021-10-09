const express = require('express')
const router = express.Router()
const db = require('../repository/rawQueries')
const knex = require('../repository/employeeRepository')
const manager = require('../manager/employeeManager')


/* ------------ TEST SECTION ------------ */

/* GET time for testing connection. */
router.get('/time', function(req, res, next) {
    db.getTime(req, res)
})

/* KNEX setup for create table. */
router.get('/knex/setup', function(req, res, next) {
    knex.setupTable(req, res)
})

/* KNEX add test employee in table. */
router.get('/knex/add', function(req, res, next) {
    knex.addTestEmployee(req, res)
})

/* KNEX drop for drop table. */
router.get('/knex/drop', function(req, res, next) {
    knex.dropTable(req, res)
})

/* ------------ TEST SECTION ended ------------ */




/* CRUD for employees */
router.route('/')
    .get((req, res) => {
        manager.getAllEmployees(req, res)
    })
    .post((req, res) => {
        manager.saveEmployee(req, res)
    })

/* CRUD for employee by id */
router.route('/:id')
    .get((req, res) => {
        manager.getEmployeeById(req, res)
    })
    .post((req, res) => {
        manager.saveEmployee(req, res, true)
    })
    .delete((req, res) => {
        manager.deleteEmployee(req, res)
    })

module.exports = router
