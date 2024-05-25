const userModel = require("../models/userModel")
const bcrypt = require('bcryptjs')

const initialData = require('../database/initialData')
const { v4: uuidv4 } = require('uuid')

// Signup create the new user
const signup = async (request, response) => {
    const { firstName, lastName, phone , email, password, role } = request.body

    try{
        const existingUser = await userModel.findOne({email})
        if(existingUser) {
            response.status(409).send({ message: 'Email id already exist'})
        }
        const tenantId = uuidv4()
        const userToBeRegistered = new userModel({firstName, lastName, phone, email, password, role, tenantId })

        await userToBeRegistered.save()

        let options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        const token = userToBeRegistered.generateAccessJWT()
        response.cookie('TenantID', tenantId)     
        response.cookie('SessionID', token, options)
        response.status(201).send({ message: 'User created successfully'})
    } 
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}


// Login allows user and admin to login 
const login = async (request, response) => {
    const allUserData = await userModel.find()
    if(allUserData.length == 0) {
        const initialUser = new userModel(initialData)
        await initialUser.save()
    }    

    const {email} = request.body 
    try{
        const existingUser = await userModel.findOne({ email }).select('+password +tenantId') // default the mongoose doesn't provide password
        if(!existingUser) {
            return response.status(401).send({ message: 'Invalid email address'})
        }

        const validatePassword = await bcrypt.compare(`${request.body.password}`, existingUser.password)
        if(!validatePassword) {
            return response.status(401).send({ message: 'Invalid password'})
        }

        let options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }
        if(existingUser.tenantId) {
            response.cookie('TenantID', existingUser.tenantId)
        }
        const token = existingUser.generateAccessJWT()     
        response.cookie('SessionID', token, options)
        response.status(200).send({ message: 'Login Successfully'})
    } 
    catch(error) {
        response.status(500).send({ message: error.message})
    }
}

module.exports = {
    signup,
    login
}