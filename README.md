# DATABASE
We are using [Slonik](https://github.com/gajus/slonik) because it promotes writing raw SQL while still baking in basic protections such as SQL injection. If we look in the `package.json` file, we'll see some other Slonik packages for interceptors and migrations.

## Creating the schema
If this is your first time getting the code up and running, we need to create the database schema before running any migrations. Let's do that and then migrate to the latest migration. Run the following commands from the `api` directory:

`$ npm run create-db-schema`
`$ npm run migrate:up`

We can take a peek at the various scripts in `package.json`, but some helpful context is below.

## Running migrations
We're using [@slonik/migrator](https://www.npmjs.com/package/@slonik/migrator) for migrations. The `migrate.js` file in the `database` directory sets up our ability to use it. Once set up, we can run `node <path/to/file>/migrate create --name <name-of-table-or-whatever>.sql`. This auto-generates a down and up file - we do the rest by writing raw SQL. We've got a script setup, so simply run the following from the `api` directory:

`npm run create-migration <name>.sql`

### Migrating Up and Down
Up - running `up` will migrate to the latest. Per the docs, "It is also possible to migrate up or down "to" a specific migration. For example, if you have run migrations `one.sql`, `two.sql`, `three.sql` and `four.sql`, you can revert `three.sql` and `four.sql` by running `node migrate down --to three.sql`. Note that the range is _inclusive_. To revert all migrations in one go, run n`ode migrate down --to 0`. Conversely, `node migrate up` runs all up migrations by default. To run only up to a certain migration, run `node migrate up --to two.sql`. This will run migrations `one.sql` and `two.sql` - again, the range is inclusive of the name.

### Seeding
`$ npm run seed` - This script seeds our local database. A future enhancement would be to pipe everything in from a CSV so the uuids are the same every time, but for the intents and purposes of this project, it's not necessary.
