const express = require('express')
const router = express.Router()
const db = require('../repository/rawQueries')
const knex = require('../repository/employeeRepository')
const manager = require('../manager/employeeManager')


/* ------------ TEST SECTION ------------ */

/* GET time for testing connection. */
router.get('/time/callback', function(req, res, next) {
    const callback1 = result => {console.log(result)}
    db.getTimeCallback(callback1)

    const callback2 = result => {res.send(result)}
    db.getTimeCallback(callback2)
})

/* GET time for testing connection. */
router.get('/time', function(req, res) {
    db.getTime().then(
        time => {
            res.send(time)
        },
        error => {
            console.log(error)
            res.status(500).send(error)
        }
    )
})

/* KNEX setup for create table. */
router.get('/knex/setup', function(req, res) {
    knex.setupTable().then(
        employees => res.send(employees),
        error => {
            console.log(error)
            res.status(500).send(error)
        }
    )
    res.send(knex.setupTable())
})

/* KNEX add test employee in table. */
router.get('/knex/add', function(req, res) {
    knex.addTestEmployee().then(
        employees => res.send(employees),
        error => {
            console.log(error)
            res.status(500).send(error)
        }
    )
})

/* KNEX drop for drop table. */
router.get('/knex/drop', function(req, res) {
    knex.dropTable().then(
        employees => res.send(employees),
        error => {
            console.log(error)
            res.status(500).send(error)
        }
    )
})

/* ------------ TEST SECTION ended ------------ */



/* CRUD for employees */
router.route('/')
    .get((req, res) => {
        manager.getAllEmployees(req).then(
            employees => res.send(employees),
            error => {
                console.log(error.status, error.value)
                res.status(error.status).send(error.value)
            }
        )
    })
    .post((req, res) => {
        manager.saveEmployee(req).then(
            employee => res.send(employee),
            error => {
                console.log(error.status, error.value)
                res.status(error.status).send(error.value)
            }
        )
    })

/* CRUD for employee by id */
router.route('/:id')
    .get((req, res) => {
        manager.getEmployeeById(req).then(
            employee => res.send(employee),
            error => {
                console.log(error)
                res.status(500).send(error)
            }
        )
    })
    .post((req, res) => {
        manager.saveEmployee(req,true).then(
            employee => res.send(employee),
            error => {
                console.log(error.status, error.value)
                res.status(error.status).send(error.value)
            }
        )
    })
    .delete((req, res) => {
        manager.deleteEmployee(req).then(
            status => res.send(status),
            error => {
                console.log(error)
                error === 500 || error === 400 ? res.status(error).send() : res.status(500).send(error)
            }
        )
    })

module.exports = router
