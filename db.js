require("dotenv").config();
const spicedPg = require("spiced-pg");
const DATABASE_URL = process.env.DATABASE_URL;
const db = spicedPg(DATABASE_URL);

module.exports.insertUser = function (first_name, last_name, email, password) {
    const sql = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
    `;
    return db
        .query(sql, [first_name, last_name, email, password])
        .then((result) => result.rows);
};


module.exports.findUserByEmail = function (email) {
    const sql = `
        SELECT id, email, password, first_name, last_name FROM users WHERE email= $1;
    `;
    return db
        .query(sql, [email])
        .then((result) => result.rows);
};


module.exports.getBasicToDos = function (email) {
    const sql = `
        SELECT * FROM basictodo WHERE email= $1;
    `;
    return db.query(sql, [email]).then((result) => result.rows);
};

