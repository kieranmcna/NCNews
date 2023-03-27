const { selectBooks } = require("../model/get.model")

const sendBooks = (request, response) => {
    selectBooks().then((result) => response.status(200).send(result))
}
const invalidEndpoint = (request, response) => {
    response.status(404).send({ "message": "Not found" })
}
module.exports = { sendBooks, invalidEndpoint }