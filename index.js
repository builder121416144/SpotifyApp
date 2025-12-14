import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

// ⚠️ questi li metteremo in .env dopo
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const SCOPES = [
  "user-top-read"
].join(" ");

app.get("/", (req, res) => {
  res.send("Spotify OAuth app is running.");
});

app.get("/login", (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize?" + params.toString()
  );
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
