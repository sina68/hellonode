'use strict';

const express = require('express');
const bodyParser = require("body-parser");

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';



// App
const app = express();
app.use(bodyParser.json());
app.get('/', (req, res) => {
  res.send('Hello World');
});

const fetch = require("node-fetch")

const categoriesByAppId = `
query ($application_id: uuid!) {
  category(where:{application_id:{_eq:$application_id}}){
    id
    title
  }
}
`;

const firstSubCategory = `
query ($parent_id: uuid!) {
  category(where:{parent_id:{_eq:$parent_id}}){
    id
    title
  }
}
`;

// execute the parent operation in Hasura
const execute = async (variables) => {
  const fetchResponse = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: categoriesByAppId,
        variables
      })
    }
  );
  const data = await fetchResponse.json();
  console.log('DEBUG: ', data.data.category[0].id);
  return data;
};


// Request Handler
app.post('/frontpage', async (req, res) => {

  // get request input
  const { application_id } = req.body.input;

  // run some business logic

  // execute the Hasura operation
  const { data, errors } = await execute({ application_id });

  // if Hasura operation errors, then throw error
  if (errors) {
    return res.status(400).json(errors[0])
  }

  // success
  return res.json({
    data
  })

});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);