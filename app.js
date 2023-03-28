const express = require("express");
const app = express();
const { sendTopics, invalidEndpoint, sendArticleInfo } = require("./controller/get.controller");
app.use(express.json());

app.get("/api/topics/", sendTopics)

app.get("/api/articles/:articleId", sendArticleInfo)

app.use((error, request, response, next) => {
    if (error.status && error.msg) {
        response.status(error.status).send({ message: error.msg })
    }
})

app.all("/*", invalidEndpoint)

module.exports = app