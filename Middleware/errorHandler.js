const { logEvents } = require("./logEvents")


const errorHandler =  (err, req , res, next) => {
    logEvents(`${err.name}: ${err.message} : ${req.headers.origin}`, 'errLog.txt')
    res.status(500).send(`Error : ${err.message}`)
}

module.exports = errorHandler 