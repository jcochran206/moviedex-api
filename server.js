require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIEDEX = require("./moviedex.json");
const { validateToken } = require("./middelwares/authenticate.js");

const app = express();

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
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
      movie.genre.toLowerCase().includes(req.query.genre.toLocaleLowerCase())
    );
  }

  if (req.query.avg_vote) {
    response = response.filter(
      (movie) => parseInt(movie.avg_vote) >= parseInt(req.query.avg_vote)
    );
  }

  res.json(response);
});

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {});
