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
        password: process.env.PGPASSWORD,
        max: 1
    });
};

internals.init();

exports.queryAsync = async function (text, params) {
    return await internals.pool.query(text, params);
};
