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
const execute = async (query, variables) => {
  const fetchResponse = await fetch(
    "http://localhost:8080/v1/graphql",
    {
      method: 'POST',
      body: JSON.stringify({
        query: query,
        variables
      })
    }
  );

  const data = await fetchResponse.json();
  return data;
};


// Request Handler
app.post('/frontpage', async (req, res) => {

  const { application_id } = req.body.input;

  const { data, errors } = await execute(categoriesByAppId, { application_id });
  if (errors) {
    return res.status(400).json(errors[0])
  }

  data.category[0].products = [];
  let parent_id = data.category[0].id;
  const { data2, errors2 } = await execute(firstSubCategory, { parent_id });
  if (errors2) {
    return res.status(400).json(errors2[0])
  }



  // success
  return res.json({
    data
  })

});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);