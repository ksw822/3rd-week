

const express = require("express");
const routes = require('./routes');

const app = express();
const port = 3000;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());


const connect = require("./schemas");
connect();

app.use("/", routes);

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
});
