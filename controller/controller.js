const { selectTopics, selectArticleId, selectAllArticles, selectComments, addComments, updateComments } = require("../model/model")
const sendTopics = (request, response) => {
    selectTopics().then((result) => response.status(200).send(result))
}

const sendArticleInfo = (request, response, next) => {
    const { articleId } = request.params;
    selectArticleId(articleId).then((result) => response.status(200).send(result))
        .catch((error) => {
            next(error);
        })
}

const sendAllArticles = (request, response, next) => {
    selectAllArticles().then((result) => response.status(200).send(result))
}

const sendComments = (request, response, next) => {
    const { articleId } = request.params;
    selectArticleId(articleId)
        .then(() => {
            return selectComments(articleId)
        })
        .then((result) => {
            response.status(200).send(result);
        })
        .catch((error) => {
            next(error);
        });
}


const postComments = (request, response, next) => {
    const { articleId } = request.params;
    const author = request.body.author;
    const body = request.body.body;

    return addComments(request, author, body, articleId)
        .then((postedComment) => {
            response.status(201).send({ postedComment })
        })
        .catch((error) => {
            next(error);
        });

}

const patchComments = (request, response, next) => {
    const { articleId } = request.params;
    const { inc_votes } = request.body;
    return updateComments(request, inc_votes, articleId)
        .then((updatedComment) => {
            response.status(200).send({ updatedComment })
        })
        .catch((error) => {
            next(error);
        })
}
const invalidEndpoint = (request, response) => {
    response.status(404).send({ "message": "Not found" })
}

module.exports = { sendTopics, invalidEndpoint, sendArticleInfo, sendAllArticles, sendComments, postComments, patchComments }
