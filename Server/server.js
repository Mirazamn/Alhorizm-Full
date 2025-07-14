const express = require('express')
const cors = require('cors')
const app = express()
const PORT = 3333

const userRoute = require('./routes/users')
const postRoute = require('./routes/posts')

app.use(express.json())
app.use(cors())
app.use('/users', userRoute)
app.use('/posts', postRoute)
app.listen(PORT)