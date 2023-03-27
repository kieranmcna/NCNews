const db = require("../db/connection");

const selectBooks = () => {
    return db.query(`SELECT * FROM topics ORDER BY slug ASC`).then((result) => result.rows)
}

module.exports = { selectBooks }