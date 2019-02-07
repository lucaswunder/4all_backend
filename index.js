const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(bodyParser.json());

app.use(cors());

app.use("/api", require("./app/routes"));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(500).send("Ops, Come back later!");
});

app.listen(3333);
