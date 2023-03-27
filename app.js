const express = require("express");
const app = express();
const { sendTopics, invalidEndpoint } = require("./controller/get.controller");
app.use(express.json());

app.get("/api/topics", sendTopics)

app.all("/*", invalidEndpoint)
module.exports = app