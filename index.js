import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;

const SCOPES = "user-top-read";

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

app.get("/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res.status(400).send("No code received");
  }

  try {
    const tokenResponse = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization:
            "Basic " +
            Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    res.send({
      access_token: tokenData.access_token,
      expires_in: tokenData.expires_in,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Token exchange failed");
  }
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
