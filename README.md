# GETTING STARTED
If it's your first time here, let's clone the repo, install packages, run migrations/seeds, get the server running and take things for a test spin! Steps below:

1. `$ git clone git@github.com:dannytannertantrum/merchant-mill-arcade.git`
2. Inside of `api`, run `$ nvm use` and follow the commands to install the correct node version if you do not have it.
3. Inside of `api`, run `$ npm i`
4. If you do not have it installed, [download Postgres here](https://www.postgresql.org/download/)
5. Start the Postgres servers
6. `$ npm run create-db-schema`
7. `$ npm run migrate:up`
8. `$ npm run seed`
9. `$ npm run dev`
10. At this point, the server should be running and you should have a local database populated with some data. In the root of `api`, there's a `.requests.http` file. In order to make use of it, [install the `REST Client` extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code. This allows us to send requests right from VS Code. Take note of the little "Send Request" link above each HTTP method and try it out!

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
Up - running `up` will take us to the latest migration. [Per the docs](https://www.npmjs.com/package/@slonik/migrator?activeTab=readme): 'It is also possible to migrate up or down "to" a specific migration. For example, if you have run migrations `one.sql`, `two.sql`, `three.sql` and `four.sql`, you can revert `three.sql` and `four.sql` by running `node migrate down --to three.sql`. Note that the range is _inclusive_. To revert all migrations in one go, run `node migrate down --to 0`...Conversely, `node migrate up` runs all up migrations by default. To run only up to a certain migration, run `node migrate up --to two.sql`. This will run migrations `one.sql` and `two.sql` - again, the range is inclusive of the name.'

### Seeding
`$ npm run seed` - This script seeds our local database.

### Test Database
We have a test database for integration tests to avoid polluting our dev database (in case we forget to clean something up, there's an error, etc.). Just like the commands above, we can create the test schema, migrate, seed, etc. with the following:

`$ npm run create-test-db-schema`
`$ npm run migrate-test:up`
`$ npm run seed-test`

There are also the subsequent down commands for migrating.
