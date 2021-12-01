
## Description

This is the code for a REST API I made for a college project.

## Technology stack

The API was written in TypeScript and is powered by the framework NestJS.

For this project the relational database PostgreSQL was the one chosen.
It was tricky to add an arbitrary sorting order to rows without having to update a lot of rows at the same time.
The solution I found was to use a column with unspecified precision and scale on the DB side and an arbitrary floating-point library on the application side.
This way, only one of the two nearest neighbor rows of target position (or the parent board when no rows are available) has to be locked. Although the target position can't be guaranteed due to other rows not being locked, there's no risk of constraint violations, and it's faster than updating many values every time a position changes.

## Installation

1. Set up the database:
	Although MikroORM is compatible with many SQL databases, this app was meant to be used and only tested with PostgreSQL, and some raw SQL code was used as well. But feel free to test it with other databases.

2. Load tables into DB:
	When the database is ready, navigate to the folder *src* and edit the file *mikro-orm.config.ts* with your connection credentials.
	After editing the credentials, it's time to load the entity tables into the db. Thankfully MikroORM provides a cli tool that does that. To do it, go to the root directory of the project (the parent of the src folder), and run the following commands in the terminal:
	```bash
	npm i @mikro-orm/cli
	npx mikro-orm schema:create -d
	```
	or, if you prefer not to install it:
	```bash
	npx -p @mikro-orm/cli schema:create -d
	```
	This command will just dump the generated code into the terminal.
	If this command dumps SQL code into your terminal, then you're all set to proceed. Otherwise you should check your config for errors and if you're lost you can check MikroORM's docs entry on [setting up the commandline](https://mikro-orm.io/docs/installation#setting-up-the-commandline-tool).

	After setting up your cli tool, you're ready to load the tables into the db. To do so, run the following command:
	```bash
	npx mikro-orm schema:create -r
	```

3. Start the app:
	If everything goes well, you should see a success feedback message, which means the app is ready to be started.
	To start it, run the following command:
	```bash
	npm start
	```
	To compile the code, run:
	```bash
	npm run build 
	```

4. Next steps:
	After successfully running the application, you can start using it.
	Thanks to NestJS, the API has an interactive documentation and playground available online, on path '/api'.
