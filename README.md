<p align="center"><img width="347" alt="logo" align="center" src="https://user-images.githubusercontent.com/23561464/170766998-00235994-9006-41dd-8a68-bbb91ea0100f.png"></p>

# GETTING STARTED

**PLEASE NOTE: THIS PROJECT IS A WORK IN PROGRESS**

Before we get this application running locally and fruitlessly attempt to dethrone George Costanza from the #1 spot in *Frogger*, let's make sure we have the following installed:

- [NodeJs](https://nodejs.org/en/download/)
- [Postgres](https://www.postgresql.org/download/)

Already done? Great! Now let's clone the repo, install packages, run migrations/seeds, get the server running and take things for a test spin!

&nbsp;  
## Server

1. **Clone the repo**: In your terminal, run `git clone git@github.com:dannytannertantrum/merchant-mill-arcade.git`
2. **Install and use nvm**: This project uses `nvm`. If you need to install it on your machine, follow the instructions [outlined here](https://github.com/nvm-sh/nvm#installation-and-update). Then, inside of the root directory, run `nvm use` and follow the commands to install the correct node version if you do not have it.
3. **Install packages**: Inside of root, run `npm i`
4. **Start the Postgres servers**: Open Postgres and click the "Start" button.
5. **Set local environment variables**: Create a `.env` file in the root directory and add the following keys:

```
POSTGRES_CONNECTION_STRING=postgres://glc@localhost:5432/merchant_mill_arcade
TEST_POSTGRES_CONNECTION_STRING=postgres://glc@localhost:5432/test_merchant_mill_arcade
```

In your terminal, run the rest of the commands below in the root directory:

6. **Create the database schema**: `npm run create-db-schema`
7. **Create the test database schema**: `npm run create-test-db-schema`
8. **Run migrations**: `npm run migrate:up`
9. **Run migrations for test**: `npm run migrate-test:up`
10. **Seed data**: `npm run seed`
11. **Seed test data**: `npm run seed-test`
12. **Start the server**: `npm run dev`

At this point, the server should be running. A local database and test database should be populated with some data. Feel free to use Postman or any REST client of your choice, but if you're using VS Code, check out the `.requests.http` file in root. In order to make use of it, [install the `REST Client` extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) for VS Code. This allows us to send requests right from VS Code. Take note of the little "Send Request" link above each HTTP method and try it out!

You can also take a peek at what request and response bodies should look like via swagger: http://localhost:7000/docs

&nbsp;  
## Client
First things first, create a `.env` file in the `client` directory and add the following key/value pairs:

```
BASE_URL=http://localhost:7000
CUSTOM_SEARCH_API_KEY=
CUSTOM_SEARCH_ENGINE_ID=
```

### Programmable Search Engine
This application uses Google's Programmable Search Engine. A fallback exists in the UI, so feel free to skip this section if you do not wish to set it up. Otherwise, follow these instructions to [create an instance of a PSE](https://developers.google.com/custom-search/docs/tutorial/introduction?hl=en) and [generate an API key](https://developers.google.com/custom-search/v1/overview?hl=en). Once setup is complete, plug your API key and Search Engine ID  into their corresponding values in the `.env` file.

### Install packages and start the application
In your terminal, run the following commands in the `client` directory:
1. **Install packages**: `npm i`
2. **Start the server**: `npm start`

> Note: From the root directory, we can also run `npm run start-client` to serve up the frontend.

If both server and client side are running, the UI can be accessed at http://localhost:1234/


&nbsp;  

# DATABASE
We are using [Slonik](https://github.com/gajus/slonik) because it promotes writing raw SQL while still baking in basic protections such as SQL injection.

&nbsp;  
## Running migrations
We're using [@slonik/migrator](https://www.npmjs.com/package/@slonik/migrator) for migrations. The `migrate.js` file in the `database` directory sets up our ability to use it. The migrator auto-generates a `down` and `up` file; we do the rest by writing raw SQL.

### Migrating Up and Down
Running `up` will take us to the latest migration. [Per the docs](https://www.npmjs.com/package/@slonik/migrator?activeTab=readme): *It is also possible to migrate up or down "to" a specific migration. For example, if you have run migrations `one.sql`, `two.sql`, `three.sql` and `four.sql`, you can revert `three.sql` and `four.sql` by running `node migrate down --to three.sql`. Note that the range is _inclusive_. To revert all migrations in one go, run `node migrate down --to 0`...Conversely, `node migrate up` runs all up migrations by default. To run only up to a certain migration, run `node migrate up --to two.sql`. This will run migrations `one.sql` and `two.sql` - again, the range is inclusive of the name.*

We have scripts set up to migrate up and down:

- `$ npm run migrate:up`
- `$ npm run migrate:down`
- `$ npm run migrate:fully-down`

&nbsp;  
## Seeding (local data)
As outlined above, we can run separate seed scripts for local and test data.
- `$ npm run seed` - This script seeds our local database.
- `$ npm run seed-test` - This script seeds our test database.

&nbsp;  

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

&nbsp;  

# Troubleshooting
Sometimes, we get errors. Sometimes these errors are from not taking enough code breaks (bad!) and they leave us feeling silly. Here are some common ones and what to look out for:

1. Just starting out and seeing the error below? We're probably missing local environment variables. Take a look at [step 5 under Getting Started](#getting-started).

```
...api/node_modules/slonik/dist/src/utilities/parseDsn.js:10
    if (dsn.trim() === '') {
            ^

TypeError: Cannot read properties of undefined (reading 'trim')
```

2. `connect ECONNREFUSED` - Is Postgres running?
3. `Exceeded timeout of 5000 ms for a hook` - is Postgres running?
4. `“connect ECONNREFUSED 127.0.0.1:80”` - are you seeing this while running/adding tests or trying to hit routes? If so, make sure routes are valid, e.g. prefixed with a forward slash: `/game/:id` and not `game/:id`
5. `Error: Cannot find module 'fs/promises'` or `code: 'MODULE_NOT_FOUND'` - did you run `$ nvm use`?
6. Are processes hanging? If so, check and make sure all our hooks are calling `done()` and passing to the next handler.
