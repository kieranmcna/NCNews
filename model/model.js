const db = require("../db/connection");
const { voteValidation, checkValidLength, checkValidArticleId, addCommentValidation, checkExistingArticleId, checkCommentsExist } = require("../utils/utils");

const selectTopics = () => {
    return db.query(`SELECT * FROM topics`).then((result) => result.rows)
}

const selectArticleId = (id) => {
    return Promise.all([checkExistingArticleId(id), checkValidArticleId(id)])
        .then(() => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`, [id])
        .then((result) => {
            return result.rows[0];
        })
        })
}
const selectAllArticles = () => {
    return db.query(`SELECT art.article_id, art.title, art.topic, art.author, art.body, art.created_at, art.votes, art.article_img_url, COUNT(com.article_id) AS comment_count FROM articles art LEFT JOIN comments com ON art.article_id = com.article_id GROUP BY art.article_id ORDER BY art.created_at DESC;`).then((result) => result.rows)
}

const selectComments = (id) => {
    return checkCommentsExist(id).then(() => {
        return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id]).then((result) => {
            return result.rows;
        })
    })
}
const addComments = (request, author, body, article_id) => {
    return Promise.all([addCommentValidation(request), checkValidArticleId(article_id), checkValidLength(article_id, author, body)])
        .then(() => {
    const stringQuery = `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `;
    return db.query(stringQuery, [author, body, +article_id])
        .then((postedComment) => {
            return postedComment.rows[0];
        })
        })
}
const updateComments = (request, inc_votes, article_id) => {
    const stringQuery = `
    UPDATE comments
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `;
    return Promise.all([
        checkValidArticleId(article_id), voteValidation(inc_votes)
    ])
        .then(() => {
            return db.query(stringQuery, [inc_votes, +article_id])
        })
        .then((updatedComment) => {
            return updatedComment.rows[0];
        })

}


module.exports = { selectTopics, selectArticleId, selectAllArticles, selectComments, addComments, updateComments }
