const { selectTopics, selectArticleId, selectAllArticles, selectComments } = require("../model/get.model")

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

const invalidEndpoint = (request, response) => {
    response.status(404).send({ "message": "Not found" })
}


module.exports = { sendTopics, invalidEndpoint, sendArticleInfo, sendAllArticles, sendComments }

