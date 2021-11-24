const Joi = require('joi');

const schemas = {
	employeePOST: Joi.object().keys({
		name: Joi.string().min(1).max(100).required(),
		surname: Joi.string().min(1).max(100).required(),
		position: Joi.string().valid('Junior Software Engineer', 'Software Engineer',
			'Senior Software Engineer', 'Lead Software Engineer'),
		date_of_birth: Joi.date().required(),
		salary: Joi.number().min(0).integer().required(),
	}),
	filterSortGET: Joi.object().keys({
		name: Joi.string().min(1).max(100),
		surname: Joi.string().min(1).max(100),
		sorted: Joi.bool(),
		order: Joi.string().valid('asc', 'desc').insensitive(),
		page: Joi.number().min(0).integer(),
	}),
	byID: Joi.object().keys({
		id: Joi.number().min(0).integer(),
	}),
	userAuthentication: Joi.object().keys({
		name: Joi.string().min(1).max(100).required(),
		password_digest: Joi.string().min(1).max(100).required(),
	}),
};

module.exports = {
	schemas,
};
