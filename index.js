const express = require('express')
const connectDb = require("./db")
const signupRouter = require("./routes/signup")
const loginRouter = require("./routes/login")
const homeRouter = require("./routes/home")
const cors = require("cors")
const app = express()
const port = 3000
connectDb();

app.use(express.json())
app.use(cors({origin:"*"}))

app.get('/',(req, res) =>{
    res.send("Hello World")
})

app.use("/signup", signupRouter)
app.use("/login", loginRouter)
app.use("/home", homeRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}
)

