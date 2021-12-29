const path = require('path');
const { SlonikMigrator } = require('@slonik/migrator')
const { createPool } = require('slonik')


const { POSTGRES_CONNECTION_STRING } = process.env
const slonik = createPool(POSTGRES_CONNECTION_STRING)

const migrator = new SlonikMigrator({
    migrationsPath: path.join(__dirname, '..', '/migrations'),
    migrationTableName: 'migration',
    slonik
})

migrator.runAsCLI()
