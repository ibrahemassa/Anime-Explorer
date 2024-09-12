import express from "express";
import axios from "axios";

const app = express();
const PORT = 3000;
const API_URL = "https://api.jikan.moe/v4/anime/";

app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result = await axios.get("https://api.jikan.moe/v4/top/anime", {params:{limit:20}});
  res.render("home.ejs", {results: result.data.data});
});

app.get("/search", async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.render("search_results.ejs", {
      results: [],
      query: "",
      error: "No search query provided.",
    });
  }
  try {
    let searchConfig = {
      params: {
        q: query,
        limit: 16,
        order_by: "score",
        sort: "desc",
      },
    };
    const result = await axios.get(API_URL, searchConfig);
    res.render("search_results.ejs", {
      results: result.data.data,
      query,
      error: null,
    });
  } catch (err) {
    res.render("search_results.ejs", {
      results: [],
      query,
      error: "No results found.",
    });
  }
});

app.get("/anime", async (req, res) => {
  let id = req.query.id;
  try {
    const result = await axios.get(API_URL + id);
    res.render("anime.ejs", { anime: result.data.data });
  } catch (err) {
    res.render("anime.ejs", { anime: err.response.data });
  }
});

app.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`Running on localhost:${PORT}`);
});
