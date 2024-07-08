const jwt = require('jsonwebtoken')
const { ACCESS_TOKEN } = require('../configuration/config')
const userModel = require('../models/userModel')

const verifyUser = async (request, response, next) => {
    try {
        const authHeader = request.headers['cookie']

        if(!authHeader){
            return response.status(401).send({status: 'failure', code: 401, message: 'Token not found'})
        }

        const [cookieString, tenantString] = authHeader.split(';')
        const cookie = cookieString.split("=")[1]
        const tenantID = tenantString.split("=")[1]

        jwt.verify(cookie, ACCESS_TOKEN, async (error, decoded) => {
            if(error) {
                return response.status(401).json({code:401 ,message:'Session expired'})
            }           
            const {id} = decoded
            const existingUser = await userModel.findById({_id: id})
            const password = existingUser?._doc?.password
            if(password) {
                const {password, tenantId, ...data} = existingUser?._doc
                request.user = data
                request.tenantId = tenantID
                next()
            } else {
                request.user = existingUser
                request.tenantId = tenantID
                next()
            }
        })
    }
    catch(error) {
        response.status(500).json({status: 'error', code:500, message: error.message})
    }
}

const verifyAdmin = (request, response, next) => {
    try{
        const {role} = request.user
        if(role != 'admin') {
            return response.status(401).json({status: 'failed',code:401,message: 'Unauthorized access'})
        }
        next()
    }
    catch(error) {
        response.status(500).json({status: 'error', code: 500, message: error.message})
    }
    
}

module.exports = {
    verifyUser,
    verifyAdmin
}