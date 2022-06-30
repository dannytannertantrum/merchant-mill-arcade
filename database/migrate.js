const path = require('path');
const { SlonikMigrator } = require('@slonik/migrator')
const { createPool } = require('slonik')


const CONNECTION_STRING = process.env.NODE_ENV_TEST === 'TEST'
    ? process.env.TEST_POSTGRES_CONNECTION_STRING
    : process.env.POSTGRES_CONNECTION_STRING

const slonik = createPool(CONNECTION_STRING)

const migrator = new SlonikMigrator({
    migrationsPath: path.join(__dirname, '..', '/migrations'),
    migrationTableName: 'migration',
    slonik
})

migrator.runAsCLI()
