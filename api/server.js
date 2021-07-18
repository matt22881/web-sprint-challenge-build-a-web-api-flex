const express = require('express');
const server = express();

// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
const actions = require('./actions/actions-router')
const projects = require('./projects/projects-router')

// Configure your server here
server.use(express.json())
server.use(logger)
server.use('/api/actions', actions)
server.use('/api/projects', projects)

server.get('/', (req, res) => {
    res.status(200).send(`<h1>Welcome to the API</h1>`)
})


function logger(req, res, next) {
    const newTime = new Date()
    const timestamp = newTime.toLocaleString()
    console.log(`[${timestamp}]: ${req.method} called to ${req.url}`)
    console.log('\n --- Start Body ---\n', req.body, '\n --- End Body --- \n')
    next()
}

// Do NOT `server.listen()` inside this file!
module.exports = server;