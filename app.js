const express = require("express");
const app = express();
const { sendBooks, invalidEndpoint } = require("./controller/get.controller");
app.use(express.json());

app.get("/api/topics", sendBooks)

app.all("/*", invalidEndpoint)
module.exports = app