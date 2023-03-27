const { selectTopics } = require("../model/get.model")

const sendTopics = (request, response) => {
    selectTopics().then((result) => response.status(200).send(result))
}
const invalidEndpoint = (request, response) => {
    response.status(404).send({ "message": "Not found" })
}
module.exports = { sendTopics, invalidEndpoint }