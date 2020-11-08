const express = require('express')
const connectDB = require('./config/db')
const helmet = require('helmet')
const cors = require('cors')
const path = require('path')

const userRoutes = require('./routes/api/users')
const profileRoutes = require('./routes/api/profile')
const tripsRoutes = require('./routes/api/trips')

const app = express()

connectDB()

app.use(helmet())
app.use(cors())
app.use(express.json({ extended: false }))

// Routes
app.use('/api/users', userRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/trips', tripsRoutes)

// Serve static assets for production
if (process.env.NODE_ENV === 'production') {
  // Set static folder (create-react-app produced files)
  app.use(express.static(path.join(__dirname, '../client/build')))

  // Set route for the single page application (all routes redirect to index.html)
  app.get('*', (req, res) => {
    res.sendfile(path.join((__dirname = '../client/build/index.html')))
  })
}

module.exports = app
