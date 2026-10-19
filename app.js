const express = require("express");
const path = require("path");
const films = require("./data/films");

const app = express();
const PORT = 3000;

// Konfigurasi view engine dan path absolut
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware static files (CSS & gambar)
app.use(express.static(path.join(__dirname, "public")));

// Halaman 1: katalog + filter via query parameter
app.get("/", (req, res) => {
  const selectedGenre = req.query.genre || "";

  let filteredFilms = films;
  if (selectedGenre) {
    filteredFilms = films.filter(
      (film) => film.genre.toLowerCase() === String(selectedGenre).toLowerCase()
    );
  }

  const genres = [...new Set(films.map((film) => film.genre))];

  res.render("index", {
    title: "Katalog Film",
    films: filteredFilms,
    genres: genres,
    selectedGenre: String(selectedGenre)
  });
});

// Halaman 2: detail via route parameter
app.get("/item/:id", (req, res) => {
  const id = Number(req.params.id);
  const film = films.find((f) => f.id === id);

  if (!film) {
    return res.status(404).render("not-found", {
      title: "Data Tidak Ditemukan",
      requestedId: req.params.id
    });
  }

  res.render("detail", {
    title: film.title,
    film: film
  });
});

// Rute lain yang tidak dikenal
app.use((req, res) => {
  res.status(404).render("not-found", {
    title: "Halaman Tidak Ditemukan",
    requestedId: ""
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
