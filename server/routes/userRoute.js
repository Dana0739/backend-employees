const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');
const repository = require('../auth/userRepository');
const schemas = require('../utils/schemas');
const User = repository.User;
const conf = require('../auth/config');
const jwt = require('jsonwebtoken');

/* KNEX setup for create table. */
router.get('/setup', async (request, response) => {
    const result = await repository.setupTable();
    response.status(result.status).send(result.value);
});

/* KNEX drop for drop table. */
router.get('/drop', async (request, response) => {
    const result = await repository.dropTable();
    response.status(result.status).send(result.value);
});


//Register User
router.post('/register', async (request, response) => {
    const validate = schemas.schemas.userAuthentication.validate(request.body, {convert: true});
    if (validate.error) {
        return response.status(422).send(validate.error);
    }
    const hashedPassword = await bcrypt.hash(validate.value.password_digest, 12, null); //bcrypt encryption

    const user = new User({
        name: validate.value.name,
        password_digest: hashedPassword
    });

    user.save().then(() => {
        response.send('User has been successfully created');
    });
});

// Authenticate && Return a Token if Valid User/Password
router.post('/getToken', (request, response) => {
    const validate = schemas.schemas.userAuthentication.validate(request.body, {convert: true});
    if (validate.error) {
        return response.status(422).send(validate.error);
    }

    User.forge({name: validate.value.name}).fetch().then(result => {
        if (!result) {
            return response.status(400).send('name not found');
        }
        result.authenticate(validate.value.password_digest).then(user => {
            const payload = {id: user.id};
            const token = jwt.sign(payload, conf.secret, {expiresIn: 3000}); //here is an expiration time
            response.send(token);
        }).catch(error => {
            return response.status(400).send({error: error});
        })
    });
});


module.exports = router;
