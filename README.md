# Test User Creator

A Node.js command line application to help you load test user data into a table. This application is useful for when you need to have a large quantity of reasonably realistic looking user data. I used this application to load a million records into a Postgres database.

The application leverages the JetBrains Test Data plugin to do the heavy lifting of generating the initial data. The application loops through the generated user data, cleans it up a bit and adds it to a table in a configured Postgres database.

The initially generated test data is a little wonky. The application formats the address with a US look. It also makes the email address match the user's name.

It should be straightforward to adjust the code to use a different data store type if you wish to use something other than Postgres.

## Getting Started

### Install Dependencies

Do an `npm install` to install the application dependencies.

### Install the Plugin

The Test Data plugin works with many of the JetBrains IDE's. Since the application is written in Node.js, the [WebStorm](https://www.jetbrains.com/webstorm/) IDE is a good choice to pair with the plugin.

Install the [Test Data](https://plugins.jetbrains.com/plugin/16873-test-data) plugin into your JetBrains IDE.

### Prepare an Output Table

Prepare a Postgres table to receive the test user data. The table should have the following fields:

```
id
first_name
last_name
address_line1
city
state_province
postal_code
email
```

Here is example Postgres SQL to create a compatible table:

```sql
CREATE TABLE IF NOT EXISTS public.user__system
(
    id uuid NOT NULL,
    first_name character varying(200) COLLATE pg_catalog."default",
    last_name character varying(200) COLLATE pg_catalog."default",
    address_line1 character varying(200) COLLATE pg_catalog."default",
    city character varying(200) COLLATE pg_catalog."default",
    state_province character varying(200) COLLATE pg_catalog."default",
    postal_code character varying(200) COLLATE pg_catalog."default",
    email character varying(200) COLLATE pg_catalog."default",
    CONSTRAINT user__system_pkey PRIMARY KEY (id)
)
TABLESPACE pg_default;
```

### Adjust Code to Point to Output Table

Replace `user__system` in the /index.js file with the name of your Postgres table.

### Create Database Connection File

Create an .env file if one is not present.

In the .env file, specify the connection information for your Postgres database. Here are example settings:

```
PGHOST='localhost'
PGDATABASE='Test'
PGPORT=5432
PGUSER='tester'
PGPASSWORD=''
```

### Configure a Data Generator

1. Open the data/users.js file.
2. In the file, right click and select the `Generate Test Data` item.
3. Choose `Custom` \ `Configure Custom Data Generators...`.
4. Click the `+` sign.
5. Give your generator a name and choose the `Multiple` type.

The default values for the `Multiple` type produces output in the format that the application expects.

## Using the Application

### Run Data Generator

1. In the data/users.js file, delete everything below the `exports.list =` line and place the cursor under the `exports.list =` line.
2. At that cursor position, right click and select the `Generate Test Data` item.
3. Choose `Custom` \ &nbsp;name-you-gave-data-generator.
4. Enter the number of rows you wish to generate.

### Run Application

From the JetBrains IDE, run the application. The application will load the records into the table.

Repeat running the data generator and application steps until you reach the number of records you wish to have. (The data generator only allows up to 25,000 rows at a time to be generated.)
