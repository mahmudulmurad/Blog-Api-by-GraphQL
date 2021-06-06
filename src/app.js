const express = require('express')
const cors = require('cors')
require('./db/mongoose')
const userRouter = require('./routers/user')
const blogRouter = require('./routers/blog')

const app = express()
app.use(cors())
app.use(express.json())
app.use(userRouter)
app.use(blogRouter)


module.exports = app