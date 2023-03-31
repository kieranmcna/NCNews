const db = require('../db/connection');

exports.addCommentValidation = (request) => {
    if (!request.body.hasOwnProperty("author") || !request.body.hasOwnProperty("body")) {
        return Promise.reject({ status: 400, msg: "A comment & author must be provided" })
    }
}
exports.checkValidArticleId = (article_id) => {
    if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Invalid Article ID" })
    }
}

exports.checkExistingArticleId = (id) => {
    const stringQuery = `
    SELECT * FROM articles
    WHERE article_id = $1;
    `;
    return db.query(stringQuery, [id])
        .then((result) => {
            if (result.rowCount === 0) {
                return Promise.reject({ status: 404, msg: "Article ID does not exist" })
            }
        })
}

exports.voteValidation = (input) => {
    if (!input) {
        return Promise.reject({ status: 400, msg: "Invalid input, the input must be a number and the input length must be greater then 0" })
    }
}

exports.checkValidLength = (input, ...extraInput) => {
    if (input.length < 1 || extraInput.length < 1) {
        return Promise.reject({ status: 400, msg: "Invalid input, the input length must be greater then 0" })
    }
}

exports.checkCommentsExist = (id) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC;`, [id]).then((result) => {
        if (result.rowCount === 0) {
            return Promise.reject({ status: 200, msg: "No comments found for this article" })
        }
    })
}
