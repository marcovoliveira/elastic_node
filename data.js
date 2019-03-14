const elasticsearch = require('elasticsearch');
const client = new elasticsearch.Client({
    hosts: ['http://localhost:9200']
});

// GET localhost:9200
client
    .ping({ requestTimeout: 3000 })
    .then(response => console.log(response, 'All is well'))
    .catch(error => console.log(error, 'elasticsearch cluster is down!'));

// PUT localhost:9200/movies
client.indices
    .create({ index: 'movies' })
    .then(response => console.log(response))
    .catch(error => console.log(error));

const movies = require('./movies.json');
let bulk = [];

movies.forEach(movie => {
    bulk.push({
        index: {
            _index: 'movies',
            _type: '_doc'
        }
    });
    bulk.push(movie);
});

// POST localhost:9200/_bulk
client
    .bulk({ body: bulk })
    .then(response =>
        console.log(response, 'Inseridos: ' + movies.length + ' filmes')
    )
    .catch(error => console.log(error));
