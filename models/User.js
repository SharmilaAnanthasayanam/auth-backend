const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : true,
    },
    email:{
        type: String,
        required : true,
        unique : true,
    },
    JoinedOn:{
        type: Date,
        default : Date.now()
    },
    password:{
        type: String,
        required :  true,
    },
    forgetpassword: {
        time : Date,
        otp : String,
    },
    tokens : {
        type: String,
    },
},
{
    collection: "User"
}
);

module.exports = mongoose.model("User", userSchema)