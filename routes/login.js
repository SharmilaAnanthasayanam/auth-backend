const express = require("express")
const router = express.Router();
const {AuthentiateUser} = require("../controllers/login")
const client = require("../redis")

client
    .connect()
    .then(()=>{
        console.log("connected to redis")
    })
    .catch((e)=>{
        console.log(e)
    })


router.post("/", async(req,res) => {
    try{
        const {email, password} = await req.body;
        loginCredentials = await AuthentiateUser(email,password);
        if (loginCredentials === "Invalid User name or Password"){
            res.status(200).send("Invalid User name or Password")
        }
        else if (loginCredentials === "Server Busy"){
            res.status(200).send("Server Busy")
        }
        else{
            res.status(200).json({tokens:loginCredentials.token})
        }
    }
    catch(e){
        console.log("e")
    }
})

module.exports = router