const db = require("../db/connection");

const selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => result.rows)
}

const selectArticleId = (id) => {
    if (isNaN(id)) {
        return Promise.reject({ status: 400, msg: "Invalid Article ID" })
    }
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 404, msg: "Article not found" })
            }
            return result.rows[0];
        })
}


const selectAllArticles = () => {
    return db.query(`SELECT art.article_id, art.title, art.topic, art.author, art.body, art.created_at, art.votes, art.article_img_url, COUNT(com.article_id) AS comment_count FROM articles art LEFT JOIN comments com ON art.article_id = com.article_id GROUP BY art.article_id ORDER BY art.created_at DESC;`).then((result) => result.rows)
}

const selectComments = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 200, msg: "No comments found for this article" })
        } return result.rows;
    })
}

module.exports = { selectTopics, selectArticleId, selectAllArticles, selectComments }
