import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";


let appAccessToken = null;
let appTokenExpiresAt = 0;

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

async function getAppAccessToken() {
  // If token exists and hasn't expired, reuse it
  if (appAccessToken && Date.now() < appTokenExpiresAt) {
    return appAccessToken;
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64"),
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
    }),
  });

  const data = await response.json();

  appAccessToken = data.access_token;
  appTokenExpiresAt = Date.now() + data.expires_in * 1000;

  return appAccessToken;
}


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

app.post("/login", async (req, res) => {
  const { code } = req.body;

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to exchange token" });
  }
});



app.get("/search", async (req, res) => {
  const q = req.query.q;
  const authHeader = req.headers.authorization;

  if (!q) {
    return res.status(400).json({ error: "Missing search query" });
  }

  let token;

  try {
    if (authHeader) {
      // Logged-in user search
      token = authHeader.split(" ")[1];
    } else {
      // Public search (no login)
      token = await getAppAccessToken();
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        q
      )}&type=track&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = await response.json();

    if (!data.tracks || !data.tracks.items) {
  return res.status(500).json({ error: "Invalid Spotify response" });
}


    const tracks = data.tracks.items.map((item) => ({
  id: item.id,
  uri: item.uri,
  name: item.name,
  artist: item.artists[0].name,
  album: item.album.name,
}));


    res.json(tracks);
  } catch (err) {
    res.status(500).json({ error: "Spotify search failed" });
  }
});

app.get("/me", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Missing authorization" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    res.json({ id: data.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});





app.post("/playlists", async (req, res) => {
  const authHeader = req.headers.authorization;
  const { name } = req.body;

  if (!authHeader || !name) {
    return res.status(400).json({ error: "Missing data" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Get user ID
    const meRes = await fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const meData = await meRes.json();

    // Create playlist
    const playlistRes = await fetch(
      `https://api.spotify.com/v1/users/${meData.id}/playlists`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          public: false,
        }),
      }
    );

    const playlistData = await playlistRes.json();

    res.json({ playlistId: playlistData.id });
  } catch (err) {
    res.status(500).json({ error: "Failed to create playlist" });
  }
});

app.post("/playlists/:id/tracks", async (req, res) => {
  const authHeader = req.headers.authorization;
  const { uris } = req.body;

  if (!authHeader || !uris) {
    return res.status(400).json({ error: "Missing data" });
  }

  const token = authHeader.split(" ")[1];

  try {
    await fetch(
      `https://api.spotify.com/v1/playlists/${req.params.id}/tracks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris }),
      }
    );

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add tracks" });
  }
});

