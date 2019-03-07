const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');

// const server = require('http').createServer(app);
const io = require('socket.io').listen(app.listen(3333));

io.set('origins', '*:*');

app.use(bodyParser.json());

app.use(cors());

app.use('/api', require('./app/routes'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => res.status(500).send(err));

const clientList = [];

io.on('connection', (socket) => {
  // console.log(`Socket conectado: ${socket.id}`);

  // socket.on('admin', (data) => {
  //   console.log(`Successful Socket Test ${data.name}`);
  // });

  socket.on('storeClientInfo', (data) => {
    clientList.push(data);
  });

  socket.on('disconnect', () => {
    clientList.splice(clientList.findIndex(x => x.socketId === socket.id), 1);
  });
});

// only for test
app.get('/conn', (req, res) => res.send(clientList));

app.clientList = clientList;

app.io = io;

// app.listen(3333);
