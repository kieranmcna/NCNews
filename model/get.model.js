const db = require("../db/connection");

const selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => result.rows)
}

const selectArticleId = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" })
        } return result.rows[0];
    })
}
module.exports = { selectTopics, selectArticleId }