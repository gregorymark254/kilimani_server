const mongoose = require("mongoose")

const MpesaSchema = new mongoose.Schema(
    {
        phone : { type: String, required: true},
        id : { type: String, required: false},
        amount : { type: String, required: true}
    },
    { timestamps : true }
)

module.exports = mongoose.model("MpesaPayments", MpesaSchema)