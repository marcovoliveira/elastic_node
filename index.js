const elasticsearch = require('elasticsearch');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const client = new elasticsearch.Client({
    node: 'http://localhost:9200'
});

const app = express();

app.set('port', process.env.PORT || 3001);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/views')));
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
    console.log('http://localhost:3001');
});

app.get('/', function(req, res) {
    res.sendFile('index.html', {
        root: path.join(__dirname, 'views')
    });
});

app.get('/search', function(req, res) {
    let param = {
        from: 0,
        size: 1000,
        query: {
            match: { title: req.query['q'] }
        }
    };

    // POST localhost:9200/movies/_search
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
