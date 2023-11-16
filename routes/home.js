const express = require("express")
const router = express.Router()
const {AuthorizeUser} = require("../controllers/login")

router.get("/",async(req,res) => {
    try{
        const auth_token = req.headers.authorization
        AuthorizeUser(auth_token).then(
            data =>{
                UserDetails = data
                console.log("User details:",UserDetails)
                if (UserDetails === false){
                    res.status(400).send("Invalid Token")
                }
                else{
                    res.status(200).json(UserDetails)
                }
                    }
        )
        
    }
    catch(e){
        console.log(e);
        res.status(400).send("Server Busy")
    }
    
})
module.exports = router