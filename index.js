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
app.post('/addNumbers', async (req, res) => {

  // get request input
  const { numbers } = req.body;

  // run some business logic


  /*
  // In case of errors:
  return res.status(400).json({
    message: "error happened"
  })
  */

  try {
    return res.json({
      sum: numbers.reduce((s, n) => s + n, 0)
    });
  } catch (e) {
    console.error(e)
    return res.status(500).json({
      message: 'unexpected'
    })
  }

});

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})