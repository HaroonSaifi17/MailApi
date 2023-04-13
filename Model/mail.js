const mongoose = require("mongoose")


const blogSchema = new mongoose.Schema({
  mail: String,
})
const Mail = mongoose.model('mails',blogSchema)
module.exports = Mail
