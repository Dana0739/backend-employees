const repository = require('../repository/employeeRepository')
const schemas = require('../utils/schemas');

//CREATE UPDATE
//save employee
const saveEmployee = (req, id = false) => {
    return new Promise(function (resolve, reject) {
        const result = schemas.schemas.employeePOST.validate(req.body, {"convert": true})
        if (result.error) {
            reject({status : 422, value : result.error})
        }
        else {
            const {name, surname, position, date_of_birth, salary} = result.value
            if (!id) {
                repository.addEmployee(name, surname, position, date_of_birth, salary).then(
                    (result, error) => {
                        result ? resolve(result) : reject({status : 500, value : error})
                    })
                    .catch((error) => {
                        reject({status : 500, value : error})
                    })
            } else {
                id = parseInt(req.params.id)
                repository.updateEmployee(id, name, surname, position, date_of_birth, salary).then(
                    (result, error) => {
                        result ? resolve(result) : reject({status : 500, value : error})
                    })
                    .catch((error) => {
                        reject({status : 500, value : error})
                    })
            }
        }
    })
}

const notMentionedBoolean = (param) => {
    return param === 'false' || !param
}

const checkIfSimpleGetAllEmployees = (req) => {
    return !req.query.name && !req.query.surname && notMentionedBoolean(req.query.sorted) && !req.query.order && !req.query.page
}


//READ
//get all employees
const getAllEmployees = (req) => {
    return new Promise(function (resolve, reject) {
        if (checkIfSimpleGetAllEmployees(req)) {
            repository.getAllEmployees(req).then(
                (result, error) => {
                    result ? resolve(result) : reject(error)
                })
                .catch((error) => {
                    reject(error)
                })
        } else {
            const result = schemas.schemas.filterSortGET.validate(req.query, {"convert": true})
            if (result.error) {
                reject({status : 422, value : result.error})
            } else {
                const {name, surname, sorted, order, page} = result.value
                repository.getAllEmployeesFilterSort(req, name.toLowerCase(), surname.toLowerCase(), sorted, order, page)
                    .then((result, error) => {
                        result ? resolve(result) : reject({status : 500, value : error})
                    })
                    .catch((error) => {
                        reject({status : 500, value : error})
                    })
            }
        }
    })
}

//get employee by id
const getEmployeeById = (req) => {
    return new Promise(function (resolve, reject) {
        repository.getEmployeeById(req, parseInt(req.params.id)).then(
            (result, error) => {
                console.log(error ? error : result)
                result ? resolve(result) : reject(error)
            })
            .catch((error) => {
                console.log(error)
            })
    })
}


//DELETE
//delete employee by id
const deleteEmployee = (req) => {
    return repository.deleteEmployee(parseInt(req.params.id))
}


module.exports = {
    saveEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployee
}
