'use strict';

const { Pool } = require('pg');

const internals = {
    pool: {}
};

internals.init = function () {
    internals.pool = new Pool({
        host: process.env.PGHOST,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD
    });
};

internals.init();

exports.queryAsync = async function (text, params) {
    const start = Date.now();
    const res = await internals.pool.query(text, params);
    const duration = Date.now() - start;
    console.log('executed query', { text, duration, rows: res.rowCount });
    return res;
};

exports.getClientAsync = async function () {
    const client = await internals.pool.connect()
    const query = client.query
    const release = client.release
    // set a timeout of 5 seconds, after which we will log this client's last query
    const timeout = setTimeout(() => {
        console.error('A client has been checked out for more than 5 seconds!')
        console.error(`The last executed query on this client was: ${client.lastQuery}`)
    }, 5000)
    // monkey patch the query method to keep track of the last query executed
    client.query = (...args) => {
        client.lastQuery = args
        return query.apply(client, args)
    }
    client.release = () => {
        // clear our timeout
        clearTimeout(timeout)
        // set the methods back to their old un-monkey-patched version
        client.query = query
        client.release = release
        return release.apply(client)
    }
    return client
};
