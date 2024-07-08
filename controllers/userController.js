const documentModel = require("../models/documentModel")

const addANewDocument = async (request, response) => {
    const tenantId = request.tenantId
    const files = request.files.docs

    const document = documentModel(tenantId)

    const fileData = files.map( (file) => ({
        owner: request.user._id,
        filename: file.originalname,
        path: file.path,
        size: file.size,
        mimetype: file.mimetype,
    }))

    await document.insertMany(fileData)

    response.status(200).send("Files Uploaded Successfully")
}

module.exports = {
    addANewDocument
}