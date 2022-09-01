'use strict';

require('dotenv').config();

const StateCodes = require('./data/state-codes.js');
const Users = require('./data/users.js');

const Db = require('./db');

const internals = {};

internals.getStateCode = function () {
    const index = Math.floor(Math.random() * StateCodes.codes.length);
    return StateCodes.codes[index];
};

internals.formatUser = function (user) {
    // Format user data to give it a more realistic US look.
    const id = user.id;

    const fullName = user.name.split(' ');
    const firstName = fullName[0];
    const lastName = fullName[1];

    const fullAddress = user.address.split(',');
    const originalAddressLine1 = fullAddress[0].split(' ');
    const addressLine1 = `${originalAddressLine1[2]} ${originalAddressLine1[0]} ${originalAddressLine1[1]}`;
    const city = fullAddress[1];
    const stateProvince = internals.getStateCode();
    const postalCode = fullAddress[3];

    const originalEmail = user.email.split('@');
    const email = `${firstName}.${lastName}@${originalEmail[1]}`.toLowerCase();

    return {
        "id": id,
        "firstName": firstName,
        "lastName": lastName,
        "addressLine1": addressLine1,
        "city": city,
        "stateProvince": stateProvince,
        "postalCode": postalCode,
        "email": email
    };
};

internals.writeUser = async function (formattedUser) {
    const text = `INSERT INTO "User--System"
("Id", "FirstName", "LastName", "AddressLine1", "City", "StateProvince", "PostalCode", "Email")
VALUES
($1, $2, $3, $4, $5, $6, $7, $8)`;

    const params = [
        formattedUser.id,
        formattedUser.firstName,
        formattedUser.lastName,
        formattedUser.addressLine1,
        formattedUser.city,
        formattedUser.stateProvince,
        formattedUser.postalCode,
        formattedUser.email
    ];

    const result = await Db.queryAsync(text, params);
    if (result.rowCount !== 1) {
        throw(`writeUser insert has unexpected row count "${result.rowCount}".`);
    }
};

internals.main = async function () {
    // Loop through users.
    let count = 0;
    for (const user of Users.list) {
        const formattedUser = internals.formatUser(user);

        await internals.writeUser(formattedUser);

        ++count;
        console.log(`${count} ${formattedUser.firstName} ${formattedUser.lastName}`);
    }
};

internals.main().then();
