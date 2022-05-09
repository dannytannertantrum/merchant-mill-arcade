# GETTING STARTED

Before we fruitlessly attempt to dethrone George Costanza from the #1 spot in *Frogger*, let's make sure we have the following installed:

- [NodeJs](https://nodejs.org/en/download/)
- [Postgres](https://www.postgresql.org/download/)

Already done? Great! Now let's clone the repo, install packages, run migrations/seeds, get the server running and take things for a test spin! Steps below:

1. **Clone the repo**: `$ git clone git@github.com:dannytannertantrum/merchant-mill-arcade.git`
2. **Install and use nvm**: This project uses `nvm`. If you need to install it on your machine, follow the instructions [outlined here](https://github.com/nvm-sh/nvm#installation-and-update). Then, inside of the `api` directory, run `$ nvm use` and follow the commands to install the correct node version if you do not have it.
3. **Install packages**: Inside of `api`, run `$ npm i`
4. **Start the Postgres servers**: Open Postgres and click the "Start" button. Once you see things running, run the rest of the commands below within the `api` directory.
5. **Create the database schema**: `$ npm run create-db-schema`
6. **Create the test database schema**: `$ npm run create-test-db-schema`
7. **Run migrations**: `$ npm run migrate:up`
8. **Run migrations for test**: `$ npm run migrate-test:up`
9. **Seed data**: `$ npm run seed`
10. **Seed test data**: `$ npm run seed-test`
11. **Start the server**: `$ npm run dev`

At this point, the server should be running! A local database and test database should be populated with some data. Feel free to use Postman or any REST client of your choice, but if you're using VS Code, check out the `.requests.http` file in `api`. In order to make use of it, [install the `REST Client` extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code. This allows us to send requests right from VS Code. Take note of the little "Send Request" link above each HTTP method and try it out!

You can also take a peek at what request and response bodies should look like via swagger: http://localhost:7000/docs


# DATABASE
We are using [Slonik](https://github.com/gajus/slonik) because it promotes writing raw SQL while still baking in basic protections such as SQL injection.

## Running migrations
We're using [@slonik/migrator](https://www.npmjs.com/package/@slonik/migrator) for migrations. The `migrate.js` file in the `database` directory sets up our ability to use it. The migrator auto-generates a `down` and `up` file; we do the rest by writing raw SQL.

### Migrating Up and Down
Running `up` will take us to the latest migration. [Per the docs](https://www.npmjs.com/package/@slonik/migrator?activeTab=readme): *It is also possible to migrate up or down "to" a specific migration. For example, if you have run migrations `one.sql`, `two.sql`, `three.sql` and `four.sql`, you can revert `three.sql` and `four.sql` by running `node migrate down --to three.sql`. Note that the range is _inclusive_. To revert all migrations in one go, run `node migrate down --to 0`...Conversely, `node migrate up` runs all up migrations by default. To run only up to a certain migration, run `node migrate up --to two.sql`. This will run migrations `one.sql` and `two.sql` - again, the range is inclusive of the name.*

We have scripts set up to migrate up and down:

- `$ npm run migrate:up`
- `$ npm run migrate:down`
- `$ npm run migrate:fully-down`

## Seeding (local data)
As outlined above in the *Getting Started* section, we can run separate seed scripts. For the simplicity of things, the data is the same - but the tests hit the test database.
- `$ npm run seed` - This script seeds our local database.
- `$ npm run seed-test` - This script seeds our test database.


# Testing

## Test database
We have a test database for integration tests to avoid polluting our dev database (in case we forget to clean something up, there's an error, etc.). Just like the commands above, we can create the test schema, migrate, seed, etc. with the following:

- `$ npm run create-test-db-schema`
- `$ npm run migrate-test:up`
- `$ npm run seed-test`

## Running tests
We use [jest](https://jestjs.io/) with `ts-jest` so we can get TypeScript support. To run tests:
- `$ npm t` - run all tests
- `$ npm run test-watch` - run tests in watch mode
- `$ npm t /pattern/` - Run a subset of tests based on a matching pattern. E.g. if you just want to run tests in `add-game.integration.ts`, you can run `$ npm run test-watch add-game.i` - this also works in watch mode.


# Troubleshooting
Sometimes, we get errors. Sometimes these errors are from not taking enough code breaks (bad!) and they leave us feeling silly. Here are some common ones and what to look out for:

1. `connect ECONNREFUSED` - Is Postgres running?
2. `Exceeded timeout of 5000 ms for a hook` - is Postgres running?
3. `“connect ECONNREFUSED 127.0.0.1:80”` - are you seeing this while running/adding tests or trying to hit routes? If so, make sure routes are valid, e.g. prefixed with a forward slash: `/game/:id` and not `game/:id`
4. `Error: Cannot find module 'fs/promises'` or `code: 'MODULE_NOT_FOUND'` - did you run `$ nvm use`?
5. Are processes hanging? If so, check and make sure all our hooks are calling `done()` and passing to the next handler.
