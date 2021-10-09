const validator = require('../utils/employeeVaidator')
const repository = require('../repository/employeeRepository')

//CREATE UPDATE
//save employee
const saveEmployee = (req, res, id = false) => {
    if (validator.checkEmployeeParameters(req, res)) {
        const {name, surname, position, date_of_birth, salary} = req.body
        if (!id) {
            repository.addEmployee(name, surname, position, date_of_birth, salary, res)
        } else {
            id = validator.getValidId(req, res)
            repository.updateEmployee(id, name, surname, position, date_of_birth, salary, res)
        }
    }
}


//READ
//get all employees
const getAllEmployees = (req, res) => {
    if (validator.checkIfSimpleGetAllEmployees(req)) {
        repository.getAllEmployees(req, res)
        return
    }
    if (validator.validateFilterSortParams(req, res)) {
        const name = req.query.name
        const surname = req.query.surname
        const sorted = req.query.sorted
        const order = req.query.order //if no order - value is undefined and default value of arg is used if function
        const page = req.query.page
        repository.getAllEmployeesFilterSort(req, res, name, surname, sorted, order, page)
    }
}

//get employee by id
const getEmployeeById = (req, res) => {
    const id = validator.getValidId(req, res)
    repository.getEmployeeById(req, res, id)
}


//DELETE
//delete employee by id
const deleteEmployee = (req, res) => {
    const id = validator.getValidId(req, res)
    repository.deleteEmployee(req, res, id)
}


module.exports = {
    saveEmployee,
    getAllEmployees,
    getEmployeeById,
    deleteEmployee
}
