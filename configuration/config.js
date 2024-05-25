const dotenv = require('dotenv')
dotenv.config()

const { PORT, DB_URL } = process.env

module.exports = { PORT, DB_URL }