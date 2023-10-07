const router = require("express").Router()
const axios = require("axios")
const mpesaPayments = require("../Models/MpesaRoute")

//Genereting access token
router.get("/token", (req,res) => {
    generateToken()
})
  
const generateToken = async (req, res, next) => {

    const secret = process.env.MPESA_CONSUMER_SECRET
    const customer = process.env.MPESA_CONSUMER_KEY
    const auth = new Buffer.from(`${customer}:${secret}`).toString("base64")

    await axios.get("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", {
        headers: {
        authorization : `Basic ${auth}`
        }
    })
    .then((response) => {
        // console.log(response.data.access_token)
        token = response.data.access_token
        next();
    })
    .catch((err) => {
        console.log(err)
        console.log("error one")
        // res.status(400).json(err.message)
    })
}
  
//Sending stk push to customer
router.post("/stk", generateToken , async (req,res) => {
    const phone = req.body.phone
    const amount = req.body.amount

    const date = new Date()
    const timestamp = date.getFullYear() + 
    ("0" + (date.getMonth() + 1)).slice(-2) +
    ("0" + date.getDate()).slice(-2) +
    ("0" + date.getHours()).slice(-2) +
    ("0" + date.getMinutes()).slice(-2) +
    ("0" + date.getSeconds()).slice(-2)

    const shortCode = process.env.MPESA_PAYBILL
    const passKey = process.env.MPESA_PASSKEY
    const password = new Buffer.from(shortCode + passKey + timestamp).toString("base64")


    await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {    
            BusinessShortCode : shortCode,    
            Password : password,    
            Timestamp : timestamp,    
            TransactionType: "CustomerPayBillOnline", //customer buy goods online
            Amount : amount,    
            PartyA : `254${phone}`,    
            PartyB : shortCode,    
            PhoneNumber : `254${phone}`,    
            CallBackURL : "https://577e-197-254-103-158.ngrok.io/api/v7/callBack",    
            AccountReference : "myaccount",    
            TransactionDesc : "Test"
        },
        {
            headers: {
                Authorization : `Bearer ${token}`
            }
        }
    )
    .then((data) => {
        console.log(data.data)
        res.status(200).json(data.data)
    })
    .catch((err) => {
        console.log(err.message)
    })
})


//callback url
router.post("/callBack", async (req, res) => {
    try {
      const callbackData = req.body;
      console.log(callbackData);
  
      if (!callbackData.Body || !callbackData.Body.stkCallback) {
        console.log("Invalid callback data");
        return res.status(400).json("Invalid callback data");
      }
  
      const callbackMetadata = callbackData.Body.stkCallback.CallbackMetadata;
  
      if (!callbackMetadata) {
        console.log("No callback metadata found");
        return res.status(400).json("No callback metadata found");
      }
  
      // Extract transaction details from callback data
      const id = callbackMetadata.Item[3].Value;
      const phone = callbackMetadata.Item[4].Value;
      const amount = callbackMetadata.Item[0].Value;
  
      console.log({ id, phone, amount });
  
      // Create a new MpesaPayments instance and save it to the database
      const payment = new mpesaPayments({
        number: phone,
        amount,
        id,
      });
  
      const savedPayment = await payment.save();
      console.log("----- TRANSACTION SAVED SUCCESSFULLY -----", savedPayment);
  
      // Respond with a success message
      res.status(200).json({ message: "Transaction saved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

module.exports = router