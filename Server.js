require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const corsOption = require("./DB/corsOption")
const mongoconnect = require("./DB/MongoDb")
const auth = require("./Routes/auth")
const blog = require("./Routes/blogRoute")
const vote = require("./Routes/voteQuestion")
const publicPost = require("./Routes/publicRoute")
const helpSupport = require("./Routes/helpRoute")
const mpesa = require("./Routes/Mpesa")
const events = require("./Routes/eventRoute")
const {logger } = require("./Middleware/logEvents")
const errorHandler = require("./Middleware/errorHandler")

//connection to Databases
mongoconnect()

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cors(corsOption))
app.use(logger)

//routes
app.get("/", (req, res) => {
    res.json({Message:"Kilimani Hub Backend Server."});
});
app.use("/api/v1", auth) //auth route
app.use("/api/v2", blog) //blog posts
app.use("/api/v3", vote) //vote posts
app.use("/api/v4", publicPost) //public posts
app.use("/api/v5", helpSupport) //help support posts
app.use("/api/v6", events) //events posts
app.use("/api/v7", mpesa) //mpesa payment route

//Error handler
app.use(errorHandler)


//Connetion to the server
const PORT = process.env.PORT 
const server = app.listen(PORT, () => console.log(`Server is running on port:${PORT}`))