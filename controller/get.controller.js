const { selectTopics, selectArticleId, selectAllArticles, selectComments, addComments } = require("../model/get.model")

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
    console.log("I'm in the controller")
    const { articleId } = request.params;
    const author = request.body.author;
    const body = request.body.body;

    return addComments(request, author, body, articleId)
        .then((postedComment) => {
            console.log(postedComment)
            response.status(201).send({ postedComment })
        })
        .catch((error) => {
            next(error);
        });

}
const invalidEndpoint = (request, response) => {
    response.status(404).send({ "message": "Not found" })
}

module.exports = { sendTopics, invalidEndpoint, sendArticleInfo, sendAllArticles, sendComments, postComments }

