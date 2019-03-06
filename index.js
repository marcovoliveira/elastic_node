const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  hosts: ["http://localhost:9200"]
});

const express = require("express");

const app = express();

const bodyParser = require("body-parser");

const path = require("path");

client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    if (error) {
      console.error("500");
    } else {
      console.log("200");
    }
  }
);

app.use(bodyParser.json());

app.set("port", process.env.PORT || 3001);

app.use(express.static(path.join(__dirname, "/views")));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", function(req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "views")
  });
});

app.get("/search", function(req, res) {
  let param = {
    from: 0,
    size: 1000,
    query: {
      match: { title: req.query["q"] }
    }
  };

  client
    .search({ body: param })
    .then(results => {
      console.log(results.hits);
      res.send(results.hits);
    })
    .catch(err => {
      console.log(err);
      res.send([]);
    });
});

app.listen(app.get("port"), function() {
  console.log("Express server listening on port " + app.get("port"));
});
