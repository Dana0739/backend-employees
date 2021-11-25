const express = require('express');

const router = express.Router();
const db = require('../employee/rawQueries');
const repository = require('../employee/employeeRepository');
const schemas = require('../utils/schemas');

module.exports = function (passport) {

    /* GET time for testing connection. */
    router.get('/database/time', async (request, response) => {
        const time = await db.getTime();
        response.status(time.status).send(time.value);
    });

    /* CRUD for employees */
    router.route('/')
        .get(async (request, response) => {
            const params = schemas.schemas.filterSortGET.validate(request.query, {convert: true});
            let employees;
            if (params.error) {
                employees = {status: 422, value: params.error};
            } else {
                let {name, surname, sorted, order, page} = params.value;
                if (name) name = name.toLowerCase();
                if (surname) surname = surname.toLowerCase();
                employees = await repository.getAllEmployeesFilterSort(name, surname, sorted, order, page);
            }
            response.status(employees.status).send(employees.value);
        })
        .post(passport.authenticate('jwt', {session: false}, null),
            async (request, response) => {
                const body = schemas.schemas.employeePOST.validate(request.body, {convert: true});
                let employee;
                if (body.error) {
                    employee = {status: 422, value: body.error};
                } else {
                    const {name, surname, position, date_of_birth, salary} = body.value;
                    employee = await repository.addEmployee(name, surname, position, date_of_birth, salary);
                }

                response.status(employee.status).send(employee.value);
            });

    /* CRUD for employee by id */
    router.route('/:id')
        .get(async (request, response) => {
            const id = schemas.schemas.byID.validate(request.params, {convert: true});
            const employee = id.error
                ? {status: 422, value: id.error}
                : (await repository.getEmployeeById(Number.parseInt(id.value.id)));
            response.status(employee.status).send(employee.value);
        })
        .post(passport.authenticate('jwt', {session: false}, null),
            async (request, response) => {
                const body = schemas.schemas.employeePOST.validate(request.body, {convert: true});
                const id = schemas.schemas.byID.validate(request.params, {convert: true});
                let employee;
                if (body.error || id.error) {
                    employee = {status: 422, value: body.error};
                } else {
                    const {name, surname, position, date_of_birth, salary} = body.value;
                    employee = await repository.updateEmployee(id.value.id, name, surname, position, date_of_birth, salary);
                }
                response.status(employee.status).send(employee.value);
            })
        .delete(passport.authenticate('jwt', {session: false}, null),
            async (request, response) => {
                const id = schemas.schemas.byID.validate(request.params, {convert: true});
                let result = id.error
                    ? {status: 422, value: id.error}
                    : (await repository.deleteEmployee(id.value.id));
                response.status(result.status).send(result.value);
            });

    return router;
}
