const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/hello', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

// Request Handler
app.post('/getFirstUser', async (req, res) => {

  // run some business logic


  // success
  return res.json({
    id: "1",
    name: "sina",
    email: "sina@gmail.com"
  })

});

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})