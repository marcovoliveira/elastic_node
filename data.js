const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  hosts: ["http://localhost:9200"]
});

client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    if (error) {
      console.error(error);
    } else {
      console.log("200");
    }
  }
);

client.indices.create(
  {
    index: "movies"
  },
  function(error, response, status) {
    if (error) {
      console.log(error);
    } else {
      console.log("200", response);
    }
  }
);

const movies = require("./movies.json");

var bulk = [];

movies.forEach(movie => {
  bulk.push({
    index: {
      _index: "movies",
      _type: "all_movies"
    }
  });
  bulk.push(movie);
});

client.bulk({ body: bulk }, function(error, response) {
  if (error) {
    console.log("400", error);
  } else {
    console.log("200", movies.length);
  }
});
