const express = require("express");
const cors = require("cors");
const app = express();
const {
  sendTopics,
  invalidEndpoint,
  sendArticleInfo,
  sendArticles,
  sendComments,
  postComments,
  patchComments,
  deleteCommentsRequest,
  sendUsers,
} = require("./controller/controller");

app.use(express.json());

app.use(cors());

app.get("/api/topics/", sendTopics);

app.get("/api/articles/:articleId", sendArticleInfo);

app.get("/api/articles", sendArticles);

app.get("/api/articles/:articleId/comments", sendComments);

app.post("/api/articles/:articleId/comments", postComments);

app.patch("/api/articles/:articleId", patchComments);

app.delete("/api/comments/:commentId", deleteCommentsRequest);

app.get("/api/users", sendUsers);

app.use((error, request, response, next) => {
  if (error.status && error.msg) {
    response.status(error.status).send({ message: error.msg });
  }
});
app.all("*", invalidEndpoint);

module.exports = app;
