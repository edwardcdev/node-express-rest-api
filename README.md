# Node Express REST API

## Running

1. `npm install`

1. `npm run seed`, to create a database in `database.sqlite3`.

1. `npm start`.


## Specification

- Server : [nodemon](https://nodemon.io/)

- Database : SQLite

- ORM : [Sequelize](http://docs.sequelizejs.com/)

- Middleware: `getProfile`

## Data Models

### Profile
A profile can be either a `client` or a `contractor`. 
clients create contracts with contractors. contractor does jobs for clients and get paid.
Each profile has a balance property.

### Contract
A contract between and client and a contractor.
Contracts have 3 statuses, `new`, `in_progress`, `terminated`. contracts are considered active only when in status `in_progress`
Contracts group jobs within them.

### Job
contractor get paid for jobs by clients under a certain contract.

## APIs 

1. ***GET*** `/contracts/:id` 

1. ***GET*** `/contracts` 

1. ***GET*** `/jobs/unpaid`

1. ***POST*** `/jobs/:job_id/pay`

1. ***POST*** `/balances/deposit/:userId`

1. ***GET*** `/admin/best-profession?start=<date>&end=<date>`

1. ***GET*** `/admin/best-clients?start=<date>&end=<date>&limit=<integer>` 

