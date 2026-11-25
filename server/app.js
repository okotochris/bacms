require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongodb = require('mongoose')
const staff = require('./routes/staff')
const result = require('./routes/result')
const auth = require('./routes/auth')
const studentRoute = require('./routes/student')



const app = express()

const allowedURLs = process.env.ALLOWED_URLS
  allowedURLs.split(',')
  .map(url => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedURLs.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 8080

const URI = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/bacmsdb'
mongodb.connect(URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api', staff)
app.use('/api', auth)
app.use('/api', result)
app.use('/api', studentRoute)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
