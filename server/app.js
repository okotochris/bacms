require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongodb = require('mongoose')
const staff = require('./routes/staff')
const result = require('./routes/result')
const auth = require('./routes/auth')



const app = express()

const allowedURLs = process.env.ALLOWED_URLS
  .split(',')
  .map(url => url.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedURLs.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(express.json());

const PORT = process.env.PORT || 8080

const URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bacmsdb'
mongodb.connect(URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

app.use('/api', staff)
app.use('/api', auth)
app.use('/api', result)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
