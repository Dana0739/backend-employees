//params must be array of strings
const checkRequiredParameters = (req, res, params) => {
    for (let requiredParameter of params) {
        if (!req.body[requiredParameter]) {
            res.status(422).send({error: `You're missing a "${requiredParameter}" property.`});
            return false
        }
    }
    return true
}

const errorMessageConstruct = (paramName, requirement) => {
    return `"${paramName}" property must ${requirement}.\n`
}

const employeeRequiredParams = ['name', 'surname', 'position', 'date_of_birth', 'salary']
const employeeStatusEnum = ['Junior Software Engineer', 'Software Engineer', 'Senior Software Engineer', 'Lead Software Engineer']

const checkEmployeeParameters = (req, res) => {
    if (!checkRequiredParameters(req, res, employeeRequiredParams)) {
        return
    }

    let param
    let valid = true
    let errorMessage = 'Expected format:\n'

    for (let paramName of employeeRequiredParams) {
        param = req.body[paramName]

        switch (paramName) {
            case 'name':
            case 'surname':
                if (param.length === 0 || param.length > 100) {
                    valid = false;
                    errorMessage += errorMessageConstruct(paramName, 'have length more than 0 and less then 100')
                }
                break
            case 'position':
                if (!employeeStatusEnum.includes(param)) {
                    valid = false;
                    errorMessage += errorMessageConstruct(paramName, 'be in values: ' + employeeStatusEnum.join(', '))
                }
                break
            case 'date_of_birth':
                if (!Date.parse(param)) {
                    valid = false;
                    errorMessage += errorMessageConstruct(paramName, 'should be formatted as Date (ex. yyyy-mm-dd)')
                }
                break
            case 'salary':
                if (!parseInt(param) || parseInt(param) <= 0) {
                    valid = false;
                    errorMessage += errorMessageConstruct(paramName, 'be more than 0')
                }
                break
            default:
                break
        }
    }
    if (!valid) {
        res.status(422).send({error: errorMessage})
    }
    return valid
}

const getValidId = (req, res) => {
    const id = parseInt(req.params.id)
    if (!id) {
        return res
            .status(422)
            .send({error: 'id is not valid'})
    }
    return id
}

const notMentionedBoolean = (param) => {
    return param === 'false' || !param
}

const checkIfSimpleGetAllEmployees = (req) => {
    return !req.query.name && !req.query.surname && notMentionedBoolean(req.query.sorted) && !req.query.order && !req.query.page
}

const validateFilterSortParams = (req, res) => {
    const name = req.query.name
    const surname = req.query.surname
    const sorted = req.query.sorted
    const order = req.query.order
    const page = req.query.page

    let valid = true;
    let errorMessage = 'Expected format:\n';
    if (name || name.length === 0) {
        if (name.length === 0 || name.length > 100) {
            valid = false;
            errorMessage += errorMessageConstruct('name', 'have length more than 0 and less then 100')
        }
    }
    if (surname || name.length === 0) {
        if (surname.length === 0 || surname.length > 100) {
            valid = false;
            errorMessage += errorMessageConstruct('surname', 'have length more than 0 and less then 100')
        }
    }
    if (sorted) {
        if (sorted.toLowerCase() !== 'true' && sorted.toLowerCase() !== 'false') {
            valid = false;
            errorMessage += errorMessageConstruct('sorted', 'be true of false')
        }
    }
    if (order) {
        if (order.toUpperCase() !== 'ASC' && order.toUpperCase() !== 'DESC') {
            valid = false;
            errorMessage += errorMessageConstruct('order', 'be ASC of DESC')
        }
    }
    if (page) {
        if (!parseInt(page) && parseInt(page) !== 0 || parseInt(page) < 0) {
            valid = false;
            errorMessage += errorMessageConstruct('page', 'be more than 0')
        }
    }

    if (!valid) {
        res.status(422).send({error: errorMessage})
    }
    return valid
}

module.exports = {
    checkEmployeeParameters,
    getValidId,
    validateFilterSortParams,
    checkIfSimpleGetAllEmployees
}
