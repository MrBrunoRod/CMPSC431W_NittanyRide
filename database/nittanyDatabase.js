// opens/creates the database, enables foreign key constraints, and exports connection

const Database = require("better-sqlite3");
const db = new Database("./database/database.sqlite");

db.pragma("foreign_keys = ON");

module.exports = db;

console.log("Successfully created database!");