const db = require("../db/connection");

const selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => result.rows)
}

module.exports = { selectTopics }