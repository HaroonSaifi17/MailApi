const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport');
require('dotenv').config()

const app = express()
const port = 4040

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  })
)
var transporter = nodemailer.createTransport(smtpTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD
  }
}));


app.use(express.urlencoded({ extended: true }))
app.post('/', async(req,res)=>{
   try {
   let info= await transporter.sendMail({
    from: process.env.USERNAME,
     to: req.body.mail,
     subject: 'Sending Email using Node.js[nodemailer]',
    text: 'That was easy!'
});
    console.log("Message send %s",info.messageId)
     res.status(200).end()
   } catch (error) {
      res.status(500).json(error.message)
   }
})
app.listen(process.env.PORT || port, () => {
  console.log(`Server is listening at http://localhost:${port} `)
})
