require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongodb = require('mongoose')
const staff = require('./routes/staff')
const auth = require('./routes/auth')



const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8080

const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bacmsdb'
mongodb.connect(URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api', staff)
app.use('/api', auth)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
