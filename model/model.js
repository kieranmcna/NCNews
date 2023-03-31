const { promises } = require("dns");
const { query } = require("../db/connection");
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
const addComments = (request, author, body, article_id) => {
    if (!request.body.hasOwnProperty("author") || !request.body.hasOwnProperty("body")) {
        return Promise.reject({ status: 400, msg: "A comment & author must be provided" })
    }
    else if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Invalid Article ID" })
    }
    else if (request.body.author < 1 || request.body.body < 1) {
        return Promise.reject({ status: 400, msg: "The comment body & author value must be at least 1 character in length" })
    }
    const stringQuery = `
    INSERT INTO comments
    (author, body, article_id)
    VALUES
    ($1, $2, $3)
    RETURNING *;
    `;
    return db.query(stringQuery, [author, body, +article_id])
        .then((postedComment) => {
            console.log(postedComment.rows[0]);
            return postedComment.rows[0];
        })
        .catch((error) => {
            throw error;
        });
};

const checkValidArticleId = (article_id) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Invalid Article ID" })
    }
}

const checkValidLength = (input) => {
    if (input.length < 1) {
        return Promise.reject({ status: 400, msg: "Invalid input, the input length must be greater then 0" })
    }
}

const numberCheck = (input) => {
    if (isNaN(input)) {
        return Promise.reject({ status: 400, msg: "Invalid input, the input must be a number" })
    }
}

const updateComments = (request, inc_votes, article_id) => {
    const stringQuery = `
    UPDATE comments
    SET votes = votes + $1
    WHERE article_id = $2
    RETURNING *;
    `;
    return Promise.all([
        checkValidArticleId(article_id), numberCheck(inc_votes), checkValidLength(inc_votes)
    ])
        .then(() => {
            return db.query(stringQuery, [inc_votes, +article_id])
        })
        .then((updatedComment) => {
            console.log(updatedComment.rows[0]);
            return updatedComment.rows[0];
        })
        .catch((error) => {
            throw (error);
        });

}


module.exports = { selectTopics, selectArticleId, selectAllArticles, selectComments, addComments, updateComments }
