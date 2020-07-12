require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIEDEX = require("./moviedex.json");
const { validateToken } = require('./middelwares/authenticate.js');

const app = express();

app.use(morgan('tiny'));
app.use(helmet());
app.use(cors());
app.use(validateToken);

app.get("/movie", function handleGetMovie(req, res) {
  let response = MOVIEDEX;

  // filter by country
  if (req.query.country) {
    response = response.filter((movie) =>
      // case insensitive searching
      movie.country.toLowerCase().includes(req.query.country.toLowerCase())
    );
  }

  // filter by genre if type query param is present
  if (req.query.genre) {
    response = response.filter((movie) =>
      movie.genre.includes(req.query.genre)
    );
  }

  if (req.query.avg_vote) {
    console.log(req.query.avg_vote);
    response = response.filter(
      (movie) => Number(movie.avg_vote) >= Number(req.query.avg_vote)
    );
  }

  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
