const { selectTopics, selectArticleId, selectArticles, selectComments, addComments, updateComments, removeComment, selectUsers, sendTopic } = require("../model/model");
const { voteValidation, checkValidLength, checkValidArticleId, addCommentValidation, checkExistingArticleId, checkCommentsExist, checkIfNumber, checkCommentsArticleId, checkTopicExists } = require("../utils/utils");

const sendTopics = (request, response) => {
    selectTopics().then((result) => response.status(200).send(result))
}

const sendUsers = (request, response) => {
    selectUsers().then((result) => response.status(200).send(result))
}

const sendArticleInfo = (request, response, next) => {
    const { articleId } = request.params;

    Promise.all([checkExistingArticleId(articleId), checkValidArticleId(articleId)])
        .then(() => {
            selectArticleId(articleId).then((result) => response.status(200).send(result))
        })
        .catch((error) => {
            next(error);
        })
}


const sendArticles = (request, response, next) => {
    const { topic } = request.query;

    if (!topic) {
        return selectArticles().then((result) => response.status(200).send(result))
    }
    else if (topic) {
        checkTopicExists(topic)
            .then(() => {
                return sendTopic(request, topic).then((result) => response.status(200).send(result))
            })

            .catch((error) => {
                next(error)
            })
    }
}




const sendComments = (request, response, next) => {
    const { articleId } = request.params;

    Promise.all([checkValidArticleId(articleId), checkExistingArticleId(articleId), checkCommentsArticleId(articleId)])

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

    Promise.all([addCommentValidation(request), checkValidArticleId(articleId), checkValidLength(articleId, author, body)])

        .then(() => {
    return addComments(request, author, body, articleId)
        .then((postedComment) => {
            response.status(201).send({ postedComment })
        })
        })
        .catch((error) => {
            next(error);
        });

}

const patchComments = (request, response, next) => {
    const { articleId } = request.params;
    const { inc_votes } = request.body;

    Promise.all([
        checkValidArticleId(articleId), voteValidation(inc_votes)
    ])

        .then(() => {
    return updateComments(request, inc_votes, articleId)
        .then((updatedComment) => {
            response.status(200).send({ updatedComment })
        })
        })
        .catch((error) => {
            next(error);
        })
}

const deleteCommentsRequest = (request, response, next) => {
    const { commentId } = request.params;
    const { path } = request;

    Promise.all([checkIfNumber(commentId, path), checkCommentsExist(commentId)])

        .then(() => {
            return removeComment(commentId)
                .then((deletedComment) => {
                    response.status(204).send({ deletedComment })
                })
        })
        .catch((error) => {
            next(error);
        })

}



const invalidEndpoint = (request, response) => {
    response.status(404).send({ "message": "Not found" })
}

module.exports = {
    sendTopics,
    invalidEndpoint,
    sendArticleInfo,
    sendArticles,
    sendComments,
    postComments,
    patchComments,
    deleteCommentsRequest,
    sendUsers,
}

