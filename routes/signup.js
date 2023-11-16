const express = require("express");
const { CheckUser } = require("../controllers/login");
const { InsertVerifyUser } = require("../controllers/signup");
const { InsertSignUpUser } = require("../controllers/signup");
const router = express.Router();

router.get("/:token", async(req,res) => {
    try{
        const response = await InsertSignUpUser(req.params.token)
        res.status(200).send(response)
    }
    catch(e){
        console.log(e);
        res.status(500).send(
            `<html>
            <body><h4>Registration Failed</h4>
            <h5>Link Expired........</h5>
            <p>Regards</p>
            <p>Team</p>
            </body>
            </html>`)
    }
});



router.post("/verify", async(req,res) => {
    const{name, email, password} = await req.body;
    console.log(name, password, email);
    const registerCredentials = await CheckUser(email);
    console.log(registerCredentials);
    try{
        if (registerCredentials === false){
            await InsertVerifyUser(name, email, password)
            res.status(200).send(true)
        } 
        if (registerCredentials === true){
            res.status(200).send(false)
        }
        else if (registerCredentials === "Server Busy"){
            res.status(500).send("Server Busy")
        }
    }
    catch(e){
        console.log(e)
    }
    
    
}

)

module.exports = router