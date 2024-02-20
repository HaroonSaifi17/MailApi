const express = require('express')
const cors = require('cors')
const nodemailer = require('nodemailer')
var smtpTransport = require('nodemailer-smtp-transport')
const mongoose = require('mongoose')
const Mail = require('./Model/mail')
require('dotenv').config()

const app = express()
const port = 4040

app.use(
  cors({
    origin: '*',
    optionsSuccessStatus: 200,
  })
)
var transporter = nodemailer.createTransport(
  smtpTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.USERNAME,
      pass: process.env.PASSWORD,
    },
  })
)

try {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
} catch (err) {
  console.log('could not connect')
}
const dbConnection = mongoose.connection
dbConnection.on('error', (err) => console.log(`Connection error ${err}`))
dbConnection.once('open', () => console.log('Connected to DB!'))

app.use(express.urlencoded({ extended: true }))
app.post('/', async (req, res) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.USERNAME,
      to: req.body.mail,
      subject: 'Thank You for subscribing',
      html: `
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f2f2f2;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      }
      h1 {
        color: #3d3d3d;
      }
      p {
        color: #555;
      }
      a {
        color: #0078e7;
        text-decoration: none;
      }
    </style>
    <div class="container">
      <h1>Thank You for Subscribing to The Campus Chronicles!</h1>
      <p>Dear Subscriber,</p>
      <p>On behalf of the entire team at The Campus Chronicles, we want to express our gratitude for subscribing to our newsletter. You are now part of a community of readers who are passionate about staying informed about campus news and events.</p>
      <p>We promise to bring you the latest news, events, and stories from your campus and beyond. You can expect to receive our newsletters every week. If you have any feedback or suggestions, please do not hesitate to reach out to us.</p>
      <p>Thank you once again for your subscription.</p>
      <p>Best regards,</p>
      <p>The Campus Chronicles Team</p>
      <hr>
      <p>If you no longer wish to receive our newsletters, please <a href="#">unsubscribe here</a>.</p>
    </div>
`,
    })
    console.log('Message send %s', info.messageId)
    res.status(200).end()
    await Mail.findOneAndUpdate(
      { mail: req.body.mail },
      { mail: req.body.mail },
      { upsert: true }
    )
  } catch (error) {
    res.status(500).json(error.message)
  }
})
app.listen(process.env.PORT || port, () => {
  console.log(`Server is listening at http://localhost:${port} `)
})
