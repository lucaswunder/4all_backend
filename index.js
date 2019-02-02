const app = require('express')();
const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.use('/api', require('./app/routes'));

app.listen(3000);
