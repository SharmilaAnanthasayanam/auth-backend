const User = require("../models/User")
const {sendMail} = require("../controllers/sendMail")
const bcrypt = require("bcrypt")
const mongoose = require ("mongoose")
const verifyUser = require("../models/verifyUser")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

async function InsertVerifyUser(name,email,password){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedpassword = await bcrypt.hash(password,salt)
        const token = generateToken(email)

        const newUser = new verifyUser({
            name: name,
            email: email,
            password: hashedpassword,
            tokens: token
        })

        const activationLink = `http://localhost:3000/signup/${token}`
        const content = `<h4>hi, there</h4>
        <h5>Welcome to the app</h5>
        <p>Thank you for signing up. Please click the below link to activate</p>
        <a href="${activationLink}">click here</a>
        <p>Regards</p>
        <p>Team</p>`
        
        sendMail(email, "Verify User", content)
        await newUser.save();

    }
    catch(e){
        console.log(e)
    }
    function generateToken(email){
        const token = jwt.sign(email, process.env.secret_key);
        return token
    }   
}

async function InsertSignUpUser(token) {
    try{
        const userVerify = await verifyUser.findOne({tokens:token})
        if (userVerify){
            const newUser = new User({
                name: userVerify.name,
                email: userVerify.email,
                password: userVerify.password,
                forgetpassword: {}
            })

            await newUser.save();
            await verifyUser.deleteOne({tokens:token})

            const content = `<h4>hi, there</h4>
            <h5>Welcome to the app</h5>
            <h5>Registration Successful</h5>
            <p>Regards</p>
            <p>Team</p>`

            sendMail(userVerify.email, "Registration Successful", content)
            return `<html><body><h4>hi, there</h4>
            <h5>Welcome to the app</h5>
            <h5>Registration Successful</h5>
            <p>Regards</p>
            <p>Team</p></body></html>`
        }
        return `<html><body><h4>Registration Failed</h4>
        <h5>User not found</h5>
        <p>Regards</p>
        <p>Team</p></body></html>`
    }
    catch(e){
        console.log(e);
        return `<html><body><h4>Registration Failed</h4>
        <h5>Unexpected error</h5>
        <p>Regards</p>
        <p>Team</p></body></html>`
    }
    
}

module.exports = {InsertVerifyUser, InsertSignUpUser}