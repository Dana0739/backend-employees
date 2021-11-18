# Employees project

This is a research project for the SPbPU university (couse: internet technology)

Student: Zhetesova Dana

Unit: Institute of Physics and Mechanics

Course: Magistracy, 1st course

Group: 5040102/10101

Supervisor: Vladislav Lomako

## Installation
```bash
git clone https://github.com/Dana0739/backend-employees.git
```

## Usage
```bash
node .\backend\resources\bin\www
```

## Project structure
+ app.js - main express application script, constructs project
+ */server*
  + */auth*
  + */repository*
    + *employeeRepository.js* - contains data layer for repository (via **knex**)
    + *rawQueries.js* - contains test time query via simple pool
  + */routes*
    + *employeeRoute.js* - main business logic entity routing (CRUD) + db managing queries
  + */utils*
    + *schemas.js* - **Joi** validation schemas
+ */resources/bin/www .js* - application launcher

## Contributing
Pull requests are not welcome. This is an educational project that will never be used and developed for production, but you still can donate.
