const express = require("express");
const db = require("./database");
const app = express();
const port = 8000;
const routes = require("./Routes/routes");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/item", routes);

db.then((database) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}).catch(console.log);
