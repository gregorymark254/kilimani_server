require("dotenv").config()
const express = require("express")
const app = express()
const cors = require("cors")
const corsOption = require("./DB/corsOption")
const mongoconnect = require("./DB/MongoDb")
const auth = require("./Routes/auth")
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

//Error handler
app.use(errorHandler)


//Connetion to the server
const PORT = process.env.PORT 
const server = app.listen(PORT, () => console.log(`Server is running on port:${PORT}`))