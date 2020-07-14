require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const MOVIEDEX = require("./moviedex.json");
const { validateToken } = require("./middelwares/authenticate.js");
const { query } = require("express");

const app = express();

const morganSetting = process.env.NODE_ENV === "production" ? "tiny" : "common";
app.use(morgan(morganSetting));
app.use(helmet());
app.use(cors());
app.use(validateToken);

app.get("/movie", function handleGetMovie(req, res) {
  let response = MOVIEDEX;

  const { avg_vote, country, genre} = req.query

  
  if (avg_vote) {
    response = response.filter((movie) => {
      return parseFloat( movie.avg_vote) >=  parseFloat(avg_vote)
    });
  }
  if (country) {
    response = response.filter((movie) =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (genre) {
    response = response.filter((movie) =>
      movie.genre.toLowerCase().includes(genre.toLocaleLowerCase())
    );
  }


  res.json(response);
});

app.use((error, req, res, next) => {
  let response;
  if (process.env.NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    response = { error };
  }
  res.status(500).json(response);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {});
