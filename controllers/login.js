const User = require("../models/User")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const bcrypt = require("bcrypt")
const client = require("../redis")
dotenv.config()
async function CheckUser(email){
    try{
        const user = await User.findOne({email:email})
        if (user){
            return true
        }
        return false
    }
    catch(e){
        return (e)
    }
}

async function AuthentiateUser(email, password){
    try{
        const userValid = await User.findOne({email:email})
        const passValid = await bcrypt.compare(password,userValid.password)
        if (passValid){
            const token = jwt.sign(email, process.env.login_key)
            const response = {
                id: userValid._id,
                name: userValid.name,
                email: userValid.email,
                token: token,
                status: true
            }

            await client.set(`key-${email}`, JSON.stringify(response))
            await User.findOneAndUpdate({email: userValid.email},{$set: {token: token}}, {new:true} )
            return response
        }
        return("Invalid User name or Password")
    }
    catch(e){
        console.log(e)
        return ("Server Busy")
    }
}

async function AuthorizeUser(token){
    const tokenValid = jwt.verify(token, process.env.login_key)
    console.log("tokenValid: ",tokenValid)
    const valid_email = tokenValid
    if(tokenValid){
        console.log("email:",valid_email)
        const auth = await client.get(`key-${valid_email}`)
        console.log("auth: ", auth)
        if (auth){
            console.log("Redis")
            const data = JSON.parse(auth)
            console.log(data)
            return data
        }
        else{
            console.log("Mongodb")
            return await User.findOne({email:valid_email})
        }  
    }
    console.log("Hi")
    return false
}

module.exports={CheckUser, AuthentiateUser, AuthorizeUser}