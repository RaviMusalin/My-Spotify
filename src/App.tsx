import { useState, useEffect } from 'react'
import './App.css'
import SearchBar from './components/SearchBar';
import SearchResults from './components/SearchResults';
import Playlist from "./components/Playlist";
import type { Track } from "./types/Track"
import { SPOTIFY_AUTH_ENDPOINT, SPOTIFY_SCOPES, REDIRECT_URI, } from "./config/spotify";


export default function App() {
  const [searchResults, setSearchResults] = useState<Track[]>([]) // Search Results
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]) // Tracks in Playlist
  const [playlistName, setPlaylistName] = useState<string>("")
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (code) {
      const BACKEND_URL = import.meta.env.DEV
        ? "http://localhost:5000"
        : "https://my-spotify-backend-tj28.onrender.com";


      fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          setAccessToken(data.access_token);
        })
        .catch((err) => {
          console.error("Failed to exchange token", err);
        });

      window.history.replaceState({}, document.title, "/");
    }
  }, []);




  // Handle function for Search Bar component
  function handleSearch(term: string) {

    const BACKEND_URL = import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://my-spotify-backend-tj28.onrender.com";

    const headers: HeadersInit = {};

    if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    fetch(`${BACKEND_URL}/search?q=${encodeURIComponent(term)}`, {
      headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Search request failed");
        }
        return res.json();
      })
      .then((tracks: Track[]) => {
        setSearchResults(tracks);
      })
      .catch((err) => {
        console.error("Search failed", err);
        setSearchResults([]);
      });
  }





  // Handle function for Search Results component
  function handleAdd(track: Track) {
    // Check for duplicates
    const alreadyInPlaylist = playlistTracks.some((savedTrack) => savedTrack.id === track.id)

    if (alreadyInPlaylist) return;

    setPlaylistTracks((prev) => [...prev, track])
  }

  // Handle function for Playlist component
  function handleRemove(track: Track) {
    setPlaylistTracks((prev) => prev.filter((t) => t.id !== track.id))
  }

  // Handle function for login
  function handleSpotifyLogin() {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

    const scopes = SPOTIFY_SCOPES.join(" ");
    console.log(import.meta.env.VITE_SPOTIFY_CLIENT_ID);

    const authUrl =
      `${SPOTIFY_AUTH_ENDPOINT}` +
      `?client_id=${clientId}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl;
  }






  function handleSavePlaylist() {
    if (!accessToken || playlistTracks.length === 0) return;

    const BACKEND_URL = import.meta.env.DEV
      ? "http://localhost:5000"
      : "https://my-spotify-backend-tj28.onrender.com";


    // Create playlist
    fetch(`${BACKEND_URL}/playlists`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: playlistName }),
    })
      .then((res) => res.json())
      .then((data) => {
        const spotifyPlaylistId = data.playlistId;
        const dbPlaylistId = data.dbPlaylistId;

        const uris = playlistTracks.map((t) => t.uri);

        return fetch(`${BACKEND_URL}/playlists/${spotifyPlaylistId}/tracks`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uris,
            tracks: playlistTracks,
            dbPlaylistId,
          }),
        });
      })

      .then(() => {
        setPlaylistTracks([]);
        setPlaylistName("");
        alert("Playlist saved to Spotify!");
      })
      .catch(() => {
        alert("Failed to save playlist");
      });
  }


  const isLoggedIn = Boolean(accessToken);


  return (
    <div className='min-h-screen bg-neutral-900 text-white'>
      <header className='flex items-center justify-between px-6 border-b border-neutral-800'>
        <h1 className='text-xl font-bold'>Final Spotify TEST</h1>
      </header>


      <button
        className="px-4 py-2 rounded bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50"
        onClick={handleSpotifyLogin}
        disabled={isLoggedIn}
      >
        {isLoggedIn ? "Welcome" : "Login to Spotify"}
      </button>


      <main className="grid grid-cols-3 gap-6 p-6">
        {/* Search */}
        <SearchBar onSearch={handleSearch} />

        <SearchResults results={searchResults} onAdd={handleAdd} />

        <section className="bg-neutral-800 rounded p-4">
          <Playlist
            tracks={playlistTracks}
            name={playlistName}
            onNameChange={setPlaylistName}
            onRemove={handleRemove}
            onSave={handleSavePlaylist}
          />

        </section>

      </main>
    </div>


  );
}