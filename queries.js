const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "movies",
  password: "secret123",
  port: 5432
});

const getMovies = (request, response) => {
  pool.query("SELECT * FROM movies ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const addMovie = (request, response) => {
  const { title, year } = request.body;

  pool.query(
    "INSERT INTO movies (title, year) VALUES ($1, $2)",
    [title, year],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send("Sucesso");
    }
  );
};

module.exports = {
  getMovies,
  addMovie
};
