'use strict'
const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const indexRouter = require('./routes/index')

const app = express()

app.use(cors())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

app.use((req, res, next) => {
    next(createError(404))
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    res.locals.message = err.message
    res.status(err.status)
    res.json({error: err})
})

module.exports = app
