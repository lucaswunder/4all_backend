const app = require('express')();
const bodyParser = require('body-parser');
const { Client } = require('./app/models');

app.use(bodyParser.json());

// Client.create({ name: 'lucas', cpf: '02303202323', password: '1234' });

app.post('/', async (req, res) => {
  console.log(req.body);

  await Client.create(req.body);

  return res.send();
});

app.listen(3000);
