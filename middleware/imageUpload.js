const multer = require('multer')
const fs = require('fs')

const createDirectoryIfNotExist = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true })
    }
}

const storage = multer.diskStorage({
    filename: function(request, file, callback){
        callback(null, file.originalname)
    },
    destination: function(request, file, callback)
    {
        const tenantId = request.tenantId
        const uploadDirectory = `./public/docs/${tenantId}`

        // creates the directory if not exist
        createDirectoryIfNotExist(uploadDirectory)

        callback(null, uploadDirectory)
    },
})

const upload = multer({storage})

module.exports = upload