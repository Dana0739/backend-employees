const conf = require('../../resources/config/config').knexConfig;
const knex = require('knex')(conf);
const bookShelf = require('bookshelf');
const bookShelfDatabase = bookShelf(knex);
const securePassword = require('bookshelf-secure-password');
bookShelfDatabase.plugin(securePassword);

//create a user model with secure password
const User = bookShelfDatabase.Model.extend({
    tableName: 'user_authentication',
    hasSecurePassword: true //password_digest using bcrypt
});


module.exports = {
    User
};
















// // INITIALISATION STEPS
// // setup
// const setupTable = () => knex.schema.createTableIfNotExists('user_authentication', table => {
//     table.increments().unsigned().primary(); // Integer id
//     table.specificType('name', 'varchar(100) check(length(name) <= 100 and length(name) > 0)').notNullable();
//     table.specificType('password_digest', 'varchar(100) check(length(password_digest) <= 100 and length(password_digest) > 0)').notNullable();
// })
//     .then(row => ({status: 200, value: row}))
//     .catch(error => ({status: 500, value: error}));
//
// // drop
// const dropTable = () => knex.schema.dropTableIfExists('user_authentication')
//     .then(row => ({status: 200, value: row}))
//     .catch(error => ({status: 500, value: error}));
