## test-user-creator

### About

This program loops through JetBrains Test Data generated user data and adds it to the User--System table in the configured database.

### Configuration

#### .env File

Create an .env file if one is not present.

Specify Postgres connection information.

```
PGHOST=''
PGDATABASE=''
PGPORT=5432
PGUSER=''
PGPASSWORD=''
```

#### Add user data

Use the JetBrains Test Data generator to create user data. The code is set up to use the default structure of the Custom \ Multiple type.

In the data/users.js file, delete everything below the `exports.list =` line and replace it with generated user data.
